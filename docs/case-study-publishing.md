# Case-study publishing — system, mapping, and workflow

How a case study goes from Notion → a static page on the site, using `case-telus-koodo.html`
as the canonical template. Status: **TELUS & Koodo is the only fully-built example.** We are
validating the pipeline by hand-publishing a second one (Energizer) before automating it.

## The system (3 layers)

1. **Case Studies DB** — Notion database (`powershifter.com CMS`). The **index / metadata**.
   - DB: `77b9e6f8-e8ae-48f8-9697-1d4bc2c372d7` · data source `collection://906abf9b-c8f1-4ff3-9d23-9e0d2c1e576c`
   - Properties: Title, Headline, Summary/Excerpt, Services, Outcome Tier (1/2/3), Needs
     Review, Slug, Source URL, SEO Title, Meta Description, Hero Image / Thumbnail, OG Image,
     Schema Type, Status (Draft/Published/Scheduled), Asset Tracker (relation).
2. **Copy Deck pages** — under `Copy Deck — powershifter.com` (`388b37ad-cd5b-81e9-946a-f8f38d89d5ad`).
   The **slot-by-slot copy**, authored *as template sections* (EYEBROW / H1 / SUB-VOICE / byline
   table / fact sheet / 3 odometer stats / the five `the X.` sections / pull-quotes / figures /
   before-after / next-case). TELUS reference deck: `388b37ad-cd5b-81b2-9104-d3f6a7c9eafc`.
3. **HTML template** — `case-telus-koodo.html`. The render target. Now cleaned of the broken
   koodo-wordmark animation and tuned to the `web-animation-design` motion standard.

> The DB alone can't render a page — the rich content (odometer stats, figures, pull-quotes,
> before/after, next-case) lives in the **copy deck**, not DB fields. You need both. Images are
> external **Cloudflare Images** URLs, populated separately.

## Mapping (Notion → HTML slot)

| Notion source | → HTML slot |
|---|---|
| DB **Title** + **Headline** | `h1#title` = "[Client] — [Headline]" |
| DB **Summary/Excerpt** → deck **SUB-VOICE** | `.sub-voice > em.voice.mag` |
| DB **Services** → deck byline/fact | `.byline .role` + dossier `.cs-fact` Services |
| DB **SEO Title / Meta Description** | `<title>` / `<meta name="description">` |
| DB **Hero/OG Image** (Cloudflare URLs) | masthead `<img>` / `og:image` |
| DB **Slug / Status / Outcome Tier / Needs Review** | route, publish gate, outcome treatment, `[OUTCOME PLACEHOLDER]` flag |
| Deck **EYEBROW** | hero `.eyebrow` ("Category · Client") |
| Deck **Fact sheet** (`<dl>`) | dossier Client / Sector / Services / Platform |
| Deck **Topline stats** (3) | 3 `.stat` odometers (number / suffix / caption) |
| Deck **the brief./challenge./process./solution./outcome.** | the five body `<h2>` (lowercase + period — canon) |
| Deck **PULL** (eyebrow + `*mag*`) → skill `> **pull:**` | `<aside class="pull">` + `span.mag` |
| Deck **Fig 01/02**, **In-the-wild video**, **Before/after**, **Credentials**, **Next case** | `figure.breakout`, `.cs-kiosk`, before-after card, cred chips, `.post` cards |

Voice/structure rules are owned by the **`ps-case-study-writer`** skill (five-section spine,
no fabricated metrics, 2–3 pull quotes, verbatim testimonials).

## Hand-publish workflow (what we're doing manually first)

1. Pull the case study's **DB row** (metadata) + its **copy deck** page (content) from Notion.
2. Copy `case-telus-koodo.html` → `<slug>.html`. Fill every slot from the mapping above.
3. Where the source has a gap (missing image, thin outcome, no testimonial), **log it** — don't
   invent. Use the skill's `[OUTCOME PLACEHOLDER]` convention; set DB **Needs Review** if open.
4. Wire footer/next-case links; set the eyebrow convention; clean-URL route.
5. Verify locally (`.html` for the file server; clean URL on Vercel), then commit + push.
6. **Keep a build journal** (below) of what mapped cleanly vs. what fought the template —
   that evidence is what the future `case-study-publisher` skill gets built from.

## Section manifest — every block is optional

Include a block only when the source supplies it. **TELUS & Koodo = dense maximum; Energizer =
lean minimum.** This is the rule the future `case-study-publisher` skill renders against.

- **Masthead image** — only if a hero image exists; else omit (hero flows to the dossier).
- **Dossier stats (odometers)** — Tier 1: up to 3 hard-metric odometers · Tier 2: 0–1 fact-of-record
  stat · Tier 3: none. The fact sheet (Client / Sector / Services / Platform) always shows.
- **Figures** — only with real images; else omit (no empty plates).
- **In-the-wild video** — only with footage (Cloudflare Stream — see Media).
- **Before/after**, **Credentials**, **Testimonial** — only if supplied; testimonials verbatim.
- **Pull quotes** — 2–3, lifted from the body.

