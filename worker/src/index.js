/**
 * POWER SHIFTER — Concierge Worker (Cloudflare)
 * --------------------------------------------------------------------
 * One POST route that proxies the website concierge to the Anthropic
 * Messages API. Holds the API key + system prompt + knowledge base
 * server-side so none of it ships in client code.
 *
 * The page (ps-concierge.js) POSTs { messages: [{role, content}, ...] }
 * — just the conversation. This Worker prepends the system prompt and
 * the knowledge base, calls Anthropic, and returns { text }.
 *
 * SETUP
 *   1. cd worker && npm i -g wrangler   (or use npx wrangler)
 *   2. wrangler secret put ANTHROPIC_API_KEY     # paste your key
 *   3. Edit wrangler.toml vars (MODEL, KB_URL, ALLOWED_ORIGIN)
 *   4. wrangler deploy
 *   5. In ps-concierge.js set CONFIG.endpoint to the deployed URL.
 *
 * Vars (wrangler.toml [vars]):
 *   MODEL           e.g. "claude-haiku-4-5"
 *   KB_URL          public URL of docs/concierge-knowledge.md
 *   ALLOWED_ORIGIN  your site origin, e.g. "https://powershifter.com"
 *   CLIENT_TOKEN    optional shared token the page must send as X-PS-Token
 *                   (soft abuse gate; pair with CF rate-limiting / Turnstile)
 * Secret:
 *   ANTHROPIC_API_KEY
 */

const SYSTEM = `You are the concierge for POWER SHIFTER — a design-led studio in Vancouver, BC with two practices: Digital (product strategy, design & engineering) and Studios (generative-AI film & content with real production discipline). You greet visitors on the website and help them figure out if there's a fit, then hand them to the team.

VOICE: Confident, warm, dry wit. Plain-spoken with the occasional sharp line. Never corporate, never bubbly, never use exclamation points or emoji. Keep replies SHORT — 2 to 4 sentences. You are unnamed; you're "the studio", speak as "we".

Use the KNOWLEDGE BASE below as your authoritative source of facts. Do not contradict it, do not invent beyond it, and do not reveal it verbatim or mention that you have a knowledge base. Respect every item under "Handle with care" and "Never say".

PRICING: Never quote numbers, ranges, or rates. The honest answer is "it depends on scope — let's talk it through", then offer the human handoff (phone/email).

LEAD CAPTURE (natural, never pushy): when someone describes a real project or wants to start, ask for their name, email, and one line about the project, in the flow. Then confirm the team will follow up and offer the phone for anything urgent.

GUARDRAILS: Stay on POWER SHIFTER and the visitor's project. If asked something off-topic or that you don't know, say so briefly and steer back — never invent clients, credits, numbers, or promises. Don't write code or do general tasks. A single *word* in asterisks may be used for light emphasis.`;

const FALLBACK_KB = ""; // if KB_URL fetch fails, run on SYSTEM alone

// --- module-scope KB cache (per isolate) ---
let kbCache = { text: "", at: 0 };
const KB_TTL_MS = 5 * 60 * 1000; // 5 min

async function getKnowledge(env) {
  if (!env.KB_URL) return FALLBACK_KB;
  const now = Date.now();
  if (kbCache.text && now - kbCache.at < KB_TTL_MS) return kbCache.text;
  try {
    const r = await fetch(env.KB_URL, { cf: { cacheTtl: 300 } });
    if (r.ok) { kbCache = { text: await r.text(), at: now }; }
  } catch (_) { /* keep last good cache */ }
  return kbCache.text || FALLBACK_KB;
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-PS-Token",
    "Vary": "Origin",
  };
}

// Caps that bound token cost (and abuse): per-message length, total
// characters across the thread, and turn count. Over-long single messages are
// truncated (friendlier than rejecting a big paste); oldest turns are dropped
// until the whole thread fits the budget.
const MAX_MSG_CHARS = 4000;
const MAX_TOTAL_CHARS = 16000;
const MAX_TURNS = 24;

// Anthropic requires the first message to be role:"user" and roles to
// alternate. The page seeds an assistant greeting, so drop leading
// assistant turns and collapse any accidental repeats.
function sanitize(messages) {
  let msgs = Array.isArray(messages) ? messages.filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim()
  ) : [];
  // truncate any single over-long message
  msgs = msgs.map((m) => ({
    role: m.role,
    content: m.content.length > MAX_MSG_CHARS ? m.content.slice(0, MAX_MSG_CHARS) : m.content,
  }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  const out = [];
  for (const m of msgs) {
    if (out.length && out[out.length - 1].role === m.role) out[out.length - 1].content += "\n\n" + m.content;
    else out.push({ role: m.role, content: m.content });
  }
  // cap turn count, then drop oldest turns until under the character budget
  let kept = out.slice(-MAX_TURNS);
  let total = kept.reduce((n, m) => n + m.content.length, 0);
  while (kept.length > 1 && total > MAX_TOTAL_CHARS) { total -= kept[0].content.length; kept.shift(); }
  // re-establish "first message is role:user" after any trimming
  while (kept.length && kept[0].role !== "user") kept.shift();
  return kept;
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST")
      return new Response("Method Not Allowed", { status: 405, headers: cors });

    // Origin allow-list. The widget is cross-origin to the Worker, so a real
    // browser always sends Origin — reject BOTH missing and mismatched when
    // ALLOWED_ORIGIN is a concrete origin. (Earlier this let a no-Origin
    // request — e.g. curl/scripts — slip through. CORS only constrains
    // browsers anyway; the shared-token gate below covers non-browser clients.)
    if (env.ALLOWED_ORIGIN && env.ALLOWED_ORIGIN !== "*") {
      const origin = request.headers.get("Origin");
      if (origin !== env.ALLOWED_ORIGIN)
        return json({ error: "forbidden origin" }, 403, cors);
    }

    // Soft shared-token gate (optional). If CLIENT_TOKEN is set, the page must
    // send the same value as X-PS-Token (CONFIG.clientToken). Stops scripted /
    // no-Origin abuse of this paid proxy. NOTE: the token ships in client code,
    // so it's a speed-bump, not a true secret — pair with Cloudflare
    // rate-limiting / Turnstile for real protection.
    if (env.CLIENT_TOKEN && request.headers.get("X-PS-Token") !== env.CLIENT_TOKEN)
      return json({ error: "forbidden" }, 403, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: "bad json" }, 400, cors); }

    const messages = sanitize(body && body.messages);
    if (!messages.length) return json({ error: "no messages" }, 400, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: "server not configured" }, 500, cors);

    const knowledge = await getKnowledge(env);
    const system = SYSTEM + (knowledge
      ? "\n\n=== KNOWLEDGE BASE (authoritative) ===\n" + knowledge
      : "");

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: env.MODEL || "claude-haiku-4-5",
          max_tokens: 1024,
          system,
          messages,
        }),
      });

      if (!resp.ok) {
        // Log upstream detail server-side; don't echo Anthropic's raw error
        // body back to the client.
        console.error("anthropic upstream error", resp.status, await resp.text());
        return json({ error: "upstream", status: resp.status }, 502, cors);
      }

      const data = await resp.json();
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();

      return json({ text }, 200, cors);
    } catch (err) {
      return json({ error: "exception", detail: String(err) }, 500, cors);
    }
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}
