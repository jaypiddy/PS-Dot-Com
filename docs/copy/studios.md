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

## Block 1 — Reel hero

_Full-bleed autoplay reel as background. H1 carries the canonical statement; sub-paragraph names the provenance; small scroll prompt at the foot._

**H1 (two-line):**
- **H1 line 1:** Anyone can generate.
- **H1 line 2:** Few can direct.

**BODY:** Power Shifter Studios. Film, audio, and motion on generative pipelines — run by people who came up through ILM, Ridley Scott, and Ogilvy, not a prompt library.

**MICRO (scroll prompt):** Watch the work ↓

---

## Block 2 — Proof bar

_High-contrast strip above the films index. No header. One declarative line of trophies + the qualifying claim._

**STAT (bold):** Two Silver ADDYs, 2026

**BODY:** *The Summit* (Iron Mountain) · *Four Dreams* (Ernest Packaging) — judged against everything, not just the AI category.

_Open call: verify the judging-category claim before "judged against everything" ships. If the ADDYs were entered in an AI-specific category, the qualifying sentence dies._

---

## Block 2b — The roster

_Logo-roster trust signal — direct reuse of `.proof-spine` pattern shipped on `/digital` June 23 2026. Pairs with Block 2's award/film proof bar as the second social proof surface: Block 2 is "what we won and what we made"; Block 2b is "who trusts us." The Studios voice spec ("Every flex attached to a name, a credit, or a trophy") fits a logo-roster cleanly — each logo IS a name-attached flex. Lift the HTML + CSS directly from `digital.html` when this page builds. Position: between Block 2 (Proof bar above) and Block 3 (Films index below)._

**EYEBROW:** The roster

**LOGO GRID (9 logos, 3x3 — same as `/digital` and homepage):**

| Row 1 | Row 2 | Row 3 |
|---|---|---|
| Telus | Energizer | Lululemon |
| Deloitte | KPMG | Grammarly |
| Akamai | Iron Mountain | Canucks |

_Same 9 logos across all three surfaces (homepage proof spine, `/digital` roster, `/studios` roster). Roster includes both Digital clients (TELUS, Deloitte, KPMG, Grammarly, Akamai) and Studios-relevant clients (Iron Mountain — "The Summit" film; Energizer; Lululemon; Canucks). The cross-practice mix is intentional — one masterbrand, two doors._

---

## Block 3 — Films index — "The work"

_Header, then two featured rows (the award winners, full-width, inline-playing) followed by a four-up grid for the rest. Ordering rule from the companion doc: award winners first, then by ambition not recency._

**H2:** The work

### Featured 01 — Iron Mountain

**AWARD:** Silver ADDY · 2026

**H3:** Iron Mountain — *The Summit*

**BODY:** Musicians climb to a summit and discover the power they carried all along: their data.

**CTA:** Watch →

### Featured 02 — Ernest Packaging

**AWARD:** Silver ADDY · 2026

**H3:** Ernest Packaging — *Four Dreams*

**BODY:** Four surreal dreams brought to life — characters that speak, move, and feel as if they've always existed.

**CTA:** Watch →

### Grid 03 — Celestial AI

**H3:** Celestial AI

**BODY:** A story told in light itself — photonic fabric as cinema.

**CTA:** Watch →

### Grid 04 — The Algorithm Trap

**H3:** The Algorithm Trap

**BODY:** Fast, raw, restless — the endless scroll, mirrored back at itself.

**CTA:** Watch →

### Grid 05 — Maple Health

**H3:** Maple Health

**BODY:** The quiet moments of empathy that define real healthcare, animated.

**CTA:** Watch →

### Grid 06 — Rapid MVP / Luma

**H3:** Rapid MVP — *Luma*

**BODY:** A brilliant idea left waiting — until it didn't have to be.

**CTA:** Watch →

---

## Block 4 — Provenance / credits

_Not a leadership block — a credits block. Name, role, credit line, styled like a one-sheet. No portraits, no bios; full bios live on /about. Closes with a link out._

**H2:** Directed by people who earned the word

### Credit 01

**NAME:** JP Holecka
**ROLE:** Director // Head of Gen AI
**CREDIT LINE:** Little Women · 21 Jump Street · Black Dog Films (Ridley Scott) · ILM, commercial division

### Credit 02

**NAME:** Johnny Darrell
**ROLE:** Director // Editor
**CREDIT LINE:** Sausage Party: Foodtopia (Amazon) · Cloudy with a Chance of Meatballs (Sony / Lord Miller) · 25 years in CGI and story

### Credit 03

**NAME:** Russ Jarman Price
**ROLE:** Chairman
**CREDIT LINE:** Ogilvy London, Creative Partner · Ogilvy Caribbean, Chairman

**CTA (block footer):** Meet the whole team →
_(Routes to `/about`.)_

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

