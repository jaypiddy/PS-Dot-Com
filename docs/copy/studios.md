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

_Full-bleed autoplay reel as background. H1 carries the canonical statement; sub-paragraph names the provenance; canonical button at the foot scrolls down to the films index. Button uses the site's `.btn .cascade` vocabulary (matches the homepage Digital/Studios pair and the page-closer "Start a film") — see Notes 15._

**H1 (two-line):**
- **H1 line 1:** Anyone can generate.
- **H1 line 2:** Few can direct.

**BODY:** Power Shifter Studios. Film, audio, and motion on generative pipelines — run by people who came up through ILM, Ridley Scott, and Ogilvy, not a prompt library.

**CTA (outline `.btn`):** Watch the work →
_Routes to `#films` (in-page scroll to the films index). Renders as outline-on-dark via the canonical `.btn` rule (`border:1px solid var(--paper)`) — the cascade letter-and-arrow hover animation comes along for free._

---

## Block 2 — Proof bar

_High-contrast strip above the films index. No header. One declarative line of trophies + the qualifying claim._

**STAT (bold):** Two Silver ADDYs, 2026

**BODY:** *The Summit* (Iron Mountain) · *Four Dreams* (Ernest Packaging) — judged against everything, not just the AI category.

_Open call: verify the judging-category claim before "judged against everything" ships. If the ADDYs were entered in an AI-specific category, the qualifying sentence dies._

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

_A credits block, not a leadership block. Each entry leads with a square portrait, then name + role + credit line, styled like a one-sheet. Bios still live on /about — this is the credit roll, not the team page. Closes with a link out. (The original brief said "no portraits, no bios" — that was overridden June 24 2026; see Notes 14.)_

**H2:** Directed by people who earned the word

### Credit 01

**PORTRAIT:** `images/portraits/jp.jpg` (placeholder — swap for real headshot when shot)
**NAME:** JP Holecka
**ROLE:** Director // Head of Gen AI
**CREDIT LINE:** Little Women · 21 Jump Street · Black Dog Films (Ridley Scott) · ILM, commercial division

### Credit 02

**PORTRAIT:** `images/portraits/johnny.jpg` (placeholder — swap for real headshot when shot)
**NAME:** Johnny Darrell
**ROLE:** Director // Editor
**CREDIT LINE:** Sausage Party: Foodtopia (Amazon) · Cloudy with a Chance of Meatballs (Sony / Lord Miller) · 25 years in CGI and story

### Credit 03

**PORTRAIT:** `images/portraits/russ.jpg` (placeholder — swap for real headshot when shot)
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

    **Button vocabulary.** The reel-hero scroll-prompt button was originally styled with a custom `.reel-scroll` class — uppercase, .14em letter-spacing, .28-alpha border. That diverged from the site's canonical button vocabulary (`.btn` + `.cascade` modifier) used on the homepage Digital/Studios pair and on every page-closer ("Start a project" on `/digital`, "Start a film" on `/studios`). JP's call on review: one button vocabulary, not two.

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
