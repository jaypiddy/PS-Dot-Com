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
 *   CONTACT_TO      where contact-form emails land, e.g. "bd@powershifter.com"
 *   CONTACT_FROM    a Resend-verified sender, e.g.
 *                   "POWER SHIFTER <concierge@powershifter.com>"
 * Secrets:
 *   ANTHROPIC_API_KEY
 *   RESEND_API_KEY   (only needed for the POST /contact route)
 *
 * ROUTES
 *   POST /          → concierge chat (Anthropic)
 *   POST /contact   → contact form → email via Resend
 *   POST /log       → conversation transcript → email via Resend (on session end)
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

// ALLOWED_ORIGIN may be a comma-separated allow-list (added at the 2026-07-13
// powershifter.com cutover, when two origins serve the site). ACAO must be a
// single origin, so echo the request's origin when it's on the list; fall back
// to the first entry so error responses still carry a valid header.
function allowedOrigins(env) {
  return (env.ALLOWED_ORIGIN || "*").split(",").map((s) => s.trim()).filter(Boolean);
}

function corsHeaders(env, request) {
  const list = allowedOrigins(env);
  const origin = request && request.headers.get("Origin");
  const allow =
    list.includes("*") ? "*" :
    (origin && list.includes(origin)) ? origin :
    list[0] || "*";
  return {
    "Access-Control-Allow-Origin": allow,
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

// Per-IP rate limiting via the Workers ratelimit binding (wrangler.toml
// [[ratelimits]]). Fails OPEN: if the binding isn't deployed yet or the
// limiter itself errors, the request proceeds — the limiter must never be
// the thing that breaks the concierge.
async function allowed(binding, key) {
  if (!binding) return true;
  try {
    const { success } = await binding.limit({ key });
    return success;
  } catch (_) {
    return true;
  }
}

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
    const cors = corsHeaders(env, request);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST")
      return new Response("Method Not Allowed", { status: 405, headers: cors });

    // Origin allow-list. The widget is cross-origin to the Worker, so a real
    // browser always sends Origin — reject BOTH missing and mismatched when
    // ALLOWED_ORIGIN is concrete. (Earlier this let a no-Origin request —
    // e.g. curl/scripts — slip through. CORS only constrains browsers anyway;
    // the shared-token gate below covers non-browser clients.) Membership
    // check, not equality — ALLOWED_ORIGIN can be a comma-separated list.
    {
      const list = allowedOrigins(env);
      if (list.length && !list.includes("*")) {
        const origin = request.headers.get("Origin");
        if (!origin || !list.includes(origin))
          return json({ error: "forbidden origin" }, 403, cors);
      }
    }

    const path = new URL(request.url).pathname.replace(/\/+$/, "");
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";

    // /log is fired by the page via a keepalive request on unload, which can't
    // set custom headers — so it carries its token in the BODY and is routed
    // before the header-based token gate. (Origin is still enforced above.)
    if (path.endsWith("/log")) {
      if (!(await allowed(env.FORM_LIMITER, ip + ":log")))
        return json({ error: "rate_limited" }, 429, cors);
      return handleLog(request, env, cors);
    }

    // Soft shared-token gate (optional). If CLIENT_TOKEN is set, the page must
    // send the same value as X-PS-Token (CONFIG.clientToken). Stops scripted /
    // no-Origin abuse of this paid proxy. NOTE: the token ships in client code,
    // so it's a speed-bump, not a true secret — pair with Cloudflare
    // rate-limiting / Turnstile for real protection.
    if (env.CLIENT_TOKEN && request.headers.get("X-PS-Token") !== env.CLIENT_TOKEN)
      return json({ error: "forbidden" }, 403, cors);

    // Route: POST /contact → contact-form email (Resend); anything else → chat.
    if (path.endsWith("/contact")) {
      if (!(await allowed(env.FORM_LIMITER, ip + ":contact")))
        return json({ error: "rate_limited" }, 429, cors);
      return handleContact(request, env, cors);
    }

    // Route: POST /subscribe → "The Signal" footer signup → Campaign Monitor.
    // Shares FORM_LIMITER with /contact but on its own key, so a signup and an
    // inquiry don't eat each other's budget.
    if (path.endsWith("/subscribe")) {
      if (!(await allowed(env.FORM_LIMITER, ip + ":subscribe")))
        return json({ error: "rate_limited" }, 429, cors);
      return handleSubscribe(request, env, cors);
    }

    // Chat is the paid path (Anthropic tokens) — cap per-IP message rate.
    if (!(await allowed(env.CHAT_LIMITER, ip)))
      return json({ error: "rate_limited" }, 429, cors);

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
      // Log the detail server-side; return a generic error so internal
      // strings never reach the client (matches the upstream-error path).
      console.error("chat exception", String(err));
      return json({ error: "exception" }, 500, cors);
    }
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}

