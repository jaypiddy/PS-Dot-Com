# Case study: TELUS & Koodo

**Route:** `/case-telus-koodo` (file: `case-telus-koodo.html`)
**Source HTML:** `case-telus-koodo.html`
**Last sync commit:** `a64031d`
**Status:** LIVE
**Notion mirror:** _will be added when this file's Notion page is created_

The shared chrome (header, takeover menu, footer) on this page is governed by `_shared.md`. This file covers the page-specific copy above the footer: sub-page hero, masthead, dossier with three odometer stats, five-section body, supporting figures and pull quotes, before/after asset block, credentials, next-case teaser, page closer.

This is the first fully built case study; its structure is the template every subsequent case study should follow. The five-section authored structure (brief → challenge → process → solution → outcome) is the canonical case-study spine — the `ps-case-study-writer` skill maintains the editorial rules around it.

---

## Sub-page hero

_50vh sub-hero, same DNA as the article template's hero. Back link to /work; eyebrow names the practice + client; H1 carries the topline outcome; sub-voice gives the qualifying framing; byline strip lists role and category._

**CTA (back):** ← Back to all Work

**EYEBROW:** Digital · TELUS & Koodo

**H1:** One platform that ended USB-stick ordering for a national dealer network

**SUB-VOICE (serif italic, magenta):** Two brands, three dealer audiences, one catalogue dealers adopted and never left.

**MICRO (case-study byline):**

| Role | Field | Value |
|---|---|---|
| ROLE-LABEL | Role | Strategy · UX · UI · Engineering · Analytics |
| SEP | \| | \| |
| CATS | _(category links)_ | Digital |

_Category link routes back to `/work`._

---

## Masthead plate

_Full-width 21:9 image plate below the hero. Same `wframe` pattern as article masthead. Image: `images/telus_catalogue.png`._

**ALT:** _(empty — image is decorative, identity carried by the hero above)_

---

## Dossier

_Composed spec block: 4-fact `<dl>` on the left/top, "The receipts" eyebrow + three odometer-styled stats on the right/bottom. The odometers animate on scroll-in._

### Fact sheet

| Role | DT | DD |
|---|---|---|
| FACT | Client | TELUS & Koodo |
| FACT | Sector | Telecom · Dealer channel |
| FACT | Services | Strategy · UX · UI · Engineering · Analytics |
| FACT | Platform | Responsive web · WordPress · EN / FR |

### Topline stats

**EYEBROW:** The receipts

| Role | Number | Suffix | Caption |
|---|---|---|---|
| STAT | 700 | + | accessory SKUs across two brands, served from one platform |
| STAT | 3 | _(none)_ | dealer audiences — corporate, independent, Koodo — on a single instance |
| STAT | 2,832 | _(none)_ | peak weekly visits · 253 unique, against a few-hundred-location network |

---

## Body — five-section authored structure

_The canonical case-study spine. Five H2s in lowercase + period: `the brief.` → `the challenge.` → `the process.` → `the solution.` → `the outcome.` Two figures, two pull-quotes, one in-the-wild video, one closing argument inside `the outcome.`_

### Lede

**LEDE:** TELUS dealers used to learn about new accessories from a spreadsheet on a USB stick, mailed out monthly. We replaced it with a responsive catalogue — two brands, three dealer audiences — that dealers adopted and never left, and whose UX TELUS later carried into telus.com/shop.

### the brief.

**H2:** the brief.

**BODY:** TELUS and Koodo sell phones, plans, and accessories — but their independent dealers were under no obligation to buy accessories from TELUS. They could source from any wholesaler, and many did, because TELUS made it hard to do otherwise. The merchandising "platform" was a USB stick carrying a flat spreadsheet of 700+ SKUs, updated monthly and physically distributed to a dealer network of a few hundred locations. No promotions. No new-product announcements. No way to see what an accessory actually looked like.

**BODY:** Dealers weren't using it at all, and every accessory bought elsewhere was TELUS revenue walking out the door. Customers were walking too — leaving stores empty-handed when the accessory they wanted wasn't on the shelf. TELUS Customer Solutions engaged Power Shifter to replace the USB platform with something dealers would actually want to use: a browsing and wish-list experience feeding TELUS's existing fulfilment system, built responsive, branded for both TELUS and Koodo, in English and French.

### the challenge.

**H2:** the challenge.

