# Case-study builder

Scripts that generated the hand-published case-study pages from Notion-authored
copy. Companion to [`docs/case-study-publishing.md`](../../docs/case-study-publishing.md)
(the SOP + build journal). Run from the repo root; Python 3 only, no deps.

The principle: **slice the shared chrome (head/nav/CSS + footer) from the verified
`xyon.html` base and regenerate only the body region per case**, so every page stays
byte-identical in chrome and only the editorial body content is authored.

## Files
- **`build_cases.py`** — reads `cases_data.py`, slices chrome from `xyon.html`, and
  writes `<slug>.html` for each case. Body is an ordered list of render-specs:
  `('h2', t)` `('h3', t)` `('p', html)` `('ul', [items])` `('pull', eyebrow, html)`
  `('quote', text, name, role, co)` `('comment', t)` `('raw', html)`.
  Run: `python3 tools/case-study-builder/build_cases.py [slug ...]` (no args = all).
- **`cases_data.py`** — the structured source-of-record for each case (title, meta,
  eyebrow, h1, sub-voice, dossier facts, body specs, next-case slugs) plus the
  `CARD` registry used for next-case links. Sector / Platform / sub-voice / pull
  eyebrows are **editorial derivations**, not Notion DB fields.
- **`wire_cards.py`** — repoints `/work` grid cards (`href="#"` → slug) by matching
  their `<h3>`, fixes titles, inserts placeholder cards.
- **`add_odometers.py`** — Tier-1 odometer upgrade: injects a `proof-row` dossier
  (digit cols + `.ch` separators + `.sfx` units) into the hard-metric pages. The
  trigger JS + CSS already ship in the cloned chrome (guarded by `if (proofRow)`).

## Caveats
- These reflect the 2026-06 batch. The generated `.html` is the canonical/live
  artifact; regenerating overwrites it. Re-sync `cases_data.py` from Notion before
  rebuilding a page, or edit the `.html` directly for one-off copy changes.
- Not wired to Notion — copy is pasted into `cases_data.py` by hand (the eventual
  `case-study-publisher` skill formalizes the Notion→page step).
