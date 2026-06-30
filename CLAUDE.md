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
2026-06-30 moving blog articles into `/insights/<slug>` — see the fix in
`article.html` and `tools/blog-renderer/render_blog.py` (commit `0728b95`) for
the worked example, and `docs/design-system.md` §11 for the durable rule.

Pages that stay flat at the root (case studies, `/work`, `/digital`, etc.) are
unaffected — this only matters when a page is nested.

## Where things live

- **Case studies** — hand-published from Notion, one `.html` per case at root
  (`/xyon`, `/allia-health-group`, …). SOP + build journal: `docs/case-study-publishing.md`.
  Generator tooling: `tools/case-study-builder/` (see its README).
- **Blog / Insights** — 63 Published posts rendered from Notion export data onto
  the `article.html` template, served at `/insights/<slug>`; the listing grid is
  `/insights` (`insights.html`). Generator: `tools/blog-renderer/` (see its README) —
  re-run `python3 tools/blog-renderer/render_blog.py` after editing the template
  chrome, the converter, or `posts.json`/`blog-meta.csv`.
- Neither generator is wired live to Notion (no API calls at build time) — both
  read a hand-exported JSON/CSV snapshot. Re-export from Notion before rebuilding
  if the source content has changed.

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