**BODY:** The brief looked light. We told TELUS it wasn't — that far more requirements would surface once we got into discovery — and proposed an agile, prototype-first approach the client wasn't accustomed to. That call proved out fast. A three-week discovery phase of stakeholder workshops surfaced the real shape of the problem: not one audience but three, with sensitive pricing walls between them. Corporate TELUS dealers needed MSRP and a TELUS-branded experience. Independent dealers needed the TELUS experience without MSRP visibility. Koodo dealers needed Koodo inventory, Koodo branding, and MSRP. All three had to be served by a single platform instance — separate builds were off the table — with independent dealers authenticating through their global TELUS dealer IDs via a separate portal.

#### Pull-quote breakout (after the challenge intro)

**EYEBROW:** The constraint

**PULL:** Filtering 700+ SKUs across two brands in responsive web was the *edge of the discipline*.
_("edge of the discipline" rendered in magenta via `span.mag`; pull-quote is decorated with an animated `pull-slash` SVG.)_

**BODY:** Then the wish lists: shared by multiple buyers per dealer location, without duplicate lists and double orders turning into a cost and logistics problem. And one constraint with upside — the Koodo experience would be the first responsive design ever produced for the Koodo brand, setting the precedent for every Koodo channel that followed.

#### Figure 01 (after the challenge body)

- **ALT:** The Koodo-branded accessories catalogue shown on a laptop
- **CAPTION-NUM:** Fig. 01
- **CAPTION-BODY:** Same platform, a different face: the Koodo-branded instance carries its own inventory, pricing, and identity — walled off from the two TELUS audiences on the same build.

### the process.

**H2:** the process.

**BODY:** Agile sprints, prototype first. Getting to a working prototype quickly meant gaps were found and closed while the project moved, instead of surfacing in a string of post-launch releases. The full team — strategy, UX, design, development, analytics — ran in parallel from day one through launch, so newly discovered requirements went straight into the build.

**BODY:** The decision that most changed the client's thinking cost nothing to build: we kept their spreadsheet. TELUS managed the catalogue in Excel, so rather than force a new workflow, we made the spreadsheet the ingestion path for the platform. The team that ran the USB process could run the new catalogue with almost no adjustment — and updating it took less time than before.

### the solution.

**H2:** the solution.

**BODY:** WordPress was chosen for one specific reason: its user management framework gave our technical team the foundation to serve three strictly separated experiences — distinct pricing, inventory, news, and branding per audience — from a single instance, within budget. The data model parsed every SKU, banner, and bulletin to the right audience, and the admin experience was built so one administrator could publish to all three without ever leaking sensitive pricing across the wall.

**BODY:** The catalogue UX took three weeks of hypothesis and testing on the filtering problem alone. The result let a dealer narrow 700+ SKUs to the right accessory in seconds, on a phone, a tablet, or the desktop at the back of the store. The shared wish-list system — built jointly by UX, front-end, and back-end — let multiple buyers per location research, build, and share lists that fed TELUS's fulfilment workflow, with no training and no FAQ required.

#### Figure 02 (after the solution body)

- **ALT:** The responsive filtering experience shown on desktop and phone
- **CAPTION-NUM:** Fig. 02
- **CAPTION-BODY:** The filtering experience: 700+ SKUs narrowed to the right accessory in seconds — phone, tablet, or the desktop at the back of the store.

### the outcome.

**H2:** the outcome.

**BODY:** Adoption was the metric that mattered, and TELUS's own characterization was the one we'd design for again: dealers who switched would not go back, and many stopped ordering elsewhere. The monthly USB cycle — and the structural impossibility of promoting anything on it — was gone. TELUS reported the platform drawing 1,300–1,800 page visits a week at launch, climbing to 2,000–2,200 within months. One week logged 2,832 page visits from 253 unique visitors — against a dealer network of a few hundred locations, each sharing a single login.

**BODY:** Then the outcome nobody scoped: the production quality was high enough that dealers began turning the catalogue around on showroom floors, walking customers through accessories the store didn't stock — saving sales that previously left the building. A back-office tool became customer-facing because it could hold up.

#### In-the-wild video (after the outcome intro)

_Full-bleed video plate with caption + hover-to-play hint. Video: `videos/koodo_loop.mp4`. Poster: `images/koodo.jpg`._

**EYEBROW:** In the wild

**CAPTION:** A back-office tool, now facing the customer — live on the showroom floor.

**MICRO (hover hint):** Hover to play

#### Pull-quote breakout (after the in-the-wild video)

