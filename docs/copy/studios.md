# Studios practice

**Route:** `/studios`
**Source HTML:** `studios.html` (built into static site June 23 2026)
**Companion copy doc:** `POWER_SHIFTER_Studios_Copy_v1.md` (v1, June 2026 — supplies voice notes, ledger, and open calls preserved at the bottom of this file)
**Last sync commit:** _set at build commit_
**Status:** LIVE (Blocks 1, 2, 2b, 3, 4, 5b, 8 shipped; Blocks 5, 6, 7 deferred — see Notes 1)

This page was built into the static site June 23 2026 from the interim copy in this file. Open calls noted at the bottom remain open and resolve at follow-up commits. The shared chrome (header, takeover menu, footer) on this page is governed by `_shared.md`. This file covers only the page-specific copy.

---

## Voice for this page

_Excerpted from the companion copy doc; preserved verbatim because it governs every line written for this page going forward._

> This is the Studios dialect: shorter sentences than /digital, more attitude, zero process vocabulary. The reader is a CCO, ECD, or brand lead who has seen a thousand AI demo reels and is waiting to be unimpressed. Every flex on this page is attached to a name, a credit, or a trophy. Tool and vendor names never appear — craft stages do. The pipeline is described at the level of discipline, not stack.

---

## Block 1 — Hero (+ Block 1b showreel theater)

_**Reworked 2026-07-14 (commit `d1ab51f`).** Was a full-bleed autoplay reel background (`.reel-hero`, Pattern G). Now a section-header hero mirroring `/digital`'s `.sub-hero` — slash-field weather, eyebrow, `.rise` headline (the differentiator keeps the late-serif italic `.voice` in magenta via a scoped `.sub-hero h1 .voice` rule; `/digital`'s voice is cream). No hero CTA (matches `/digital`, and the reel now sits right below — see Notes 15/24). The showreel moved OUT of the hero background into a screening **theater** directly below (Block 1b): the `.cs-screening`/`.cs-letterbox` component the film case studies use, as a raw `<video id="reelVideo">` + HLS (not the Stream iframe) so no Cloudflare player logo. Homepage still uses the reel as a hero background — only `/studios` changed._

**EYEBROW:** Studios — generative film, audio & motion

**H1 (one line, `.voice` on the second sentence):** Anyone can generate. _Few can direct._

**BODY:** Power Shifter Studios. Film, audio, and motion on generative pipelines — run by people who came up through ILM, Ridley Scott, and Ogilvy, not a prompt library.

### Block 1b — Showreel theater

_`.cs-screening` → `.cs-meta-strip` (title + format chips) → `.cs-letterbox` (black band, 16:9 reel). Raw `<video>` + HLS (not the Stream iframe) so no Cloudflare logo; native `controls` for playback + volume (`controlslist="nodownload"`), still autoplays muted+loop so it moves on load. Reel UID `5442fab995851e59c1c965023f4f28bc` — a Studios-specific reel (decoupled from the homepage hero reel 2026-07-14; the homepage keeps its own `STREAM.video`, do not re-sync)._

**META TITLE (serif italic):** The Studios reel
**META CHIPS:** Format 16:9 · Pipeline Generative · Cut Summer 2026

---

## Block 2 — Proof bar

_High-contrast strip above the films index. No header. One declarative line of trophies + the qualifying claim._

**STAT (bold):** Two Silver ADDYs, 2026

**BODY:** *The Summit* (Iron Mountain) · *Four Dreams* (Ernest Packaging) — judged against everything, not just the AI category.

_**CONFIRMED 2026-07-14 (JP):** the judging-category claim is verified — the ADDYs were not entered in an AI-specific category, so "judged against everything" stands. Cleared for paid outbound and PR reuse. (Resolved open call — do not re-flag.)_

---

## Block 3 — Films index — "The films"

_Canonical `.work` + `.cards.four-up` + `.card` pattern (reused from `/digital` "Digital, selected" and the homepage "Selected work"), with a `.wcard.feature` hero card on top — ported verbatim from `/work.html`. JP brief June 24 2026: "The design pattern for the film case studies should be the same pattern/component as on the digital page" + "Lets add this exact component from the work.html page below the title WORK and above the rows of films on the studios page." The original Pattern I (featured rows + 4-up grid hybrid) was decommissioned — every grid film is now an equal card. The featured `.wcard.feature` on top serves as the "lead piece" hero treatment for the strongest film (Iron Mountain — The Summit, the ADDY winner). Iron Mountain also stays as card #1 in the grid — deliberate editorial layering: the featured card sells the trophy; the grid card sells the story. See Notes 16 + Notes 17 + Notes 18._

**H2:** The films
**ALL-WORK LINK (`.all swipe`):** See all the work → _(routes to `work.html`; the .swipe JS auto-wraps "work" italic-serif. Copy is "see all the WORK" not "all FILMS" because /work.html is the aggregate index of both Digital and Studios pieces — calling it "all the work" honours that aggregation. See Notes 18.)_

### Featured card — Iron Mountain (`.wcard.feature` from /work.html)

