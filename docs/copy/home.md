# Homepage

**Route:** `/`
**Source HTML:** `index.html`
**Last sync commit:** `5df8022`
**Status:** LIVE

The shared chrome (header, takeover menu, footer) on this page is governed by `_shared.md`. This file covers only the page-specific copy below the nav and above the footer.

---

## Block 1 — Thesis hero

_Full-bleed hero with looping reel as background. The H1 sets the two-voices pairing; the sub-line frames the proposition; two CTAs route to the practices._

**H1 (CAPS + SUB-VOICE pair):**
- **CAPS:** Made to use.
- **SUB-VOICE:** Made to remember.

**BODY:** A product studio and a film studio with one design culture. Software in weeks, cinema in days — made in the same room.

**CTA (solid):** Digital →
**CTA (outline):** Studios →

---

## Block 2 — Two doors

_Two-up "doors" introducing the practices. Each door has its own eyebrow, name, lede with sub-voice, body paragraph, and enter link._

### Door 01 — Digital

**EYEBROW:** 01 — Product

**H2:** Digital

**LEDE (BODY + SUB-VOICE):** Working software in weeks, *not months.*

**BODY:** Product strategy, design, and engineering — designers at heart, all the way down to the dev team. MVPs in 4–6 weeks. Platforms that hold at enterprise scale.

**CTA:** Enter Digital

### Door 02 — Studios

**EYEBROW:** 02 — Film

**H2:** Studios

**LEDE (BODY + SUB-VOICE):** Anyone can generate. *Few can direct.*

**BODY:** Cinematic film, audio, and motion from people who made it the old way first. Two Silver ADDYs say the craft survived the pipeline.

**CTA:** Enter Studios

---

## Stitch — two-voices marquee

_Continuous horizontal scroll between the home hero and the proof spine. Alternates the grotesque Digital voice (`g`) with the Late Serif italic Studios voice (`v`), separated by middots._

The track repeats this six-phrase sequence:

1. **CAPS:** Made to use
2. **SUB-VOICE:** Made to remember
3. **CAPS:** Software in weeks
4. **SUB-VOICE:** Cinema in days

_(The HTML duplicates the sequence to fill the marquee track; edits should be made to the sequence above and copied into every duplicate in the markup.)_

---

## Block 3 — Proof spine

_The receipts: four numeric proof points presented as scroll-triggered odometers, followed by a 3×3 checkerboard client logo wall._

**EYEBROW:** The receipts

### Stats

| Role | Number | Unit | Caption |
|---|---|---|---|
| STAT | 300,000 | + | enrollments in six months — TELUS Rewards |
| STAT | 30 | days | from idea to validated proof of concept — Energizer |
| STAT | +40 | % | organic leads — Angel Oak |
| STAT | 2 | × Silver ADDY | Power Shifter Studios, 2026 |

_(The "+40%" on Angel Oak and the "2× Silver ADDY" were **confirmed by JP 2026-07-14** and are out of the canon parking lot — both are cleared for paid reuse, PR, and outbound. Do not re-flag as unverified.)_

### Client wall

_3×3 grid, checkerboard treatment (alternating ink-on-paper and paper-on-ink cells)._

**ALT (in display order):** Telus · Energizer · Lululemon · Deloitte · KPMG · Grammarly · Akamai · Iron Mountain · Canucks

