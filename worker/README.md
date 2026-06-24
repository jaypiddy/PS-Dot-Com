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
  ...
};
```

That's the only client change. With `endpoint` set, the page stops using
the in-page prototype API and talks to the Worker. With `endpoint: null`
it falls back to the prototype helper (handy for local dev in Claude).

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
- **Origin lock:** `ALLOWED_ORIGIN` rejects cross-origin POSTs. Keep it set
  in production; use `"*"` only for local testing.
- **Model output cap:** `max_tokens` is 1024 (matches the prototype). Tune
  in `src/index.js` if you want longer replies.
- **Cost control:** Haiku-class models keep this cheap; the short-reply
  instruction and token cap bound each call.
