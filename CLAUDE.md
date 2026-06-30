# PS-Dot-Com — agent instructions

Static multi-page HTML site (no build step) for POWER SHIFTER, deployed on Vercel.
`main` auto-deploys to production (`ps-dot-com.vercel.app`) on every push — no
manual `vercel` command needed. This file is project-scoped instructions for any
agent working in this repo; see `docs/design-system.md` for visual canon and
`docs/copy/README.md` for the content/copy workflow.

## Critical rule: internal links must be root-absolute

Every page's chrome (nav, footer, stylesheet/script tags, the AI concierge) uses
**relative paths with no leading slash** — `href="work"`, `src="ps-spice.css"`.
That only resolves correctly when the page sits at the site root. **The moment a
page lives one directory down (e.g. `/insights/<slug>`), every one of those
relative references breaks** — stylesheets, scripts, nav links, the concierge's
knowledge-base fetch — because the browser resolves them against the URL's
directory, not the site root.

**Before adding any page in a subdirectory:** make sure every internal
`href`/`src` it carries (in its own markup and in any chrome it shares) is
root-absolute (`href="/work"`, not `href="work"`). This bit us for real on
2026-06-30 moving blog articles into `/insights/<slug>` (commit `0728b95`) and
case studies into `/work/<slug>` (same day, same fix applied to all 16) — see
`docs/design-system.md` §11 for the durable rule.

Pages that stay flat at the root (`/work`, `/digital`, `/studios`, `/insights`,
`/about`) are unaffected — this only matters when a page is nested. Both
case studies and blog posts now ARE nested (one directory under their listing
page), so any new one is automatically in scope for this rule.

## Where things live

- **Case studies** — hand-published from Notion, one `.html` per case at
  `work/<slug>.html`, served at `/work/<slug>` (`/xyon`, `/allia-health-group`, …
  moved here from the root 2026-06-30). SOP + build journal:
  `docs/case-study-publishing.md`. Generator tooling: `tools/case-study-builder/`
  (see its README — **don't re-run `build_cases.py` on a case that's had a
  hand-fix since**, it'll regress it).
- **Blog / Insights** — 63 Published posts rendered from Notion export data onto
  the `article.html` template, served at `/insights/<slug>`; the listing grid is
  `/insights` (`insights.html`). Generator: `tools/blog-renderer/` (see its README) —
  re-run `python3 tools/blog-renderer/render_blog.py` after editing the template
  chrome, the converter, or `posts.json`/`blog-meta.csv`.
- Neither generator is wired live to Notion (no API calls at build time) — both
  read a hand-exported JSON/CSV snapshot. Re-export from Notion before rebuilding
  if the source content has changed.

## Filter grids (work + insights)

`/work` and `/insights` share a filter pattern: `.ftab[data-cat]` tabs over a grid
of `.wcard[data-cat]` cards. Two things to know:

- **Scope card queries to the grid, never a bare `[data-cat]`** — the filter tabs
  *also* carry `data-cat`, so `querySelectorAll('[data-cat]')` sweeps them up and a
  filter click hides the other tab buttons. Use `.work-grid .wcard` / `.sheet .wcard`.
- **The `/work` tab counts are computed by JS from the cards on load** (not
  hand-maintained — don't hand-edit the `<span class="fc">` numbers and expect them
  to stick; the script overwrites them). A card opts out of the count with
  `data-count="false"` (e.g. a "coming soon" placeholder). The static numbers in the
  HTML are just the no-JS fallback — keep them roughly right but the JS is the truth.
  The hero "N projects" line is separate static prose — update it by hand if the count
  changes meaningfully. (`/insights` counts are set at build time by the renderer
  instead, since it regenerates that page.)

## Local preview caveat

Clean URLs (extensionless routing) are a **Vercel-only** feature (`vercel.json`
`cleanUrls:true`). A local static server (`python3 -m http.server`) needs the
literal `.html` suffix — `/insights/foo.html`, not `/insights/foo`. Don't read a
404 on the local preview as a regression unless you also check the suffixed URL.

## Verify before claiming done

For anything observable in a browser, actually load it (the `preview_*` tools) —
inspect computed styles / DOM state, not just the generated source — before
saying a fix works. Several real bugs here (the insights filter hiding tabs, the
overlay headline sitting under the reveal scrim) were invisible in the markup and
only showed up when actually clicked/rendered.
