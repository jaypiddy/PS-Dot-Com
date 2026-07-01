# POWER SHIFTER — Design System (canonical spec)

**Status:** canonical · reconciled June 2026
**Relationship to other docs:** this is the **contract** — tokens, patterns, and
decisions. `docs/design-system-audit.md` remains the exhaustive pattern catalogue;
when the two disagree, *this* file wins and the audit gets updated to match.
**How to use in Claude Code:** implement tokens + patterns in the target stack.
Adapt implementation freely for technical constraints, but push any change that
alters a **decision** (a token value, a pattern rule) back into this file so both
sides stay in sync.

---

## 1 · Design tokens (source of truth)

These already exist as CSS custom properties on every page. Port them verbatim.

### Color
| Token | Value | Role |
|---|---|---|
| `--ink` | `#121315` | Primary dark — bg for dark sections, text on paper |
| `--ink-soft` | `#1A1B1E` | Slightly lifted ink — media wells, placeholders |
| `--paper` | `#F6F3EC` | Warmed cream ("Lando cream", **not** white). Light bg + text on ink |
| `--grey` | `#6B6E73` | Muted text — roles, captions, meta. **Darkened from `#6E7176`** so secondary text clears AA on paper (4.62:1). |
| `--magenta` | `#FD2E90` | The single accent. **One per viewport** (see §4). Ship on **ink/dark** (5.28:1) or as **large** text only — as *small* text on paper it is 3.17:1 and **fails AA**. Use `--magenta-ink` for small magenta text on light. |
| `--magenta-ink` | `#CD2575` | **AA-safe magenta for small text on light surfaces** (4.60:1 on paper, 5.10:1 on white). Eyebrows, small labels (`.qb-role`), and links/error/hover text on paper or white. Same hue family as `--magenta`, just deep enough to pass. |
| `--line` | `rgba(18,19,21,.14)` | Hairline **on paper** (ink-based) |
| `--line-light` | `rgba(250,250,247,.18)` | Hairline **on ink** (paper-based) |

> Note: an earlier `--paper:#FAFAF7` is overridden later to `#F6F3EC`. Ship the
> warmed cream `#F6F3EC` as canonical.

> **Contrast note (WCAG 2.1 AA):** `--grey` and `--magenta-ink` values were set to
> clear 4.5:1 against paper `#F6F3EC`. Brand `--magenta` intentionally stays bright
> for its role on ink and as large display type — do **not** repoint it to the ink
> variant globally. Pick the token by surface + size (see §4).

### Type families ("Two Voices")
| Token | Stack | Voice |
|---|---|---|
| `--display` | `articulat-heavy-cf`, Helvetica Neue, … | The confident sans (heavy 900) — headlines, big statements |
| `--text` | `articulat-cf`, … | UI / body / labels |
| `--serif` | `la-mericana` (ExtraBold, `800`) | The serif "voice" — a display serif for the emotional/pivot line, pull quotes, big stat numerals. Ship at **weight 800** (`--magenta`/`--ink` per surface). |
| `--mono` | `config-mono-vf`, ui-monospace, … | Eyebrows + small index numerals (nav/related/ledger) |

Fonts load via Adobe Typekit (`use.typekit.net/xkk7api.css`). **Load it async**
(`media="print" onload="this.media='all'"` + `<noscript>` fallback) so a slow/blocked
kit never blanks the page — see §7 "black-on-blank" lesson.

### Layout & motion
| Token | Value | Use |
|---|---|---|
| `--gutter` | `clamp(20px,4vw,64px)` | Page side padding |
| `--max` | `1440px` | Max content width (`.wrap`) |
| House easing | `cubic-bezier(.76,0,.24,1)` | The signature ease — use everywhere |

---

## 2 · Typography scale