_Two-module one-two punch — shared verbatim with `/digital`. Module 1 (Early & Often) runs canonical 5fr/7fr `.engine` layout; Module 2 (Direct-to-Expert) runs mirrored 7fr/5fr via `.engine.mirror`. Pattern shipped on `/digital` June 23 2026 — see `digital.md` Notes 15 and `digital.html` for the live implementation. When this page builds, lift the HTML + CSS directly from the `/digital` implementation — no editorial polish, no rewriting._

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

**Voice note for Studios:** the copy is universal across both practices and ships unchanged. The Studios voice spec ("Every flex attached to a name, a credit, or a trophy") still governs the rest of the page; these two modules are an exception — they describe the working principles common to both Digital and Studios.

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
| Directed by people who earned the word | /studios credits header | Taglines, Digital contexts |
| The pipeline is new. The discipline isn't. | /studios process block; eligible for talks/decks | Homepage |
| Bring the board you were told was unshootable. | /studios closer; eligible for outbound to CDs | Digital contexts |

### Open calls to resolve before build

1. **"Ask Toronto"** — in or out, pending the Leo Burnett relationship's referenceability. If the relationship formalizes, name it; if it stays informal, cut.
2. **ADDY judging-context claim** — verify category before "judged against everything" ships in the proof bar.
3. **Film ordering** — award-first proposed; override if a stronger opener exists in the unreleased pipeline. Akamai, when public, likely takes slot one.

### Dependency on /about

The full bios for all six leads (Eilish, Ted, Cary, JP, Johnny, Russ) consolidate on /about — single grid, practice tags, the one-team statement. The W+K / Goodby positioning resolves there in prose. /digital optionally carries a one-line senior-bench strip (Microsoft · Starbucks · Nike · Nintendo pedigree), no faces.

---

## Build notes

_Append-only. New notes added at the bottom; references in the codebase cite by note number._

1. **Initial /studios build — spine commit (June 23 2026).**
    Built into the static site at `studios.html` based on the chrome lifted verbatim from `digital.html` (head + header + takeover menu + footer + scripts). The base CSS, typography, color tokens, and reusable patterns (`.proof-spine`, `.engine` + `.engine.mirror`, `.page-closer`) come along with the clone — orphan CSS from `/digital`-specific patterns (`.sub-hero`, `.validator-band`, `.terminal`, `.offers-section`, etc.) currently rides along unused. Acceptable for the static prototype phase; clean up in a follow-up commit if size or maintainability becomes an issue.

    **Blocks shipped:** 1 (Reel hero, Pattern G), 2 (Proof bar, Pattern H), 2b (The roster — reuse of Pattern F from `/digital`), 3 (Films index, Pattern I), 4 (Credits one-sheet, Pattern J), 5b (One-two punch — reuse of Pattern E from `/digital`), 8 (Closer — reuse of `.page-closer` with Studios copy).

    **Blocks deferred:** 5 (How it's made — needs three generated stills for Board / Generation / Final states; the lede ships but the visual strip can't), 6 (What we make — services 4-up text grid), 7 (For agencies — pending the "Ask Toronto" / Leo Burnett referenceability resolution).

    HTML comments inside `studios.html` mark each deferred block's insertion point so the follow-up commits are surgical inserts, not restructures.

