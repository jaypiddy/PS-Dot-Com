# Digital practice

**Route:** `/digital` (file: `digital.html`)
**Source HTML:** `digital.html` · originally extracted from `PS_Digital_Hub_v1.html` (Claude Design prototype, June 11 2026)
**Last sync commit:** _to be set on the build-out commit_
**Status:** LIVE — all 8 sections (chrome, hero, outcome strip, offers, validator, how-we-work, selected work, partners, page closer) implemented to LIVE quality. Two cards in Selected Work still point to `#` until those case studies are built (Energizer, Delta Controls, Angel Oak); TELUS Rewards links to `case-telus-koodo.html`.

The shared chrome (header, takeover menu, footer) on this page is governed by `_shared.md`. This file covers only the page-specific copy.

---

## Hero

_Identity-first hero. Eyebrow names the practice scope; H1 makes the velocity claim; sub-paragraph qualifies and bolds the AI/senior pairing; two CTAs route to the validator and to a project start._

**EYEBROW:** Digital — product strategy, design & engineering

**H1:** Working software in weeks, *not months.*
_("not months" rendered as serif italic via `em.voice`. Matches the homepage doors block's Digital door lead line exactly — same wording, scaled up to H1 for the hub page._

**BODY:** Designers at heart, all the way down to the dev team. **AI does the volume. Senior people make the calls.** MVPs in 4–6 weeks; platforms that hold at enterprise scale.
_Renders inside `<p class="sub-body">` — a new sibling of the existing `.sub-voice` class (which carries serif-italic-on-magenta lines). `.sub-body` is plain prose with bolded mid-sections, intended for hub pages where the hero needs to qualify the H1 with weighted prose rather than an italic voice flourish._

**CTA (solid):** Validate your idea in just a few minutes →
_Routes to `https://rapidmvp.powershifter.com/validate` (per Notes 6, 9). Lives inside the new `.sub-hero-ctas` extension to `.sub-hero` — see Notes 10._

**CTA (outline):** Start a project
_Routes to `#contact` (the page closer)._

---

## Outcome strip

_The receipts. Four count-up numerals (count-up JS in the prototype), one per stat. No section header on this block — it's a horizontal proof spine._

| Role | Number | Unit | Caption |
|---|---|---|---|
| STAT | 300,000 | + | enrollments in six months — TELUS Rewards |
| STAT | 30 | days | from idea to validated proof of concept — Energizer |
| STAT | +40 | % | organic leads — Angel Oak |
| STAT | Best UX | _(no numeric)_ | Vancouver UX Awards — Delta Controls |

_Stat 4 has no numeric — renders as serif italic text inside the same `.stat b` container, no `.odo` element. CSS rule `.stat b > em{font-style:italic;font-family:var(--serif);font-weight:500}` covers the variant._

---

## Offers — "Two ways in"

_Two-up offer grid. Numbered, no icons. Each tile has a number, an offer name, a one-sentence frame, and a CTA._

**H2:** Two ways in

### Offer 01 — Rapid MVP

**NUM:** 01 — Pressure-test

**H3:** Rapid MVP

**LEAD:** A working MVP in 4–6 weeks — *pressure-tested before a dollar is committed.*

**BODY:** Start with the Validator. Then six weeks to a real product in market, scoped against what we've already shipped.

**CTA:** Start with the Validator
_Routes to `https://rapidmvp.powershifter.com/validate`._

### Offer 02 — Product Design & Engineering

**NUM:** 02 — Build

**H3:** Product Design & Engineering

**LEAD:** The core practice — platforms and products designed and built by one team, *holding at enterprise scale.*

**BODY:** Designers, strategists and engineers in the same room. No account layer. Senior people on the work, AI in the pipeline.

**CTA:** Start a project
_Routes to `#contact`._

---

## Validator

_Tool tease. Two-column INK band — section flips to ink background to read as the page's strongest CTA. Argument on the left, Cloudflare Stream explainer video on the right (16:9). The video is the asset that conveys what the Validator does — the previous terminal demo was decorative flourish, replaced June 23 2026._

**H2:** Don't take the meeting yet. Take the test.

**BODY:** Run your idea through the MVP Validator — execution risk, scope realism, and technical feasibility, scored against everything we've ever shipped. You'll know what to cut before we ever talk.

**CTA:** Validate your MVP →

### Video embed

_Cloudflare Stream explainer video. Iframe player (controls, audio, captions if uploaded, lazy load, adaptive HLS all handled by Cloudflare). Customer subdomain `customer-xv1aafyshr3tbknu.cloudflarestream.com` — same Stream account as the homepage hero reel. Video UID: `b95bdf8570cc633d7f96867d40bad336` (set live June 23 2026). The UID appears in two places inside `digital.html` — iframe `src` and the URL-encoded `poster` parameter — both pointing at the same Stream UID's resources (the iframe player and the frame-0 thumbnails endpoint)._

---

## How we work — the one-two punch

_Two adjacent .engine bands with alternating layouts. Module 1 (Early & Often) runs canonical 5fr/7fr; Module 2 (Direct-to-Expert) runs mirrored 7fr/5fr via the `.engine.mirror` modifier. Copy is verbatim from JP's off-platform draft (June 23 2026) — do not edit without re-syncing. Same copy ships verbatim on `/studios` when that page builds. See Notes 16._

### Module 1 — Early & Often

**H2:** Early and often. *Sometimes ugly.*

**BODY:** You will see the work while it is still changing: rough cuts, wireframes mid-thought, builds mid-sprint.

**BODY:** That keeps us close to the problem and able to **correct course before a small miss becomes an expensive one.**

**BODY:** We avoid ta-da moments at all costs. No polished surprise in week eleven. Just visible progress, sharper decisions, and work that gets better because you saw it early enough to shape it.

### Module 2 — Direct-to-Expert

**H2:** *Expertise compounds.*

**BODY:** You are the experts in your business. We are the experts in turning complex digital problems into products people want to use.

**BODY:** Put the right people in the same room and progress compounds. You work directly with the strategists, designers, and engineers doing the work. **No account-layer relay. No game of telephone.**

**BODY:** Your expertise. Ours. One team, solving the right problem sooner.

---

## Selected work — "Digital, selected"

_Four-card filtered slice of the work library. Each card: image frame (UI motion intended), tag, project H3, one-line blurb._

**H2:** Digital, selected

**CTA (header):** All work →

### Card 01 — TELUS Rewards

**TAG:** Platform

**H3:** TELUS Rewards

**BODY:** 300,000 enrollments in six months.

### Card 02 — Energizer

**TAG:** Rapid MVP

**H3:** Energizer

**BODY:** Product-market fit validated in 30 days.

### Card 03 — Delta Controls

**TAG:** Product · Best UX, VUX

**H3:** Delta Controls

**BODY:** IoT configuration, moved to the cloud.

### Card 04 — Angel Oak

**TAG:** Web · SEO

**H3:** Angel Oak

**BODY:** +40% organic leads from a user-first redesign.

---

## Partners

_Credentialed partnerships strip. No header. Lead sentence + a horizontal row of partner-tier labels._

**BODY:** Certified, not just familiar — and this site runs on the same stack we build for clients.

**Partners row:**

- Contentful · Silver Partner
- Sanity · Agency Partner
- Vercel · Expert

_Webflow line removed: the v1 prototype was authored before the Webflow direction was abandoned. Partner tier standings for the three remaining still need verification before paid reuse — see Notes 3._

---

## Closer

_Page-end CTA. H2 reframes deliverable; one-line BODY repositions the role of the input and reinforces the visibility + direct-collaboration promise (timeline-agnostic — holds for both service lines); two CTAs._

**H2:** The roadmap isn't the product. *Bring the idea.*

**BODY:** You'll see the work in progress, not reveal meetings — and you'll work directly with the people making it. No account layer, no brief telephone.

**CTA (solid):** Start a project →
**CTA (tel):** +1 (604) 227-9952

---

## Notes & conflicts

1. **Hero H1 — resolved to canon "not months."**
   The original v1 prototype's hero read "Working software in weeks, not quarters." Resolved on June 23 2026 (stub commit) to the current canon "Working software in weeks, *not months.*" — matching `home.md`, `article.html`, `_shared.md` taglines, and the deck overview. The H1 now renders with `em.voice` on "not months." mirroring the homepage doors block's Digital door lead line exactly. The "not quarters" wording is retired permanently.

2. **Energizer caption wording — resolved to homepage form.**
   The outcome strip on /digital now reads "from idea to validated proof of concept — Energizer," matching the homepage proof spine verbatim. The v1 prototype's shorter "idea to validated…" wording is retired. Both pages now carry identical caption text — the receipts don't drift between the homepage and the practice page.

3. **Webflow partner line dropped; remaining tier verification still open.**
   The v1 prototype carried four partner-tier chips: Contentful Silver, Sanity Agency, Vercel Expert, Webflow Enterprise. Webflow was dropped on the build-out commit (June 23 2026) — Power Shifter moved off Webflow to static HTML on Vercel, so naming Webflow as a current partner would misrepresent the stack. The three remaining tier standings (Contentful Silver, Sanity Agency, Vercel Expert) still need verification before paid reuse — these were unflagged in the prototype and should be confirmed against current partner-portal status before this page is used in paid outbound or pitches.

4. **Stats parity with the homepage.**
   The Best UX / Delta Controls stat replaces the "2× Silver ADDY" stat used on the homepage proof spine. Each page should pick the four proof points most relevant to its dialect. Both stats are real; this is a curation choice, not a conflict.

5. **Studios cross-link absent.**
   The prototype has no link out to /studios from this page. The masterbrand-two-doors IA probably wants a seam at the bottom (or in the engine band of the homepage) routing readers across. Decide when the page builds.

6. **Validator linkage.**
   The Validator is a separately deployed Next.js app at `https://rapidmvp.powershifter.com/`, branded "Rapid MVP Validator" (currently v1.5-flash, build 2026-01-28). The prototype's hero CTA `Validate your idea in just a few minutes →` and the in-page section's `Validate your MVP →` both target the on-page `#validator` anchor on the Digital hub. When this page builds, both should route to `https://rapidmvp.powershifter.com/validate` — the in-page Validator section becomes a tease for the standalone app, not a destination. The terminal demo on the hub stays as marketing flourish; the actual validation happens on the rapidmvp subdomain. JP has flagged that the validator app's own styling will change post-launch of the main site, so the hub's visual treatment is the lead, not vice versa.

7. **AI Content Operations removed.**
   The prototype HTML carries a third offer card titled "AI Content Operations" between Rapid MVP and Product Design & Engineering. JP confirmed on June 23 2026 that this isn't an offering Power Shifter actually has — it appears to have been invented during the Claude Design prototype session and slipped into the v1 file. The deck now lists two offers, the H2 reads "Two ways in," and Product Design & Engineering is renumbered from 03 to 02. Do not reintroduce from the prototype HTML.

8. **What the Validator app actually does (`rapidmvp.powershifter.com`).**
   Three-step flow on the deployed app: (1) the user describes their product vision in plain English answering a short series of structured questions about problem, solution, and complexity (no technical specs required); (2) an AI pressure-test engine analyzes the concept "against millions of data points" to surface risks, competitors, and technical complexity; (3) the user receives a free report containing an MVP validation score, key execution risks, a plain-English feasibility check, a recommended tech stack, an estimated build time, and a step-by-step execution plan. Marketed as 100% free, no credit card, with submissions never treated as IP ("Your idea remains 100% yours"). Lead-magnet mechanics (email capture, downstream nurture) are presumably present but the exact shape isn't visible in the SSR snapshot of `/validate` — the questionnaire and any capture step are client-rendered. The validator app's landing page carries three named testimonials (Joseph Santry / lululemon, Achin Kansal / Phinity, Simon Pimstone / XYON) and a JP founder note. Repo at `jaypiddy/idea-validator-app` is private and not accessible to the PAT used for the PS-Dot-Com repo; deeper code-level details would need either a wider-scoped PAT or the repo made public.

9. **Validator time-to-complete — resolved to "just a few minutes."**
   Three surfaces previously claimed ~2 minutes (Digital practice hero CTA, `rapidmvp.powershifter.com` homepage hero) and one said ~5 minutes (`/validate` intro screen). JP decided on June 23 2026 to drop the specific-number framing entirely in favour of "just a few minutes" — more honest, doesn't lock to a number that has to be defended, and absorbs the natural variability of how long users actually take. The Digital practice hero CTA is now `Validate your idea in just a few minutes →`. The Validator app's homepage `~2 min` claim and the `/validate` intro screen's `Takes ~5 minutes. No obligation.` sit in the separate `jaypiddy/idea-validator-app` repo and need the same update at the validator app's styling refresh — likely standardize on `Takes just a few minutes.` on the `/validate` intro and drop the time claim from the marketing hero, since the time number reads as more credible when it appears right before the user starts answering questions.

10. **Page built out — all 6 sections live.**
    `digital.html` was built out on June 23 2026 (commit after the stub commit). All 6 interior sections are now real implementations, no stubs remaining. The full pattern mapping is in `docs/design-system-audit.md`. Section-to-pattern resolution:
    - **Outcome strip:** `.proof` + `.proof-row` + 4 `.stat` cells. Stats 1-3 (TELUS, Energizer, Angel Oak) reuse the homepage proof spine HTML verbatim. Stat 4 (Best UX / Delta Controls) is the new text-only variant — `<b><em>Best UX</em></b>` inside `.stat`, no `.odo`. Logos strip omitted (it's the homepage's job).
    - **Offers:** `.doors.compact` (new variant — sub-page scale, ~48vh per door) with two `.door.digital` cards. Both light-styled since the offers are stages, not opposites; differentiation comes from numbered eyebrows + lead emphasis. "Two ways in" H2 sits in a constrained `.wrap` above the full-bleed doors block.
    - **Validator:** `.engine.validator-band` (new variant — 1fr/1fr grid instead of canonical 5fr/7fr, H2 dialed to clamp(32px,3.6vw,54px) so it fits the half-width column). Right column carries the new `.terminal` component.
    - **How we work:** canonical `.engine` band (5fr/7fr), second one on the page — deliberate rhythm reuse. H2 left with magenta `.rule`, 3-paragraph prose body right ending in the bench credentials line.
    - **Selected work:** `.work` section with `.cards.four-up` (new variant — extends homepage 3-up to 4-up; breaks to 2-up at ≤1100px, 1-up at ≤680px). Only TELUS Rewards links to a real case study; the other three point to `#` until those cases are built.
    - **Partners:** new `.partners-strip` — 3 partner-tier chips (Contentful Silver, Sanity Agency, Vercel Expert). Webflow dropped per Notes 3.
    Page status moves from INTERIM to LIVE on this commit. Inherited work.html JS (`.work-grid`/`.wcard`/`[data-cat]` bindings) remains in place as harmless no-ops — JS cleanup is a separate follow-on pass.

11. **New design-system patterns now in production.**
    Three new patterns + one extension class were introduced for this page and are now live (all documented in `docs/design-system-audit.md` §"New patterns to add to the system"):
    - **Pattern A — `.sub-hero-ctas`:** extension of `.sub-hero` to support a row of CTAs in the hero. Live in this page's hero (Validator + Start-a-project pair). Reusable on `/studios`, `/about`, and any future hub-style page.
    - **Pattern B — `.terminal`:** monospace 6-line scripted CLI exchange, role-coded by leading icon (`$` prompt, `✓` ok, `▲` warn, `→` signal). Live in the Validator section. Lines reveal in sequence via the existing `.reveal` → `.in` observer, staggered 180ms per line. Reusable as `.terminal.breakout` inside `.article-body .prose` on case studies showing technical work, engineering-stream Insights articles, or the Studios AI-pipeline visualization.
    - **Pattern C — `.partners-strip`:** horizontal row of partner-tier chips (display-weight name + serif-italic tier label). Live in the Partners section. Distinct from `.logos` (which masks client logos via mask-image). Reusable on `/about` when that page ships.
    Also live: a `.sub-body` class for hero body prose with bolded mid-sections (sibling of the existing `.sub-voice` italic-magenta treatment and `.streams` 3-stream paragraph treatment), and a `.stat b > em` rule for text-only outcome-strip values.

12. **Takeover menu link 02 (Digital) — cross-page rewire still pending.**
    Every existing built page's takeover menu (`work.html`, `insights.html`, `article.html`, `case-telus-koodo.html`) carries link 02 pointing to `index.html#digital` (the anchor on the homepage doors block). Now that `digital.html` is live, link 02 should route to `digital.html` instead. The `digital.html` page itself still has link 02 pointing to `index.html#digital` to stay consistent with the other pages — diverging on one page only would create inconsistent navigation. The cross-page rewire is its own commit and touches every page with a takeover. Same kind of follow-on applies to links 03 (Studios), 05 (About), and 06 (Contact) when those pages ship.

13. **Editorial constraint — "six weeks" / "4-6 weeks" claims scoped to Rapid MVP only.**
    The specific-number cadence claim is the Rapid MVP service line's claim, not a whole-practice claim. The reality of the Product Design & Engineering offer is that platforms — even AI-assisted, even agentic-pipeline-supported — still run months, not weeks. Putting a specific timeframe number into any whole-page surface (page closer, partner pitches, About page positioning) reads as an overpromise on the enterprise build work that is the larger part of the practice's actual delivery.

    **Scope of this constraint:** specific-number claims like `six weeks`, `4–6 weeks`, `30 days`, or any numeric duration framing. The H1's generic `Working software in weeks, not months.` is a different category — directional brand canon, paired with the contrasting `not months.` clause, deliberately ambiguous on which projects land in weeks vs which run longer. That phrasing is shared with the homepage doors block, the shared chrome taglines, the article template's related-reading row, and the deck overview — it stays as-is. If the H1 framing is ever revisited, that's a cross-page edit and its own decision.

    **Where the specific-number claim IS allowed on `/digital`** (each one qualified by service-line context):
    - **Hero body:** "MVPs in 4–6 weeks; platforms that hold at enterprise scale." — "MVPs" is the explicit qualifier, and the second clause explicitly contrasts the platform side. The two-clause structure carries the scoping.
    - **Offer 01 — Rapid MVP, lead:** "A working MVP in 4–6 weeks — pressure-tested before a dollar is committed." — inside the Rapid MVP card, naturally scoped.
    - **Offer 01 — Rapid MVP, body:** "Start with the Validator. Then six weeks to a real product in market…" — inside the Rapid MVP card, naturally scoped.

    **Where the specific-number claim is NOT allowed:**
    - **Page closer.** The closer body is page-level and spans both service lines. The original closer body ("In six weeks you'll be testing software, not reviewing decks…") was rewritten on June 23 2026 to drop the timeframe entirely and lean on visibility + direct collaboration instead — both true regardless of project length. New body: "You'll see the work in progress, not reveal meetings — and you'll work directly with the people making it. No account layer, no brief telephone." Echoes the "Early and often" engine band's visibility promise.
    - **Future Studios cross-link copy, About page positioning, Partners pitch deck reuse** — anywhere a whole-practice numeric claim would land.

    The homepage closer ("Cinema in days. Software in weeks.") is a masterbrand-velocity claim covering both Digital and Studios. "Cinema in days" is itself a numeric duration claim (the Studios analogue of "MVPs in 4-6 weeks") and the same scoping logic applies — when revisited, those claims should sit inside service-line context, not at the masterbrand level. Its own editorial call.

14. **Validator section — flipped to ink background, terminal replaced with Cloudflare Stream explainer video.**
    JP feedback on June 23 2026: "The rapid MVP section kind of blurs in with the page. I want this to feel like a stronger call to action, so I would like to use the black background. I also don't think that the image we have there with the mono text, monotype text is of a benefit. We've got an explainer video that I think is much stronger for being able to convey the idea of what the Rapid MVP is."

    **Two changes applied:**

    a) **Section background flipped paper → ink.** Adds a paper/ink/paper sandwich between the offers block above and the how-we-work band below. The Validator now reads as the page's strongest CTA rather than a third paper-on-paper section blending into the rhythm. `.validator-band` now sets `background:var(--ink); color:var(--paper)` with paper H2, paper p (.86 opacity), full-paper `<strong>`. `em.voice` stays magenta. The button (`.btn.solid.cascade`) stays paper-on-ink — high contrast on the dark section, matches the homepage closer's solid CTA treatment on its dark band.

    b) **Terminal block replaced with Cloudflare Stream video embed.** The `.terminal` CSS pattern (six lines of scripted CLI output with role-coded magenta signal line) is stripped from `digital.html` entirely. The right column now carries a `.video-frame` block — a new generic 16:9 video container — holding a Cloudflare Stream iframe player. The Stream iframe handles controls, captions (when uploaded), lazy loading, and adaptive HLS — no JS to wire on our side.

    **Video UID — live as of June 23 2026:** `b95bdf8570cc633d7f96867d40bad336`. Customer subdomain `customer-xv1aafyshr3tbknu.cloudflarestream.com` (same Stream account as the homepage hero reel — confirmed from `index.html` STREAM config). The UID appears in two places inside the iframe URL in `digital.html`: the iframe `src` (pointing at the Stream iframe player endpoint) and the URL-encoded `poster` parameter (pointing at the same UID's `thumbnails/thumbnail.jpg?time=0s` endpoint, so the player shows the frame-0 still while loading). The Cloudflare dashboard exposes three values per video — Video ID, HLS Manifest URL, Dash Manifest URL — only the Video ID is needed for the iframe player pattern. The HLS and Dash manifests are for custom-player workflows (the homepage hero reel uses HLS via hls.js and builds the `.m3u8` URL from UID + customer subdomain).

    **Pattern split codified:** the site now has two video embed conventions, both legitimate.
    - **Cloudflare Stream iframe player** (`.video-frame` wrapper) — for marketing/explainer videos the visitor plays deliberately. Controls visible. Audio expected. Used on `/digital` for the Rapid MVP explainer. Reusable on Studios, About, case studies, anywhere a narrated video earns the visit.
    - **Plain `<video>` tag** with frame-0 poster — for decorative card loops on `/work` (3-8s, muted, autoplay on hover, no controls). Documented in `docs/VIDEO_PIPELINE.md`. The clip spec (3-8s, 1280×720, H.264, ~1-2.5MB, audio stripped, faststart, frame-0 IS the poster) applies to this pattern only.

    **`.terminal` pattern preserved in the design system audit doc** as a reusable component (case studies showing technical work, Insights articles citing CLI exchanges, Studios pipeline documentation) — just not used on `/digital` anymore. Each page that wants the pattern will redefine the CSS inline per project convention (no shared stylesheet). The audit doc's "New patterns" §B entry for `.terminal` stays catalogued; needs an updated note on the next audit-doc pass noting that the pattern is currently unused but available, and a new §C entry for `.video-frame`.

    **Magenta budget after the change** is still inside the 2-per-viewport ceiling. The Validator viewport at rest now has one magenta surface (`em.voice` on "Take the test."). The terminal's signal-line magenta is gone. The CTA hover state on `.btn.solid` adds a second magenta surface but only during interaction (not at rest), so the budget holds.

15. **How we work — two-module one-two punch (June 23 2026).**
    JP brief: "One of the key pieces to Power Shifter's success has not only been our early and often and sometimes ugly, but it's paired with the philosophy of direct-to-expert. I want this as an alternating one-two punch on the services pages, the first being early and often, the second being direct-to-expert. Use the same copy on both /digital and /studios."

    Implementation: replaced the single "Early and often" engine band on `/digital` with two adjacent `.engine` bands. Module 1 keeps the canonical 5fr/7fr layout (H2 left, body right). Module 2 uses the new `.engine.mirror` modifier — 7fr/5fr, with `order` flipping the columns so body reads left and H2 reads right at desktop. The two read as a zigzag at desktop scale; on mobile both stack identically (H2 → body) because the mirror rhythm doesn't read at narrow widths.

    **Verbatim copy constraint:** the H2s and body paragraphs ship word-for-word as JP supplied them — no editorial polish, no rewriting. Two stylistic decisions inside JP's copy that the page handles:
    - **Module 1 voice accent.** "Early and often. *Sometimes ugly.*" splits H2 across two beats; the second beat ("Sometimes ugly.") takes `em.voice` (magenta italic late-serif). Matches the page's H2 pattern from the hero, validator, and homepage.
    - **Module 2 voice accent.** "Expertise compounds." is a single phrase — no two-beat split to lean on. The full phrase takes `em.voice` (magenta italic). One magenta accent per H2, both H2s separated by a viewport-height of scroll so they don't compete inside one viewport. Magenta budget holds (2-per-viewport ceiling).

    **What the swap displaced — bench credentials line.** The previous Early-and-often body ended in "**The bench:** leadership that shipped for Microsoft, Starbucks, Nike, Nintendo, and Coca-Cola before ever sitting in an agency pitch." That line is now off the page. It's a real credentials claim that earns its keep somewhere. Three places it can credibly land when needed:
    1. As a bench strip directly under the partners-strip section (`/digital`)
    2. As an About-page lead (`/about` when built — see `studios.md` "Dependency on /about" note)
    3. As a homepage proof-spine modifier (currently the proof spine is client logos; a roster bench strip below would add complementary credibility)

    **Section IDs:** Module 1 keeps the existing `id="how-we-work"` anchor (the takeover menu link still works). Module 2 has a new `id="direct-to-expert"` anchor for future deep linking.

    **Cross-page parity:** the same two modules ship verbatim on `/studios` when that page builds. See `studios.md` for the corresponding section in the Studios copy deck.
