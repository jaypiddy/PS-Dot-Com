# Video pipeline

Status (2026-07): **LIVE.** Two production patterns are in use, both on Cloudflare Stream
(customer `xv1aafyshr3tbknu`):
1. **Work-card hover-loops** — `data-video="<stream>/downloads/default.mp4"` on a card's
   `.wframe`; JS lazy-builds a muted/looping `<video>` on first hover. Wired on the digital
   card set + the Studios film cards (Iron Mountain, Celestial, Ernest, Rapid MVP, Algorithm
   Trap, Maple). Each Stream video needs **MP4 downloads enabled** (the `/downloads/default.mp4`
   URL 302s once ready, 404s until then) for the card to play.
2. **Case-page film embed** — `<iframe class="cs-film-vid" …/iframe?autoplay&muted&loop&poster=…>`
   (HLS, works the moment the video is uploaded, no download needed) in the screening room, and
   the closing full-bleed hover-to-play **`.cs-reel`** component.

**GOTCHA (fixed 2026-07-07):** the hover-loop JS builds `<source>`s by swapping the extension;
it must offer `.webm` **only for local files**, never for Stream URLs — Stream serves only
`default.mp4`, so a `.webm` request 404s and stalls the rollover. The JS gates on
`/cloudflarestream\.com/`. Posters: Studios film pages use the video's own Stream thumbnail
(`/thumbnails/thumbnail.jpg?time=Ns`), not a separately-hosted image.

## Original POC notes (below — historical)

## POC state (what's in the repo now)

- Opt-in per card: `data-video="videos/<name>.mp4"` on the card's `.wframe`
- Each loop is a trio: `<name>.webm` (VP9) + `<name>.mp4` (H.264, faststart, no audio)
  + `images/<name>_poster.jpg` (frame 0) used as the card's still
- Behavior: lazy-load on first hover only; play muted/looping with 350ms fade-in;
  on leave: freeze frame → fade out → rewind to 0 after 420ms (re-enter cancels rewind)
- Gated: `(hover: hover)` and not `(prefers-reduced-motion: reduce)` — touch devices
  never download video
- Hover image scale removed on /work — stills must hold steady under the loops
- NOTE: the WebM twin exists only because the test browser (open Chromium) lacks the
  H.264 codec. Real browsers all play H.264. Production needs MP4 + poster only.

## Production plan (Option A — Cloudflare Stream, recommended)

One upload replaces the whole trio. Encoding and ingress are free; billing is
$5 / 1,000 min stored (prepaid) + $1 / 1,000 min delivered.
At ~25 loops × 8s ≈ 3.5 stored minutes, this lives in the $5 minimum indefinitely.
https://developers.cloudflare.com/stream/pricing

Publish flow:
1. Editor drops the raw clip into the Notion property (or pastes a Stream UID)
2. Sync job uploads to Stream → stores UID → one API call to enable MP4 download
3. Templates derive both URLs from the UID:
   - video:  the Stream MP4 download URL (plain <video src>, no player embed, no HLS)
   - poster: https://customer-<code>.cloudflarestream.com/<uid>/thumbnails/thumbnail.jpg?time=0s

The "middleware" is two API calls inside the sync job that has to exist anyway.

## Option B — owned ffmpeg middleware (only if Stream can't express a need)

GitHub Action / build container triggered by the Notion sync, running the trio
commands below, writing to R2. Justified only for custom encode ladders, WebM/AV1
bandwidth shaving, or loop-point trimming as pipeline steps.

```sh
ffmpeg -i in.mp4 -an -c:v copy -movflags +faststart out.mp4
ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 out.webm   # optional
ffmpeg -i out.mp4 -frames:v 1 -q:v 3 out_poster.jpg
```

## Clip spec (either option)

3–8s, 1280×720, H.264, ~1–2.5MB, audio stripped, faststart.

## Editorial rule (non-negotiable, applies to Studios generation)

Frame 0 IS the card still. Clips must be generated with an opening frame that
works as static art — the poster is not a byproduct, it's the card's art direction.