- **Hero H1 (sub-hero):** `--display`, `clamp(52px,7vw,108px)`, line-height .96, letter-spacing -.02em
- **Section H2 (.engine):** `--display`, `clamp(40px,4.6vw,72px)`, line-height 1.02
- **Eyebrow:** `--mono` 700, 12px, letter-spacing .14em, UPPERCASE. Color: `--magenta-ink` on light surfaces (12px fails AA in bright `--magenta`), `--magenta` only on ink/dark.
- **Body:** `--text` 400, `clamp(16px,1.5vw,21px)`, line-height 1.5–1.6
- **Serif voice:** `--serif` italic — used inline as `em.voice` (see §5 voice rule)

> **Weight note:** `--display` (articulat-heavy-cf) ships a single **900** cut. `--serif`
> (`la-mericana`) is a **static display serif** — the kit subset carries `500 italic`, `700`,
> and `800` (+ `800 italic`); ship the serif at **ExtraBold `800`** everywhere (hero voice
> line, pull quotes, `.stat` numerals). It replaced `fraunces-variable` (July 2026): because
> la-mericana is static, the legacy `--serif-vset` (`font-variation-settings`) is now **inert**
> — weight is set by real `font-weight:800`, not an axis. `--text` has 400 (body) + 700 (UI);
> `--mono` is variable 200–700.
>
> **Numerals are proportional** (`'0'` 0.727em vs `'1'` 0.392em) and the subset has **no
> `tnum`** — so the odometer centers each digit (`.odo .col{align-items:center}` +
> `text-align:center`) to keep narrow digits from floating in oversized boxes. La Mericana
> also has **tall vertical metrics** (content box ~1.5em); the odometer roll-mask
> `--step` was raised `1.18em → 1.35em` so `overflow:hidden` doesn't clip glyph bottoms
> (the "2" was cut). `--step` is the roll unit, so the animation scales with it.

---

## 3 · Color usage rules

- **Two surfaces:** ink sections and paper sections, alternated for rhythm. Aim for a
  paper / ink / paper cadence down a page; never two heavy ink bands adjacent without intent.
- **Hairlines:** use `--line` on paper, `--line-light` on ink. Never the wrong pairing.
- **Text on ink is always `--paper`.** (This is the rule the hero bug broke — see §7.)

## 4 · The magenta rule

`--magenta` is the only accent. **Budget: roughly one magenta moment per viewport.**
It marks: eyebrows, the emotional serif "voice" line, key CTAs, the takeover, and
draw-on rules. Don't let it become decorative or appear 3–4× in one screen.

**Which magenta (contrast):** pick by surface **and** size.

| Context | Token | Ratio |
|---|---|---|
| Small text (≤~18px) on paper/white — eyebrows, links, labels, form errors | `--magenta-ink` `#CD2575` | 4.60:1 ✅ |
| Any magenta text on **ink/dark** | `--magenta` `#FD2E90` | 5.28:1 ✅ |
| **Large** display magenta on paper (hero voice line, big quote marks ≥~24px) | `--magenta` `#FD2E90` | 3.17:1 ✅ (large-text 3:1) |
| Magenta **fill** with light text on it (buttons) | fill `--magenta-ink`, text `--paper` | 4.60:1 ✅ |

Small brand `--magenta` on paper is **3.17:1 — fails AA**; that's the trap the a11y
pass fixed. Magenta as a **hairline/edge/underline** (`.rule`, `.sp-edge`, kinetic
underline) is a non-text graphic → only needs 3:1, so brand `--magenta` is fine there.

---

## 5 · Patterns & components

### Header / nav (shared chrome)
- Fixed top bar: wordmark left, **"Menu +"** trigger right. Band-flips ink/paper on
  scroll (`darkBands()`); `header.on-light` on paper sections.
- **Pink takeover** (`.takeover`, bg `--magenta`): full-viewport, numbered link list
  (`.tk-l` → `.tk-n` mono numeral + `.tk-t` display word + `.tk-ar` arrow). Words fill
  with the `scratches-v2.webp` texture on hover (`background-clip:text`). Signature
  moment — keep it.
- **Active page:** `.tk-l.is-current` + `aria-current="page"` → persistent arrow +
  solid numeral. Set on the link matching the current route.