**EYEBROW:** The reach

**PULL:** Work for a few hundred dealers ended up shaping the experience for *millions of TELUS customers*.
_("millions of TELUS customers" rendered in magenta via `span.mag`._

**BODY (end):** The strongest validation came from inside TELUS. Their e-commerce team took the filtering and sorting experience we designed for dealers and leveraged it for telus.com/shop — the consumer storefront.

---

## Graphic assets — before/after + credentials

_Below the body. Two-column before/after card with a magenta-arrow seam, followed by two credential chips. Demonstrates the transformation visually without further prose._

### Before / after

| Role | Label | Caption |
|---|---|---|
| BA | Before | Monthly USB stick, mailed out to every dealer |
| BA | After | Live responsive catalogue on any device |

_Seam between the two columns carries a magenta `→` arrow._

### Credentials

| Role | EK (eyebrow) | Caption |
|---|---|---|
| CRED | A first | First responsive design ever built for the Koodo brand |
| CRED | Adopted | Dealer UX carried into telus.com/shop |

---

## Next case

_Two-card teaser block. Same `.post` component as the homepage Insights block, with the index numerals dropped._

**H2:** Next *case*
_("case" in serif italic + magenta — `em.voice.mag`.)_

### Card 01 — Maple Health

**STREAM:** Digital · Maple Health

**H3:** A triage platform that books the right care in one pass

**MICRO (date):** 2026

### Card 02 — Iron Mountain

**STREAM:** Studios · Iron Mountain

**H3:** "The Summit" — a generative brand film in days, not months

**MICRO (date):** 2026

---

## Page closer

_Magenta CTA band at the foot of the page, above the footer. Same scale as the homepage closer; same H2/sub-voice as the article template._

**H2 (CAPS + SUB-VOICE pair):**
- **CAPS:** Read enough?
- **SUB-VOICE:** Let's build.
_(SUB-VOICE renders as serif italic in magenta — `em.voice.mag`. Identical to `article.md`'s page closer.)_

**BODY:** You'll work directly with the people who make it — no account layer, no game of telephone.

**CTA (solid):** Start a project →
**CTA (tel):** +1 (604) 227-9952

---

## Cross-page canon used on this page

- **Anyone can generate. / Few can direct.** — referenced inside the Iron Mountain next-case card title.
- **Working software in weeks, not months.** — referenced in spirit by the "a generative brand film in days, not months" wording on the Iron Mountain next-case card.

---

## Notes & open calls

1. **Lowercase periodized H2 convention.**
   The five body sections are titled `the brief.` / `the challenge.` / `the process.` / `the solution.` / `the outcome.` — lowercase, ending in a period. This is the case-study spine and is canon, owned by the `ps-case-study-writer` skill. Subsequent case studies follow it without variation.

2. **Two figures, two pull quotes is the upper rhythm.**
   The body carries Fig. 01 (after the challenge body), Fig. 02 (after the solution body), one pull-quote breakout in the challenge section, and one in the outcome section. The in-the-wild video plate is a third "figure" but with its own component class (`cs-kiosk`). Case studies should land in this density range — denser and the spine breaks; sparser and the proof thins out.

3. **The odometer dossier is a topline trio.**
   Three odometer stats sit in the dossier — internally verifiable, not client-reported metrics. The reusable rule is: the dossier carries proof points the agency can defend from build records (SKU counts, audience splits, peak traffic from the analytics we ran) rather than client-attributed business metrics that need approval to cite externally.

4. **Koodo wordmark ambient field — known open bug.**
   The two figure plates (`figure.breakout.fig-tilt`) were intended to carry an animated ambient field of the "koodo" wordmark behind the dark background, matching the slash-field motif. Five rendering approaches have been attempted; only the masthead implementation works reliably. The figure plates currently render the wordmark statically or not at all. Tracked as a standing parking-lot item; the page is live without the animation. See the build journal at commit `5df8022` for the last attempted approach.

5. **The reach pull-quote claim is verifiable.**
   "Millions of TELUS customers" refers to TELUS adopting the filtering UX into telus.com/shop — TELUS's published consumer subscriber count is the supporting claim. Verify before paid outbound reuse of that pull quote.

6. **Next-case teasers point to unbuilt pages.**
   The Maple Health and Iron Mountain teaser cards both target `href="#"`. When those case studies build, repoint the cards. Until then, the teasers are aspirational placeholders — same situation as the cross-links on `work.md`.
