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
- Inner wrap: `.eyebrow` (small-caps label) → `h1.rise` → supporting line, one of two sanctioned variants (§7 item 5): `.sub-voice` (voice line — serif italic magenta `.voice.mag`) or `.sub-body` (body line — prose, `--paper` on the ink hero). The legacy `.streams` (insights) variant has been migrated onto `.sub-body`.
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
- Each `.door` has: `.eyebrow` (`Section — descriptor` convention per §7 item 7, e.g. "Digital — product"), H2, `.lead` (display weight, with `em.voice` for the italic half), `p.body` (max 42ch), `.enter.swipe` CTA
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

**Status on `/digital` (as of June 23 2026): pattern decommissioned.** The `.sub-hero-ctas` row was removed from `/digital` per JP's call — see `digital.md` Notes 18. The two issues: the pill shape (`border-radius:999px`) read off against the page's square `.btn.solid` vocabulary, and the primary CTA was a redundant pre-driver to the Validator section sitting one viewport below the hero. CSS and HTML stripped entirely.

The pattern stays catalogued here as a reference, but **do not revive the pill design** on future hub pages (Studios, About). If those pages genuinely need hero-level CTAs:
- Use the existing global `.btn.solid` square-button vocabulary (no `border-radius` override)
- Verify the CTA isn't already driving to a destination immediately below the hero (if it is, the in-section CTA is sufficient — don't pre-drive)

Proposed structure (preserved for reference, NOT for verbatim reuse):

```html
<div class="sub-hero-inner wrap">
  <span class="eyebrow">…</span>
  <h1 class="rise">…</h1>
  <p class="sub-voice"><em class="voice mag">…</em></p>
  <!-- If a future hub page needs hero CTAs, use globals; no pills: -->
  <div class="sub-hero-ctas">
    <a class="btn solid cascade" href="…">Primary →</a>
    <a class="btn cascade" href="…">Secondary</a>
  </div>
</div>
```

The full original CSS block (with `border-radius:999px` pill styling) is available in commit history of `digital.html` prior to the June 23 2026 decommission — but if revived for a future page, the pill border-radius must drop in favor of the square `.btn.solid` treatment used throughout the rest of the site.

**Default decision for future hub pages:** ship the hero without a CTA row unless there's a specific conversion path the page closer + takeover menu can't cover. The hero standing on H1 + sub-body alone reads more confidently than a hero pre-driving its own content.

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

Structure (`.video-frame`), with the live UID from the `/digital` Validator implementation:

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

**Cloudflare Stream dashboard exposes three values per video — only the Video ID is needed for this pattern.** The HLS Manifest URL and Dash Manifest URL are for custom-player workflows where you wire the streaming source into your own video element (the homepage hero reel does this with `hls.js`). The Stream iframe player derives its streaming source from the UID + customer subdomain internally — no manifest URL needed.

CSS for `.validator-band` ink variant: section gets `background:var(--ink); color:var(--paper)`. H2 paper, p paper at .86 opacity, `<strong>` full paper, `em.voice` stays magenta. The `.btn.solid.cascade` (paper bg + ink text) already reads on dark from the homepage closer pattern.

**Reuse beyond `/digital`:**
- `.video-frame` — Studios (the reel beyond the hero), About (founder explainer if one is filmed), individual case studies needing a polished play-through clip outside the article body.
- `.validator-band` ink variant — useful anywhere a paper page needs one section to "break" the rhythm and pull the eye. Don't overuse — one ink section per page is the rule. Multiple paper-to-ink flips on one page would lose the punctuating effect.

**Customer subdomain:** `customer-xv1aafyshr3tbknu.cloudflarestream.com` is the single Stream account for the site (homepage hero reel + Validator explainer + any future Stream videos all share it). Confirmed in `index.html` STREAM config and now in `digital.html` Validator iframe.

### Pattern E — `.engine.mirror` (alternating one-two punch layout)

