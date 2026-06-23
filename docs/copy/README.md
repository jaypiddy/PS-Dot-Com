# Copy deck

The site's user-facing copy, versioned alongside the HTML. One file per page. Shared chrome (header, menu, footer) lives in `_shared.md`.

This deck is the source of truth for site copy from the date the first page lands. **Copy changes are made here first, then propagated to HTML in the same commit.** Anything else is drift waiting to happen.

The legacy markdown docs in `/mnt/user-data/outputs/POWER_SHIFTER_*` are superseded by this deck.

## Files

| File | Page | Route | Status |
|---|---|---|---|
| `home.md` | Homepage | `/` | LIVE |
| `_shared.md` | Header, takeover menu, footer | n/a — appears on every page | LIVE |
| `digital.md` | Digital practice | `/digital` | INTERIM |
| `studios.md` | Studios practice | `/studios` | INTERIM |
| `about.md` | About | `/about` | INTERIM |
| _(deferred)_ | Work grid | `/work` | not yet extracted |
| _(deferred)_ | Insights collection | `/insights` | not yet extracted |
| _(deferred)_ | Article template | `/article` | not yet extracted (template-level, real content paginates from Notion) |
| _(deferred)_ | Case study: TELUS & Koodo | `/case-telus-koodo` | not yet extracted |
| _(deferred)_ | Contact | `/contact` | full-page vs. footer-section decision pending; deferred either way until the structural choice lands |

**Status meanings:**

- **LIVE** — copy reflects what's currently shipped in the static site HTML. Drift is a bug.
- **INTERIM** — copy extracted from a prototype HTML that hasn't been built into the static site yet. Open calls and conflicts with current canon are flagged in each file's **Notes** section. Promotes to LIVE when the page lands in the repo.

Pages with no HTML and no prototype — Careers — are not in the deck. They get added when they're built. No skeleton files; skeletons invite stale copy.

## Conventions

### File structure

Each page file mirrors the HTML's section structure:

- **H1** = page name + route
- **Metadata block** below H1: route, status, source HTML file, last sync commit
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

The lines below are the canonical Power Shifter brand statements. They appear in multiple places; when one changes, every appearance updates in the same commit.

1. Made to use. / Made to remember.
2. Anyone can generate. / Few can direct.
3. Working software in weeks, not months.

## Workflow

1. Copy change requested → edit the relevant `.md` file in this deck.
2. Propagate the change to the matching HTML location(s) in the same commit.
3. Update the **last sync commit** field in the file's metadata block.

If you only touch the HTML and skip the deck, the deck drifts and we're back to where we started in a week. Don't.
