# OG composer

Generates 1200×630 Open Graph images by compositing a headline onto a
keyframe still, in the site's card-overlay style (bottom tint gradient,
Articulat Heavy headline, `POWER//SHIFTER — …` mono eyebrow, magenta `//`).

Two generators, same technique:

- **`generate_og.py`** — every blog card on `/insights`. Keyframe = the
  card's Cloudflare image; headline = the card `<h2>`/`<h3>`; eyebrow
  `POWER//SHIFTER — Insights`.
- **`generate_og_work.py`** — every `/work` case study. Keyframe = the
  case's card image on `work.html` (a curated still for the films, an
  in-the-wild video frame for the digital cases); headline = the case
  `<h1 id="title">`; eyebrow `POWER//SHIFTER — <CLIENT>` (client pulled
  from the case sub-hero eyebrow). Cards that are still "image pending"
  slot-frame placeholders take a keyframe from the `OVERRIDE` map at the
  top of the script (e.g. Allia → `images/allia/allia-after.jpg`).

## Run

```bash
python3 tools/og-composer/generate_og.py             # all blog cards
python3 tools/og-composer/generate_og.py 3           # first 3 (spot-check)
python3 tools/og-composer/generate_og_work.py        # all case studies
python3 tools/og-composer/generate_og_work.py 3      # first 3 (spot-check)
```

Work output lands in `og-export/work-<slug>.jpg` + `manifest-work.csv`
(`slug,file,client,headline,status`).

Requires Google Chrome (used headless as the compositor — it loads the
real Adobe Fonts kit `xkk7api`, so the type matches the site exactly).

## Output

`og-export/<slug>.jpg` (JPEG q82, ~150KB each) + `og-export/manifest.csv`
(`slug,file,title,status`). The folder is **gitignored** — these are
destined for Cloudflare Images, not the repo.

## How it works

- Scrapes `(slug, image, title)` from the rendered card grid in
  `insights.html` (source of truth for what each card shows). Featured
  cards use `<h2>`, regular cards `<h3>` — the regex accepts both.
- Headline font size steps down with title length (76 → 46px) so long
  titles stay on 2–3 lines.
- Any output under 30KB is flagged `CHECK` in the manifest (usually means
  the source image failed to load before the screenshot).

## Publishing flow (manual, next step after generating)

1. Upload `og-export/*.jpg` to Cloudflare Images (account hash
   `So76NP_fFT3s9jNLvxCRFw`).
2. Record each returned image ID against its slug (extend manifest.csv).
3. Wire `<meta property="og:image" content="https://imagedelivery.net/<hash>/<id>/public">`
   into each post — via the blog renderer template
   (`tools/blog-renderer/`), NOT by hand-editing 63 files.

## Re-running

Safe to re-run anytime — output is regenerated from the current
`insights.html`. If a post's title or card image changes, re-run, re-upload
that one file, and update its ID.