_(Logos are SVG masks tinted to the cell's foreground colour; alt text above doubles as the only copy associated with this block.)_

---

## Block 4 — The seam

_The "why one room" argument. H2 pairs a grotesque statement with a Late Serif sub-voice; body is five short paragraphs, one with a bold emphasis on the structural claim._

**H2 (CAPS + SUB-VOICE pair):**
- **CAPS:** One room.
- **SUB-VOICE:** No wall.

**BODY:** Digital products and a film studio. Not as strange as it sounds.

**BODY:** Most brands hire one agency to build the product and another shop to tell its story, then pay both to argue across the wall.

**BODY (bold emphasis):** **We never built the wall.**

**BODY:** From the beginning, we have refused to stay in our lane. Designers, strategists, engineers and filmmakers work in the same room, solving the same problem from different angles.

**BODY:** That has always been the advantage.

**BODY:** AI scales it. Design runs it. And no, we were never a dev shop.

---

## Block 5 — Selected work

_Three-card tease of the work library. Header pairs an H2 with an "All work →" link to `/work`. Each card has a category tag, project H3, one-line blurb, and CTA._

**H2:** Selected work

**CTA (header):** All work →

### Card 01 — Iron Mountain

**TAG:** Studios

**H3:** Iron Mountain — *The Summit*

**BODY:** A cinematic spot with a blockbuster look, made on a generative pipeline. Silver ADDY, 2026.

**CTA:** Watch the film →

### Card 02 — TELUS Rewards

**TAG:** Digital

**H3:** TELUS Rewards

**BODY:** A loyalty platform 300,000 people enrolled in within six months.

**CTA:** Read the case →

### Card 03 — Energizer

**TAG:** Digital · Rapid MVP

**H3:** Energizer

**BODY:** Product-market fit validated in 30 days with a rapid proof of concept.

**CTA:** Read the case →

---

## Block 6 — Insights

_Three-post tease of the editorial platform. Header H2 contains a magenta highlight treatment on the word "public". Three posts in a row, each with a stream label, title, and date._

**H2:** Thinking in *public*
_("public" rendered as serif italic on a magenta block; paper-white text; slight Y-offset baseline so the highlight reads as a stamp, not a textwrap._

**BODY (three streams introduction):** **Build** — how to make products people love. **Frames** — how to make films that are remembered. **Founder's Focus** — where it's all going, whether you agree or not.

### Post 01

**STREAM:** Frames

**H3:** Power Shifter Studios takes home two Silver ADDYs

**MICRO (date):** May 2026

### Post 02

**STREAM:** Build

**H3:** Can vibe design and coding AI apps build a real product?

**MICRO (date):** June 2025

### Post 03

**STREAM:** Founder's Focus

**H3:** Designing for rage: how platforms profit from chaos

**MICRO (date):** January 2025

---

## Block 7 — Closer

_Page-end CTA block. H2 pairs grotesque with a magenta-highlighted Late Serif sub-voice. One body line, two CTAs: a "Start a project" button and a tel link._

**H2 (CAPS + SUB-VOICE pair):**
- **CAPS:** Great work used to take months.
- **SUB-VOICE:** Now it takes nerve.
_(SUB-VOICE here uses the magenta-on-cream variant — `em.voice.mag` — for emphasis.)_

**BODY:** Cinema in days. Software in weeks. Bring the idea — you'll work directly with the people who make it. There's no account layer to get past.

**CTA (solid):** Start a project →
**CTA (tel):** +1 (604) 227-9952

---

## Cross-page canon used on this page

These canonical lines appear on this page and should be edited via global find-and-replace if revised:

- Made to use. / Made to remember. (hero H1; tagline in `_shared.md` footer)
- Anyone can generate. / Few can direct. (Studios door lede)
- Working software in weeks, not months. (Digital door lede — wording recently changed from "not quarters")

---

## Page metadata (SEO / Open Graph)

_Canonical `<head>` copy for `index.html`. The homepage is the top share target (the bare domain) — keep these deliberate, not an afterthought. The OG title/description were rewritten 2026-07-14 (proof-led) from a weaker tagline-led version._

- **Title tag:** POWER SHIFTER — Digital Products & Generative Films | Vancouver
- **Meta description:** Made to use. Made to remember. A product studio and a film studio with one design culture — the work and the place it lives, made in the same room. Software in weeks, cinema in days.
- **OG title:** POWER SHIFTER — Software in weeks. Cinema in days.
- **OG description:** Two studios, one design culture: digital products and generative film, made in the same room. Made to use. Made to remember.
- **OG image:** `/images/og/og-home.png` (twitter:card = summary_large_image; twitter title/desc/image fall back to the OG tags, matching the other core pages).
