# PS-Dot-Com

Rebuild of [powershifter.com](https://powershifter.com) for POWER SHIFTER Digital Inc., Vancouver.

One masterbrand, one domain, two doors: **Digital** (product strategy, design, engineering) and **Studios** (generative AI film and content production). The site is hand-built static HTML (no build step), live on Vercel — `main` push = production deploy.

## Status

_The whole site is now **built and live on [powershifter.com](https://powershifter.com)** (Vercel; `main` push = deploy) — the domain cutover landed 2026-07-13. This table and the counts below are a point-in-time snapshot; the live site + `docs/` + the memory journal are the current source of truth._

| Page | File | State |
|---|---|---|
| Homepage | `index.html` | Built — live |
| Work | `work.html` | Built — live, 25 case studies |
| Digital | `digital.html` | Built — live |
| Studios | `studios.html` | Built — live (`.sub-hero` + showreel theater since 2026-07-14) |
| Insights | `insights.html` | Built — live, 63 posts |
| About | `about.html` | Built — live |

## Brand system

**Two Voices.** The structural idea of the site: two typographic registers signal the two practices.

- **Grotesque** — Neue Haas Grotesk (`--display` / `--text`). The vessel. Digital, structure, UI, evidence.
- **Serif** — Late Serif Variable, italic (`--serif`, Adobe Fonts kit `pkh7feu`, tracking −0.02em). The film voice. Studios, emphasis pivots, sub-voice lines.

**Palette.** Cream paper `#F6F3EC`, ink, magenta (`--magenta`). Magenta is the only accent — it carries interaction, emphasis, and the Studios signal.

**Approved lines.**
- "Made to use. Made to remember." — hero / footer
- "Anyone can generate. Few can direct." — Studios
- "Working software in weeks, not quarters." — Digital

**Sub-page header pattern.** Magenta caps eyebrow → 900 grotesque H1 → pink serif-italic sub-voice line. Work page: "Twenty-two projects. Two practices. One room."

## Interaction systems

All motion uses `cubic-bezier(.76,0,.24,1)` and is disabled under `prefers-reduced-motion`.

**Letter cascade (primary buttons).** `.cascade` on a button label. JS splits the label into per-letter columns, each holding two stacked glyphs (the second magenta). Hover rolls the column `translateY(-100%)` with a 14ms-per-letter stagger. Glyph cells are 1.3em tall to preserve descenders. Arrow nudges +5px, delayed 0.1s.

**Highlight swipe (secondary links).** `.swipe` wraps the last word of the label in `.hl` — set in serif italic at 1.18em. Hover scales a magenta box in from the left behind the word and flips it to paper. All swipe labels are two or more words; the JS skips single-word labels.

**Pink takeover menu.** Nav bar is logo + "MENU +". The takeover is a full-viewport magenta panel sliding from the top: numbered links (01 Work → 06 Careers) in 900 grotesque with staggered rise, footer with phone and city. **Click-only** — the button toggles; Close, Escape, or a link click dismiss, and scroll-lock is wired. (Hover-open and hover-close were removed 2026-07-14: opening a nav on hover fights the expected pattern and caused a recurring tap bug — don't re-add them. See `docs/design-system.md`.) Link words fill with an animated texture on hover via `background-clip:text`. Logo links home on both pages; on work.html the section links resolve to `index.html#…` anchors.

**F1 ink-fill filters (work page).** Pill tabs with cascade labels and grey counts. Active state fills ink with a magenta count. Hybrid's count reads "In production" in serif italic. Filtering toggles cards by `data-cat`.

**Homepage.** Cloudflare Stream hero reel, odometer stat counters, adaptive nav, word-mask rise animations.

## Work page

25 case studies: 17 Digital, 8 Studios/hybrid (incl. two Studios × Digital hybrids — Iron Mountain and Resurrection Campaign).

**Studios:** Iron Mountain — *The Summit* (featured, Silver ADDY 2026), Ernest Packaging — *Four Dreams* (Silver ADDY 2026), Celestial AI, The Algorithm Trap, Maple Health, Rapid MVP — *Luma*, Bremont — *From the Wing to the World*, Resurrection Campaign.

**Digital:** TELUS Rewards, Energizer, Hall Constructors, NVA, SxS Technologies, Koodo, BC Parks Foundation (Discover Parks), BC Women's Health Foundation, Angel Oak, Vancouver Chinatown BIA, NCIS (Nautical Claims Investigative Service), Phinity, XYON, Luxxee, Delta Controls, lululemon, Allia Health Group.

Hero images live in `images/` and are referenced by relative path. Delta Controls and lululemon are placeholder frames pending imagery.

## Repo structure

```
index.html        Homepage (v2.8)
work.html         Work page (v1)
images/           Project hero images + images/logos/ client wordmarks
README.md
```

## Conventions

- Static HTML, no build step. Each page carries its own CSS/JS inline.
- Image paths are relative (`images/x.jpg`).
- Shared systems (nav, takeover, buttons, footer) are duplicated per page during prototyping; they consolidate in Phase 3.
- Review protocol is dailies: director notes against rendered pages, then revision.

## Roadmap

1. Remaining pages, one at a time, carrying the global systems: Digital, Studios, Insights, About.
2. Content calls outstanding: MD title, proof-number verification, photography, OG images.
3. Phase 3: production build (Next.js), shared componentization, CMS for Insights.