Added June 23 2026. Pairs with the canonical `.engine` pattern to create JP's "alternating one-two punch" rhythm on services pages. Two adjacent `.engine` bands flip their column proportions and source order for visual cadence.

**Module 1 (canonical):** `5fr/7fr`, H2 left + body right.
**Module 2 (mirror):** `7fr/5fr` via `.engine.mirror`, body left + H2 right at desktop.

The two read as a zigzag at desktop scale. On mobile (≤860px), both stack identically (H2 → body) — the mirror rhythm doesn't read at narrow widths, and stacking H2-first preserves source order + cognitive flow.

Implementation note: source order in HTML stays H2-first → body-second for every module regardless of layout, for accessibility. The visual flip uses CSS `order:` on the grid children rather than reordering the DOM.

```css
.engine.mirror .engine-grid{grid-template-columns:7fr 5fr}
.engine.mirror .engine-grid > div:first-child{order:2}
.engine.mirror .engine-grid > div:nth-child(2){order:1}
@media(max-width:860px){
  .engine.mirror .engine-grid{grid-template-columns:1fr}
  .engine.mirror .engine-grid > div:first-child{order:0}
  .engine.mirror .engine-grid > div:nth-child(2){order:0}
}
```

**Reuse beyond `/digital`:** Studios — the same one-two punch ships verbatim on `/studios` when that page builds (see `studios.md` Block 5b). The pattern extends naturally to any services-page rhythm: three modules would go canonical → mirror → canonical; four would zigzag fully. Don't break the alternation — that's the whole point.

**Magenta budget across modules:** each H2 takes one `em.voice` magenta accent. With two modules separated by a viewport-height of scroll, only one H2 is in view at a time. Budget holds at one magenta surface per viewport.

### Pattern F — `.proof-spine` + `.logos` (client logo roster)

Added June 23 2026 in response to JP's social proof brief. **Direct reuse of the homepage's `.logos` block** (index.html Block 3, lines 118-137 CSS, 527-537 HTML) — same 9 logos, same 3x3 checkerboard with alternating ink/paper cells, same `.logo-mask` currentColor masking technique. The only net-new code is the section wrapper `.proof-spine` (paper bg, generous padding, magenta eyebrow). All 9 logo PNGs already live in `images/logos/`.

The 9 logos: Telus, Energizer, Lululemon, Deloitte, KPMG, Grammarly, Akamai, Iron Mountain, Canucks. Logo widths in the inline style attributes are calibrated per-logo to normalize visual weight across variable PNG aspect ratios — copied verbatim from the homepage; do not re-eyeball without re-measuring.

**Why this exists at section scope on `/digital`** (despite client names already appearing in the outcome strip and Selected Work cards): logos function semantically differently from project cards. Cards say "here's work we did." Logos say "here's who trusts us." Same names, different surface. For B2B at this tier, multi-surface client name appearance is conventional reinforcement, not redundancy.

**The `.logo-mask` technique.** Each logo PNG is loaded as a `mask-image` rather than an `<img>` tag. The mask cuts the logo silhouette out of a `background-color: currentColor` span. Because `color` is inherited from the cell, the same logo renders paper-on-ink in odd cells and ink-on-paper in even cells without separate asset variants. On hover, `color` shifts to magenta — the logo "lights up" without a separate hover asset.

```html
<div class="proof-spine" id="proof-spine">
  <div class="wrap reveal">
    <span class="eyebrow">The roster</span>
    <div class="logos" aria-label="Selected clients">
      <div class="cell"><span class="logo-mask" style="--mask-image: url('images/logos/<name>.png'); width: <px>px; height: 28px;" aria-label="<Brand>"></span></div>
      <!-- repeat for each cell -->
    </div>
  </div>
</div>
```

