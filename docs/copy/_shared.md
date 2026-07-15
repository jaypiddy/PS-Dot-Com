# Shared chrome

Copy that appears on every page: header / nav, takeover menu, footer. Edits here ripple to every HTML page in the same commit.

**Source HTML:** `index.html` (canonical) · also embedded in `work.html`, `insights.html`, `article.html`, `case-telus-koodo.html`
**Last sync commit:** `5df8022`
**Status:** LIVE

---

## Header / nav

_Persistent top bar. Logo (left) returns to homepage; menu trigger (right) opens the pink takeover._

**ALT (logo):** POWER SHIFTER home

**CTA (menu trigger):** Menu +

---

## Takeover menu

_Full-viewport pink takeover. Numbered link list, contact details in the footer of the panel._

**CTA (close):** Close ×

### Links

| Role | Number | Label | Route |
|---|---|---|---|
| NUM + LINK | 01 | Work | `/work` |
| NUM + LINK | 02 | Digital | `/#digital` (homepage anchor for now; `/digital` when the practice page ships) |
| NUM + LINK | 03 | Studios | `/#studios` (homepage anchor for now; `/studios` when the practice page ships) |
| NUM + LINK | 04 | Insights | `/insights` |
| NUM + LINK | 05 | About | `#` (not yet built) |
| NUM + LINK | 06 | Contact | `/#contact` (anchor scrolls to the homepage closer; will repoint when a Contact page ships) |

### Takeover footer

**MICRO (phone):** +1 (604) 227-9952
**MICRO (location):** Vancouver, BC

---

## Footer

_Site-wide footer. Logo + tagline (left), nav list (centre), newsletter signup (right), land acknowledgement, legal._

### Brand block

**TAGLINE (CAPS + SUB-VOICE):**
- **CAPS:** Made to use.
- **SUB-VOICE:** Made to remember.

### Footer nav

- Work → `/work`
- Digital → `/#digital`
- Studios → `/#studios`
- Insights → `/insights`
- About → `#` (not yet built)
- Careers → `#` (not yet built)
- Contact → `/#contact` (anchor for now)

### Newsletter — "The signal"

**H4:** The signal

**BODY:** What we're learning shipping software and cinema on AI pipelines. Monthly, short, no filler.

**MICRO (input placeholder):** Email address

**CTA:** Subscribe

_Wiring (2026-07-14): posts to the concierge Worker's `POST /subscribe` → **Campaign Monitor** list `fc63da7e`. Client is `ps-signal.js`, class-based on `form.js-signal` — a page can carry two (the footer `.news` block plus an in-body `.signal` block on `article.html` / `design-sprint-day-four.html`). **Until 2026-07-14 this field was a dead placeholder** — no form, no handler, no endpoint; it took an address and silently did nothing. See `worker/README.md` → "Newsletter route"._

**STATUS — success:** You're on the list. Watch for The Signal.

**STATUS — invalid email:** That email doesn't look right.

**STATUS — rate limited:** One moment — try that again shortly.

**STATUS — failure:** Couldn't sign you up just now — email jp@powershifter.com and we'll add you.

_These four are the only feedback a subscriber ever sees; the rule is that a signup either confirms or says why, and never fails silently again. The failure line names a real human fallback rather than a dead end. Edit them in `ps-signal.js`._

### Land acknowledgement

**BODY:** We acknowledge that we live and work uninvited on the unceded territories of the xwməθkwəy̓əm (Musqueam), Sḵwx̱wú7mesh (Squamish), Sel̓íl̓witulh (Tsleil-Waututh), Syilx tmixw (Okanagan), Nłeʔkepmx Tmíxw (Nlaka'pamux), Niitsítpiis-stahkoii (Blackfoot / Niitsítapi), Mi'kma'ki, the Mississaugas of the Credit, Anishnabeg, Chippewa, Haudenosaunee, and Wendat peoples. We are grateful for the opportunity to build our agency and communities on land that is cared for by these Nations.

### Legal row

**MICRO:** © {year} Power Shifter Digital Inc. All rights reserved.
**LINK:** Terms & Conditions
**LINK:** Privacy Policy
**LINK:** Cookies

_(Year fills automatically via JS on page load.)_
