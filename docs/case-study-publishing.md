# Case-study publishing — system, mapping, and workflow

How a case study goes from Notion → a static page on the site, using `case-telus-koodo.html`
as the canonical template. Status: **TELUS & Koodo is the only fully-built example.** We are
validating the pipeline by hand-publishing a second one (Energizer) before automating it.

> **2026-06-30 — route changed.** Case studies moved from the site root to **`work/<slug>.html`**,
> served at **`/work/<slug>`** (matching the same nest-under-the-listing-page pattern the blog uses
> at `/insights/<slug>` — see `docs/design-system.md` §11). `tools/case-study-builder/` writes here
> now; see its README before re-running it on an already-published case.

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

### Notion sync + publish (post-build)

- **Notion is the source of truth, and edits keep arriving after a page is published.** Don't assume
  a live page is final — **re-fetch the Notion entry and diff against the HTML** before treating it
  as done. Real examples: the Allia testimonial swap + Canadian-spelling pass, the Delta Controls
  "ladder" rewrite, the 8 outcome-placeholder removals — all landed *after* first publish. Patch only
  the changed spots (title/meta tags, the specific paragraphs/pulls), don't re-render the whole page.
  ⚠️ **Do NOT re-run `tools/case-study-builder/build_cases.py` to apply a sync** — it regenerates the
  body from `cases_data.py`, which doesn't know about post-publish Notion edits *or* the odometer
  injection, so it silently regresses them. Hand-patch the `.html` (or update `cases_data.py` first).
- **`Status` + `Needs Review` can be written from here** via the connected Notion integration
  (`notion-update-page` → `update_properties`, `{"Status":"Published","Needs Review":"__NO__"}`).
  Convention: `Needs Review = YES` iff the body has an open `[OUTCOME PLACEHOLDER]`; when that's
  resolved (a real metric added, or the callout removed because none exists), flip `Needs Review → NO`
  and `Status → Published`. These writes appear in Notion page history under the **integration**, not
  a person — mention that when reporting.

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

- **Studios (film) case — video-first, Stream iframe player.** Film cases lead with the visuals:
  order is hero-text → dossier/receipts → **hero film → stills gallery → context reel → written
  case**. The plain-`<video>` pattern above needs **MP4 download enabled** on the UID; if it isn't
  (the download URL 404s), use the **Stream iframe player** instead — it works off HLS with no
  extra step and gives a real play/unmute/fullscreen UI:

  ```html
  <iframe class="cs-film-vid" allow="autoplay; encrypted-media; picture-in-picture;" allowfullscreen
    src="https://customer-xv1aafyshr3tbknu.cloudflarestream.com/<UID>/iframe?autoplay=true&amp;muted=true&amp;loop=true"></iframe>
  ```

  `muted=true` is required for browser autoplay; keeping the controls bar lets viewers unmute (to
  hear the anthem) and pause — which also satisfies the auto-play accessibility rule. `.cs-film-vid`
  / `.cs-film` / `.cs-gallery` are the film-case layout classes (see `work/iron-mountain.html`).

## Status & queue