**Eyebrow choice — "Studios — selected clients":** the proof-spine eyebrow follows the ratified hub convention (`Section — descriptor`, design-system.md §7 item 7). It replaced the earlier brand-pattern label "The roster" ("The X" family, e.g. the homepage "The receipts") when the eyebrow convention was locked.

**Reuse beyond `/digital`:** the same 9-logo roster ships verbatim on `/studios` when that page builds (see `studios.md` Block 2b). The Studios voice spec fits a logo-roster cleanly — every logo is a name-attached flex. The cross-practice mix in the roster (Digital + Studios clients combined) is intentional — one masterbrand, two doors.

**Reuse confirmed:** shipped on `/studios` in the initial Studios build (June 23 2026). Same 9 logos, identical HTML and CSS. See `studios.md` Notes 7.

---

### Pattern G — `.reel-hero` (full-bleed Cloudflare Stream video hero)

Studios Block 1. Full-bleed Cloudflare Stream video as hero background, with overlaid H1 + body + scroll-prompt button. Distinct from `.sub-hero` (paper background, no video) and from the homepage's hero (different scale + interaction). Ink underlay so the video fade-in doesn't flash white; `.reel-vignette` darkens the bottom band for text legibility against any video content.

```html
<section class="reel-hero" id="reel-hero">
  <div class="reel-bg">
    <iframe class="reel-video"
            src="https://customer-xv1aafyshr3tbknu.cloudflarestream.com/<UID>/iframe?muted=true&autoplay=true&loop=true&controls=false&preload=auto"
            …></iframe>
    <div class="reel-vignette"></div>
  </div>
  <div class="reel-inner wrap">
    <h1 class="rise"><span>…</span><span><em class="voice">…</em></span></h1>
    <p class="sub-body">…</p>
    <a class="btn cascade" href="#anchor">Watch the work →</a>
  </div>
</section>
```

**Button vocabulary (June 24 2026 update).** The reel-hero scroll prompt uses the canonical `.btn .cascade` button (outline variant — paper border on dark video background) — same vocabulary as the homepage Digital/Studios pair and every page-closer button. The original Pattern G shipped with a custom `.reel-scroll` class that diverged from this — uppercase, lower opacity, different border alpha. That was removed; see `studios.md` Notes 15. The settle-in animation timing (.7s delay so the button lands after H1 + body in the sequence) is preserved via a `.reel-hero .btn` rule.

**Sizing.** Iframe sized `width:max(100%,177.78vh); height:max(56.25vw,100%)` centered with `transform:translate(-50%,-50%)` to guarantee 16:9 video always covers the hero box regardless of viewport aspect ratio. `min-height:88vh` on `.reel-hero` so the hero feels cinematic (taller than the standard 50vh `.sub-hero`).

**Browser autoplay.** Cloudflare Stream iframe query string MUST include `muted=true` for browsers to allow autoplay without user interaction. `controls=false` removes the player chrome. `preload=auto` starts the buffer immediately.