2. **Reel hero video — using the homepage hero reel UID.**
    The reel-hero `<iframe>` (Block 1, Pattern G) points to Cloudflare Stream UID `dcde8adcb14fb52708c8ce6cf631658f` — the same UID that drives the homepage hero reel. This is intentional, not a placeholder: the homepage reel IS the Studios reel (it's the masterbrand showcase of Studios work). If a `/studios`-specific reel gets cut later, swap the UID via `str_replace` on the iframe `src`; everything else stays. Customer subdomain `customer-xv1aafyshr3tbknu.cloudflarestream.com` per `docs/VIDEO_PIPELINE.md`.

    Iframe query string: `?muted=true&autoplay=true&loop=true&controls=false&preload=auto`. Standard background-video parameter set. Browsers require `muted=true` for autoplay to succeed without user interaction.

3. **Hero H1 voice treatment.**
    Two-line H1: `Anyone can generate.` (display weight, paper color) over `Few can direct.` (late-serif italic via `em.voice`, magenta). The italic line is the differentiator — same pattern the homepage uses for the Studios door lede. Both lines render as `<span>` children inside `<h1>` with `display:block` for the line break; `<br>` would have worked too but `<span>` lets the CSS hook line-by-line if needed later (separate animation timing, asymmetric letter-spacing, etc.).

4. **Films index — "Watch" CTAs route to "#".**
    All six `Watch →` links in Block 3 route to `#` because none of the films have case-study pages yet. Same status as `/digital`'s Selected Work (3 of 4 cards still route to `#`, only Koodo links to a real case study). Pattern: when individual film case-studies build, swap the `href="#"` to the case-study URL via `str_replace` per film. Iron Mountain and Ernest are highest priority since they're the award winners and the featured rows.

5. **Films index — poster-only, no inline video loops in this commit.**
    Each film tile uses its uploaded poster image from `/images/<slug>.jpg` (sourced June 2026: `iron_mountain.jpg`, `ernest.jpg`, `celestial.jpg`, `algorithm_trap.jpg`, `maple_health.jpg`, `rapid_mvp.jpg`). Inline video previews (the `.work` `.media + <video>` pattern from `/work`) are a follow-up — they require encoding each film to muted-loop MP4 + WebM, generating frame-0 posters, and uploading to `/videos`. The play badge (`.film-play`) sits on the poster image as a visual affordance for the future video-on-hover behavior.

6. **"Judged against everything" claim — UNVERIFIED. (Open call carried.)**
    The Block 2 proof bar's qualifying line `judged against everything, not just the AI category` ships in the static prototype but remains an unverified claim. If the ADDYs were entered in an AI-specific category, the qualifier dies and the bar shortens to just the award + film names + agencies. Verify the judging-context before any paid outbound, PR pitch, or production publish. Carried open call from `studios.md` original brief.

7. **Roster — direct paste from `/digital`, identical 9-logo set.**
    Same 9 logos, same widths, same `.proof-spine` + `.logos` + `.cell` + `.logo-mask` HTML structure as `/digital` line ~992. The roster's cross-practice mix (Telus, Deloitte, KPMG, Grammarly, Akamai → Digital; Iron Mountain, Energizer, Lululemon, Canucks → Studios-adjacent) is intentional per the one-masterbrand-two-doors IA. If a Studios-specific subset is wanted later, override the 9 logos in this file's HTML and update the roster grid; the underlying CSS doesn't need to change.

8. **Credits CTA `Meet the whole team →` routes to "#".**
    `/about` isn't built yet. When `about.html` ships, swap the `href="#"` on `.credits-cta` to `about.html`. Carried as a pending cross-page rewire item alongside the takeover menu link 05.

9. **Takeover menu link 03 (Studios) still points to `index.html#studios`.**
    Per the existing convention on `/digital` (where link 02 still points to `index.html#digital` rather than `digital.html`), the takeover menu on `/studios` ships unchanged. The full cross-page takeover rewire — pointing 02 → `digital.html` and 03 → `studios.html` on every page — is a single dedicated commit that will touch all built pages at once. Carried in the `/digital` Notes 12 parking lot.

10. **Closer H2 voice line — `unshootable` in magenta italic.**
    Block 8's H2 carries the late-serif italic + magenta treatment via `em.voice.mag` on the word `unshootable.` — same dual-class pattern as `/digital`'s closer (`em.voice.mag` on `Bring the idea.`). The body line below (`The budget used to be the ceiling. Now it's the idea.`) sits in plain prose. CTA copy: `Start a film →` (not `Start a project →` — Studios-specific). Phone number identical to `/digital` — one masterbrand, one phone.

11. **Orphan CSS riding along from `/digital` clone.**
    The full CSS block from `digital.html` was copied with the clone, which means `studios.html` carries definitions for patterns it doesn't use: `.sub-hero` (paper hero variant), `.sub-voice`, `.validator-band`, `.terminal`, `.offers-section`, `.partners-strip`, `.cards.four-up`, `.work` grid styles, and others. The rules don't render because no HTML elements reference them, but they add page weight. **Acceptable for now** — each page is intentionally self-contained, and the prototype phase prioritizes pattern propagation over byte-trimming. Clean up in a maintenance commit later, or once a shared `assets/css/site.css` is introduced.

12. **New patterns this build added to the system (audit doc).**
    Four new patterns documented in `docs/design-system-audit.md`:
    - **Pattern G — `.reel-hero`:** full-bleed Cloudflare Stream video background with overlaid H1 + body + scroll prompt. Studios Block 1. Distinct from `.sub-hero` (paper bg, no video) and from the homepage's hero treatment.
    - **Pattern H — `.proof-bar`:** single declarative trophy line on ink background, between hero and roster. Studios Block 2. Distinct from `.proof` (multi-stat outcome strip) and from `.proof-spine` (logo grid).
    - **Pattern I — `.films` + `.film-featured` + `.film-card` + `.film-grid`:** featured-row + 4-up-grid film index. Studios Block 3. The featured rows use a 7fr/5fr media+meta split; the grid is the standard 4-up below a horizontal rule. Reusable for any future media-index page (case studies, podcast episodes, etc.).
    - **Pattern J — `.credits` + `.credit-card`:** name + role + credit-line one-sheet in a 3-up grid. Studios Block 4. Reusable on `/about` if that page wants a credits-style format for a particular team subset, but the canonical `/about` is a full bio grid (not this).