- **15 case studies LIVE + Published** at `/work/<slug>` (`/work/energizer`, `/work/xyon`,
  `/work/allia-health-group`, plus the 12-case batch — see journal #5; moved here from the root
  2026-06-30, journal #7). As of 2026-06-30 **all 15 are `Status: Published` + `Needs Review: NO`
  in Notion** (flipped via the connected Notion integration — see journal #8), **placeholder-free**,
  and **editorially signed off** (Sector/Platform, hero sub-voice, and the odometer stat picks all
  approved; Energizer's pull eyebrow conformed to the `Section — descriptor` convention so all 15
  match).
- **Outcome placeholders — all resolved.** The 8 cases that carried an open `[OUTCOME PLACEHOLDER]`
  had it removed in Notion (no hard metric available → the outcomes stay qualitative); the
  non-rendered HTML tracking comments were stripped from every page. **Zero `[OUTCOME PLACEHOLDER]`
  remain in `work/*.html`.**
- **Tier-1 odometer dossier shipped** on the 6 hard-metric cases (journal #6) — the
  hand-publish → tooling → odometer arc from this doc's earlier "Next" items is done.
- **First Studios (film) case LIVE:** `/work/iron-mountain` — Iron Mountain "Finding Harmony in
  Data," the Silver ADDY-winning AI anthem (via Liquid Agency). First non-digital case; video-first
  layout, Stream iframe players autoplaying muted on loop (journal #9). Wired on `/work` (feature
  card), `/studios` (hero + grid film cards), and the homepage Selected-work card.
- **Build tooling exists:** `tools/case-study-builder/` (slices chrome from `xyon.html`, generates
  bodies from structured data, wires `/work` cards, injects odometers) — see its README. Not wired
  to Notion; copy is hand-transcribed into `cases_data.py`. This is the de facto first draft of the
  `case-study-publisher` skill, ad hoc rather than formalized — formalizing it (Notion → page
  directly, no hand-transcription step) is the actual remaining "Next."
- **Still pending across the set:** the image/video pass (hero/figure/OG via Cloudflare Images;
  `/work` thumbs for the imageless cards; koodo video → Cloudflare Stream, blocked on a Stream UID
  from JP) — unchanged from earlier in this doc.
- **TODO — poster stills for non-autoplaying videos.** Click-to-play case-study players (e.g. the
  three Ernest episode players — Values / CURE / Connectology) render a **black frame at rest**
  instead of a still. Give each a proper poster: either set a good frame on the Stream iframe
  (`?poster=<url-encoded thumbnail>` / `thumbnails/thumbnail.jpg?time=<Ns>`) or a chosen still, so
  every idle player shows an image rather than black. (Autoplaying hero films are less affected but
  a poster still helps pre-roll and reduced-motion.)
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

**#3 — Allia Health Group (2026-06-29), `allia-health-group.html` → `/allia-health-group`. Outcome
Tier 1 (hard metrics).** The Tier-1 case the journal was waiting for — **validates the odometer
dossier.** Cloned from `xyon.html` (kept its testimonial block) and **added the 3-odometer
proof-row back** (96 · 100 · 5). Complete Notion entry: metadata + five-section body + 3 pulls +
testimonial (Camilo Parra) + `[OUTCOME PLACEHOLDER]`. **Mapped cleanly:** hero, fact sheet, the
five sections, three solution sub-headers, three pulls, testimonial. Verified live in preview:
odometers animate on scroll (`proofRow.in`), testimonial upright Articulat, no console errors.

**Findings:**
1. **Odometer dossier works for Tier 1.** Generated 3 `.stat` odometers from agency-verifiable
   build records — Lighthouse **96**/100 performance, **100** (a11y/best-practices/SEO), **5**-week
   build. The `.odo .col` `--d=<digit>` pattern + the (already-present, guarded) proofRow JS
   animate cleanly. → Confirms the template's odometer path; the future skill can emit 1–3 stats.
2. **DB `SEO Title` + `Meta Description` were EMPTY** — derived both (title "…Investor-Ready
   Rebrand | POWER SHIFTER"; meta from the summary). **JP: add these to the Notion entry (or
   approve mine).**
3. **No imagery** (Hero/OG empty; no work-grid thumbnail exists). Omitted masthead + figures, and
   **deferred the `/work` grid card to the image pass** (an imageless card looks unfinished beside
   the others). Page is reachable directly + via sibling next-case links until then.
4. **`[OUTCOME PLACEHOLDER]`** here is a *class-6 business event* (did the liquidity event close?
   investor-conference date?) — kept as an HTML comment, not rendered. The Lighthouse hard metrics
   are shipped in the dossier + outcome; Needs Review stays YES for the business-event verify.
5. Sector/Platform derived; hero sub-voice condensed; pull eyebrows authored (Section — descriptor).
   Notion **Status** stays Draft.

**Three hand-publishes done (Tier 2 / 3 / 1). The template now covers the full range** — lean
fact-sheet-only through dense odometer dossier + testimonial. This is enough evidence to build the
`case-study-publisher` skill from a section manifest. **Pending across all: the image/video pass**
(hero/figure/OG via Cloudflare Images; work-grid thumbs; koodo video → Cloudflare Stream).

**#4 — Allia Notion sync + `/work` card (2026-06-29), commits `7b3207e` + `4a409a0`.** Notion had
moved since #3: the testimonial swapped (Camilo Parra → **Kendra Hogue, Senior Chief of Staff**,
new quote) and the previously-empty SEO Title + Meta Description were filled. Re-fetched and
diffed against the published HTML, applied just the three changed spots (title/meta tags +
testimonial block) rather than re-publishing the whole page — body prose was unchanged. Also added
the deferred `/work` grid card for Allia (top-left, placeholder `slot-frame` image — "image
pending" — since no thumbnail exists yet). Energizer got a separate, smaller Notion sync in the
same commit (word-level copy polish, no structural change). **Takeaway:** Notion content can keep
moving after a page is published — re-fetch and diff before assuming a published page is final;
don't re-derive editorial fields (SEO Title etc.) once JP has actually filled them in.

**#5 — 12-case batch + `case-study-builder` tooling (2026-06-29), commits `94b238d` + `b904e19`.**
Hand-editing one case at a time doesn't scale past 3 — built a small Python generator
(`tools/case-study-builder/`) that slices the verified `xyon.html` chrome and regenerates only the
body per case from structured render-specs (`h2`/`h3`/`p`/`ul`/`pull`/`quote`/`comment`), so every
page stays byte-identical in chrome. Published 12 more cases through it: `hall-constructors`,
`ncis-maritime`, `telus-support`, `luxxee`, `bc-parks-foundation`, `5x5`, `phinity`, `nva`, `bcw`,
`delta-controls`, `angel-oak-home-loans`, `telus-rewards`. Repointed 11 existing `/work` cards
(real images already on disk) to their new URLs, fixed two stale titles (`SxS Technologies` →
`5x5 Technologies`, `Luxxee` → `luxxee`), added a placeholder card for `telus-support` (no image on
disk). **6 of the 12 carry an open `[OUTCOME PLACEHOLDER]`** (hall, ncis, bc-parks, phinity, nva,
telus-rewards) — parked as HTML comments per the established convention, Needs Review stays YES.
**Editorial derivations flagged for JP** across the batch: Sector/Platform, hero sub-voice
condensations, pull eyebrows — same convention as #1–#3. All Status stays Draft. **Takeaway:** the
generator (not yet Notion-wired — copy is hand-transcribed into `cases_data.py`) is the practical
first draft of the `case-study-publisher` skill; formalizing the Notion→page step is what's
actually left to "build the skill," not starting from scratch.

**#6 — Tier-1 odometer dossier upgrade (2026-06-29), commit `fde9044`.** Retrofitted the
Allia-style animated `proof-row` ("The receipts") onto the 6 hard-metric (Tier 1) cases from the
batch in #5, which had shipped their metrics in prose only: `telus-support` (30% / 600K / 70%),
`luxxee` (170K+ / 18K / 33%), `bcw` (3,500 / 20 / 3), `delta-controls` (90 / 3× / 2020),
`angel-oak-home-loans` (40% / 30, 2-up), `telus-rewards` (300K+ / 22% / 100%). Reused the chrome's
existing odometer JS/CSS (digit columns + `.ch` separators for thousands-commas + `.sfx` unit
suffixes for `%`/`K`/`K+`/`×`) — no new dependencies. A small generator script
(`tools/case-study-builder/add_odometers.py`) injects the `proof-row` markup into each page's
`cs-dossier` section. Verified rolling on scroll (`.in`/`.go` classes), no console errors.
**Takeaway:** the figure/caption choice for each odometer (which 2–3 numbers lead, what the
caption says) is an editorial call I made per case — worth a glance to confirm they're the numbers
JP would lead with, not just the first ones mentioned in the Notion body.

**Delta Controls got a follow-up Notion sync** (2026-06-30, commit `faf716e`) — late-breaking copy
introduced a "ladder" motif (the engineer no longer climbs a ladder to configure a sensor hub) into
the sub-voice, brief, outcome, and outcome pull. Same diff-and-patch approach as #4: four spots
changed, body otherwise untouched. **Pattern to expect going forward:** Notion edits keep arriving
after publish on a rolling basis — re-fetch and diff rather than assuming any published case is
done, the same way #4 found Allia had moved.

**#7 — Moved all 16 case studies from the root to `/work/<slug>` (2026-06-30).** JP: "the case
studies should also be ~work/case-study-name?" — drawing the same parallel the blog had just
made at `/insights/<slug>`. Scoped it first: 16 pages total (the 15 above + the original
`case-telus-koodo`, live since before this doc existed), referenced from `work.html` (16 cards),
`digital.html` (1 link to `case-telus-koodo`), and each other (32 next-case cross-links) — nowhere
else. Same fix as the blog move: every case-study page's chrome (nav, footer, stylesheets/scripts,
legal links, the "Back to all Work" link) used relative hrefs with no leading slash, which only
worked flat at the root; rewrote them all to root-absolute, plus `case-telus-koodo`'s page-content
local assets (`images/koodo_*.png`, `videos/koodo_loop.mp4`). Updated `tools/case-study-builder/`
(`build_cases.py`'s write path, base-template read path, back-link, and next-card href; `wire_cards.py`
and `add_odometers.py`'s target paths) so future cases generate correctly in `work/` without a
second manual pass. **Did not re-run `build_cases.py`** on the 12 builder-managed cases to apply
the fix — that would have overwritten the Delta Controls Notion sync (#6's trailing note) and the
Tier-1 odometer proof-rows, neither of which `cases_data.py` knows about (see the builder's
README). Fixed all 16 files directly instead, with a script applying the identical string
replacements a regeneration would have made to the chrome, leaving body content untouched.
Verified in a browser from the nested path on both a hand-built case (`case-telus-koodo` — its
local image/video assets, stylesheets, back-link) and a builder-generated one (`xyon` — its real
next-case cross-links); confirmed `work.html`'s 16 cards and `digital.html`'s 1 link resolve; zero
leftover relative chrome references across all 16 files. **No redirects** added from the old root
URLs — same call as the blog move (dev preview domain, not yet the production domain).

**#8 — Status flips, placeholder resolution, editorial sign-off (2026-06-30).** The finishing pass.
Three parts, all driven by JP review:
1. **Notion `Status` flips, in two waves.** Confirmed scope with JP first (the `Status` field is the
   sign-off gate, and there was a real split). Wave 1: the 7 review-clean cases (`Needs Review: NO`) →
   Published. Wave 2: as JP resolved each `[OUTCOME PLACEHOLDER]`, the remaining 8 → Published. End
   state: **all 15 `Status: Published` + `Needs Review: NO`.** Done via the connected Notion
   integration (`notion-update-page`); writes show under the integration in page history, flagged to
   JP. (First use of Notion *writes* this project — reads were all we'd done before.)
2. **All 8 outcome placeholders resolved.** JP removed the 🚧 callouts in Notion (no measured metric
   available → qualitative outcomes stand). For each, re-fetched + diffed Notion vs. the HTML, removed
   the non-rendered tracking comment, and **synced the prose edits found in the diff** — Allia's
   Canadian-spelling/wording pass (signalled, colour, scalable, "rather than", "would never satisfy")
   and TELUS Rewards' projection-sentence tightening ("indicated that … would *nearly triple*", so it
   clearly reads as a projection, not a result). Hand-patched (did **not** re-run the builder — see
   the Notion-sync note above). Zero placeholders remain.
3. **Editorial derivations approved.** JP reviewed the four classes of non-Notion-sourced copy —
   Sector/Platform (inferred fact-sheet rows), condensed hero sub-voice, pull eyebrows, and the
   Tier-1 odometer stat picks. **Approved as-is** except one: Energizer's lone pull eyebrow was the
   old bare-`The payoff` style → changed to **`Outcome — the payoff`** so all 15 follow the
   `Section — descriptor` convention. (Commits `0e830cb` placeholders/prose, `87590f5` final two,
   `e8f8503` eyebrow.)

**Case-study track is now fully closed** except the cross-set **image/OG/video pass** (heroes,
figures, OG, the two `image pending` `/work` cards, koodo → Cloudflare Stream blocked on a UID) and
the optional **formalize-the-builder-into-a-skill** work.

**#9 — Iron Mountain, first Studios (film) case (2026-07-02), `work/iron-mountain.html` →
`/work/iron-mountain`. Outcome Tier 3 (fact of record).** Built by hand from the Notion *Studio Case
Studies* DB (page `391b37ad…`), copying `telus-rewards.html` for chrome and rewriting the body — the
builder tooling is digital-only (odometer stats), so film cases are hand-built for now. What was new
vs. the digital cases:
1. **Film-first structure.** Per JP: it's a visual medium, so visitors get visuals fast — order is
   hero-text → dossier/receipts → **hero film → 4-still gallery → context reel → written case**
   (brief→challenge→process→solution→outcome + pull quotes). New layout classes `.cs-film` /
   `.cs-film-vid` / `.cs-gallery`.
2. **Receipts, adapted for film.** No odometer topline metric fits, so the 3-stat row is
   `1 Silver ADDY` / `5 week sprint` / `1:15` (runtime) — all Tier-3 facts. Long text units use the
   `.sfx-label` modifier (nowrap + smaller) so "Silver ADDY"/"week sprint" stay one line. (JP
   corrected the runtime stat from the brief's "60 sec" to the delivered `1:15`.)
3. **Video → Stream iframe player, not `<video>`.** MP4 download wasn't enabled on the two UIDs
   (`downloads/default.mp4` 404s), so used the iframe player, **autoplaying muted on loop** (see
   Media). Hero film UID `0cbeeb8d…`; context reel (the film running on ironmountain.com)
   `32c6639f…`. Held off Vidzflow (its `/v/` share page iframes as a messy landing page).
4. **Wiring:** re-pointed the homepage Iron Mountain card from the external legacy URL to the new
   internal `/work/iron-mountain`; filled the placeholder `href="#"` on the `/work` feature card and
   both `/studios` film cards.

Notion **Status** is already `Published` / `Needs Review: NO` on the source page. Still pending: enable
MP4 download on the two Stream UIDs (would let us switch to the house `<video>` pattern).