**Reuse beyond `/studios`:** any future hub page that wants a cinematic full-bleed video hero (e.g. a future case-study landing page, a Studios sub-route). Not appropriate for `/digital` (paper bg is the design system's hub-page default) or `/about` (people-first, not media-first).

---

### Pattern H — `.proof-bar` (single declarative trophy strip)

Studios Block 2. High-contrast single-line strip between hero and roster. Ink background, paper text. No section header. One declarative claim, one supporting clause. Distinct from `.proof` (multi-stat outcome strip with odometers — `/digital` Block 2) and from `.proof-spine` (logo grid — Pattern F).

```html
<section class="proof-bar" id="awards">
  <div class="wrap">
    <p class="proof-bar-stat">
      <strong>Two Silver ADDYs, 2026.</strong>
      <span class="proof-bar-body">…qualifying clause with <em>italicized</em> proper nouns…</span>
    </p>
  </div>
</section>
```

**Type scale.** `clamp(18px,1.9vw,24px)` — bigger than body but smaller than H2. The single declarative line is the entire payload; type weight + ink background carry the gravity, no need to over-scale.

**Reuse beyond `/studios`:** any page that wants to drop a single declarative claim above the fold without a section header — a stat-of-record on `/about`, a certification claim on a case study landing, etc. Use sparingly — one per page maximum; the whole point is high contrast.

---

### Pattern I — `.films` + `.film-featured` + `.film-card` + `.film-grid` (featured-plus-grid media index)

**STATUS: DECOMMISSIONED June 24 2026.** Replaced on `/studios` Block 3 by direct reuse of the canonical `.work` + `.cards.four-up` + `.card` pattern (Pattern 4b in §2 above, also documented as the pattern used by /digital "Digital, selected" and the homepage "Selected work"). JP brief on review: "The design pattern for the film case studies should be the same pattern/component as on the digital page." All Pattern I CSS rules (`.films`, `.films-heading`, `.film-featured`, `.film-media`, `.film-play`, `.film-meta`, `.film-award`, `.film-grid`, `.film-card`, `.film-cta`) were deleted from `studios.html` in the same commit. See `studios.md` Notes 16. The Pattern I documentation below is preserved as a historical record of what was tried — do NOT revive it without explicit cause. If a future hub page needs a featured+grid hybrid, evaluate whether the canonical `.cards` + `.cards.four-up` (with an optional `.cards.featured` modifier) can do the job before re-introducing a parallel component vocabulary.

---

#### Historical record (decommissioned)

Studios Block 3 (until June 24 2026). Two featured rows on top (`.film-featured`, 7fr media + 5fr meta side-by-side at desktop), then a 4-up grid (`.film-grid` containing `.film-card`s) for the remaining items. Each item has a poster image with `.film-play` badge, a title (with optional italic film-name treatment), a body line, and a `Watch →` CTA.

```html
<section class="films" id="films">
  <div class="wrap">
    <h2 class="films-heading">The work</h2>

    <article class="film-featured">
      <a class="film-media" href="…">
        <img src="…" alt="…">
        <span class="film-play" aria-hidden="true">▶</span>
      </a>
      <div class="film-meta">
        <span class="film-award">Silver ADDY · 2026</span>
        <h3>Client — <em>Film name</em></h3>
        <p>One-line synopsis.</p>
        <a class="film-cta" href="…">Watch →</a>
      </div>
    </article>

    <!-- repeat .film-featured for the second featured row -->

    <div class="film-grid">
      <article class="film-card">
        <a class="film-media" href="…">…</a>
        <h3>…</h3>
        <p>…</p>
        <a class="film-cta" href="…">Watch →</a>
      </article>
      <!-- 3 more .film-card -->
    </div>
  </div>
</section>
```

**Featured rows: media aspect-ratio 16:9.** Grid cards: 4:3, smaller play badge. Featured rows separated themselves from the grid with `border-top:1px solid var(--line)` on `.film-grid` + `margin-top:48px;padding-top:48px` — a clear visual rule between "featured" and "the rest."

**Why it was decommissioned.** The featured+grid hybrid created a parallel component vocabulary on /studios that diverged from the rest of the site. The site's work-grid component (`.work` + `.cards.four-up` + `.card`, with `.tag` eyebrows and `.go.swipe` italic-last-word CTAs) already exists, ships on /digital and the homepage, and visually carries award status via copy (Block 2 proof bar + per-card body line) rather than structure. Maintaining two parallel patterns for the same job ("show our best work in a grid") was the wrong trade — one masterbrand, one component vocabulary.

---

### Pattern J — `.credits` + `.credit-card` (credits one-sheet)

Studios Block 4. Square portrait + name + role + credit-line one-sheet in a 3-up grid. Each `.credit-card` has a `.credit-portrait` square at the top (1:1 aspect, `object-fit:cover`), then a 1px ink rule sitting on `.credit-name`'s top edge, then name (display weight), role (small magenta caps), credit line (grey body). Bios live on `/about`. Block footer carries a CTA routing to `/about`.

**Layout note (June 24 2026 update).** This pattern was originally portrait-less per the studios.md brief; portraits were added when JP overrode that on review. The 1px ink rule moved from `.credit-card`'s `border-top` to `.credit-name`'s `border-top` so the rule sits between the portrait and the meta rather than stranding above the photo. If portraits ever get dropped on a future hub page using this pattern, move the rule back to `.credit-card`.

**Bio-video rollover (June 24 2026 update).** Each card optionally carries a `data-video-uid` attribute pointing to a Cloudflare Stream video. When present, a `<iframe class="credit-video">` is lazy-loaded into the portrait on first hover and fades in over the still — bio-video posters that become full bio-videos on rollover. The handler reuses the existing `matchMedia('(hover: hover)')` + `prefers-reduced-motion` gates from the `.wframe[data-video]` hover-video pattern; touch devices and reduced-motion users see only the still portrait. See `studios.md` Notes 19.

**Still poster sourced from the video (June 24 2026 update).** The portrait's `<img src>` is also derived from the same Cloudflare Stream UID — pointing at Stream's thumbnail API at `time=0s` (first frame, 800×800 center-crop). No separate portrait file exists in the repo. One UID per card; both the still poster and the playing iframe video derive from it. When the video is re-uploaded or replaced in Stream, both surfaces update automatically. See `studios.md` Notes 20.

```html
<section class="credits" id="credits">
  <div class="wrap reveal">
    <h2 class="credits-heading rise">Heading</h2>
    <div class="credits-grid">
      <article class="credit-card" data-video-uid="<cloudflare-stream-uid>">
        <div class="credit-portrait">
          <img src="https://customer-<sub>.cloudflarestream.com/<UID>/thumbnails/thumbnail.jpg?time=0s&width=800&height=800&fit=crop"
               alt="Name, Role" loading="lazy">
          <iframe class="credit-video" aria-hidden="true" tabindex="-1"
                  frameborder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"></iframe>
        </div>
        <h3 class="credit-name">Name</h3>
        <p class="credit-role">Role // Title</p>
        <p class="credit-line">Credit · Credit · Credit · Credit</p>
      </article>
      <!-- 2 more .credit-card -->
    </div>
    <a class="credits-cta" href="about.html">Meet the whole team →</a>
  </div>
</section>
```

The iframe has NO `src` on page load — empty in the DOM, takes no network. JS attaches the src on first mouseenter, listens for the iframe's `load` event, toggles `.loaded` class. The CSS hover rule `.credit-card:hover .credit-video.loaded{opacity:1}` only fires when both states are true — no blank-iframe flash during initial load.

**Iframe sizing for 16:9 source over 1:1 container.** `width:177.78%; height:100%; transform:translate(-50%,-50%)` centers the iframe and makes it 1.7778× wider than the square container — the Stream player's 16:9 frame fills the square vertically and crops horizontally. Works for landscape bio videos (the standard talking-head aspect). If a future video is shot 9:16 portrait, invert the math: `width:100%; height:177.78%`.

**Portrait still specs (June 24 2026 update).** No local portrait file needed. The `<img src>` points at Cloudflare Stream's thumbnail API derived from the same `data-video-uid`. Params: `time=0s` for the literal first frame (per JP's brief), `width=800&height=800` for the output size, `fit=crop` for centered 1:1 crop. The `.credit-portrait img{object-fit:cover}` rule handles any minor edge cases. If a video begins with a fade-in from black and the still needs to be later in the cut, change `time=0s` to `time=2s` or similar per card — easy tweak. When the underlying video is re-uploaded in Stream, both the still poster and the playing video update automatically.

