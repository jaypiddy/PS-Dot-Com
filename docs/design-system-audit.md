# Power Shifter design-system audit

**Last sync commit:** `07a2079`
**Maintained at:** `docs/design-system-audit.md`

JP's direction on the rebuild: *"any design patterns established elsewhere on the site get 'first right of refusal' once the copy for the page is completed. If we're a world class digital agency, best design systems practices should be followed."*

This file is the working inventory of what already exists on the site. Before inventing a new pattern for a new page, look here first. New patterns get added below with explicit notes on where else they'd be reused — so they enter the system on purpose, not by accident.

The CSS for these patterns currently lives **inline in each HTML page**. That's a Phase 2 prototyping decision, not the production architecture. When the static-HTML phase wraps and the Next.js layer ships, every pattern below should resolve to a shared stylesheet or component library. Until then, building a new page means copying the CSS rules from the source files cited below.

---

## Source files audited

| File | Role | Lines |
|---|---|---|
| `index.html` | Homepage — canonical reference for hero, doors, proof, engine, three-card work, three-up insights, closer | 858 |
| `work.html` | Sub-page chrome reference; sub-hero + filter + card grid | 1115 |
| `insights.html` | Sub-hero variant + stream filter + post grid (card-state demos) | 1072 |
| `article.html` | Editorial body components: lede, ledger, pull, figure, signal, video/podcast embeds, end, related | 1124 |
| `case-telus-koodo.html` | Case-study spine: masthead, dossier with odometer trio, in-the-wild video, before/after, credentials, next-case | 1327 |

---

## Pattern inventory

### 1. Page chrome (every page)

- `<head>` — Typekit kit `pkh7feu`; CSS variables `--ink`, `--ink-soft`, `--paper`, `--grey`, `--line`, `--magenta`; font stacks `--display` (Neue Haas Grotesk Display), `--text` (Neue Haas Grotesk Text)
- `<header>` — wordmark SVG + Menu button
- `<div class="takeover">` — magenta full-screen menu; `.tk-links` has 6 indexed items (01 Work, 02 Digital, 03 Studios, 04 Insights, 05 About, 06 Contact); each link uses staggered `--td` transition delay for cascade-in
- `<footer>` — mark, tagline ("Made to use. / Made to remember."), link list, "The signal" newsletter signup, land acknowledgement, legal row
- Inline `<script>` for takeover toggle (hover-intent on desktop, click-toggle on mobile, ESC to close), scroll-reveal observer (`.reveal` → `.in` on intersection), year stamp

**Reference:** `work.html:530-872` (cleanest sub-page baseline)

### 2. Sub-page hero — `.sub-hero`

- ~50vh hero with `.slash-field` SVG decoration (six animated slash pairs at varying scale/delay)
- Inner wrap: `.eyebrow` (small-caps label) → `h1.rise` → `.sub-voice` (serif italic on magenta `.voice.mag`) OR `.streams` (3-stream definition paragraph, insights only)
- **Variants:** `.sub-hero.article` (adds back-link), `.sub-hero.casestudy` (adds back-link + eyebrow + role/cats byline)
- **Currently does NOT support hero CTAs.** When a hub page (like `/digital`) needs CTAs in the hero, extend with a `.sub-hero-ctas` row — see "New patterns" below.

**Reference:** `work.html:591-599`, `insights.html:694-702`, `article.html:741-756`, `case-telus-koodo.html:933-947`

### 3. Filter bar — `.work-filter` + `.ftab`

- Sticky bar below sub-hero; each `.ftab` carries `.fl.cascade` label + `.fc` count
- Active state: `.ftab.on` (ink fill, paper text, magenta count)
- Pending/empty state: `.fc.pending` (magenta italic, for "In production" instead of a count)
- F1-style ink-fill animation on hover; label cascade on entry

**Reference:** `work.html:601-609`, `insights.html:704-712`

### 4. Card grids — two card classes

