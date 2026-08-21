# ps-images

Upload proxy for Cloudflare Images and Stream. Its whole reason to exist is
that the Cloudflare API token stays on Cloudflare — never in a chat window, a
laptop shell, or this repo. A token scoped to `Images: Edit` can overwrite
every asset on the site.

Separate from `worker/` (ps-concierge) on purpose. That one is browser-facing
and gated by `CLIENT_TOKEN`, which ships inside `ps-concierge.js` and is
documented there as a speed-bump rather than a secret. An upload endpoint
holding a write token cannot sit behind a credential published in page source.

## Endpoints

| | |
|---|---|
| `POST /upload` | multipart `file=<image>` → `{ id, urls, filename, uploaded }` |
| `POST /upload/video` | multipart `file=<video>` → `{ uid, playback, mp4 }` |
| `GET /health` | config sanity, no auth needed |

All POSTs require `X-Upload-Key: <UPLOAD_KEY>`.

No CORS headers anywhere, deliberately. Nothing in a browser should call this;
the missing `Access-Control-Allow-Origin` is the enforcement.

## Setup

**1. Create the named variants** in the Cloudflare Images dashboard. An
undefined variant 404s at delivery time, so do this before relying on it.

| Variant | Size | Fit | Used for |
|---|---|---|---|
| `masthead` | 1920 × 1080 | cover | in-article hero |
| `thumb` | 800 × 450 | cover | listing cards |
| `og` | 1200 × 630 | cover | social |

`og` is the one that matters. It is 1.91:1, not the 16:9 hero crop — reusing
the masthead for social is what every scraper then crops unpredictably.

**2. Fill in `CF_ACCOUNT_ID`** in `wrangler.toml`. Not a secret; it is in every
API URL and in the dashboard address bar.

**3. Set the two secrets.**

```
cd worker-images
npx wrangler secret put CF_IMAGES_TOKEN    # API token, Images: Edit (+ Stream: Edit if using video)
npx wrangler secret put UPLOAD_KEY         # openssl rand -hex 32
```

`CF_IMAGES_TOKEN` must be a scoped API token, not a Global API Key — a Global
key is account-wide and cannot be limited to Images.

**4. Deploy.**

```
npx wrangler deploy
curl https://ps-images.<subdomain>.workers.dev/health
```

## Using it

```
curl -X POST https://ps-images.<subdomain>.workers.dev/upload \
  -H "X-Upload-Key: $UPLOAD_KEY" \
  -F file=@hero.jpg
```

```json
{
  "id": "59a2b057-93ba-4b0c-948e-44e0ff0a7000",
  "urls": {
    "masthead": "https://imagedelivery.net/So76NP_fFT3s9jNLvxCRFw/59a2b.../masthead",
    "thumb":    "https://imagedelivery.net/So76NP_fFT3s9jNLvxCRFw/59a2b.../thumb",
    "og":       "https://imagedelivery.net/So76NP_fFT3s9jNLvxCRFw/59a2b.../og"
  }
}
```

**`id` is the part that matters.** Paste it into the Notion row and the
pipeline derives all three URLs from it — one upload, three correct crops,
rather than the same file in three slots that want different aspect ratios.

## Limits and behaviour

- Images cap at 10 MB (`MAX_IMAGE_BYTES`), Cloudflare's own limit.
- Video POSTs cap at 200 MB. Larger files want a tus upload, which this does
  not implement.
- 20 uploads per minute per IP. Uploads are rare and human-driven, so this is
  an abuse ceiling, not a throttle. Fails open if the binding is missing, same
  as ps-concierge.
- Cloudflare's own error bodies are passed straight through. They name the real
  problem — bad token scope, unsupported format — far better than anything this
  Worker could paraphrase.
- The MP4 URL returned for video only resolves once MP4 downloads are enabled
  on that video, matching the plain `<video>` pattern the case studies use.