**Mobile behavior.** At ≤880px the grid collapses to single-column and `.credit-portrait` caps at 360px max-width so the portraits read as thumbnail headshots, not full-bleed posters.

**Role color: magenta.** Small all-caps with `letter-spacing:.04em`. Counts against the 2-per-viewport magenta budget — at desktop the credits block shows three magenta role labels in close proximity, reading as one magenta cluster rather than three separate surfaces. Verify in QA that the credits block + any other magenta element on screen don't compound.

**Credit-card top rule.** 1px solid ink (not the lighter `var(--line)`) — the cards are foregrounded credits, not footnotes.

**Currently:** `Meet the whole team →` routes to `#` because `/about` isn't built yet. Swap to `about.html` when that page ships (same parking-lot item as the takeover menu link 05).

**Reuse beyond `/studios`:** any block that wants to surface a focused subset of people with portraits + credits — a case-study credits roll (Director / Editor / Strategist), a Speaking page (recent talks given), a Press page (recent press credits). Use sparingly — the canonical people-introduction format is `/about`'s full bio grid, not this. The bio-video rollover variant scales to those use cases automatically — just add `data-video-uid` per card and the JS handler picks it up.

---

## Resolved during the `/digital` build-out

1. **Selected work card count: 4-up.** Resolved with the new `.cards.four-up` modifier — `grid-template-columns:repeat(4,1fr)` at desktop, `repeat(2,1fr)` at ≤1100px, `1fr` at ≤680px. The `:nth-child(n+2) .meta` rule widens the padding-left selector from the homepage's `(2),(3)` to all cards beyond the first.
2. **Three `.engine` bands on one page (Validator + Module 1 + Module 2).** Resolved: kept all three, distinguished by content + layout + background. The Validator band uses the `.validator-band` ink variant (1fr/1fr + smaller H2 + ink background) holding the Cloudflare Stream video. Modules 1 and 2 of the one-two punch use canonical paper layouts — Module 1 at 5fr/7fr canonical, Module 2 at 7fr/5fr via `.engine.mirror`. Repetition is the rhythm, not a weakness — the three are distinguished by right-column content (video vs prose vs prose), backgrounds (ink vs paper vs paper), and layouts (1fr/1fr vs 5fr/7fr vs 7fr/5fr).
3. **Hero scale: 50vh.** Resolved: kept the standard `.sub-hero` 50vh — the design system says sub-page hero is a section header, not a takeover. Hub pages aren't an architectural exception. CTA row added via the new `.sub-hero-ctas` extension instead of bumping the hero height.