// POST /contact — emails the concierge contact form via Resend.
// Needs secret RESEND_API_KEY and vars CONTACT_TO + CONTACT_FROM.
async function handleContact(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "bad json" }, 400, cors); }

  // Honeypot: the page renders a visually-hidden "company" field humans never
  // see. Anything filling it is a form bot — pretend success (don't tip it
  // off, don't send the email, don't burn Resend quota).
  if (body.company) return json({ ok: true }, 200, cors);

  const clean = (s, n) => String(s == null ? "" : s).trim().slice(0, n);
  const name = clean(body.name, 200).replace(/[\r\n]+/g, " ");
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "invalid email" }, 400, cors);
  if (!message) return json({ error: "empty message" }, 400, cors);
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM)
    return json({ error: "server not configured" }, 500, cors);

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: email,                       // replying to the email goes to the visitor
        subject: "New project inquiry" + (name ? " — " + name : ""),
        text: `Name: ${name || "(not given)"}\nEmail: ${email}\n\n${message}`,
      }),
    });
    if (!resp.ok) {
      console.error("resend error", resp.status, await resp.text());
      return json({ error: "send failed" }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  } catch (err) {
    console.error("contact exception", String(err));
    return json({ error: "exception" }, 500, cors);
  }
}

// POST /subscribe — adds an email to the Campaign Monitor list behind "The
// Signal" (the footer newsletter field on every page).
// Needs secret CM_API_KEY and var CM_LIST_ID (+ optional CM_CONSENT_TO_TRACK).
//
// Campaign Monitor auth is HTTP Basic with the API key as the USERNAME and any
// non-empty password — the key never reaches the browser, which is the whole
// reason this goes through the Worker rather than posting from the page.
async function handleSubscribe(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "bad json" }, 400, cors); }

  // Honeypot — same contract as /contact: the page renders a visually-hidden
  // "company" field humans never see. Anything filling it is a bot; pretend
  // success rather than tipping it off or burning the CM quota.
  if (body.company) return json({ ok: true }, 200, cors);

  const email = String(body.email == null ? "" : body.email).trim().slice(0, 200);
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return json({ error: "invalid email" }, 400, cors);
  if (!env.CM_API_KEY || !env.CM_LIST_ID || /REPLACE/.test(env.CM_LIST_ID))
    return json({ error: "server not configured" }, 500, cors);

  try {
    const resp = await fetch(
      `https://api.createsend.com/api/v3.3/subscribers/${env.CM_LIST_ID}.json`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(env.CM_API_KEY + ":x"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EmailAddress: email,
          // CM requires an explicit tracking-consent value on add. Kept as a var
          // so it can be flipped to "No" without a code change — see wrangler.toml.
          ConsentToTrack: env.CM_CONSENT_TO_TRACK || "Yes",
          // Someone typing their address into a public signup box is a fresh
          // opt-in, so honour it even if they'd unsubscribed before.
          Resubscribe: true,
        }),
      }
    );
    if (!resp.ok) {
      // CM returns 400 + {Code,Message} for addresses it rejects after our regex.
      const detail = await resp.text();
      console.error("campaign monitor error", resp.status, detail);
      if (resp.status === 400) return json({ error: "invalid email" }, 400, cors);
      return json({ error: "subscribe failed" }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  } catch (err) {
    console.error("subscribe exception", String(err));
    return json({ error: "exception" }, 500, cors);
  }
}

// POST /log — emails a conversation transcript via Resend when a session ends.
// Token arrives in the BODY (the page sends this via a keepalive request on page
// unload, which cannot set custom headers). Empty/trivial sessions are skipped.
async function handleLog(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "bad json" }, 400, cors); }
  if (env.CLIENT_TOKEN && body.token !== env.CLIENT_TOKEN) return json({ error: "forbidden" }, 403, cors);

  const msgs = Array.isArray(body.messages) ? body.messages.filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim()
  ) : [];
  // The greeting is an assistant turn, so "no user turns" = nobody actually
  // talked. Skip those (bots, idle openers) so the inbox isn't flooded.
  const userTurns = msgs.filter((m) => m.role === "user").length;
  if (userTurns < 1) return json({ ok: true, skipped: true }, 200, cors);
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM)
    return json({ error: "server not configured" }, 500, cors);

  const transcript = msgs.slice(-80)
    .map((m) => (m.role === "user" ? "Visitor" : "Concierge") + ": " + m.content.slice(0, 2000))
    .join("\n\n")
    .slice(0, 24000);
  const firstUser = ((msgs.find((m) => m.role === "user") || {}).content || "conversation")
    .replace(/\s+/g, " ").slice(0, 60);

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        subject: "Concierge transcript — " + firstUser,
        text: transcript + "\n\n— " + userTurns + " visitor message(s).",
      }),
    });
    if (!resp.ok) {
      console.error("resend log error", resp.status, await resp.text());
      return json({ error: "send failed" }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  } catch (err) {
    console.error("log exception", String(err));
    return json({ error: "exception" }, 500, cors);
  }
}
