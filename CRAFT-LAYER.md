# PS · Craft Layer — design-spice pass

An **additive** interaction/visual layer for the Two Voices pages. It does not
touch brand tokens or existing markup — it reuses your class names and the house
easing `cubic-bezier(.76,0,.24,1)`, and every effect is gated behind a body class
so it can be toggled off to compare against the shipped page.

## Files
- `ps-spice.css`
- `ps-spice.js`

## Integration (per page)
```html
<!-- in <head>, after the Typekit + preload links -->
<link rel="stylesheet" href="ps-spice.css">

<!-- before </body> -->
<script src="ps-spice.js"></script>
```
That's it. The script boots itself, marks each `<section>` as a host, wires the
modules, draws the band divider, and reveals content.

## Two modes — review vs production
The script checks for `data-spice-review` on `<body>`:
- **Production** (no attribute — the real `digital.html` / `studios.html`): all
  modules ship ON, **no control panel**, and the real Cloudflare Stream
  `<iframe>`s are left untouched.
- **Review** (`<body data-spice-review>` — `digital-preview.html` / `studios-preview.html`):
  renders the **Craft Layer** control panel (✦, bottom-right) for toggling each
  module on/off, and swaps Stream embeds for styled posters so the preview
  sandbox stays fast. State persists in `localStorage`.

To audition the layer with toggles, open `digital-preview.html` / `studios-preview.html`
(preview-only — don't deploy them). To ship, the two real pages already include the
layer with no panel.

## The 7 modules (body-class gates)
| Gate | Module | What it does |
|---|---|---|
| `sp-magnetic` | Magnetic CTAs | `.btn` leans toward the pointer, snaps home. Rides on top of the existing cascade. |
| `sp-reveal` | Magenta-wipe media | `.frame` / `.wframe` unveil under a magenta swipe on scroll-in — the highlight-swipe DNA applied to imagery. |
| `sp-kinetic` | Kinetic Two-Voices | The serif `em.voice` line grows and draws a magenta underline on entry. |
| `sp-index` | Editorial index | Outlined section numerals (`.sp-idx`) float in the top gutter for an editorial spine. |
| `sp-rules` | Drawn hairlines | `.rule` draws on; each paper→ink flip gets a magenta seam edge (`.sp-edge`). |
| `sp-skew` | Scroll inertia | Section media drifts a few px against scroll velocity. Subtle. |

Master gate is `spice-on`; in review mode untick **Spice** to see the original.

## Review-driven refinements baked in
- **Kinetic underline suppressed inside `.engine` bands** — those already carry
  their own `.rule`, so the kinetic underline is dropped there to avoid two
  stacked magenta marks. It still enriches hero/closer/door voice lines.
- **Band divider** — a content-width hairline is injected between the two
  adjacent `.engine.how-band` modules (the one-two punch).
- **Thumbnail hairline normalization** — `.work .card .frame` gets a 1px
  `line-light` hairline below it so the first/top-left card (e.g. Iron Mountain)
  matches the grid's between-cell seam rhythm.
- **Webflow partner chip** — added to Digital's `.partners-strip` (Enterprise
  Certified Expert). This one is a content edit in `digital.html`, not the layer.

## Notes for production
- **Stream embeds:** in this review build, `ps-spice.js` swaps the Cloudflare
  Stream `<iframe>`s (`.reel-video`, `.video-frame iframe`) for a styled poster so
  the sandbox stays fast. In production, keep your real iframes — the swap is the
  only review-only behaviour; everything else ships as-is.
- All modules respect `prefers-reduced-motion` and gate pointer effects behind
  `(hover:hover) and (pointer:fine)`.
- Nothing here is page-specific — the same two files drop onto any Two Voices
  page (Work, Insights, About when it ships).