## Resolved — site-wide merge (June 2026)

1. **Takeover/footer nav rewired across all 8 pages.** Resolves prior follow-on #1: every page's takeover and footer nav now route Work→`work.html`, Digital→`digital.html`, Studios→`studios.html`, Insights→`insights.html`, About→`about.html`, Contact→`#contact` (Careers→`#` until built). The active page carries `.is-current` + `aria-current="page"` (takeover) and `aria-current="page"` (footer); detail pages mark their parent (case→Work, article→Insights); `index.html` has no menu item of its own.
2. **§8 consistency trio ratified** (now locked in `design-system.md` §7 as items 5/6/7): supporting line collapsed to two variants — `.streams` (Insights) and `.reel-body` (Studios) migrated onto `.sub-body` (Studios keeps `--paper` over the reel scrim); voice-color rule applied site-wide (`em.voice.mag` = magenta pivot/closer, bare `em.voice` = cream in-headline emphasis); eyebrow convention set per page-type (hub `Section — descriptor`, detail `Category · Client/Topic`).
3. **Craft Layer + Concierge rolled out site-wide** in production mode (no `data-spice-review`): `ps-spice.css/js` + `ps-concierge.css/js` on all 8 pages; `image-slot.js` on `about.html` only.

## Open follow-ons

1. **JS cleanup on `digital.html`.** Inherited scripts from `work.html` still bind to `.wcard`, `.work-grid`, `[data-cat]`, and `.wframe[data-video]` — selectors that don't exist on `/digital`. These are no-ops, not errors, but should be pared down once the inherited `work-filter`/`work-grid` CSS rules (also unused on `/digital`) are removed too.
2. **Three remaining `/digital` Selected Work case studies.** Energizer, Delta Controls, and Angel Oak cards link to `#` — full case studies need to be written and built (the `ps-case-study-writer` skill carries the seven non-negotiables for these). Only the TELUS Rewards card points to a real case (`case-telus-koodo.html`).
3. **Partner tier verification.** Contentful Silver, Sanity Agency, and Vercel Expert are named in the Partners section but standings should be verified against current partner-portal status before paid reuse on outbound or pitches.

