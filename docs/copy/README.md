# Copy deck (repo mirror)

**Master deck lives in Notion.** This directory mirrors it.

- **Master:** [Copy Deck — powershifter.com](https://app.notion.com/p/388b37adcd5b81e9946af8f38d89d5ad) under the powershifter.com CMS page in the powershifteragency workspace
- **This mirror:** `docs/copy/` in `jaypiddy/PS-Dot-Com`
- **Rendering:** the static HTML in the repo root

When copy on the live site disagrees with the Notion deck, the Notion deck wins. When this mirror disagrees with the Notion deck, the Notion deck wins. The legacy `POWER_SHIFTER_*` markdown docs in `/mnt/user-data/outputs/` are obsolete.

## Files

| File | Page | Route | Notion page | Status |
|---|---|---|---|---|
| _(parent overview)_ | Copy Deck — powershifter.com | n/a | [open](https://app.notion.com/p/388b37adcd5b81e9946af8f38d89d5ad) | n/a |
| `_shared.md` | Shared chrome (header, menu, footer) | n/a — every page | [open](https://app.notion.com/p/388b37adcd5b818398b5fdf56f64d450) | LIVE |
| `home.md` | Homepage | `/` | [open](https://app.notion.com/p/388b37adcd5b81c29b6fcdfc35260f02) | LIVE |
| `work.md` | Work grid | `/work` | [open](https://app.notion.com/p/388b37adcd5b81b89ec7fd7313a2d044) | LIVE |
| `insights.md` | Insights collection | `/insights` | [open](https://app.notion.com/p/388b37adcd5b8182b84ed327c4f84c7d) | LIVE |
| `article.md` | Article template | `/article` | [open](https://app.notion.com/p/388b37adcd5b81a09f4df45bce53fb25) | LIVE |
| `case-telus-koodo.md` | Case study: TELUS & Koodo | `/case-telus-koodo` | [open](https://app.notion.com/p/388b37adcd5b81b29104d3f6a7c9eafc) | LIVE |
| `digital.md` | Digital practice | `/digital` | [open](https://app.notion.com/p/388b37adcd5b810d8869e75c2367594f) | INTERIM |
| `studios.md` | Studios practice | `/studios` | [open](https://app.notion.com/p/388b37adcd5b81ba9beafe136dfc6c58) | INTERIM |
| `about.md` | About | `/about` | [open](https://app.notion.com/p/388b37adcd5b8188867ef30cf05e7f2b) | INTERIM |
| _(deferred)_ | Contact | `/contact` | full-page vs. footer-section decision pending; deferred either way until the structural choice lands | — |

**Status meanings:**

- **LIVE** — copy reflects what's currently shipped in the static site HTML. Drift is a bug.
- **INTERIM** — copy extracted from a prototype HTML that hasn't been built into the static site yet. Open calls and conflicts with current canon are flagged in each file's **Notes** section. Promotes to LIVE when the page lands in the repo.

Pages with no HTML and no prototype — Careers — are not in the deck. They get added when they're built.

## Workflow

1. Copy change → edit the page in **Notion** first.
2. Mirror the edit in the corresponding `docs/copy/*.md` file in this repo.
3. Propagate to the matching HTML location(s) in the static site.
4. Steps 2 and 3 land in the same Git commit. Step 1 is done before that commit, not after it.

Skipping step 1 means Notion is no longer the source of truth and the deck drifts. Skipping steps 2 or 3 means the live site stops matching the deck. Either failure mode puts us back in the Webflow situation where nobody knows what's live and what's a draft.

## Conventions

### File structure

Each page file mirrors the HTML's section structure:

- **H1** = page name + route
- **Metadata block** below H1: route, status, source HTML file, last sync commit, link back to the Notion page
- **H2** = section name. Matches the HTML `<!-- Block N — Name -->` markers where they exist
- **Section role line** under each H2 (italic, one line): what the section is for
- **Copy lines** within each section, each prefixed with a role label in **bold**

### Role labels

Each line of copy gets a role label so the role is obvious without inferring from CSS class names. Roles in use:

| Label | Meaning |
|---|---|
| **EYEBROW** | Small-caps label above a heading (`.eyebrow`) |
| **H1** / **H2** / **H3** | Headings |
| **LEDE** | Opening paragraph or pull-out sentence |
| **BODY** | Body prose |
| **SUB-VOICE** | Late Serif italic, the Studios voice — the sister phrase that follows the grotesque statement (`em.voice`) |
| **CAPS** | The grotesque, all-caps Digital voice line (`.caps`) — pairs with a SUB-VOICE counter |
| **PULL** | Pull quote |
| **CTA** | Call-to-action button or link label |
| **MICRO** | Small UI text — date stamps, tags, meta |
| **TAG** | Card/post category tag |
| **ALT** | Image alt text |
| **STREAM** | Insights stream label (Build / Frames / Founder's Focus) |
| **STAT** | Number + unit + caption, in a proof row |
| **NUM** | Numbered list anchor (used in the takeover menu links) |

A11y note: the headings on the homepage use `.rise` for reveal motion and the H1 wraps `.caps + .voice` to set the two-voices pairing. Those classes are styling, not copy roles, so they don't appear in this deck.

### Sub-voice notation

When a single line pairs the grotesque Digital voice with a Late Serif italic Studios voice, both halves are shown together with their roles labelled — never as a single line. Example:

> **CAPS:** Made to use.  
> **SUB-VOICE:** Made to remember.

That preserves the structural pairing the design system depends on.

### Special design treatments

When a word or phrase has a non-obvious visual treatment baked in (e.g. magenta highlight on a single word, animated cascade on a button), it's noted in italics under the affected line. Example:

> **H2:** Thinking in *public*  
> _("public" rendered as serif italic on magenta block, paper-white text._

### Approved canon lines

The lines below are the canonical Power Shifter brand statements. They appear in multiple places; when one changes, every appearance updates in the same commit (and the Notion master updates first).

1. Made to use. / Made to remember.
2. Anyone can generate. / Few can direct.
3. Working software in weeks, not months.
