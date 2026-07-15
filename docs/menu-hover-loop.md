# Menu hover loop — how to replace

The looping footage that fills the **menu section words** on hover (Work, Digital,
Studios, …) is **not** a video. It's an **animated WebP** poured into the letters
via CSS `background-clip:text`.

- **Asset:** `images/scratches-v3.webp` (animated WebP, 65 frames, ~33 KB — was `scratches-v2.webp` until 2026-07-14; see **Edit history** below)
- **Effect:** `.tk-l:hover .tk-t { background: url('images/scratches-v3.webp') …; background-clip: text }`
- **Referenced in 22 spots across 11 pages** (2 per page — the preload link + the CSS rule):
  1. `<link rel="preload" as="image" href="images/scratches-v3.webp">` in `<head>`
  2. the `background:url('images/scratches-v3.webp')` in the `.tk-l:hover .tk-t` CSS rule

> Why not Cloudflare Stream? `background-clip:text` needs an **image**, not a
> `<video>`/Stream iframe. So this asset stays a (local) animated WebP. Putting it
> on Stream would mean a different visual treatment (masked video / hover-reel),
> not a drop-in swap. See `design-system.md` §9 (parked "nav hover-reel" idea).

## Format requirement
The replacement **must be an animated WebP** (or animated GIF, but WebP is smaller).
Match the current feel: keep it short, seamless-looping, monochrome-ish texture,
and keep the file small (current is ~33 KB) so it preloads instantly.

## Best approach to replace it (recommended: versioned filename)
Versioning the filename sidesteps stale browser/CDN cache, so the new loop shows
immediately everywhere.

1. Drop the new file in as a **new version**: `images/scratches-v4.webp`.
2. Update all references from `scratches-v3.webp` → `scratches-v4.webp` (22 spots):
   ```bash
   cd <repo> && grep -rl 'scratches-v3.webp' *.html \
     | xargs sed -i '' 's/scratches-v3\.webp/scratches-v4.webp/g'
   ```
3. Commit + push. Vercel auto-deploys; every page picks up the new loop.

(Simplest alternative: overwrite `images/scratches-v3.webp` in place and push — zero
code changes, but the old loop may be served from cache for a while. Versioning avoids that.)

## If you only have a video/GIF (convert to animated WebP with ffmpeg)
`ffmpeg` is available locally. Example (tune fps/quality/scale to taste):
```bash
ffmpeg -i source.mp4 \
  -vf "fps=24,scale=600:-1:flags=lanczos" \
  -c:v libwebp -loop 0 -an -vsync 0 \
  -lossless 0 -q:v 60 -compression_level 6 -preset picture \
  images/scratches-v3.webp
```
- `fps` lower = smaller file; `q:v` lower = smaller/lower-quality; `scale` to the
  needed display size (it only fills text, so it doesn't need to be huge).
- Verify it animates: `grep -ac ANMF images/scratches-v4.webp` (frame count > 0).

## Edit history

- **2026-07-14 — `v2` → `v3` (bug fix, not a new loop).** The v2 grab had two defects:
  a **black tail** (frames 66–84 were solid black, so the loop flashed black before
  restarting) and **screen-grab selection handles** (dark rounded corners + a semicircular
  handle bump at the mid-left and mid-right edges, visible where the texture meets the letter
  edges). Fix: trimmed to frames 1–65 and cropped a 32px border off all four sides (then
  scaled back to 400×400 — this is the "enlarge behind the mask" that pushes the handles out
  of frame). Re-encoded 84→65 frames, 108 KB → 33 KB. Same drifting-scratches feel, cleaner.

### How to trim / crop an animated WebP (the v2→v3 recipe)
`ffmpeg` can't decode this animated WebP directly — use **libwebp** (`brew install webp`;
`img2webp`/`webpmux`/`dwebp` also need `brew install libtiff`).

```bash
# 1. explode to per-frame PNGs (frames are full-canvas, no blend compositing needed)
N=$(webpinfo in.webp | grep -c 'Duration:')
for i in $(seq 1 $N); do p=$(printf '%03d' $i)
  webpmux -get frame $i in.webp -o fr_$p.webp && ffmpeg -y -i fr_$p.webp fr_$p.png; done
# 2. find black frames (they compress tiny) and eyeball a contact sheet
for f in fr_*.png; do printf "%s %s\n" "$f" "$(stat -f%z "$f")"; done   # ~1.4 KB == black
ffmpeg -start_number 1 -i fr_%03d.png -vf "scale=150:150,tile=12x7:padding=2:color=magenta" sheet.png
# 3. crop the border off the KEPT frames (drop the black tail by only looping the good range)
for i in $(seq 1 65); do p=$(printf '%03d' $i)
  ffmpeg -y -i fr_$p.png -vf "crop=336:336:32:32,scale=400:400:flags=lanczos" crop_$p.png; done
# 4. re-encode (loop forever, ~83ms/frame to match the original cadence)
img2webp -loop 0 -d 83 -lossy -q 80 -m 6 $(ls crop_*.png | sort) -o out.webp
```
