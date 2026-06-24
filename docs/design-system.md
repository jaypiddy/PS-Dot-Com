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
| `--grey` | `#6E7176` | Muted text — roles, captions, meta |
| `--magenta` | `#FD2E90` | The single accent. **One per viewport** (see §4) |
| `--line` | `rgba(18,19,21,.14)` | Hairline **on paper** (ink-based) |
| `--line-light` | `rgba(250,250,247,.18)` | Hairline **on ink** (paper-based) |

> Note: an earlier `--paper:#FAFAF7` is overridden later to `#F6F3EC`. Ship the
> warmed cream `#F6F3EC` as canonical.

### Type families ("Two Voices")
| Token | Stack | Voice |
|---|---|---|
| `--display` | `neue-haas-grotesk-display`, Helvetica Neue, … | The confident grotesque — headlines, big statements |
| `--text` | `neue-haas-grotesk-text`, … | UI / body / eyebrows / labels |
| `--serif` | `late-serif-variable`, Georgia, … | The **human/emotional** voice — italic, used as the counter-voice |

Fonts load via Adobe Typekit (`use.typekit.net/pkh7feu.css`). **Load it async**
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

- **Hero H1 (sub-hero):** `--display` 900, `clamp(52px,7vw,108px)`, line-height .96, letter-spacing -.02em
- **Section H2 (.engine):** `--display` 500, `clamp(40px,4.6vw,72px)`, line-height 1.02
- **Eyebrow:** `--text` 700, 12px, letter-spacing .14em, UPPERCASE, color `--magenta`
- **Body:** `--text`, `clamp(16px,1.5vw,21px)`, line-height 1.5–1.6
- **Serif voice:** `--serif` italic 500 — used inline as `em.voice` (see §5 voice rule)

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
- **Link wiring (canonical):** Work→`work.html`, Digital→`digital.html`,
  Studios→`studios.html`, Insights→`insights.html`, About→`about.html`,
  Contact→`#contact`. (Practice links previously pointed at homepage anchors — fixed.)
  Careers→`#` until the page exists.
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
`.eyebrow` — `--text` 700, 12px, .14em, UPPERCASE, magenta. One formula: either a bare
section label ("Insights") or "Section — descriptor" ("About — one culture, two practices").
Pick one per context; color comes from the shared rule, never inline.

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
2. **Typekit loads async** so a blocked kit can't blank the page.
3. **Nav links wired** to standalone pages (Work/Digital/Studios/Insights/About);
   **active state** via `.is-current` + `aria-current`.
4. **Studios `reel-hero` is the one sanctioned hero exception**; all other subpages
   use `sub-hero`.
5. **Supporting line — two sanctioned variants.** The hero supporting line collapses to
   exactly two: the **voice line** (`.sub-voice > em.voice.mag`, serif italic magenta —
   declarative hub statements; Work, Insights, Article, Case) and the **body line**
   (`.sub-body`, prose, `--paper` on the ink hero — explanatory heroes; Digital, About).
   The legacy `.streams` (Insights) and `.reel-body` (Studios) variants are migrated onto
   `.sub-body`; Studios keeps `--paper` over the reel scrim and `reel-hero` stays the
   sanctioned exception (item 4).
6. **Voice-color rule (Two Voices).** `em.voice.mag` = magenta = the emotional/pivot line
   (hero voice line, page closers). Bare `em.voice` = cream = emphasis that is part of the
   headline itself. Applied site-wide.
7. **Eyebrow convention, one per page-type.** Hub/practice pages (index, work, digital,
   studios, insights, about) use `Section — descriptor`. Detail pages (article,
   case-telus-koodo) use `Category · Client/Topic`. Color comes from the shared `.eyebrow`
   rule — never inline.

## 8 · Resolved this round

The three open consistency decisions from the prior round — supporting-line treatment,
voice-color rule, and eyebrow convention — were ratified June 2026 and are now locked in
§7 as items 5, 6, and 7. The `.streams`/`.reel-body` supporting lines have been migrated
onto `.sub-body`; the voice-color and eyebrow conventions are applied site-wide.

## 9 · Parking lot (verify before paid/PR reuse)

- Proof claims pending verification: Angel Oak "+40%", the ADDY judging category,
  Contentful/Sanity/Vercel partner tiers. (Mirrored in `concierge-knowledge.md`.)
- **Careers** route not built — `#` for now.
- **Concierge email** still placeholder `hello@powershifter.com` — confirm real inbox.
- **Stream UIDs** for any nav hover-reel idea TBD.

---

## 10 · File map

- Pages: `index.html`, `work.html`, `digital.html`, `studios.html`, `insights.html`,
  `article.html`, `case-telus-koodo.html`, `about.html`
- Shared chrome copy: `docs/copy/_shared.md` · per-page copy: `docs/copy/*.md`
- Exhaustive pattern catalogue: `docs/design-system-audit.md`
- Additive layers: `ps-spice.*`, `ps-concierge.*`, `worker/`
- `*-preview.html` files are review-only (Craft Layer toggle panel) — do not ship.
