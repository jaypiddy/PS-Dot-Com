# POWER SHIFTER Concierge — Cloudflare Worker

Backend for the website concierge. Keeps the Anthropic API key, system
prompt, and knowledge base **server-side**. The page sends only the
conversation; the Worker returns the assistant's reply.

```
page (ps-concierge.js)  ──POST { messages }──▶  Worker  ──▶  Anthropic API
                        ◀──── { text } ────────┘  (+ system + KB injected)
```

## Files
- `src/index.js` — the Worker
- `wrangler.toml` — config (model, KB URL, allowed origin)

## Deploy (one time)

```bash
cd worker
npm i -g wrangler            # or use: npx wrangler ...

# 1. Add your Anthropic key as a secret (never goes in the repo)
wrangler secret put ANTHROPIC_API_KEY

# 2. Edit wrangler.toml [vars]:
#    MODEL          — Anthropic model id (e.g. claude-haiku-4-5)
#    KB_URL         — public URL of docs/concierge-knowledge.md on your site
#    ALLOWED_ORIGIN — your site origin (e.g. https://powershifter.com)

# 3. Ship it
wrangler deploy
```

`wrangler deploy` prints the Worker URL (e.g.
`https://ps-concierge.<subdomain>.workers.dev`, or a custom route if you
add one).

## Connect the page

In `ps-concierge.js`, set the endpoint:

```js
var CONFIG = {
  endpoint: 'https://ps-concierge.<your-subdomain>.workers.dev',
  clientToken: null,   // set to your CLIENT_TOKEN value if you enabled the token gate
  ...
};
```

That's the only client change. With `endpoint` set, the page stops using
the in-page prototype API and talks to the Worker. With `endpoint: null`
it falls back to the prototype helper (handy for local dev in Claude).
If you set `CLIENT_TOKEN` in `wrangler.toml`, set `CONFIG.clientToken` to the
same string so the page's `X-PS-Token` header is accepted.

## Contact form route (`POST /contact`)

Turns the concierge "Email us" panel into a real form that emails the studio
via [Resend](https://resend.com) — no inbox address shown to visitors.

1. In Resend: **verify a sending domain** (Domains → add the DNS records), then
   **create an API key** (`re_…`).
2. On the Worker, add:
   - secret `RESEND_API_KEY`
   - var `CONTACT_TO` — where leads land, e.g. `bd@powershifter.com`
   - var `CONTACT_FROM` — a Resend-verified sender, e.g.
     `POWER SHIFTER <concierge@powershifter.com>`
3. In `ps-concierge.js`, set `CONFIG.formEndpoint` to `<worker-url>/contact`.

The Worker validates name/email/message, sends the email with `reply_to` set to
the visitor (so a reply reaches them), and returns `{ ok: true }`. The page shows
its success state; with `formEndpoint` unset it falls back to an honest `mailto:`.

## Request / response contract

**Request** (POST, JSON):
```json
{ "messages": [ { "role": "user", "content": "..." }, { "role": "assistant", "content": "..." } ] }
```
**Response**:
```json
{ "text": "the assistant reply" }
```
Errors return `{ "error": "<code>" }` with a 4xx/5xx status (no internal
detail is echoed to the client — exceptions are logged server-side only). The
page shows a graceful "reach us by phone/email" fallback. A `429` means the
per-IP rate limit tripped; the widget shows a friendly "one at a time" message.

Routes: `POST /` (chat), `POST /contact` (form → email), `POST /log`
(transcript → email on session end; token travels in the body since the
keepalive unload request can't set headers).

## How the knowledge base flows

The Worker fetches `KB_URL` (your `docs/concierge-knowledge.md`), caches it
for 5 minutes, and injects it into the system prompt. **To update the bot,
edit that one markdown file and redeploy the site** — no Worker redeploy
needed (just wait out the 5-minute cache, or bump `KB_TTL_MS`).

## Security (layers, in order)

This is a public, unauthenticated endpoint that spends Anthropic tokens and
sends email — so protection is layered. A security review (2026-07-10)
confirmed no XSS (the widget escapes before render), no open relay (`to`/`from`
are hardcoded server-side — an attacker can only spam our own inbox), no email
header injection (CRLF stripped from header-bound fields; bodies are
`text/plain`), and no system-prompt override (`sanitize()` drops any non
`user`/`assistant` role).

1. **Origin lock** — `ALLOWED_ORIGIN` (comma-separated allow-list) rejects
   cross-origin POSTs *and* no-`Origin` requests. Stops browsers; a script can
   forge `Origin`, so this is only the first bar. Use `"*"` for local testing.
2. **Soft client token** — `CLIENT_TOKEN` in `wrangler.toml` must match
   `CONFIG.clientToken` in `ps-concierge.js` (sent as `X-PS-Token`; `/log`
   carries it in the body). Ships in client code, so it's a speed-bump.
3. **Per-IP rate limiting** — the real cost/abuse gate, via the GA Workers
   `ratelimit` bindings in `wrangler.toml` (`[[ratelimits]]`):
   - `CHAT_LIMITER` — 10 chat msgs / 60s / IP (bounds Anthropic spend)
   - `FORM_LIMITER` — 3 submissions / 60s / IP, separate keys for `/contact`
     vs `/log` (bounds Resend / inbox spam)
   Keyed on `CF-Connecting-IP` (Cloudflare-set, unforgeable). **Fails OPEN**:
   if a binding is missing the request proceeds, so code and config can deploy
   in either order. Enforced *per Cloudflare colo* (not global) and eventually
   consistent — a distributed botnet gets more headroom than one machine.
   The namespaces are provisioned automatically by `wrangler deploy` (no manual
   dashboard step). `period` must be `10` or `60`.
4. **Honeypot** — `/contact` reads a `company` field the page renders
   visually-hidden (offscreen, not `display:none`). Non-empty ⇒ form bot ⇒
   pretend success, send nothing.

**Token / cost caps:** per-message 4k chars, per-thread 16k, 24 turns
(`sanitize()`), `max_tokens` 1024. Combined with rate limiting, per-call and
per-IP cost are both bounded.

**Accepted limitations** (inherent to a public concierge; the fix for all is
[Turnstile](https://developers.cloudflare.com/turnstile/) if logs ever show
determined abuse): forgeable `Origin`, prompt injection (bounded — no tools,
text-only output, the KB is already public and holds no secrets), and the
per-colo rate-limit scope above.

**robots.txt** disallows `/docs/` so the public KB markdown stays out of
search indexes.