_Hero treatment, 21:9 cinematic frame, paper-on-tint text overlay. Lives between the H2 row and the 4-up grid below. The h2 element comes verbatim from /work.html (work.html's choice) — the section H2 "The films" above is visually larger via the responsive font-size rules so the hierarchy still reads correctly._

**IMAGE:** `images/iron_mountain.jpg` (full-bleed cover, 21:9 aspect on the featured variant)
**H2:** Iron Mountain — *The Summit*
**BODY:** A generative film with a blockbuster look. Silver ADDY, 2026.
**CTA:** Watch the film →
_(Uses `.wgo.swipe` — same .swipe JS auto-wraps "film" italic-serif as on the grid cards below.)_

### Grid (6 films in `.cards.four-up`)

**Layout:** 6 films in a 4-up grid, wrapping to row 1 (4 cards) + row 2 (2 cards + 2 placeholders). Placeholders are invisible `.card.placeholder` divs filling cells 7-8 with the same ink background as real cards, so the 1px line-light gap rhythm stays consistent with /digital's 4-card layout. Ordering: award winners first (mirroring /digital ordering convention), then by ambition not recency.

**Eyebrow `.tag` taxonomy:** Each film carries a short 1-3 word label, optional middle-dot separator. Mirrors /digital's "Platform" / "Rapid MVP" / "Product · Best UX, VUX" / "Web · SEO" pattern. The two ADDY winners do NOT carry the trophy in the tag — the proof bar above (Block 2) already calls out both awards by name, the featured card repeats Iron Mountain's ADDY, and the body line repeats the mention.

**CTA on every card:** Watch the film →
_Uses `.go.swipe`. The same .swipe JS that wraps "case" italic-serif on /digital wraps "film" italic-serif here, with the same magenta swipe-on-hover. All CTAs stub to `#` until film case-study pages exist._

### Card 01 — Iron Mountain

**TAG:** Branded · Live-Action
**H3:** Iron Mountain — *The Summit*
**BODY:** Musicians climb to a summit and discover the power they carried all along: their data. Silver ADDY, 2026.
**CTA:** Watch the film →

### Card 02 — Ernest Packaging

**TAG:** Branded · Character
**H3:** Ernest Packaging — *Four Dreams*
**BODY:** Four surreal dreams brought to life — characters that speak, move, and feel as if they've always existed. Silver ADDY, 2026.
**CTA:** Watch the film →

### Card 03 — Celestial AI

**TAG:** Branded · AI
**H3:** Celestial AI
**BODY:** A story told in light itself — photonic fabric as cinema.
**CTA:** Watch the film →

### Card 04 — The Algorithm Trap

**TAG:** Original · Short
**H3:** The Algorithm Trap
**BODY:** Fast, raw, restless — the endless scroll, mirrored back at itself.
**CTA:** Watch the film →

### Card 05 — Maple Health

**TAG:** Branded · Animation
**H3:** Maple Health
**BODY:** The quiet moments of empathy that define real healthcare, animated.
**CTA:** Watch the film →

### Card 06 — Rapid MVP / Luma

**TAG:** Original · IP
**H3:** Rapid MVP — *Luma*
**BODY:** A brilliant idea left waiting — until it didn't have to be.
**CTA:** Watch the film →

---

## Block 4 — Provenance / credits

_A credits block, not a leadership block. Each entry leads with a square portrait that doubles as a bio-video poster — but with one important difference from typical poster-and-video patterns: the still IS the first frame of the bio video, served via Cloudflare Stream's thumbnail API. No separate portrait files exist in the repo. On rollover the full Cloudflare Stream iframe lazy-loads over the still (see Notes 19 + Notes 20). Name + role + credit line styled like a one-sheet. Bios still live on /about — this is the credit roll, not the team page. Closes with a link out._

**H2:** Directed by people who earned the title

### Credit 01

**PORTRAIT (still):** Cloudflare Stream first-frame thumbnail of the bio video — auto-derived from the UID below, no separate file
**BIO VIDEO (Cloudflare Stream UID):** `5b2c36cd3793f90eafb8e5ae4538c405`
**NAME:** JP Holecka
**ROLE:** Director // Head of Gen AI
**CREDIT LINE:** Little Women · 21 Jump Street · Black Dog Films (Ridley Scott) · ILM, commercial division

### Credit 02

**PORTRAIT (still):** Cloudflare Stream first-frame thumbnail of the bio video — auto-derived from the UID below, no separate file
**BIO VIDEO (Cloudflare Stream UID):** `04d16613add2e8e7f984b9fed118c723`
**NAME:** Johnny Darrell
**ROLE:** Director // Editor
**CREDIT LINE:** Sausage Party: Foodtopia (Amazon) · Cloudy with a Chance of Meatballs (Sony / Lord Miller) · 25 years in CGI and story

### Credit 03

**PORTRAIT (still):** Cloudflare Stream first-frame thumbnail of the bio video — auto-derived from the UID below, no separate file
**BIO VIDEO (Cloudflare Stream UID):** `77ed0d921519c6f587a1821691e583c8`
**NAME:** Russ Jarman Price
**ROLE:** Chairman
**CREDIT LINE:** Ogilvy London, Creative Partner · Ogilvy Caribbean, Chairman

**CTA (block footer):** Meet the whole team →
_(Routes to `/about`.)_

---

## Block 2b — The roster

_Logo-roster trust signal — direct reuse of `.proof-spine` pattern shipped on `/digital` June 23 2026. Pairs with Block 2's award/film proof bar as the second social proof surface: Block 2 is "what we won and what we made"; Block 2b is "who trusts us." The Studios voice spec ("Every flex attached to a name, a credit, or a trophy") fits a logo-roster cleanly — each logo IS a name-attached flex. Lift the HTML + CSS directly from `digital.html` when this page builds. Position: between Block 4 (Credits above) and Block 5b (One-two punch below). Moved here June 24 2026 per JP — editorial sequence now reads work → people → who trusts those people → how we work. See Notes 15._

**EYEBROW:** The roster

**LOGO GRID (9 logos, 3x3 — same as `/digital` and homepage):**

| Row 1 | Row 2 | Row 3 |
|---|---|---|
| Telus | Energizer | Lululemon |
| Deloitte | KPMG | Grammarly |
| Akamai | Iron Mountain | Canucks |

_Same 9 logos across all three surfaces (homepage proof spine, `/digital` roster, `/studios` roster). Roster includes both Digital clients (TELUS, Deloitte, KPMG, Grammarly, Akamai) and Studios-relevant clients (Iron Mountain — "The Summit" film; Energizer; Lululemon; Canucks). The cross-practice mix is intentional — one masterbrand, two doors._

---

## Block 5 — How it's made — "The pipeline is new. The discipline isn't."

_Process band. H2 + body argument, then a three-state stills strip (board → generation → final), one shot, three states. Process film replaces the strip when produced._

**H2:** The pipeline is new. The discipline isn't.

**LEDE:** Every film here starts the way films have always started: a script, a board, a director with an opinion. Then the generative tracks run — performance, environment, motion, sound — with a human making the call on every frame that survives. **The machines produce volume. The edit is where the taste lives.** That's why the work holds up at broadcast scale instead of falling apart at second glance.

### Process stills strip

| Role | Number | Label | Sub-label |
|---|---|---|---|
| STATE | 01 | Board | one shot |
| STATE | 02 | Generation | same shot |
| STATE | 03 | Final | same shot |

_No tool names in any of these labels. Discipline language only._

---

## Block 5b — How we work — the one-two punch

_Two-module one-two punch — same framework as `/digital` (Early & Often + Direct-to-Expert), but the body copy is reworked for Studios voice with a film-discipline twist (June 23 2026 — see Notes 13). Module 1 runs the canonical 5fr/7fr `.engine` layout; Module 2 runs mirrored 7fr/5fr via `.engine.mirror`. Pattern E shapes lifted from `/digital`; copy diverges. H2s stay verbatim — they're the framework anchors that read true for either practice._

### Module 1 — Early & Often

**H2:** Early and often. *Sometimes ugly.*

**BODY:** You'll see the work while it's still changing: rough boards, generative drafts mid-thought, cuts mid-grade.

**BODY:** That keeps us close to the cut and able to **fix a shot before it becomes a reshoot.**

**BODY:** No ta-da reveals. No polished surprise at picture lock. Just visible progress, sharper notes, and a film that gets better because you saw it early enough to shape it.

### Module 2 — Direct-to-Expert

**H2:** *Expertise compounds.*

**BODY:** You are the experts in your brand. We are the experts in turning impossible boards into films that hold at broadcast scale.

**BODY:** Put the right people in the same room and progress compounds. You work directly with the directors, editors, and the leads shaping the look. **No account-layer relay. No notes via PM.**

**BODY:** Your brand. Our craft. One team. The film gets there sooner.

**Voice note for Studios (updated June 23 2026):** the previous brief called this block "universal across both practices and ships unchanged." JP overrode that — the two-module framework is the shared canon, but the body copy reads better through film-discipline vocabulary. The translation map: `rough cuts → rough boards` · `wireframes mid-thought → generative drafts mid-thought` · `builds mid-sprint → cuts mid-grade` · `correct course before a small miss → fix a shot before it becomes a reshoot` · `polished surprise in week eleven → polished surprise at picture lock` · `complex digital problems / products people want to use → impossible boards / films that hold at broadcast scale` · `strategists, designers, and engineers doing the work → directors, editors, and the leads shaping the look` · `game of telephone → notes via PM` · `the right problem sooner → the film gets there sooner`. The Studios voice spec ("Every flex attached to a name, a credit, or a trophy") doesn't apply here — these modules describe how the work happens, not what was won; the flex-with-a-name beats live in Blocks 2, 3, and 4 instead.

---

## Block 6 — What we make

_Four-up service list. One sentence each, no icons._

**H2:** What we make

### Service 01

**H3:** Branded film & storytelling

**BODY:** Commercials and brand films with a cinematic spine — built for broadcast, digital, and social.

### Service 02

**H3:** Generative audio & voice

**BODY:** Custom voice, music, and sonic identity that's designed, not stock.

### Service 03

**H3:** Visual & motion production

**BODY:** Campaign-ready visuals, motion graphics, and animation at a pace traditional production can't quote.

### Service 04

**H3:** IP & character development

**BODY:** Original worlds, characters, and narrative IP — prototyped in days, built to scale across formats.

---

## Block 7 — For agencies

_The one paper-thin moment. Section header, single paragraph, CTA. Discreet positioning for agency-of-record work._

**H2:** We also work behind other people's curtains

**BODY:** Agencies and in-house teams bring us in two ways: as a production partner on work that carries their name, and as advisors on building generative pipelines of their own — workflow, ethics, and what to stop paying for. Discreet either way. Ask Toronto.

**CTA:** Talk to the studio →

_Open call: "Ask Toronto" is a flex on the Leo Burnett relationship without naming a client who hasn't approved attribution. If the relationship formalizes into a referenceable engagement, name it. If it's too coy, cut the sentence — the block stands without it._

---

## Block 8 — Closer

_Page-end CTA. H2 reframes the budget vs idea constraint; BODY summarizes; CTA._

**H2:** Bring the board you were told was unshootable.

**BODY:** The budget used to be the ceiling. Now it's the idea.

**CTA:** Start a film →

---

## Cross-page canon used on this page

- **Anyone can generate. / Few can direct.** — page H1 (also the Studios door lede on the homepage).

---

## Page metadata (from companion doc)

_Preserved verbatim; will be implemented in the page `<head>` and OG tags when built._

- **Title:** Power Shifter Studios — Generative Film, Audio & Motion | Vancouver
- **Meta description:** Anyone can generate. Few can direct. Cinematic film, audio, and motion on generative pipelines — from directors who came up through ILM, Ridley Scott, and Ogilvy. Two Silver ADDYs, 2026.
- **OG title:** Power Shifter Studios — Anyone can generate. Few can direct.
- **OG description:** Generative film with thirty years of set discipline behind it.
- **OG image:** Frame grab from *The Summit*, not a graphic.

---

## Notes & open calls

_Carried from the companion copy doc; resolve before this page goes LIVE._

### Retired lines

- **"Bold, cinematic content for brands that won't wait."** — old positioning; speed claim now lives in the homepage closer. Do not bring it back on /studios.

### Ledger additions (lines locked to this page)

| Line | Lives at | Never used for |
|---|---|---|
| Directed by people who earned the title | /studios credits header | Taglines, Digital contexts |
| The pipeline is new. The discipline isn't. | /studios process block; eligible for talks/decks | Homepage |
| Bring the board you were told was unshootable. | /studios closer; eligible for outbound to CDs | Digital contexts |

### Open calls to resolve before build

1. **"Ask Toronto"** — in or out, pending the Leo Burnett relationship's referenceability. If the relationship formalizes, name it; if it stays informal, cut.
2. ~~**ADDY judging-context claim** — verify category before "judged against everything" ships in the proof bar.~~ **RESOLVED 2026-07-14 (JP): confirmed, not an AI-specific category. The qualifier stands and is cleared for paid reuse.**
3. **Film ordering** — award-first proposed; override if a stronger opener exists in the unreleased pipeline. Akamai, when public, likely takes slot one.

### Dependency on /about

The full bios for all six leads (Eilish, Ted, Cary, JP, Johnny, Russ) consolidate on /about — single grid, practice tags, the one-team statement. The W+K / Goodby positioning resolves there in prose. /digital optionally carries a one-line senior-bench strip (Microsoft · Starbucks · Nike · Nintendo pedigree), no faces.

---

## Build notes

_Append-only. New notes added at the bottom; references in the codebase cite by note number._

1. **Initial /studios build — spine commit (June 23 2026).**
    Built into the static site at `studios.html` based on the chrome lifted verbatim from `digital.html` (head + header + takeover menu + footer + scripts). The base CSS, typography, color tokens, and reusable patterns (`.proof-spine`, `.engine` + `.engine.mirror`, `.page-closer`) come along with the clone — orphan CSS from `/digital`-specific patterns (`.sub-hero`, `.validator-band`, `.terminal`, `.offers-section`, etc.) currently rides along unused. Acceptable for the static prototype phase; clean up in a follow-up commit if size or maintainability becomes an issue.

    **Blocks shipped:** 1 (Hero — `.sub-hero`, reworked 2026-07-14 `d1ab51f`; originally Reel hero / Pattern G), 1b (Showreel theater — `.cs-screening`/`.cs-letterbox`, added 2026-07-14), 2 (Proof bar, Pattern H), 2b (The roster — reuse of Pattern F from `/digital`), 3 (Films index, Pattern I), 4 (Credits one-sheet, Pattern J), 5b (One-two punch — reuse of Pattern E from `/digital`), 8 (Closer — reuse of `.page-closer` with Studios copy).

    **Blocks deferred:** 5 (How it's made — needs three generated stills for Board / Generation / Final states; the lede ships but the visual strip can't), 6 (What we make — services 4-up text grid), 7 (For agencies — pending the "Ask Toronto" / Leo Burnett referenceability resolution).

    HTML comments inside `studios.html` mark each deferred block's insertion point so the follow-up commits are surgical inserts, not restructures.

2. **Reel hero video — using the homepage hero reel UID.**
    **⚠️ SUPERSEDED 2026-07-14 (`d1ab51f`):** Block 1 is no longer a reel-hero. The hero is now a `.sub-hero` (no background video) and the reel plays in a `.cs-screening`/`.cs-letterbox` theater below it (Block 1b) as a raw `<video id="reelVideo">` + HLS — not an iframe — so there is no Cloudflare player logo. The reel UID is now `5442fab995851e59c1c965023f4f28bc` — a Studios-specific reel (was `4616f42a…`, itself swapped 2026-07-13 off `dcde8adc…`); **decoupled from the homepage hero reel 2026-07-14**, so the homepage and Studios reels no longer track each other. The original note below is preserved for history.
    The reel-hero `<iframe>` (Block 1, Pattern G) points to Cloudflare Stream UID `dcde8adcb14fb52708c8ce6cf631658f` — the same UID that drives the homepage hero reel. This is intentional, not a placeholder: the homepage reel IS the Studios reel (it's the masterbrand showcase of Studios work). If a `/studios`-specific reel gets cut later, swap the UID via `str_replace` on the iframe `src`; everything else stays. Customer subdomain `customer-xv1aafyshr3tbknu.cloudflarestream.com` per `docs/VIDEO_PIPELINE.md`.

    Iframe query string: `?muted=true&autoplay=true&loop=true&controls=false&preload=auto`. Standard background-video parameter set. Browsers require `muted=true` for autoplay to succeed without user interaction.

3. **Hero H1 voice treatment.**
    Two-line H1: `Anyone can generate.` (display weight, paper color) over `Few can direct.` (serif italic via `em.voice`, magenta). The italic line is the differentiator — same pattern the homepage uses for the Studios door lede. Both lines render as `<span>` children inside `<h1>` with `display:block` for the line break; `<br>` would have worked too but `<span>` lets the CSS hook line-by-line if needed later (separate animation timing, asymmetric letter-spacing, etc.).

4. **Films index — "Watch" CTAs route to "#".**
    All six `Watch →` links in Block 3 route to `#` because none of the films have case-study pages yet. Same status as `/digital`'s Selected Work (3 of 4 cards still route to `#`, only Koodo links to a real case study). Pattern: when individual film case-studies build, swap the `href="#"` to the case-study URL via `str_replace` per film. Iron Mountain and Ernest are highest priority since they're the award winners and the featured rows.

5. **Films index — poster-only, no inline video loops in this commit.**
    Each film tile uses its uploaded poster image from `/images/<slug>.jpg` (sourced June 2026: `iron_mountain.jpg`, `ernest.jpg`, `celestial.jpg`, `algorithm_trap.jpg`, `maple_health.jpg`, `rapid_mvp.jpg`). Inline video previews (the `.work` `.media + <video>` pattern from `/work`) are a follow-up — they require encoding each film to muted-loop MP4 + WebM, generating frame-0 posters, and uploading to `/videos`. The play badge (`.film-play`) sits on the poster image as a visual affordance for the future video-on-hover behavior.

6. **"Judged against everything" claim — UNVERIFIED. (Open call carried.)**
    **RESOLVED 2026-07-14 (JP): confirmed.** The Block 2 proof bar's qualifying line `judged against everything, not just the AI category` is verified — the ADDYs were not entered in an AI-specific category. The qualifier stands as shipped and is cleared for paid outbound, PR pitch, and production publish. (Original open call from the `studios.md` brief; kept here for provenance — do not re-flag as unverified.)

7. **Roster — direct paste from `/digital`, identical 9-logo set.**
    Same 9 logos, same widths, same `.proof-spine` + `.logos` + `.cell` + `.logo-mask` HTML structure as `/digital` line ~992. The roster's cross-practice mix (Telus, Deloitte, KPMG, Grammarly, Akamai → Digital; Iron Mountain, Energizer, Lululemon, Canucks → Studios-adjacent) is intentional per the one-masterbrand-two-doors IA. If a Studios-specific subset is wanted later, override the 9 logos in this file's HTML and update the roster grid; the underlying CSS doesn't need to change.

8. **Credits CTA `Meet the whole team →` routes to "#".**
    `/about` isn't built yet. When `about.html` ships, swap the `href="#"` on `.credits-cta` to `about.html`. Carried as a pending cross-page rewire item alongside the takeover menu link 05.

9. **Takeover menu link 03 (Studios) still points to `index.html#studios`.**
    Per the existing convention on `/digital` (where link 02 still points to `index.html#digital` rather than `digital.html`), the takeover menu on `/studios` ships unchanged. The full cross-page takeover rewire — pointing 02 → `digital.html` and 03 → `studios.html` on every page — is a single dedicated commit that will touch all built pages at once. Carried in the `/digital` Notes 12 parking lot.

10. **Closer H2 voice line — `unshootable` in magenta italic.**
    Block 8's H2 carries the serif italic + magenta treatment via `em.voice.mag` on the word `unshootable.` — same dual-class pattern as `/digital`'s closer (`em.voice.mag` on `Bring the idea.`). The body line below (`The budget used to be the ceiling. Now it's the idea.`) sits in plain prose. CTA copy: `Start a film →` (not `Start a project →` — Studios-specific). Phone number identical to `/digital` — one masterbrand, one phone.

11. **Orphan CSS riding along from `/digital` clone.**
    The full CSS block from `digital.html` was copied with the clone, which means `studios.html` carries definitions for patterns it doesn't use: `.sub-hero` (paper hero variant), `.sub-voice`, `.validator-band`, `.terminal`, `.offers-section`, `.partners-strip`, `.cards.four-up`, `.work` grid styles, and others. The rules don't render because no HTML elements reference them, but they add page weight. **Acceptable for now** — each page is intentionally self-contained, and the prototype phase prioritizes pattern propagation over byte-trimming. Clean up in a maintenance commit later, or once a shared `assets/css/site.css` is introduced.

12. **New patterns this build added to the system (audit doc).**
    Four new patterns documented in `docs/design-system-audit.md`:
    - **Pattern G — `.reel-hero`:** full-bleed Cloudflare Stream video background with overlaid H1 + body + scroll prompt. ~~Studios Block 1.~~ **Retired on `/studios` 2026-07-14 (`d1ab51f`)** — the page now uses `.sub-hero` + a `.cs-screening` reel theater (Block 1/1b). Pattern G is no longer used anywhere on the site; the CSS was removed from `studios.html`. Kept in the catalog for history / possible future reuse.
    - **Pattern H — `.proof-bar`:** single declarative trophy line on ink background, between hero and roster. Studios Block 2. Distinct from `.proof` (multi-stat outcome strip) and from `.proof-spine` (logo grid).
    - **Pattern I — `.films` + `.film-featured` + `.film-card` + `.film-grid`:** featured-row + 4-up-grid film index. Studios Block 3. The featured rows use a 7fr/5fr media+meta split; the grid is the standard 4-up below a horizontal rule. Reusable for any future media-index page (case studies, podcast episodes, etc.).
    - **Pattern J — `.credits` + `.credit-card`:** name + role + credit-line one-sheet in a 3-up grid. Studios Block 4. Reusable on `/about` if that page wants a credits-style format for a particular team subset, but the canonical `/about` is a full bio grid (not this).

13. **Block 5b — film-twist copy override (June 23 2026).**
    The initial /studios build (commit `d654459`) shipped Block 5b as a direct paste of the /digital copy, per studios.md's earlier voice note calling the modules "universal across both practices and ships unchanged."

    JP overrode that on review: "We can have the same early and often and direct to expert section with a generative film twist." The framework (Early & Often + Direct-to-Expert as the two working principles) stays — those concepts are shared canon. The body copy is now Studios-specific film-discipline language.

    **Translation map** (for future cross-page sync, and so the same move can be made if a third practice ever ships its own version):

    | /digital | /studios |
    |---|---|
    | rough cuts | rough boards |
    | wireframes mid-thought | generative drafts mid-thought |
    | builds mid-sprint | cuts mid-grade |
    | correct course before a small miss becomes an expensive one | fix a shot before it becomes a reshoot |
    | polished surprise in week eleven | polished surprise at picture lock |
    | complex digital problems | impossible boards |
    | products people want to use | films that hold at broadcast scale |
    | strategists, designers, and engineers doing the work | directors, editors, and the leads shaping the look |
    | game of telephone | notes via PM |
    | Your expertise. Ours. | Your brand. Our craft. |
    | solving the right problem sooner | The film gets there sooner |

    **H2s stay verbatim.** "Early and often. *Sometimes ugly.*" and "*Expertise compounds.*" read true for either practice; they're the anchor labels, not the argument. Diverging them would lose the masterbrand seam between the two doors.

    **Anchors stay the same** — `#how-we-work` and `#direct-to-expert` match `/digital`. Intentional: a visitor coming from the homepage's two-doors block to either practice page lands at the same anchor for the same conceptual section, even though the copy is tuned to the practice.

    **Voice spec override.** The Studios voice spec ("Every flex attached to a name, a credit, or a trophy") doesn't apply to these two modules — they describe how the work happens, not what was won. The flex-with-a-name beats live in Blocks 2 (proof bar — Two Silver ADDYs), 3 (films index — each film tied to a client and a title), and 4 (credits — three named directors with on-the-record credit lines). Block 5b is the working-principles interlude between the proof stack and the closer.

14. **Block 4 — portraits added (override of original "no portraits" brief, June 24 2026).**
    The original Block 4 brief (carried in this file) called for "no portraits, no bios; full bios live on /about" — a credits one-sheet styled like a film credit roll, text-only. JP overrode that: "Let's put placeholder images for JP, Russ, and Johnny."

    **What shipped:** three placeholder portrait JPGs at `images/portraits/{jp,johnny,russ}.jpg` (800×800, paper-toned background with display-weight initials and a small "PORTRAIT" caption under a centered rule). Each card now leads with a square portrait above the name/role/credit-line.

    **Visual change to Pattern J:** the 1px ink rule that used to sit on `.credit-card`'s `border-top` (above the name in the text-only version) moved to `.credit-name`'s `border-top` — so the rule now sits between the portrait and the name. The one-sheet credit-block visual signature is preserved (portrait → ink rule → name → role → credit-line) instead of stranding the rule above the photo.

    **Mobile behavior:** at ≤880px the grid collapses to 1-column with `.credit-portrait{max-width:360px}` so the portraits don't stretch full-width on phones — keeps them legible at a thumbnail-headshot scale, not a poster scale.

    **Carried parking-lot item:** replace the three placeholders with real headshots once shot. Same aspect ratio (1:1), same paths. Drop-in `str_replace` per file or just overwrite the JPGs at the same path. Until then the placeholders read as intentional (paper bg + bold initials + "PORTRAIT" caption) rather than broken.

    **Bios still on /about.** The Block 4 footer CTA `Meet the whole team →` still routes to /about (currently stubbed to `#`); this is the credit roll, not the team page. Pattern J's "credits one-sheet" identity holds — the override added the portrait slot, not the bio slot.

15. **Reel-hero button standardized + roster relocated (June 24 2026).**

    **Button vocabulary.** _(Moot since 2026-07-14 `d1ab51f`: the hero CTA was removed entirely in the `.sub-hero` rework — the reel now sits directly below the hero, so a "Watch the work →" pre-driver is redundant. History preserved.)_ The reel-hero scroll-prompt button was originally styled with a custom `.reel-scroll` class — uppercase, .14em letter-spacing, .28-alpha border. That diverged from the site's canonical button vocabulary (`.btn` + `.cascade` modifier) used on the homepage Digital/Studios pair and on every page-closer ("Start a project" on `/digital`, "Start a film" on `/studios`). JP's call on review: one button vocabulary, not two.

    Swapped to `<a class="btn cascade" href="#films">Watch the work →</a>`:
    - **Class**: `.btn cascade` (outline variant — paper border on dark video background, transparent fill)
    - **Arrow**: `→` instead of `↓` so the `.cascade .ar` hover animation (translateX 5px + magenta color) makes visual sense — the right-arrow translating right is the canonical interaction; a down-arrow translating right would have read broken
    - **Animation timing**: preserved the .7s settle-in delay via a new `.reel-hero .btn` rule so the button still lands after H1 (.2s) and body (.45s) in the hero sequence
    - **Hover behavior**: the cascade letter-roll and arrow slide both come along for free from the global `.cascade` rules — no extra wiring

    The scroll-down semantics still hold via the `href="#films"` anchor + the button's position at the bottom of the hero. JP confirmed `→` over `↓` is the right call — visual style consistency outweighs the strict UX literalism of the down-arrow.

    **Roster relocated (Block 2b → after Block 4).** The roster was originally between Block 2 (proof bar — trophies) and Block 3 (films — the work). New position: after Block 4 (credits — the directors) and before Block 5b (one-two punch — how we work). New editorial sequence:

    ```
    hero → trophies → work → people → who trusts those people → how we work → CTA
    ```

    The roster reads more powerfully after the directors are introduced — "here's who runs this; here's who hires them" is a stronger logical seam than "here's our trophies; here's our roster; here's the work" which front-loaded all the social proof before any of the work was shown. The HTML section order, the studios.md heading order, and the HTML comment on the .proof-spine section were all updated to match.

    **Block name stays "2b"** even though it's no longer adjacent to Block 2. Renaming would invalidate every existing reference in the notes, comments, and audit doc; the "2b" is a stable identifier now, not a positional one.

    **No copy changes** — the roster's eyebrow ("The roster") and 9-logo grid are unchanged. The cross-practice mix (Digital + Studios clients combined) still holds per the one-masterbrand-two-doors IA.

16. **Films index swapped to canonical `.work` pattern (June 24 2026).**

    **JP brief.** "The design pattern for the film case studies should be the same pattern/component as on the digital page." Direct quote on review of Pattern I (the custom featured+grid hybrid I'd shipped on the initial /studios build).

    **What was decommissioned.** Pattern I in the audit doc — a Studios-only pattern with:
    - Two featured rows for ADDY winners: 7fr media + 5fr meta side-by-side, full-width
    - 4-up grid for the remaining four films below
    - Custom award eyebrow (`.film-award` magenta uppercase)
    - Custom play badge (`.film-play` circular icon on each tile)
    - Custom CTA styling (`.film-cta` border-bottom underline)
    - ~38 lines of CSS

    All of that diverged from the canonical work-grid component used on `/digital` "Digital, selected" and the homepage "Selected work."

    **What replaced it.** Direct reuse of `.work` + `.cards.four-up` + `.card` (the canonical pattern). All CSS for this pattern already lives in studios.html (came along with the digital.html clone). Zero new CSS needed for Block 3 itself — just the markup swap. Pattern I CSS rules removed entirely.

    **Component anatomy** (matches /digital exactly):

    ```
    .work                       ← dark ink band, padded
      .wrap
        .head                   ← H2 + "See all the work →" link, flex baseline
          h2.rise               ← display weight, serif italic via .swipe
          a.all.swipe           ← "See all the work →" (work auto-italicized)
        .cards.four-up.reveal   ← 4-column grid, 1px line-light gaps
          a.card                ← each film (ink bg)
            .frame              ← 16:10 aspect image
            .meta
              .tag              ← eyebrow (uppercase, .12em tracking)
              h3                ← display weight, <i>...</i> for italic film name
              p                 ← body line, .72-alpha paper
              .go.swipe         ← "Watch the film →" (film auto-italicized)
    ```

    **Six films, 4-up grid.** Wraps to row 1 (4 cards) + row 2 (2 cards + 2 placeholders). Two `<div class="card placeholder" aria-hidden="true"></div>` fill cells 7-8 — they inherit the .card ink background so empty cells don't expose the .cards parent's line-light gap color, and the 1px gap-line rhythm stays consistent with /digital's 4-card layout. Single CSS rule for the placeholder: `.work .card.placeholder{pointer-events:none;padding:0}`.

    **Eyebrow `.tag` taxonomy.** Each film carries 1-3 word category labels, mirroring /digital's tag pattern ("Platform" / "Rapid MVP" / "Product · Best UX, VUX" / "Web · SEO"). Choices:

    - Iron Mountain — *The Summit*: `Branded · Live-Action`
    - Ernest Packaging — *Four Dreams*: `Branded · Character`
    - Celestial AI: `Branded · AI`
    - The Algorithm Trap: `Original · Short`
    - Maple Health: `Branded · Animation`
    - Rapid MVP — *Luma*: `Original · IP`

    The two ADDY winners deliberately do NOT carry "ADDY 2026" in the tag — the proof bar at the top of /studios (Block 2) already names both films and both awards; the body line on each ADDY card repeats "Silver ADDY, 2026." for the second mention. Putting the same award in three places would dull the flex.

    **CTA "Watch the film →"** uses `.go.swipe`. The .swipe JS at the bottom of studios.html (came along with the /digital clone) wraps the last word ("film") in `<span class="hl">` — italic-serif Late Serif at 1.18em, with the magenta box that swipes in on hover. Direct mirror of /digital's "Read the *case* →" treatment (where "case" is italic-serif).

    **Italic film names in `<h3>`** via `<i>...</i>` — "Iron Mountain — `<i>`The Summit`</i>`", "Ernest Packaging — `<i>`Four Dreams`</i>`", "Rapid MVP — `<i>`Luma`</i>`". Same `<i>` treatment used on the homepage Iron Mountain card (precedent at `index.html:569`). The `.card h3 i` rule renders these in serif italic regardless of bg.

    **All Watch links stub to `#`** until film case-study pages exist. Same status as /digital Selected Work — only TELUS Koodo links to a real case study; the other three /digital cards stub. Six film case-study pages remain on the parking lot — Iron Mountain and Ernest are the highest priority once their stills and offline cuts are exported.

    **"See all the work →" link** routes to `work.html`. Aggregate index of all Digital + Studios projects (22 currently). The copy says "see all the WORK" not "all FILMS" because /work.html is the aggregate — calling it "all the work" honours that aggregation. /digital uses "All work →" with the same destination; the slightly longer phrasing on /studios is deliberate (see Notes 18). Filtering /work for films-only is a future improvement (parked).

    **Why this is the right move.**
    - One masterbrand, two doors — and one component vocabulary across both
    - Visual rhythm of /digital's 4-up grid carries directly: same ink band, same gap lines, same italic-word CTAs, same tag scale and tracking
    - Films now read as work-of-equal-stature with Digital projects (not as a separate visual category that requires a different mental parse)
    - The award winners' status is communicated through copy (eyebrow + body + Block 2 proof bar above) rather than through structural prominence — which is the editorial choice the /digital page also makes (TELUS Rewards isn't structurally larger than Angel Oak; its impact is communicated in the copy)

17. **`.wcard.feature` hero card added above the grid (June 24 2026).**

    **JP brief.** "Lets add this exact component from the work.html page below the title WORK and above the rows of films on the studios page." Posted with a screenshot of the Iron Mountain — The Summit featured card from /work.html showing the 21:9 cinematic frame, "Iron Mountain — *The Summit*" h2, "A generative film with a blockbuster look. Silver ADDY, 2026." body, and "Watch the *film* →" CTA with the magenta swipe-on-hover italic-word treatment.

    **What it is.** The `.wcard.feature` component from /work.html — the same hero-row treatment that promotes Iron Mountain to the top of the work-grid index. Distinct from the canonical `.card` grid cards in /digital "Digital, selected" — the `.wcard.feature` is a single full-width hero with image-as-background and overlaid text (`.wcard-overlay` with `.wtint` gradient for legibility), versus `.card` which is a stacked image-then-meta layout.

    **Why it's not a contradiction with Notes 16.** Pattern I (decommissioned in Notes 16) was a custom-built featured+grid hybrid. The `.wcard.feature` here is direct reuse of an existing site component from /work.html — not a new pattern. The decommission rule was "one masterbrand, one component vocabulary"; reusing the /work.html hero card honors that rule by pulling from existing site CSS rather than inventing parallel styling.

    **CSS ported.** From `work.html` lines 356-393, with one tweak: the `.work .` selector prefix (so the rules only apply inside Block 3's `<section class="work">`, not site-wide — keeps the namespace tidy). Eleven rules total:
    - `.work .wcard` — flex column container
    - `.work .wframe` — base 16:9 image frame
    - `.work .wcard.feature .wframe` — overrides to 21:9 cinematic on the featured variant
    - `.work .wtint` — gradient overlay (transparent → ink 72%, bottom-up)
    - `.work .wcard-overlay` — absolute-positioned bottom-anchored text container
    - `.work .wcard-overlay h2` — display weight + italic name via `<i>`
    - `.work .wcard-overlay h2 i` — serif italic for film name
    - `.work .wcard-overlay p` — paper-78%-alpha body
    - `.work .wgo` — base CTA styling (font-weight 700, .04em tracking)
    - `.work .wcard-overlay .wgo` — color override for paper-on-tint

    Added one additional rule on `.work .wcard`: `margin-bottom:clamp(40px,5vh,72px)` so the featured card has breathing room above the grid below.

    **HTML markup** (verbatim from /work.html line 615-625, with `.reveal` added for scroll animation):

    ```html
    <a class="wcard feature reveal" data-cat="studios" href="#">
      <div class="wframe">
        <img src="images/iron_mountain.jpg" alt="..." style="width:100%;height:100%;object-fit:cover">
        <div class="wtint"></div>
        <div class="wcard-overlay">
          <h2>Iron Mountain — <i>The Summit</i></h2>
          <p>A generative film with a blockbuster look. Silver ADDY, 2026.</p>
          <span class="wgo swipe">Watch the film →</span>
        </div>
      </div>
    </a>
    ```

    Placement: between the `.head` div (H2 "The films" + "See all the work →") and the `.cards.four-up` grid. No layout container around it — just a direct child of `.wrap`.

    **Iron Mountain appears TWICE on the page.** Once in the featured hero card on top, once as card #1 in the 4-up grid below. Different body copy by design:
    - Featured: "A generative film with a blockbuster look. Silver ADDY, 2026." — sells the trophy
    - Grid #1:  "Musicians climb to a summit and discover the power they carried all along: their data. Silver ADDY, 2026." — sells the story

    Editorial layering is intentional — the featured card is the magazine cover for the lead piece; the grid card is the table-of-contents entry. The two pieces of copy do different jobs.

    **Hierarchy note.** The featured card uses `<h2>` (verbatim from /work.html). The section's H2 "The films" above is visually larger via responsive font-size rules (`clamp(36px,4vw,60px)` for `.work h2` vs `clamp(22px,2.4vw,36px)` for `.wcard-overlay h2`), so the visual hierarchy reads correctly even though both are technically h2 elements. SEO/accessibility-strict would prefer the featured card to be h3 (subordinate to section h2); the current state honors JP's "exact component" brief over the semantic preference. Easy follow-up if it becomes a concern.

    **Audit doc.** Pattern K added (the `.wcard.feature` hero card from /work.html, now also used on /studios Block 3).

18. **Block 3 H2 + CTA copy update (June 24 2026).**

    **JP brief.** "Now, let 'The work' to 'The films', keeping the CTA to the right, 'See all the work' as it is an aggregate of work and films."

    Two small copy changes on Block 3:

    | Element | Before | After |
    |---|---|---|
    | H2 | The work | The films |
    | All-work link | All work → | See all the work → |

    **Rationale on H2.** "The work" was inherited from the /digital pattern where the section is the studio's catch-all work showcase. On /studios specifically, every card IS a film — saying "The films" is more precise and honours the Studios voice ("every flex attached to a name, a credit, or a trophy"). "The work" reads as generic; "The films" reads as a curated craft category.

    **Rationale on CTA.** The CTA still routes to `work.html` (the site-wide aggregate of Digital + Studios projects, 22 currently). The previous "All work →" copy matched /digital's CTA exactly. JP's call: on /studios, where the section above is now "The films," a CTA saying "All work →" creates a small but real semantic mismatch — "all" of what? "The films" suggests this section IS all the films, so "All work →" reads ambiguously.

    The new "See all the work →" copy fixes both:
    - "see all the WORK" not "all FILMS" — because /work.html is the aggregate of Digital + Studios pieces, not a films-only filter. Calling it "all the work" honours that aggregation.
    - The longer phrasing creates a clearer semantic seam — "this is the films section; for everything else, see all the work."

    **Side-effects of the copy change.**

    - The `.swipe` JS still auto-wraps the last word ("work") in italic-serif. "See all the *work*" reads as the same italic-serif final-word treatment, just preceded by "See all the" instead of "All." Cascade hover animation, magenta swipe, and arrow translation all unchanged.
    - /digital still uses "All work →" — the two pages now have slightly different aggregator-link phrasing. That's deliberate: /digital's section is "Digital, selected" (filtered subset, not a category), so "All work →" reads as "for everything else" naturally. /studios' section is "The films" (a category in itself), so the longer copy creates the semantic seam.
    - The font-size, letter-spacing, border-bottom, and color-on-hover rules on `.all.swipe` are unchanged — the visual treatment is identical, just two more words in the copy.

    **No HTML structural change.** Single string swap on each of `<h2 class="rise">` and `<a class="all swipe">`. All Notes 16 + Notes 17 component anatomy still accurate; the H2 + CTA references inside them are updated to match. Pattern K reference in the audit doc also updated.

    **/digital parity check.** Should /digital's "All work →" also become "See all the work →"? Probably not — /digital's H2 is "Digital, selected" which already creates the semantic seam ("here's selected; for all, see..."). The change is /studios-specific because /studios' H2 "The films" doesn't carry the "selected" qualifier. If a future commit makes /digital's H2 "The platforms" or similar category name, then /digital should mirror the longer CTA for the same reason.

19. **Bio-video rollover on credit cards (June 24 2026).**

    **JP brief.** "Here are three cloudflare video links for the biography images on the website. Place swap ou the temp static images for these videos that should loop on card rollover."

    Three Cloudflare Stream UIDs:
    - JP Holecka: `5b2c36cd3793f90eafb8e5ae4538c405`
    - Johnny Darrell: `04d16613add2e8e7f984b9fed118c723`
    - Russ Jarman Price: `77ed0d921519c6f587a1821691e583c8`

    **What was added.** A Cloudflare Stream iframe per credit card, layered over the still portrait, lazy-loaded on first hover. The still portraits stay in place — they double as video posters (visible until the iframe loads + on touch devices + when reduced-motion is set). The video fades in over the still on rollover; fades back out on rollout.

    **Why iframes, not `<video>` tags.** /work.html's `.wframe[data-video]` pattern uses local MP4/WebM with the native `<video>` element. The credit videos are Cloudflare Stream-hosted (no local MP4 access). Stream iframes handle decode, loop, autoplay, and adaptive bitrate selection automatically — same pattern as the Validator explainer on /digital. (The Block 1b showreel theater is the exception — it uses a raw `<video>` + HLS, not an iframe, to keep the Cloudflare player logo off the reel.)

    **Markup pattern per card.**

    ```html
    <article class="credit-card" data-video-uid="<UID>">
      <div class="credit-portrait">
        <img src="images/portraits/<slug>.jpg" alt="..." loading="lazy">
        <iframe class="credit-video" aria-hidden="true" tabindex="-1"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"></iframe>
      </div>
      <h3 class="credit-name">...</h3>
      ...
    </article>
    ```

    The iframe has NO `src` attribute on page load — it's an empty element in the DOM, takes no network. JS attaches the src on first mouseenter.

    **CSS (added to studios.html).** Six rules in the .credit-portrait block:

    ```css
    .credit-portrait{position:relative;...}    /* added position:relative for iframe absolute positioning */
    .credit-portrait .credit-video{
      position:absolute;top:50%;left:50%;
      width:177.78%;height:100%;               /* 16:9 over 1:1 = video covers square vertically */
      transform:translate(-50%,-50%);
      border:0;opacity:0;
      transition:opacity .4s ease;
      pointer-events:none;z-index:1
    }
    .credit-card:hover .credit-portrait .credit-video.loaded{opacity:1}
    ```

    The 177.78% width is the 16:9 ratio (16/9 = 1.7778) — the Stream player renders the source video at 16:9, so the iframe needs to be 1.7778x wider than its 1:1 container so the video fills the square vertically and crops the sides. Source aspect assumption: 16:9 landscape (standard bio video aspect). If a future video is shot 9:16 portrait, the math inverts and the override would need width:100%; height:177.78%; — easy follow-up if needed.

    **JS pattern (added to the existing hover-video block in studios.html ~line 1340).** Reuses the same `matchMedia('(hover: hover)')` and `matchMedia('(prefers-reduced-motion: reduce)')` gates as the `.wframe[data-video]` handler — skips touch devices and reduced-motion users entirely.

    ```javascript
    document.querySelectorAll('.credit-card[data-video-uid]').forEach(card=>{
      const iframe = card.querySelector('.credit-video');
      if(!iframe) return;
      const uid = card.dataset.videoUid;
      const url = 'https://customer-xv1aafyshr3tbknu.cloudflarestream.com/' + uid +
                  '/iframe?muted=true&autoplay=true&loop=true&controls=false&preload=auto';
      let loaded = false;
      card.addEventListener('mouseenter', ()=>{
        if(loaded) return;
        iframe.addEventListener('load', ()=>iframe.classList.add('loaded'), {once:true});
        iframe.src = url;
        loaded = true;
      });
    });
    ```

    **First-hover behavior.** Iframe src is set, Stream player initialises (~300-800ms depending on connection), the `load` event fires, `.loaded` class is added. CSS hover rule then shows the video at opacity:1. The still portrait fades to opacity:0 underneath because the iframe (z-index:1) covers it — except the iframe never paints until `.loaded` is set, so during loading the still stays fully visible (no blank-iframe flash).

    **Subsequent hovers are instant.** Once `loaded === true`, the JS returns early; the iframe stays in the DOM with the video already playing in the background (autoplay+loop). CSS opacity transition does the visible show/hide.

    **Why the video plays even when invisible.** The Stream iframe with `autoplay=true&loop=true&muted=true` plays continuously once loaded — there's no way to pause/resume an iframe without using the Stream Player JS API (which would add ~30KB to the page). Playing-while-invisible uses muted background bandwidth but is the cleanest implementation. Browsers throttle off-screen video automatically.

    **Reduced-motion + touch device behavior.** The whole handler is gated behind both matchMedia checks — touch devices (no `(hover: hover)`) and reduced-motion users (`prefers-reduced-motion: reduce`) see ONLY the still portrait, never the video. Graceful degradation.

    **Cloudflare Stream customer subdomain.** `customer-xv1aafyshr3tbknu.cloudflarestream.com` — same subdomain as the Block 1b showreel theater and the Rapid MVP explainer on /digital. Single Cloudflare Stream account, all studios + product videos.

    **Real headshots / portrait swap.** When real headshots are shot, drop them in at `images/portraits/{jp,johnny,russ}.jpg` (same paths). The still becomes the new poster; the bio-video stays the same. No code change needed.

    **Iframe params explained.**
    - `muted=true` — required for browser autoplay (un-muted videos can't autoplay without user gesture)
    - `autoplay=true` — start playing immediately on load
    - `loop=true` — restart on end (continuous loop)
    - `controls=false` — hide player chrome (no play/pause/scrub UI)
    - `preload=auto` — start buffering immediately on iframe load

20. **Portrait stills swapped to Cloudflare Stream thumbnails (June 24 2026).**

    **JP brief.** "Can you have the 1st frame of the video render as the still image for the biography, skipping the need to upload an image for the non-hover state?"

    Cloudflare Stream auto-generates thumbnails for every video. Pattern:

    ```
    https://customer-xv1aafyshr3tbknu.cloudflarestream.com/<UID>/thumbnails/thumbnail.jpg?time=0s&width=800&height=800&fit=crop
    ```

    Params explained:
    - `time=0s` — first frame (literal "1st frame" per JP's brief)
    - `width=800` + `height=800` — output size
    - `fit=crop` — center-crop to the specified aspect (1:1 square here)

    **Each card now uses ONE source of truth — the UID.**
    - Still poster: Stream thumbnail URL, hardcoded in `<img src>`
    - Hover bio video: Stream iframe URL, lazy-built from `data-video-uid` in JS

    Both URLs derive from the same UID. When a video is re-uploaded or replaced in Stream, both the still and the playing video update automatically — no separate file to swap.

    **Local portrait files removed.** `images/portraits/jp.jpg`, `images/portraits/johnny.jpg`, `images/portraits/russ.jpg` were placeholder JPGs generated with Pillow during the initial Studios build (paper-tone background + display-weight initials over a centered rule). They're now orphaned by this change and were `git rm`'d in the same commit. The `images/portraits/` directory is empty and could be removed too, but git doesn't track empty directories so it'll just disappear on the next clone.

    **Why hardcode the URL instead of building it from `data-video-uid` in JS.** If JS fails to load (slow connection, disabled JS, CSP issues), the img src needs to already point at a real URL — otherwise the user sees a broken-image icon. The duplication (UID appears in both `<img src>` and `data-video-uid`) is a minor cost for graceful degradation.

    **First-frame caveat.** `time=0s` returns the literal first frame of the video. If a video begins with a fade-in from black, the still would be black. JP confirmed the brief explicitly ("1st frame"), so this matches the spec. If a future video starts with a fade-in and the still needs to be later in the cut, change `time=0s` to `time=2s` or similar in the relevant img src. Easy per-card tweak.

    **Alt text upgrade.** Previously "Portrait placeholder for JP Holecka" — clearly placeholder-language. Now real alt text: "JP Holecka, Director and Head of Gen AI" / "Johnny Darrell, Director and Editor" / "Russ Jarman Price, Chairman". The still IS the bio asset now, not a stand-in.

    **CSS unchanged.** The `.credit-portrait img{object-fit:cover}` rule still applies — Cloudflare Stream serves a clean 800×800 image, but `object-fit:cover` handles any minor edge cases (e.g., the 800×800 thumbnail loading at a different aspect than expected due to fit=crop edge behavior).

    **Stream thumbnail performance.** Cloudflare serves the thumbnails from their edge CDN. First-load latency is similar to any other image; subsequent visits hit the browser cache. The thumbnail URL is stable per UID + params, so it caches cleanly.

    **What this changes about the parking lot.** "Replace placeholder portraits with real headshots when shot" is gone — there's nothing to replace. The bio videos themselves ARE the headshot source. When new bio videos are produced, the stills update automatically on upload to Stream.
