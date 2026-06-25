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
   - var `CONTACT_TO` — where leads land, e.g. `hello@powershifter.com`
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
Errors return `{ "error": "...", "detail": "..." }` with a 4xx/5xx status;
the page shows a graceful "reach us by phone/email" fallback.

## How the knowledge base flows

The Worker fetches `KB_URL` (your `docs/concierge-knowledge.md`), caches it
for 5 minutes, and injects it into the system prompt. **To update the bot,
edit that one markdown file and redeploy the site** — no Worker redeploy
needed (just wait out the 5-minute cache, or bump `KB_TTL_MS`).

## Notes / hardening
- **Rate limiting:** for production abuse protection, add a
  [Cloudflare Rate Limiting rule](https://developers.cloudflare.com/waf/rate-limiting-rules/)
  on the Worker route, or use KV / a Durable Object for per-IP limits.
  The module-scope cache here is best-effort only.
- **Origin lock:** `ALLOWED_ORIGIN` rejects cross-origin POSTs — and now also
  rejects requests with **no** `Origin` header (curl/scripts) when set to a
  concrete origin. Keep it set in production; use `"*"` only for local testing.
- **Soft client token:** set `CLIENT_TOKEN` in `wrangler.toml` and the same
  value as `CONFIG.clientToken` in `ps-concierge.js`. The page then sends it as
  `X-PS-Token`; the Worker 403s anything without it. This stops scripted abuse
  CORS can't — but the token ships in client code, so treat it as a speed-bump
  and pair it with the rate-limiting rule above (and/or
  [Turnstile](https://developers.cloudflare.com/turnstile/)).
- **Model output cap:** `max_tokens` is 1024 (matches the prototype). Tune
  in `src/index.js` if you want longer replies.
- **Cost control:** Haiku-class models keep this cheap; the short-reply
  instruction and token cap bound each call.