---

### Pattern K — `.wcard.feature` (cinematic hero card)

Originally on `/work.html` (CSS at `work.html` lines 356-393), promoting Iron Mountain — The Summit to the top of the work-grid index. **Reused on `/studios` Block 3 (June 24 2026)** between the `.head` row (H2 "The films" + "See all the work →") and the `.cards.four-up` films grid. JP brief: "Lets add this exact component from the work.html page below the title WORK and above the rows of films on the studios page." The component is direct CSS reuse — rules ported verbatim to `studios.html` with a `.work .` selector prefix to scope them to the films section. See `studios.md` Notes 17 + Notes 18.

A single full-width hero with image-as-background and overlaid text. Distinct from `.card` (Pattern 4b — stacked image-then-meta layout) and from the decommissioned Pattern I (custom featured+grid hybrid). The `.wtint` gradient overlay ensures text legibility regardless of image content.

```html
<a class="wcard feature reveal" data-cat="studios" href="#">
  <div class="wframe">
    <img src="…" alt="…" style="width:100%;height:100%;object-fit:cover">
    <div class="wtint"></div>
    <div class="wcard-overlay">
      <h2>Iron Mountain — <i>The Summit</i></h2>
      <p>A generative film with a blockbuster look. Silver ADDY, 2026.</p>
      <span class="wgo swipe">Watch the film →</span>
    </div>
  </div>
</a>
```

**Cinematic aspect.** `.wframe` base is 16:9; the `.feature` variant overrides to 21:9 — the ultrawide aspect signals "hero piece" without needing additional structural treatment. The image fills the frame via `object-fit:cover`.

**Tint overlay.** `linear-gradient(transparent 30%, rgba(18,19,21,.72) 100%)` — keeps the top 30% of the image clean while darkening the bottom band where the overlay text lives. `z-index:1` puts it above the image; the overlay sits at `z-index:2`.

**Overlay typography.** `.wcard-overlay h2` uses the display weight at `clamp(22px,2.4vw,36px)` — smaller than the section's `<h2 class="rise">` at `clamp(36px,4vw,60px)`, so visual hierarchy reads correctly even though both are technically `<h2>` elements. The italic film name via `<i>` uses Late Serif at weight 500. Body line `.wcard-overlay p` is paper at 78% alpha for slight recession; `.wcard-overlay .wgo` is paper at 90% alpha with the `.swipe` italic-last-word treatment.

**Reuse beyond `/studios`:** any hub page that needs a single hero-piece treatment above a grid. The `.feature` modifier in the `.work-grid` context on `/work.html` (where it lives natively) makes the card span the full grid width via `grid-column:1 / -1`; when used outside a grid (as on `/studios` Block 3 inside a plain `.wrap`), the card just renders as a full-width block by default.

---

## How to use this file

Before stubbing a new page:

1. Read the page's copy deck in `docs/copy/<page>.md`.
2. Walk every section of the deck against the pattern inventory above.
3. For each section, pick the established pattern or document why a new one is needed.
4. Add new patterns to this file with explicit reuse notes.
5. Then stub the HTML.

When the canonical reference for a pattern moves (e.g. when the inline CSS gets extracted to a shared stylesheet), update the source-file references here in the same commit.
