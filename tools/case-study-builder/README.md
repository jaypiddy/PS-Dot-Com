# Case-study builder

Scripts that generated the hand-published case-study pages from Notion-authored
copy. Companion to [`docs/case-study-publishing.md`](../../docs/case-study-publishing.md)
(the SOP + build journal). Run from the repo root; Python 3 only, no deps.

The principle: **slice the shared chrome (head/nav/CSS + footer) from the verified
`work/xyon.html` base and regenerate only the body region per case**, so every page
stays byte-identical in chrome and only the editorial body content is authored.

## Routing

Case studies render to **`work/<slug>.html`**, served at `/work/<slug>` via Vercel
clean URLs (moved from the site root 2026-06-30, to match the same pattern the blog
uses at `/insights/<slug>` — see `docs/design-system.md` §11). Every internal link
the builder emits (back-link, category link, next-case cross-links) is root-absolute
(`href="/work/..."`) for the same reason the blog renderer's links are: a relative
`href="work"` only resolves correctly when the page sits at the site root.

## Files
- **`build_cases.py`** — reads `cases_data.py`, slices chrome from `work/xyon.html`,
  and writes `work/<slug>.html` for each case. Body is an ordered list of
  render-specs: `('h2', t)` `('h3', t)` `('p', html)` `('ul', [items])`
  `('pull', eyebrow, html)` `('quote', text, name, role, co)` `('comment', t)`
  `('raw', html)`. Run: `python3 tools/case-study-builder/build_cases.py [slug ...]`
  (no args = all).
- **`cases_data.py`** — the structured source-of-record for each case (title, meta,
  eyebrow, h1, sub-voice, dossier facts, body specs, next-case slugs) plus the
  `CARD` registry used for next-case links. Sector / Platform / sub-voice / pull
  eyebrows are **editorial derivations**, not Notion DB fields.
- **`wire_cards.py`** — repoints `/work` grid cards (`href="#"` → `/work/<slug>`) by
  matching their `<h3>`, fixes titles, inserts placeholder cards. Already run once
  (2026-06-29) — not idempotent against the current `work.html` (its `href="#"`
  targets are already gone); kept as reference for a future repoint pass.
- **`add_odometers.py`** — Tier-1 odometer upgrade: injects a `proof-row` dossier
  (digit cols + `.ch` separators + `.sfx` units) into the hard-metric pages, by
  slug, in `work/`. Idempotent (skips a file that already has `id="proofRow"`).
  The trigger JS + CSS already ship in the cloned chrome.

## Caveats
- **Don't re-run `build_cases.py` on a case that's had a hand-fix since its last
  generation** — it overwrites the whole body from `cases_data.py`, which doesn't
  know about post-publish Notion syncs (e.g. Delta Controls' copy update,
  `faf716e`) or the odometer injection (`add_odometers.py` runs as a separate pass
  *on top of* the builder's output, and isn't reflected in `cases_data.py` either).
  Re-running would silently regress both. Sync `cases_data.py` from the current
  `.html` (or from Notion) before rebuilding a case that's moved on since.
- These reflect the 2026-06 batch. The generated `.html` is the canonical/live
  artifact; regenerating overwrites it.
- Not wired to Notion — copy is pasted into `cases_data.py` by hand (the eventual
  `case-study-publisher` skill formalizes the Notion→page step).