- **Link wiring (canonical, extensionless):** Work→`/work`, Digital→`/digital`,
  Studios→`/studios`, Insights→`/insights`, About→`/about`. **Contact removed from the nav**
  (the `#contact` page-closer + the concierge handle contact now). Careers→`#` until the page
  exists. Legal links live in the footer: `/terms-and-conditions`, `/privacy-policy`.
- **Mobile:** takeover scrolls if short; foot stacks; type clamps down (≤560px).

### Hero — canonical `sub-hero`
The standard subpage hero. Ink bg, **min-height 50vh**, bottom-aligned, animated
`.slash-field` SVG backdrop. Structure:
```
eyebrow  →  H1 (.rise word-reveal)  →  supporting line
```
- **Eyebrow:** magenta caps via the shared `.eyebrow` rule (do NOT add inline `style="color"`).
- **H1:** display 900, uses `.rise` word-mask reveal.
- **Supporting line — two sanctioned variants (pick by intent):**
  - **Voice line** — `.sub-voice` > `em.voice.mag` (serif italic, **magenta**). For
    declarative hub statements. Used on Work, Insights, Article, Case study.
  - **Body line** — `.sub-body` (prose, with `<strong>`). For heroes that need an
    explanatory sentence. Used on Digital, About. **Must be `--paper` on the ink hero.**
- Detail pages (Article, Case study) add a `.back.swipe` link above the H1 — sanctioned variant.

### Hero — `reel-hero` (Studios only — sanctioned cinematic exception)
Full-bleed Cloudflare Stream background reel, **min-height 88vh**, bottom-aligned,
`.reel-vignette` scrim for legibility, H1 + `.reel-body` + a CTA button. This is the
**one** approved deviation from `sub-hero` — justified because Studios is the film
practice. A small **"SHOWREEL"** caption is expected here (live background reel).

### Engine band (`.engine` / `.engine-grid`)
Two-column section: H2 left (with a draw-on magenta `.rule`), prose right
(5fr / 7fr). The workhorse content band. Variants: `.mirror` (flip), `.validator-band`
(ink), `.how-band`.

### Buttons
- **Primary — `.btn.cascade`:** letter-by-letter cascade animation on hover. JS splits
  letters; arrow appended if `→` present.
- **Secondary — `.swipe`:** magenta highlight box swipes behind the **final word**
  (which is set in serif). Two-word minimum.
- **Solid — `.btn.solid`:** fills magenta on hover.

### Eyebrow
`.eyebrow` — `--mono` 700, 12px, .14em, UPPERCASE, `--magenta-ink` on light / `--magenta` on ink (§1, §4). One formula site-wide (every
eyebrow, page hero **and** section): hub/practice pages use "Section — descriptor"
("About — one culture, two practices", "Proof — the receipts"); detail pages use
"Category · Client/Topic" ("Digital · TELUS & Koodo"). Bare section labels ("Insights",
"Leadership") and the older "The X" device are retired — the brand word may survive as the
*descriptor* (e.g. "Proof — the receipts"). Color comes from the shared rule, never inline.
See §7 item 7.

### The "voice" rule (Two Voices)
`em.voice` = serif italic emphasis inside display type.
- `em.voice.mag` → **magenta** = the emotional/pivot line (hero voice line, page closers).
- `em.voice` (no `.mag`) → **cream** = emphasis that's part of the headline itself.
Apply this consistently — it currently flips between heroes (see §7 open items).

### Motion
- **`.rise`** — headline word-mask reveal (JS splits words; `.in` triggers on scroll).
- **`.reveal`** — block fade-up on scroll (`.in`).
- **`.slash-field`** — animated `//` SVG backdrop for `sub-hero`.
- Always honor `prefers-reduced-motion`; gate entrance anims so print/PDF show end-state.

### Additive layers (optional, drop-in)
- **Craft Layer** (`ps-spice.css` + `ps-spice.js`) — magnetic CTAs, magenta-wipe media
  reveals, kinetic voice underlines, editorial section numerals, drawn hairlines,
  scroll inertia. Gated behind body classes; `data-spice-review` enables the toggle panel.
- **Concierge** (`ps-concierge.css` + `ps-concierge.js`) — corner AI concierge.
  Knowledge in `docs/concierge-knowledge.md`; production proxies through the
  Cloudflare Worker in `worker/` (see its README).

