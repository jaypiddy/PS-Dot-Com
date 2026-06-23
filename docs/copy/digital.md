# Digital practice

**Route:** `/digital`
**Source HTML:** `PS_Digital_Hub_v1.html` (Claude Design prototype, June 11 2026)
**Last sync commit:** _n/a — page not yet built into the static site_
**Status:** INTERIM

This is interim copy extracted verbatim from the v1 prototype. Lines that conflict with the canon currently shipped on the homepage are flagged in the **Notes & conflicts** section at the bottom. When the page is built into the static site, those conflicts get resolved at the build commit and this file's status moves to LIVE.

The shared chrome (header, takeover menu, footer) on this page will be governed by `_shared.md`. This file covers only the page-specific copy.

---

## Hero

_Identity-first hero. Eyebrow names the practice scope; H1 makes the velocity claim; sub-paragraph qualifies and bolds the AI/senior pairing; two CTAs route to the validator and to a project start._

**EYEBROW:** Digital — product strategy, design & engineering

**H1:** Working software in weeks, not quarters.
_Conflict: current homepage canon reads "not months." See Notes below._

**BODY:** Designers at heart, all the way down to the dev team. **AI does the volume. Senior people make the calls.** MVPs in 4–6 weeks; platforms that hold at enterprise scale.

**CTA (solid):** Validate your idea in 2 minutes →
**CTA (outline):** Start a project

---

## Outcome strip

_The receipts. Four count-up numerals (count-up JS in the prototype), one per stat. No section header on this block — it's a horizontal proof spine._

| Role | Number | Unit | Caption |
|---|---|---|---|
| STAT | 300,000 | + | enrollments in six months — TELUS Rewards |
| STAT | 30 | days | idea to validated proof of concept — Energizer |
| STAT | +40 | % | organic leads — Angel Oak |
| STAT | Best UX | _(no numeric)_ | Vancouver UX Awards — Delta Controls |

_Wording note: the Energizer caption here drops "from" ("idea to validated…") where the homepage proof spine keeps it ("from idea to validated…"). Pick one when both pages ship live._

---

## Offers — "Two ways in"

_Two-up offer grid. Numbered, no icons. Each tile has a number, an offer name, a one-sentence frame, and a CTA._

**H2:** Two ways in

### Offer 01 — Rapid MVP

**NUM:** 01

**H3:** Rapid MVP

**BODY:** A working MVP in 4–6 weeks — pressure-tested before a dollar is committed.

**CTA:** Rapid MVP →

### Offer 02 — Product Design & Engineering

**NUM:** 02

**H3:** Product Design & Engineering

**BODY:** The core practice — platforms and products designed and built by one team, holding at enterprise scale.

**CTA:** The practice →

---

## Validator

_Tool tease. Two-column: argument on the left, faux terminal demonstrating the validator's output on the right. The terminal block is interactive flourish — copy reads as a realistic exchange._

**H2:** Don't take the meeting yet. Take the test.

**BODY:** Run your idea through the MVP Validator — execution risk, scope realism, and technical feasibility, scored against everything we've ever shipped. You'll know what to cut before we ever talk.

**CTA:** Validate your MVP →

### Terminal demo

_Six-line scripted exchange in a monospace block, lines reveal in sequence. Role-coded with a leading icon (`$` prompt, `✓` ok, `▲` warn, `→` signal)._

| Role | Line |
|---|---|
| PROMPT | `$ validate "marketplace app, two-sided, 12-week ask"` |
| OK | `✓ core loop — buildable in scope` |
| OK | `✓ auth + payments — known patterns` |
| WARN | `▲ reviews + messaging — cut from v1, sequence to v2` |
| WARN | `▲ 12 weeks — realistic at 6 with scope above` |
| SIGNAL | `→ signal: build it. smaller, sooner.` |

---

## How we work — "Early and often"

_Two-column band: H2 left, prose right. Body argues the no-account-layer working pattern, ending in a bench/credentials line._

**H2:** Early and often. Sometimes ugly.

**BODY:** You'll see the work in rough cuts, not reveal meetings. Showing you things early — wireframes mid-thought, builds mid-sprint — means we're **never more than one degree off course, and never for long.** No ta-da moments. No surprises in week eleven.

**BODY:** Sprints run AI-assisted and senior-led: the machines draft, the experts decide, and you watch it happen. You work directly with the designers and engineers on your product — there's no account layer relaying messages between you and the people doing the work.

**BODY (bench line):** **The bench:** leadership that shipped for Microsoft, Starbucks, Nike, Nintendo, and Coca-Cola before ever sitting in an agency pitch.

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
- Webflow · Enterprise Partner

_Note: the prototype was authored before the Webflow direction was abandoned. The Webflow line may need to come out when this page is built; the partner tier list more broadly needs verification of current standing before paid reuse._

---

## Closer

_Page-end CTA. H2 reframes deliverable; one-line BODY repositions the role of the input; two CTAs._

**H2:** The roadmap isn't the product.

**BODY:** Bring the idea. In six weeks you'll be testing software, not reviewing decks.

**CTA (solid):** Start a project →
**CTA (tel):** +1 (604) 227-9952

---

## Notes & conflicts

1. **Hero H1: "not quarters" vs canon "not months."**
   The hero on this prototype reads "Working software in weeks, not quarters." Current canon (`home.md`, `article.html`, `_shared.md` taglines, the deck's README) reads "not months." When this page is built, the H1 must become **Working software in weeks, not months.** to stay aligned. The "not quarters" wording is retired.

2. **Energizer caption wording.**
   The outcome strip here reads "idea to validated proof of concept — Energizer." The homepage proof spine reads "from idea to validated proof of concept — Energizer." Standardize on one form when both pages ship.

3. **Partner list.**
   Webflow is named in the partners row. The site has since moved off Webflow to static HTML on Vercel. When this page builds, decide: (a) drop Webflow from the row, (b) keep it as a historical partner credential, or (c) replace with the current actual stack. Plus: all four partner tiers (Contentful Silver, Sanity Agency, Vercel Expert, Webflow Enterprise) need verification before reuse on paid outbound — they appear unflagged in the prototype.

4. **Stats parity with the homepage.**
   The Best UX / Delta Controls stat replaces the "2× Silver ADDY" stat used on the homepage proof spine. Each page should pick the four proof points most relevant to its dialect. Both stats are real; this is a curation choice, not a conflict.

5. **Studios cross-link absent.**
   The prototype has no link out to /studios from this page. The masterbrand-two-doors IA probably wants a seam at the bottom (or in the engine band of the homepage) routing readers across. Decide when the page builds.

6. **Validator linkage.**
   The hero CTA targets `#validator` — an in-page anchor on the Digital hub. If the Validator becomes its own page (likely; the IA's content-blocking doc treats it as an offer), this CTA's destination changes.

7. **AI Content Operations removed.**
   The prototype HTML carries a third offer card titled "AI Content Operations" between Rapid MVP and Product Design & Engineering. JP confirmed on June 23 2026 that this isn't an offering Power Shifter actually has — it appears to have been invented during the Claude Design prototype session and slipped into the v1 file. The deck now lists two offers, the H2 reads "Two ways in," and Product Design & Engineering is renumbered from 03 to 02. Do not reintroduce from the prototype HTML.
