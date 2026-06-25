# Menu hover loop — how to replace

The looping footage that fills the **menu section words** on hover (Work, Digital,
Studios, …) is **not** a video. It's an **animated WebP** poured into the letters
via CSS `background-clip:text`.

- **Asset:** `images/scratches-v2.webp` (animated WebP, ~84 frames)
- **Effect:** `.tk-l:hover .tk-t { background: url('images/scratches-v2.webp') …; background-clip: text }`
- **Referenced in 14 spots across 7 pages** — on each page:
  1. `<link rel="preload" as="image" href="images/scratches-v2.webp">` in `<head>`
  2. the `background:url('images/scratches-v2.webp')` in the `.tk-l:hover .tk-t` CSS rule

> Why not Cloudflare Stream? `background-clip:text` needs an **image**, not a
> `<video>`/Stream iframe. So this asset stays a (local) animated WebP. Putting it
> on Stream would mean a different visual treatment (masked video / hover-reel),
> not a drop-in swap. See `design-system.md` §9 (parked "nav hover-reel" idea).

## Format requirement
The replacement **must be an animated WebP** (or animated GIF, but WebP is smaller).
Match the current feel: keep it short, seamless-looping, monochrome-ish texture,
and keep the file small (current is ~108 KB) so it preloads instantly.

## Best approach to replace it (recommended: versioned filename)
Versioning the filename sidesteps stale browser/CDN cache, so the new loop shows
immediately everywhere.

1. Drop the new file in as a **new version**: `images/scratches-v3.webp`.
2. Update all references from `scratches-v2.webp` → `scratches-v3.webp` (14 spots):
   ```bash
   cd <repo> && grep -rl 'scratches-v2.webp' *.html \
     | xargs sed -i '' 's/scratches-v2\.webp/scratches-v3.webp/g'
   ```
3. Commit + push. Vercel auto-deploys; every page picks up the new loop.

(Simplest alternative: overwrite `images/scratches-v2.webp` in place and push — zero
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
- Verify it animates: `grep -ac ANMF images/scratches-v3.webp` (frame count > 0).