### Outcome tiers (from `ps-case-study-writer`)
- **Tier 1** — hard metrics; lead with them (odometers).
- **Tier 2** — qualitative only; one fact-of-record stat if it exists (e.g. Energizer's "30 days").
- **Tier 3** — none; build from inferred-improvement angles + `[OUTCOME PLACEHOLDER]`, set DB **Needs Review**.

## Media

- **Images → Cloudflare Images.** DB `Hero Image` / `OG Image` hold external Cloudflare URLs
  (never Notion uploads). No image → omit the block.
- **Video → Cloudflare Stream.** Upload to Stream, enable MP4 download, then keep the plain
  `<video>` (preserves hover-to-play; the same UID can feed Work-grid thumbs):

```html
<video class="cs-kiosk-vid"
  src="https://customer-<code>.cloudflarestream.com/<UID>/downloads/default.mp4"
  poster="https://customer-<code>.cloudflarestream.com/<UID>/thumbnails/thumbnail.jpg?time=0s"
  muted loop playsinline preload="metadata"></video>
```

Studios customer code: `xv1aafyshr3tbknu`. (TELUS koodo video is being migrated from a local
mp4 to this pattern — pending its Stream UID.)

## Status & queue

- **#1 Energizer — PUBLISHED** (`energizer.html` → `/energizer`, Outcome Tier 2). See build journal.
- **Next:** hand-publish one **Tier 1** (hard-metrics) case study to validate the odometer-dossier
  path before building the `case-study-publisher` skill.
- Case Studies DB: `77b9e6f8…` (collection `906abf9b…`). TELUS reference deck: `388b37ad-cd5b-81b2…`.

**Notion mirror:** team-facing version at Notion → *powershifter.com CMS → Producing a case
study — workflow* (`38eb37ad-cd5b-8113-8d06-ee4143e8fe04`). Keep the two in sync; this repo doc
wins for build mechanics.

### Build journal

**#1 — Energizer (2026-06-25), `energizer.html` → `/energizer`. Outcome Tier 2.**
The Notion entry was *complete*: DB-row metadata **and** a fully-authored five-section body
with `> **pull:**` markers — no separate copy-deck page needed. Built by adapting
`case-telus-koodo.html`. **Mapped cleanly:** hero (eyebrow/H1/sub-voice/byline), fact sheet,
the five `the X.` sections, the solution sub-header (lowercased to `a full-featured prototype,
fast.`), one pull.

**Gaps / template-vs-content mismatches (the useful findings):**
1. **Tier 2 → no odometer trio.** TELUS's dossier assumes *three* hard-metric odometers;
   Energizer has none. Used a **single fact-of-record "30" stat** ("days from concept to a
   validated go/no-go call"). → Template needs a **lean/variable dossier** (0–1 stats).
2. **No imagery.** The linked assets are a *Google Slides deck*, not web images. Hero Image /
   OG Image empty. → **Omitted the masthead + both figure plates.** Template must be
   **image-optional** (masthead + figures should be droppable). `images/energizer.jpg` exists
   (work-grid thumb) — a candidate hero/OG if we want one.
3. **No in-the-wild video, before/after, credentials, testimonial** → omitted. These are TELUS
   richness, not universal. The future skill/template should treat them as optional blocks.
4. **Pulls:** authored 2, but the brief pull duplicated the excerpt thesis → **promoted it to
   the hero voice line, dropped the dup**, kept the outcome pull. (TELUS ran 2–3.)
5. **Sector + Platform are NOT DB fields** — derived from content ("Consumer products · Energy
   storage", "Rapid prototype · iOS / Android"). **VERIFY with JP.**
6. **Services** prop is a long 2-line semicolon list — condensed to a 5-item line for the
   byline + fact sheet (full list stays in the DB).
7. **Dead CSS:** the template's `<style>` still carries `.fig-tilt / .cs-shot / .cs-ba /
   .cs-kiosk / .masthead` rules, now unused. Harmless, but a leaner base template (or the
   skill) should prune them.
8. Notion **Status stays "Draft"** — JP flips to Published in Notion when approved (no Notion
   write made from here).

**Takeaway for the `case-study-publisher` skill:** the renderer must build from a **section
manifest** where masthead, figures, video, before/after, credentials, testimonial, and each
stat are **optional** — present only when the source supplies them. TELUS is the dense maximum;
Energizer is the lean minimum. One more hand-publish of a *Tier 1* (hard-metrics) case would
confirm the odometer path before we automate.

**#2 — XYON Health (2026-06-25), `xyon.html` → `/xyon`. Outcome Tier 3 (fact of record).**
Cloned from the lean `energizer.html` base (closer fit than dense TELUS). Complete Notion entry
(metadata + five-section body + pulls + testimonial + `[OUTCOME PLACEHOLDER]`). **Mapped cleanly:**
hero, fact sheet, the five sections, **three** solution sub-headers (`an elevated marketing site.`
…), two pulls. Work-grid card wired (`work.html` XYON → `/xyon`).

**New template feature built — testimonial block.** XYON has a verbatim client quote (Dr. Simon
Pimstone) that TELUS/Energizer lacked. Added a `.cs-quote` block (figure > blockquote + stacked
figcaption: name / role / company). **Gotcha:** the template's markdown `blockquote` style is
Fraunces *italic* (built for short quotes); a 4-sentence testimonial in heavy italic read badly,
so `.prose figure.cs-quote blockquote` is forced to **Articulat (`--text`) 400 upright** via a
higher-specificity selector. → The future skill's testimonial block should set its own font,
not inherit the markdown-blockquote style.

**Tier 3 handling:** no stats — dossier is fact-sheet-only (proof-row removed). The Notion
`[OUTCOME PLACEHOLDER]` (Needs Review = YES) is an internal marker — **kept as an HTML comment,
NOT rendered**; the outcome stays qualitative + testimonial until JP supplies hard metrics.

**Editorial calls to VERIFY with JP:** hero sub-voice condensed from the long Summary/Excerpt;
Sector (`Men's health · DTC commerce`) + Platform (`Next.js · NestJS · Sanity · Stripe`) derived
from content (not DB fields); pull eyebrows authored `Brief — the bar` / `Outcome — shipped`
(Section — descriptor convention — note Energizer's `The payoff` pull eyebrow is the older bare
"The X" style, a minor inconsistency to reconcile). Notion **Status** stays Draft.