**4a. `.work-grid` + `.wcard`** — used on `/work` (22-card grid) and the case-study `next-case` block
- Variants: `.wcard.feature` (21:9 overlay with `.wcard-overlay` and white-on-image text), `.wcard.hybrid-slot` (non-anchor in-production slot frame), `.wcard.ff` (Founder's Focus type-only-on-ink dialect on `/insights`)
- Hover video loops via `data-video` attribute + `.wframe` poster image swap on `mouseenter`

**4b. `.work` + `.card`** — homepage 3-up Selected Work
- Simpler structure: `.frame` (image) + `.meta` (tag + H3 + body + `.go.swipe` CTA)
- No video loops; no overlay variant

**Decision rule:** use `.card` on hub/marketing pages, `.wcard` on collection pages where filtering and per-card-state behaviour matter.

**Reference:** `work.html:611-826`, `index.html:558-594`

### 5. Two-up comparison — `.doors` + `.door`

- Flexbox split: two `<a>` anchors with a `.seam` divider between
- Each `.door` has: `.eyebrow` (numbered, e.g. "01 — Product"), H2, `.lead` (display weight, with `em.voice` for the italic half), `p.body` (max 42ch), `.enter.swipe` CTA
- Variants: `.door.digital` (paper on ink-line border-top) vs `.door.studios` (ink on paper-light)
- Interaction: hover on either door causes the non-hovered to recede via `flex: .82 / 1.18`; the `.seam` lights magenta on `:has(.door:hover)`

**Reference:** `index.html:493-510`, CSS `index.html:80-96, 228-241, 264-265`

### 6. Proof spine — `.proof` + `.proof-row` + `.stat` + `.odo`

- "The receipts" eyebrow + 4-stat row, each stat with animated odometer numeral + `.sfx` suffix + caption
- Odometer mechanism: each digit is a `.col` of 0-9-0-9 spans; CSS variable `--d` per column determines target offset; `.proof-row.go` triggers `transform: translateY(...)` on `.col`
- On homepage, includes a `.logos` strip below the stats (8-cell mask-image client logo row)

**Variants:**
- Standalone (`.proof`): full eyebrow + row + logos band
- Inside dossier (`.cs-dossier`): no `.proof` wrapper, row sits below the `.cs-facts` definition list

**Reference:** `index.html:517-540`, CSS `index.html:99-138, 275`; `case-telus-koodo.html:958-972`

### 7. Engine band — `.engine` + `.engine-grid`

- Two-column 5fr/7fr grid: H2.rise + magenta `.rule` (animated scaleX-in) on left, prose body on right
- Used on homepage as the "one room / no fence" block — the seam between Digital and Studios

**Reference:** `index.html:541-555`, CSS `index.html:141-146, 229-230, 304-305`

### 8. Article body components — `.article-body .prose`

Authored block system used inside `<article class="article-body wrap">`:

| Component | Class | Purpose |
|---|---|---|
| Lede | `.lede` | Opening paragraph with structural emphasis |
| Body paragraph | (default `<p>`) | Standard prose |
| H2 section | (default `<h2>`) | Section header |
| Ledger | `.ledger` + `.lrow` (each row: `.ln` + H3 + body) | Numbered claim rows |
| Pull-quote breakout | `aside.pull.breakout` (eyebrow + body with `span.mag`) | Right/center breakout quote |
| Figure breakout | `figure.breakout` or `figure.breakout.fig-tilt` (image + caption with `<b>` num + caption body) | Full-bleed figure |
| Signal embed | `.signal` (lede + email field + Subscribe) | Inline newsletter signup |
| Video embed | `.embed.video.breakout` (iframe) | Full-bleed video |
| Podcast embed | `.embed.podcast.breakout` (iframe) | Full-bleed podcast |
| Bulleted list | `ul.changes` (bold lead + body) | Weighted list, nesting supported |
| Ordered list | `ol.seq` | Sequence list |
| End paragraph | `p.end` | Closing argument |

The same body system is reused inside `case-X.html` pages for the five-section authored case-study spine (`the brief.` → `the challenge.` → `the process.` → `the solution.` → `the outcome.`).

**Reference:** `article.html:767-848`, `case-telus-koodo.html:974-1024`

### 9. Page closer — `.page-closer` (sub-pages) / `.closer` (homepage)

- `<section class="page-closer" id="contact">` (or `.closer` on the homepage; same role, slightly different styling treatment)
- H2.rise with CAPS line + `em.voice.mag` SUB-VOICE line
- One body paragraph
- `.pc-row` (sub-pages) / `.row` (homepage) with `.btn.solid.cascade` solid CTA + `.tel` phone link

**Reference:** any sub-page; `work.html:829-839` is representative

### 10. Three-up insights — `.insights` + `.post`

- 3 minimal posts in a horizontal row, each with `.stream` tag + H3 + date
- Used on the homepage as the Insights block, AND on case-study pages as the "Next case" teaser (with the index numerals dropped)

**Reference:** `index.html:596-606`, `case-telus-koodo.html:1040-1048`

### 11. Logo strip — `.logos` + `.cell` + `.logo-mask`

- Horizontal row of CSS-mask-image client logos (mask-image SVG + currentColor fill)
- Sits inside the `.proof` block on the homepage
- Width per logo is hand-tuned via inline `style="--mask-image: url(...); width: Npx; height: 28px"`

**Reference:** `index.html:527-540`

---

## Mapping: `/digital` section → pattern decision

The Digital practice page deck (`docs/copy/digital.md`, INTERIM status) has 8 content sections plus chrome. Mapping each to a pattern:

| Section | Pattern | Source | Decision |
|---|---|---|---|
| Sub-page hero (with 2 CTAs) | `.sub-hero` + new `.sub-hero-ctas` extension | `work.html:591-599` + new | **Reuse + extend** — see new pattern A |
| Outcome strip (4 stats) | `.proof` + `.proof-row` + `.stat` + `.odo` | `index.html:517-526` | **Reuse** |
| Offers — "Two ways in" (2 numbered cards) | `.doors` + `.door` | `index.html:493-510` | **Reuse** — paired comparison fits perfectly |
| Validator H2 + body | `.engine` two-column band with new `.validator-band` ink variant | `index.html:541-555` + new | **Reuse `.engine`** — argument on left, video on right matches the band structure. Section flipped to ink June 23 2026 — see Pattern D |
| Validator video embed | `.video-frame` (NEW) + Cloudflare Stream iframe | none | **NEW pattern D** (see below). Replaced the earlier `.terminal` demo |
| How we work — "Early and often" | `.engine` + `.engine-grid` | `index.html:541-555` | **Reuse** — second engine band on the page; pattern was always intended for reuse |
| Selected work (4 cards) | `.work` + `.card` | `index.html:557-594` | **Reuse** — extend to 4 cards in the same grid |
| Partners row | — | none directly | **NEW pattern C** (see below); informed by `.logos` mask system |
| Page closer | `.page-closer` | `work.html:829-839` | **Reuse** |

**Two `.engine` bands on one page (Validator + How we work).** That's a deliberate rhythm — both are "argument on left, evidence on right" sections, and using the same component twice reinforces the rhythm rather than diluting the pattern. The two are visually distinct because the right column carries different content (video vs. prose body) AND the section backgrounds differ (ink vs. paper after the June 23 2026 ink-flip).

---

## New patterns to add to the system

### Pattern A — `.sub-hero` with hero CTAs

The sub-hero pattern currently has eyebrow → H1 → sub-voice. Hub pages like `/digital`, `/studios`, `/about` need a CTA row in the hero. Extending `.sub-hero` with an optional `.sub-hero-ctas` child:

```html
<div class="sub-hero-inner wrap">
  <span class="eyebrow">…</span>
  <h1 class="rise">…</h1>
  <p class="sub-voice"><em class="voice mag">…</em></p>
  <div class="sub-hero-ctas">
    <a class="btn solid cascade" href="…">Primary →</a>
    <a class="btn cascade" href="…">Secondary</a>
  </div>
</div>
```

CSS adapts `.hero-ctas` from `index.html:485-489` (homepage) to the sub-hero scale. `.btn.solid` and `.btn` styles already exist globally and don't need to change.

**Reuse beyond `/digital`:** `/studios` hub page (Reel CTA + Brief CTA), `/about` (Careers CTA + Contact CTA), possibly the Insights stream landing pages if those become their own pages later.

### Pattern B — `.terminal` block

The Validator section originally called for a 6-line scripted exchange in a monospace block, lines revealing in sequence on scroll. Role-coded by leading icon: `$` (prompt), `✓` (ok), `▲` (warn), `→` (signal).

**Status on `/digital` (as of June 23 2026): pattern removed from the page.** The terminal block was replaced with a Cloudflare Stream explainer video for the Rapid MVP service line — see `digital.md` Notes 14 for the rationale. The CSS and HTML have been stripped from `digital.html`. The pattern stays catalogued here as a reusable design-system component for future pages.

Proposed structure (preserved for reuse):

```html
<div class="terminal breakout">
  <pre class="term-body">
    <span class="ln prompt">$ validate "marketplace app, two-sided, 12-week ask"</span>
    <span class="ln ok">✓ core loop — buildable in scope</span>
    <span class="ln ok">✓ auth + payments — known patterns</span>
    <span class="ln warn">▲ reviews + messaging — cut from v1, sequence to v2</span>
    <span class="ln warn">▲ 12 weeks — realistic at 6 with scope above</span>
    <span class="ln signal">→ signal: build it. smaller, sooner.</span>
  </pre>
</div>
```

CSS picks: dark ink background, paper text, monospace family (system stack — no new web font), magenta accent on `.signal` line. Lines reveal via the existing `.reveal` → `.in` observer with a staggered `--td` delay per line, mirroring the takeover-menu cascade and proof-row stat cascade. Don't introduce a new animation system. Full CSS block is available in the commit history of `digital.html` (see commit prior to the June 23 2026 video swap) — paste into the next page that uses the pattern.

**Reuse beyond `/digital`:** case studies showing technical work (a CLI exchange as an alternative to a static figure inside the body), engineering-stream Insights articles, the Studios page if visualizing an AI pipeline command flow. Lives as a body-component variant (`.terminal.breakout`) so it slots into `.article-body .prose` wherever needed.

### Pattern C — `.partners-strip`

A horizontal row of partner-tier chips, named in text rather than logo'd. Distinct from `.logos` (which carries client logos via mask-image — Power Shifter's customers, not Power Shifter's vendors).

Proposed structure:

```html
<section class="partners wrap">
  <p class="partners-lede">Certified, not just familiar — and this site runs on the same stack we build for clients.</p>
  <div class="partners-strip">
    <span class="ptier">Contentful <i>Silver Partner</i></span>
    <span class="ptier">Sanity <i>Agency Partner</i></span>
    <span class="ptier">Vercel <i>Expert</i></span>
  </div>
</section>
```

CSS picks: flex row with gap, each `.ptier` is a pill with display-weight name + serif-italic tier. Magenta only on hover (single-magenta-per-viewport budget already committed to the hero CTA).

**Reuse beyond `/digital`:** the About page is the obvious second home — partner credentials belong there as much as on `/digital`. Skip the footer — the footer is already busy. Don't re-use on case studies — credibility there comes from named results, not stack badges.

### Pattern D — `.video-frame` + `.validator-band` ink variant

Added June 23 2026 as a paired change. The `.validator-band` modifier now has two responsibilities: (1) scope the engine band to 1fr/1fr instead of canonical 5fr/7fr, and (2) flip the section background paper → ink so the Validator reads as the page's strongest CTA. The new `.video-frame` is the section-column video container holding the Cloudflare Stream iframe player.

Two related but distinct embeds for video on the site:

| Use case | Pattern | Embed type | Where |
|---|---|---|---|
| Marketing/explainer videos (user-initiated, with controls, audio, captions) | `.video-frame` (NEW) | Cloudflare Stream iframe player | `/digital` Validator; reusable on Studios, About, case studies |
| Decorative card loops (autoplay-muted, hover-trigger, no controls) | `.wframe[data-video]` (existing) | Plain `<video>` tag with frame-0 poster | `/work` cards; see `docs/VIDEO_PIPELINE.md` for the clip spec |

Structure (`.video-frame`):

```html
<div class="video-frame" aria-label="Rapid MVP explainer video">
  <iframe
    src="https://customer-xv1aafyshr3tbknu.cloudflarestream.com/<VIDEO_UID>/iframe?poster=https%3A%2F%2Fcustomer-xv1aafyshr3tbknu.cloudflarestream.com%2F<VIDEO_UID>%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D0s"
    loading="lazy"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    allowfullscreen="true"
    title="<descriptive title>"
  ></iframe>
</div>
```

CSS picks: 16:9 aspect-ratio, dark placeholder background (the box holds while Stream loads its own poster), soft 8px radius, generous box-shadow for depth on dark sections. Iframe absolutely positioned to fill. No JS — Stream handles controls, captions, lazy load, and adaptive HLS internally.

CSS for `.validator-band` ink variant: section gets `background:var(--ink); color:var(--paper)`. H2 paper, p paper at .86 opacity, `<strong>` full paper, `em.voice` stays magenta. The `.btn.solid.cascade` (paper bg + ink text) already reads on dark from the homepage closer pattern.

**Reuse beyond `/digital`:**
- `.video-frame` — Studios (the reel beyond the hero), About (founder explainer if one is filmed), individual case studies needing a polished play-through clip outside the article body.
- `.validator-band` ink variant — useful anywhere a paper page needs one section to "break" the rhythm and pull the eye. Don't overuse — one ink section per page is the rule. Multiple paper-to-ink flips on one page would lose the punctuating effect.

**Customer subdomain:** `customer-xv1aafyshr3tbknu.cloudflarestream.com` is the single Stream account for the site (homepage hero reel + Validator explainer + any future Stream videos all share it). Confirmed in `index.html` STREAM config and now in `digital.html` Validator iframe.

---

## Resolved during the `/digital` build-out

1. **Selected work card count: 4-up.** Resolved with the new `.cards.four-up` modifier — `grid-template-columns:repeat(4,1fr)` at desktop, `repeat(2,1fr)` at ≤1100px, `1fr` at ≤680px. The `:nth-child(n+2) .meta` rule widens the padding-left selector from the homepage's `(2),(3)` to all cards beyond the first.
2. **Two `.engine` bands on one page.** Resolved: kept both bands, with the second band now also flipped to ink. The Validator band uses the `.validator-band` modifier (1fr/1fr grid + smaller H2 + ink background — see Pattern D for the June 23 2026 video-swap update) to accommodate H2 + body + CTA on the left and the Cloudflare Stream explainer video on the right. The How-we-work band uses the canonical 5fr/7fr split on paper. Repetition is the rhythm, not a weakness — the two are now clearly distinguished by both their right-column content (video vs prose) and their backgrounds (ink vs paper).
3. **Hero scale: 50vh.** Resolved: kept the standard `.sub-hero` 50vh — the design system says sub-page hero is a section header, not a takeover. Hub pages aren't an architectural exception. CTA row added via the new `.sub-hero-ctas` extension instead of bumping the hero height.

## Open follow-ons

1. **Takeover menu link 02 (Digital).** Every existing page's takeover still points link 02 to `index.html#digital`. Now that `digital.html` is live, link 02 should route to `digital.html`. Same kind of follow-on applies to links 03 (Studios → `studios.html`), 05 (About → `about.html`), and 06 (Contact → `contact.html` or `#contact`) when those pages ship. The cross-page rewire is its own commit touching every page with a takeover (`work.html`, `insights.html`, `article.html`, `case-telus-koodo.html`, `digital.html`).
2. **JS cleanup on `digital.html`.** Inherited scripts from `work.html` still bind to `.wcard`, `.work-grid`, `[data-cat]`, and `.wframe[data-video]` — selectors that don't exist on `/digital`. These are no-ops, not errors, but should be pared down once the inherited `work-filter`/`work-grid` CSS rules (also unused on `/digital`) are removed too.
3. **Three remaining `/digital` Selected Work case studies.** Energizer, Delta Controls, and Angel Oak cards link to `#` — full case studies need to be written and built (the `ps-case-study-writer` skill carries the seven non-negotiables for these). Only the TELUS Rewards card points to a real case (`case-telus-koodo.html`).
4. **Partner tier verification.** Contentful Silver, Sanity Agency, and Vercel Expert are named in the Partners section but standings should be verified against current partner-portal status before paid reuse on outbound or pitches.

---

## How to use this file

Before stubbing a new page:

1. Read the page's copy deck in `docs/copy/<page>.md`.
2. Walk every section of the deck against the pattern inventory above.
3. For each section, pick the established pattern or document why a new one is needed.
4. Add new patterns to this file with explicit reuse notes.
5. Then stub the HTML.

When the canonical reference for a pattern moves (e.g. when the inline CSS gets extracted to a shared stylesheet), update the source-file references here in the same commit.
