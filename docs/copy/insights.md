# Insights collection

**Route:** `/insights` (file: `insights.html`)
**Source HTML:** `insights.html`
**Last sync commit:** `a64031d`
**Status:** LIVE
**Notion mirror:** _will be added when this file's Notion page is created_

> **2026-06-30 — the grid below is no longer the rough-in sample.** All 63 Published
> posts are real, rendered by `tools/blog-renderer/` from a Notion export — see its
> README. The chrome this file documents (hero, filter, closer) is still accurate;
> the **post grid section below describes the rough-in sample state and is stale**
> on card count/content (real grid: 63 cards, taxonomy Build 35 · Frames 4 ·
> Founder's Focus 24, one Featured). Individual posts route at **`/insights/<slug>`**
> — the listing itself stays at `/insights`. This is the one page set in the repo
> that's nested a directory down; see `docs/design-system.md` §11 before adding
> another.

The shared chrome (header, takeover menu, footer) on this page is governed by `_shared.md`. This file covers the page-specific copy above the footer: sub-page hero, stream filter, post grid, "Load more" rough-in, page closer.

This page is the static rough-in. Real-world pagination, counts, and post listing come from the Notion Blogs database at build time — the 9 cards in the grid are sample content demonstrating each card state (featured, standard, no-thumbnail, Founder's Focus type-only). When the Next.js layer ships, these get replaced by live data, but the page-level chrome (hero, filter, closer) is what the rest of the site depends on.

---

## Sub-page hero

_50vh sub-hero. Magenta eyebrow ties the page to its brand role; H1 carries the canonical "Thinking in public" line with the boxed-magenta treatment on "public"; sub-paragraph defines the three editorial streams._

**EYEBROW (magenta):** Insights

**H1:** Thinking in *public*
_("public" rendered as serif italic on a magenta block; paper-white text; slight Y-offset baseline so the highlight reads as a stamp, not a textwrap. Matches the homepage block 6 treatment exactly.)_

**BODY (three streams introduction):** **Build** — how to make products people love. **Frames** — how to make films that are remembered. **Founder's Focus** — where it's all going, whether you agree or not.

---

## Stream filter

_Sticky filter bar. Four tabs with stream labels + counts; counts read from the Notion Blogs database at build time. F1-style ink fill on hover; label cascade animation on entry._

| Role | Label | Count | Active |
|---|---|---|---|
| TAB | All | 94 | on (default) |
| TAB | Build | 58 | — |
| TAB | Frames | 22 | — |
| TAB | Founder's Focus | 14 | — |

_Stream counts at last sync: 58 + 22 + 14 = 94. When Notion's Blogs database changes, these update at build._

---

## Post grid

_Ruled sheet, indexed cells. The grid has three distinct card states demonstrated in the rough-in: (1) featured 21:9 overlay with full byline strip, (2) standard 4:3 with image, (3) "no thumbnail" slot-frame fallback, and the Founder's Focus dialect which renders type-only on ink with no image cell at all._

### Post 01 — Featured (Frames)

**INDEX:** 01

**TAG:** Frames · Featured

**MICRO (date):** May 14, 2026

**H2:** Power Shifter Studios takes home two Silver *ADDYs*

**EXCERPT:** Iron Mountain's "The Summit" and Ernest Packaging's "Four Dreams" — two generative films, two Silver ADDYs, one room in Vancouver.

**CTA:** Read the post →

**ALT:** _(empty — image is the Iron Mountain still; alt is intentionally blank for decorative overlay context)_

### Post 02 — Build

**INDEX:** 02

**TAG:** Build

**MICRO (date):** June 12, 2026

**H3:** Why scoping digital product and software development projects is challenging — and what to do about it

**EXCERPT:** Estimates fail for structural reasons, not effort reasons. Here is what we changed.

**CTA:** Read the post →

_Links to `article.html` — currently the only post that links to a real article template._

### Post 03 — Build

**INDEX:** 03

**TAG:** Build

**MICRO (date):** June 3, 2025

**H3:** Can vibe design and coding AI apps build a *real* product?

**EXCERPT:** We pressure-tested the 2026 vibe-stack against a production brief. The results were not what either camp predicted.

**CTA:** Read the post →

### Post 04 — Founder's Focus dialect (type-only on ink)

**INDEX:** 04

**TAG:** Founder's Focus

**MICRO (date):** January 22, 2025

**H3:** Designing for *rage*: how platforms profit from chaos

**EXCERPT:** Engagement metrics reward the worst room in the building. A founder's case for walking away from the algorithm economy.

**CTA:** Read the post →

_Founder's Focus cards render type-only on ink — no image cell. The opinion is words._

### Post 05 — Build

**INDEX:** 05

**TAG:** Build

**MICRO (date):** May 28, 2026

**H3:** Composable development with AI agents

**EXCERPT:** How agent-orchestrated builds changed our definition of a sprint — and what survived contact with a real client deadline.

**CTA:** Read the post →

### Post 06 — Frames

**INDEX:** 06

**TAG:** Frames

**MICRO (date):** February 19, 2026

**H3:** The brand experience *podcast*

**EXCERPT:** A conversation about products people use and stories people remember — and why one engine should make both.

**CTA:** Listen to the episode →

### Post 07 — Build

**INDEX:** 07

**TAG:** Build

**MICRO (date):** November 6, 2025

**H3:** Big news: say hello to PSI — the future of brand experience has arrived

**EXCERPT:** One design culture, two practices. Why we rebuilt the agency around an AI-native engine.

**CTA:** Read the post →

### Post 08 — No-thumbnail state

**INDEX:** 08

**TAG:** Build

**MICRO (date):** March 3, 2019

**H3:** Test Blog

**EXCERPT:** The shortest post in the archive — six blocks, nine-character title, no masthead. The renderer's floor.

**CTA:** Read the post →

**SLOT-TAG:** No thumbnail

_Demonstrates the slot-frame fallback when a post has no masthead image. The slot reads "No thumbnail" rather than rendering a broken image. The post itself is real (March 3, 2019, Test Blog) but its purpose in the rough-in is to show the fallback state._

### Post 09 — Founder's Focus

**INDEX:** 09

**TAG:** Founder's Focus

**MICRO (date):** September 9, 2024

**H3:** The specialist trap is a *generalist's* argument

**EXCERPT:** Fifteen years of being told to niche down. A counter-case from an agency that survived by refusing.

**CTA:** Read the post →

---

## Load more

_Single CTA below the grid in the static rough-in. Production paginates from Notion._

**CTA:** Load more →

---

## Page closer

_Magenta CTA band at the foot of the page, above the footer. Same scale as the homepage closer; page-specific H2 + sub-voice._

**H2 (CAPS + SUB-VOICE pair):**
- **CAPS:** Enough reading.
- **SUB-VOICE:** Start something.
_(SUB-VOICE renders as serif italic in magenta — `em.voice.mag`.)_

**BODY:** Cinema in days. Software in weeks. You'll work directly with the people who make it — no account layer, no brief telephone.

**CTA (solid):** Start a project →
**CTA (tel):** +1 (604) 227-9952

---

## Notes & open calls

1. **Counts source of truth.**
   The four filter counts (All 94, Build 58, Frames 22, Founder's Focus 14) are static placeholders. When the Notion → Next.js layer ships, these come from a live count over the Blogs database. The static numbers in this file are the rough-in baseline only.

2. **Card-state demonstrations.**
   The nine sample cards demonstrate four card states the renderer must handle: featured 21:9 with overlay, standard 4:3 with image, Founder's Focus type-only on ink, and no-thumbnail slot-frame fallback. When real posts populate, ensure the renderer routes each post to the right card state based on (a) "Featured" checkbox, (b) stream label, and (c) thumbnail presence.

3. **Only one post links to a real article.**
   Post 02 (the scoping article by Steven Bone) links to `article.html`. Every other post has `href="#"`. When real posts populate, slug routing replaces these.

4. **The "Test Blog" entry.**
   Post 08 is a real archival entry from March 3, 2019 that serves double duty as the no-thumbnail fallback demonstration. Decide before launch whether to surface it in the live feed or filter it out as renderer test data — its title and excerpt are not editorial content.

5. **CTA verb varies by stream.**
   Most posts use "Read the post →"; post 06 (the podcast) uses "Listen to the episode →". When real posts populate, the renderer should pick the verb by content type (post / episode / film), not by stream.

6. **Streams definition lives in the hero.**
   The three-streams definition paragraph in the sub-page hero is the canonical Build / Frames / Founder's Focus framing — it also appears verbatim on the homepage block 6. Change one, change both in the same commit.
