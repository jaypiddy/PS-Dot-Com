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
  hand-fix since**, it'll regress it). **When you publish a new case, also add it to the
  concierge KB (`docs/concierge-knowledge.md`, §2/§3) and regenerate `sitemap.xml`** — the bot
  can't mention a case that isn't in its KB. Full step list in `docs/case-study-publishing.md`.
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

## Images & media hosting

**Default new images to local `/images/<page-or-case>/`** in the repo, optimized before
commit (resize to display size — ~1600px max for full-bleed stills — then JPEG/webp). Local
is the house convention: versioned with the code, deploys atomically, and can't be orphaned
by an external CDN going away. Nested pages reference them root-absolute (`/images/…`).

- **Cloudflare Images** (`imagedelivery.net/So76NP_fFT3s9jNLvxCRFw/<id>/public`) already hosts
  the 63-post blog imagery, the leadership portraits, and every OG image — leave those as-is;
  only reach for it when you specifically want its auto-variants/format negotiation. New
  uploads need a manual dashboard/API step (there's no MCP for it), which is the friction that
  makes local the default.
- **No Webflow CDN** (`cdn.prod.website-files.com`) — the old site is being decommissioned; its
  assets were pulled local on 2026-07-07. Don't hotlink it (a grep for it should stay empty).
- **Video** = Cloudflare Stream (customer `xv1aafyshr3tbknu`); see `docs/VIDEO_PIPELINE.md`.
  Card hover-loops must NOT offer a `.webm` source for Stream URLs — Stream serves only
  `default.mp4`, so a `.webm` 404s and stalls the rollover (the JS gates webm to local files).

## SEO & deploy assets (keyed to powershifter.com since the 2026-07-13 cutover)

`sitemap.xml`, `robots.txt`, every page's `rel="canonical"`, the JSON-LD `url` fields, the
core-page `og:image` URLs (`/images/og/og-<page>.png`), and `BASE` in
`tools/blog-renderer/render_blog.py` are all hardcoded to **`https://powershifter.com`**
(flipped repo-wide + blog re-rendered at the 2026-07-13 domain cutover). Canonical host =
**apex** (non-www). `ps-dot-com.vercel.app` still serves the same deployment — canonicals
point at the apex, so it's SEO-inert; don't reintroduce it in new pages. The concierge
Worker's `ALLOWED_ORIGIN` allow-lists both origins during the transition (worker/wrangler.toml).

- `vercel.json` `redirects` (177): the site's own flat→nested moves **plus** the full
  173-URL old-Webflow→new 301 map. Exact sources are ordered before wildcards (first match wins).
- **Structured data (JSON-LD):** Organization (home), Article (23 case studies), BlogPosting
  (63 posts — injected by the blog renderer). Canonical + JSON-LD are on all 94 pages.
- `sitemap.xml` is **static — regenerate it when you add a case study or post.**
- Full current state + the incoming-SEO-specialist handoff live in **`docs/SEO-STATUS.md`**.