---

## 6 · Page rhythm reference

Canonical section order is per-page, but the surface cadence should alternate
ink/paper for rhythm. About, for example: ink hero → paper story → paper roster →
**ink** principles → paper recognition → paper work-from-anywhere → ink closer.

---

## 7 · Decisions locked this round (canon)

1. **Text on ink = `--paper`.** The `.sub-hero .sub-body` rule defaulted to `--ink`,
   rendering invisible on the ink hero (About **and** Digital). Fixed to `--paper`.
   Rule: any text on an ink surface is paper; never ink-on-ink.
2. **Typekit should load async** (`media="print" onload="this.media='all'"` + `<noscript>`) so a
   blocked kit can't blank the page. *Status: implemented on about.html; the other 9 pages load the
   kit synchronously — safe to retrofit.*
3. **Nav links wired** to standalone pages (Work/Digital/Studios/Insights/About), **extensionless**
   (Vercel clean URLs); **active state** via `.is-current` + `aria-current`. **Contact removed
   from the nav** (the `#contact` closer + concierge handle it).
4. **Studios `reel-hero` is the one sanctioned hero exception**; all other subpages
   use `sub-hero`.
5. **Supporting line — two sanctioned variants.** The hero supporting line collapses to
   exactly two: the **voice line** (`.sub-voice > em.voice.mag`, serif italic magenta —
   declarative hub statements; Work, Insights, Article, Case) and the **body line**
   (`.sub-body`, prose, `--paper` on the ink hero — explanatory heroes; Digital, About).
   The legacy `.streams` (Insights) and `.reel-body` (Studios) *hero* variants are migrated
   onto `.sub-body`; Studios keeps `--paper` over the reel scrim and `reel-hero` stays the
   sanctioned exception (item 4). (The homepage keeps a separate `.streams` paragraph in its
   insights *teaser* — a content-section descriptor, not a hero supporting line.)
6. **Voice-color rule (Two Voices).** `em.voice.mag` = magenta = the emotional/pivot line
   (hero voice line, page closers). Bare `em.voice` = cream = emphasis that is part of the
   headline itself. Applied site-wide.
7. **Eyebrow convention, one per page-type — applied to every eyebrow (page hero AND each
   section).** Hub/practice pages (index, work, digital, studios, insights, about) use
   `Section — descriptor`. Detail pages (article, case-telus-koodo) use
   `Category · Client/Topic`. Bare section labels and the older "The X" device are retired;
   a brand word may survive as the descriptor (e.g. "Proof — the receipts",
   "Challenge — the constraint"). Color comes from the shared `.eyebrow` rule — never inline.

## 8 · Resolved this round

The three open consistency decisions from the prior round — supporting-line treatment,
voice-color rule, and eyebrow convention — were ratified June 2026 and are now locked in
§7 as items 5, 6, and 7. The `.streams`/`.reel-body` supporting lines have been migrated
onto `.sub-body`; the voice-color and eyebrow conventions are applied site-wide.

