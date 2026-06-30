# Blog renderer

Renders POWER SHIFTER's 63 Published blog posts from a Notion export onto the
`article.html` template, and regenerates the `insights.html` card grid. Origin
spec: `RENDERER-SPEC.md` (handoff doc, not in this repo). Run from the repo root;
Python 3 only, no deps.

The principle: **slice the shared chrome (head/nav/CSS + footer) from `article.html`
and regenerate only the body region per post**, plus the card grid in `insights.html`
between its `<div class="sheet">` markers. Chrome edits to `article.html` (the
template) propagate to all 63 pages on the next run; chrome/CSS/JS edits to
`insights.html` *outside* the `<div class="sheet">…</div>` region are untouched by
a re-run and safe to hand-edit directly (the overlay-headline CSS, the filter JS,
and the cross-fade animation all live there).

Run: `python3 tools/blog-renderer/render_blog.py [posts.json]` (defaults to the
`posts.json` in this directory).

## Routing

Articles render to **`insights/<slug>.html`**, served at `/insights/<slug>` via
Vercel clean URLs — nested one directory below the site root, unlike case studies
(which stay flat at root). This is the one page set in the repo that's nested, so
every internal link the renderer emits (and every link `article.html`'s chrome
carries) had to be root-absolute (`href="/insights/..."`, not `href="insights/..."`)
— see `docs/design-system.md` §11 if adding another nested section.

## Files

- **`render_blog.py`** — the renderer. Converts each post's `body_markdown` into
  the template's documented component set (`docs/copy/article.md`): `p.lede` /
  `p.end`, `h2`/`h3`, `ul.changes` (bold lead clause + one level of nesting),
  `ol.seq`, `figure.breakout` (auto `Fig. 0N`), `blockquote` (for `> ` quotes —
  *not* `em.voice.mag`, which is sized for short hero phrases and looks cramped on
  multi-sentence quotes), YouTube/Podbean embeds (handles both `[text](url)` links
  and raw `<embed src="...">`/`<iframe>` lines), inline bold/italic/links, and
  markdown backslash-escapes (`\<\<Chapter\>\>`-style nav asides).
- **`posts.json`** — the Notion export (94 records; 63 Published get rendered,
  `test-blog` is excluded). Self-contained — body markdown is inline, no Notion
  connection needed to run this.
- **`blog-meta.csv`** *(optional)* — a second Notion export filling fields
  `posts.json` ships empty: the new Build/Frames/Founder's-Focus taxonomy,
  `Featured` (renders that post as the 21:9 hero card), and `Photo Credit`.
  Merged by slug in `merge_overrides()`. Absent file → falls back to
  `old_categories`, no feature card.
- **`authors.json`** — author id → name, already resolved into `posts.json`;
  reference only.

## Converter gotchas (found the hard way — re-check if posts render oddly)

- **Notion exports one block per line** (single `\n`, no blank-line paragraph
  separators, no hard wrapping). The converter treats every non-blank line as its
  own paragraph — don't reintroduce "gather consecutive lines into one `<p>`"
  logic, it silently runs distinct paragraphs together.
- **The lede drop-cap is suppressed** (`class="lede nodrop"`) when the first
  substantive paragraph opens on punctuation/a link rather than a letter (e.g. a
  bracketed `[start your journey here]` series-nav aside) — otherwise the
  drop-cap lands on `[` or a quote mark.
- Quotes (`> `) render as a real `<blockquote>`, not `em.voice.mag` — the latter
  is `line-height:1`, sized for a short hero phrase, and reads cramped/oddly
  underlined on a multi-sentence quote.

## Caveats

- Not wired to Notion — both inputs are hand-exported snapshots. Re-export from
  Notion and overwrite `posts.json`/`blog-meta.csv` before re-running if the
  source content has changed; the script doesn't fetch anything live.
- **Open from `RENDERER-SPEC.md`'s decision #2** — no `> **pull:**`/`::ledger`
  author markers exist in the current `posts.json`, so every post uses the
  baseline converter. Hand-elevating ledgers/pulls on flagship essays (the
  pattern already proven on case studies via `tools/case-study-builder/`) is a
  clean follow-up once markers are added in Notion.
- The generated `.html` under `insights/` is the canonical/live artifact;
  re-running overwrites it. One-off copy fixes can go directly in the generated
  file (several QA passes did, e.g. fixing a specific post's body) — just know a
  full re-render will overwrite that file (not the rest of the set) if it's
  rerun before the same fix lands in `posts.json` or the converter.