**Accessibility contrast pass (July 2026, WCAG 2.1 AA).** Two token changes are now
canon: `--grey` `#6E7176 → #6B6E73` (secondary text on paper 4.42 → 4.62:1), and a new
`--magenta-ink` `#CD2575` for small magenta text on light (4.60:1), applied to eyebrows,
`.qb-role`, and concierge link/error/footer/submit-hover. Brand `--magenta` `#FD2E90` is
unchanged and still owns ink/dark and large-display magenta. Token-selection matrix in §4.
Shipped on branch `a11y/wcag-aa-fixes` (PR #2) alongside the non-color a11y fixes
(odometer SR value, `<main>`/skip link, form labels, focus ring).

**Serif swap (July 2026).** `--serif` moved from `fraunces-variable` to `la-mericana`
ExtraBold (`800`), sitewide. La Mericana is a static display serif, so the old
`--serif-vset` axis settings are inert; weight is real `font-weight:800`. Its figures
are proportional with no `tnum`, so odometer digits are centered (§1 weight note).

## 9 · Parking lot (verify before paid/PR reuse)

- Proof claims pending verification: Angel Oak "+40%", the ADDY judging category,
  Contentful/Sanity/Vercel partner tiers. (Mirrored in `concierge-knowledge.md`.)
- **Careers** route not built — `#` for now.
- **Concierge email** confirmed: `bd@powershifter.com` (live inbox, already in production elsewhere).
- **Stream UIDs** for any nav hover-reel idea TBD.

---

## 10 · File map

- Pages (served **extensionless** via Vercel `cleanUrls`; old `.html` 308-redirects):
  `/` (index), `/work`, `/digital`, `/studios`, `/insights`, `/article`, `/about`. Legal pages
  built from the article template: `/terms-and-conditions`, `/privacy-policy`.
- **Case studies** (hand-published from Notion, many — `/work/xyon`, `/work/allia-health-group`,
  `/work/case-telus-koodo`, etc.; moved here from the root 2026-06-30): see
  `docs/case-study-publishing.md` + generator `tools/case-study-builder/`.
- **Blog posts** (63 Published, rendered from a Notion export — `/insights/<slug>`; listing at
  `/insights`): see generator `tools/blog-renderer/` (has its own README).
- Case studies and blog posts are the two page sets in this repo nested one directory down
  (under `/work` and `/insights` respectively) — see §11 below for why that mattered for both.
- Fonts: Adobe Typekit kit `xkk7api` (see §1). Menu hover loop: `images/scratches-v2.webp`
  (animated WebP, filled into nav words via `background-clip:text`) — swap per `docs/menu-hover-loop.md`.
- Shared chrome copy: `docs/copy/_shared.md` · per-page copy: `docs/copy/*.md`

## 11 · Engineering conventions (not visual canon, but load-bearing)

- **Internal links must be root-absolute.** Every page's chrome (nav, footer,
  stylesheet/script tags, the concierge widget) was written as relative paths with no
  leading slash — `href="work"`, `src="ps-spice.css"` — which only resolves correctly
  when the page sits at the site root. A page nested in a subdirectory (e.g.
  `/insights/<slug>`) breaks every one of those references, because the browser
  resolves a relative href against the *current URL's directory*, not the domain root.
  **Any new page added in a subdirectory must use root-absolute hrefs/srcs**
  (`href="/work"`) for everything it shares with the rest of the site. Worked twice
  the same day: blog posts into `/insights/<slug>` (commit `0728b95` — including a
  silently-broken `fetch()` inside `ps-concierge.js`), then case studies into
  `/work/<slug>` (same fix, all 16 pages — see `docs/case-study-publishing.md`
  journal #7).
- **Clean URLs are Vercel-only.** `vercel.json`'s `cleanUrls:true` strips `.html` in
  production; a local static server doesn't — test nested/extensionless routes against
  the Vercel deploy, or append `.html` for local checks.
- **Craft Layer reveal scrim sits above ordinary content** — `ps-spice.css` sets
  `body.sp-reveal .wtint{z-index:6}` and `.wframe::after{z-index:4}` during the reveal
  animation. Any text or control meant to sit visibly *on top of* a `.wframe`/`.wtint`
  image plate (e.g. an overlaid card headline) needs `z-index` above 6, or the reveal
  scrim will silently paint over it. (Found shipping the Insights card headline overlay
  — fixed at `z-index:8`.)
- **A broad `[data-attr]` selector can catch more than the cards.** The Insights filter
  tabs and the cards they filter both carried `data-cat`; a `querySelectorAll('[data-cat]')`
  scoped to "all elements with that attribute" silently hid the *other tab buttons* on
  click, not just non-matching cards. Scope DOM queries to the actual container
  (`.sheet .wcard`), not a bare attribute selector, when the same attribute is reused
  for both the controls and the content they control.
- Exhaustive pattern catalogue: `docs/design-system-audit.md`
- Additive layers: `ps-spice.*`, `ps-concierge.*`, `worker/`; deploy config: `vercel.json`
- `*-preview.html` files are review-only (Craft Layer toggle panel) — do not ship.
