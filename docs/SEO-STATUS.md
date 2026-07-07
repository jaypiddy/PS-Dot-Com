# SEO — status & handoff

_Last updated: 2026-07-07_

For the incoming SEO specialist. This is where the site stands, what's already
in place, and the highest-value places to start. It's a **static HTML site** (no
CMS, no build step) on **Vercel**; a git push to `main` deploys to production in
~1 minute. Sibling docs worth reading: the **Site Update Playbook** and **Site
Map** (shared separately), and `docs/design-system.md`.

## The 60-second picture

- **Live now:** `https://ps-dot-com.vercel.app` — repo `github.com/jaypiddy/PS-Dot-Com`.
- **Pre-cutover:** the site will move to **`powershifter.com`** (apex, non-www — see below). The old Webflow site is still live at that domain today.
- **Scale:** 94 indexable URLs — 8 core/section pages, **23** case studies (`/work/<slug>`), **63** blog posts (`/insights/<slug>`). Clean URLs (no `.html`).
- **Content source:** case studies are hand-published HTML; blog posts are generated from a Notion export. Don't hand-edit generated blog files.

## What's already done ✅

| Area | State |
|---|---|
| **Title tags** | 100% — all 94 pages have a unique `<title>`. |
| **Meta descriptions** | 100% — all 94 pages. |
| **Open Graph + Twitter** | **Case studies (23):** full — `og:image` + `og:title` + `og:description` + `twitter:card`. **Blog (63):** full. **All other pages:** OG copy present. |
| **OG images** | 23 case studies + 63 posts have real share images (1200×630, headline burned onto a keyframe). Hosted on **Cloudflare Images**. Pipeline: `tools/og-composer/`. |
| **XML sitemap** | `/sitemap.xml` — all 94 URLs, with `lastmod` + priority. ⚠️ Currently keyed to the **vercel.app** domain (see cutover tasks). |
| **robots.txt** | `/robots.txt` — allows all, points to the sitemap. |
| **301 redirects** | **All 173 legacy Webflow URLs** mapped to the new site in `vercel.json` (177 rules total). Old `/blog/*`, `/our-work/*`, `/studio/*`, `/casestudies/*`, retired sections — all covered. **Inert until the domain points here.** |
| **Indexability** | No accidental `noindex` anywhere. Semantic HTML, heading hierarchy, and an accessibility pass are done. |
| **Media hygiene** | Local images are optimized; video is on Cloudflare Stream, share images on Cloudflare Images — not bloating the repo. |

## Where to start — gaps, roughly in priority order 🎯

1. **Analytics & Search Console — nothing is installed.** No GA4, GTM, or other tag was found in the markup. Stand up **GA4** (and GTM if you want tag flexibility), verify **Google Search Console** + **Bing Webmaster**, and **submit the sitemap** (after cutover, on the final domain). This is the biggest blind spot right now.
2. **Canonical tags — none exist.** No page has `rel="canonical"`. Add self-referencing canonicals site-wide. This matters especially because (a) the domain has both apex + www, and (b) there are 177 redirects in play. Easy to template across the case/blog generators.
3. **Structured data (JSON-LD) — none exists.** No schema on any page. High-value adds: `Organization` (home), `Article` for blog posts, `Article`/`CreativeWork` for case studies, and `BreadcrumbList` on nested pages. The Notion source already carries a `Schema Type: Article` field to build from.
4. **OG images for the core pages.** Home, Work, Digital, Studios, About have OG **copy** but no `og:image` yet (they don't fit the per-case keyframe formula — pick a signature image each). Privacy/Terms intentionally have none.
5. **Ongoing / audit:** internal-link structure, `alt` text coverage, Core Web Vitals / page speed, keyword + content strategy, and heading-hierarchy review. Standard territory — the foundation above is solid to build on.

## Domain cutover checklist (powershifter.com)

Do these when the domain flips from the old Webflow site to this Vercel deployment:

1. **Canonical host: apex `powershifter.com` (non-www).** The old site's sitemap already declares apex, so this preserves continuity. In Vercel, add both `powershifter.com` and `www.powershifter.com`, set apex as primary — Vercel auto-301s `www` → apex.
2. **Regenerate `sitemap.xml` + `robots.txt`** with the `powershifter.com` base (they currently say `ps-dot-com.vercel.app`). One-line change in the generator — ask the dev/Claude Code to flip it.
3. **Add canonicals** pointing at `powershifter.com` (see gap #2).
4. **Verify the redirects live** — spot-test a handful of old URLs (e.g. `/blog/new-way-to-write-rfps`, `/studio/iron-mountain-case-study`, `/our-work/delta-controls`) resolve with a single 301 to the right new page.
5. **Submit the new sitemap** in Search Console; watch Coverage + the redirect/404 reports for the first few weeks.

## Redirect judgment calls to review

The old→new map is complete, but a few legacy URLs had no clean equivalent and got sensible defaults — confirm or redirect elsewhere (all in `vercel.json`):

- `/marketing/*` (old Contentful/headless SEO landing pages) → `/digital`
- `/join-us`, `/why-us` → `/about`
- `/casestudies/lululemon`, `/casestudies/tangram`, `/files/lululemontakebackproposal` → `/work` (no current equivalent; could be 404 instead)

## Key facts & pointers

| | |
|---|---|
| Production | `ps-dot-com.vercel.app` → `powershifter.com` (pending) |
| Repo | `github.com/jaypiddy/PS-Dot-Com` |
| Redirects | `vercel.json` → `redirects` array (177 rules, 301s) |
| Sitemap / robots | `/sitemap.xml`, `/robots.txt` (static — **regenerate when a case or post is added**) |
| OG image tooling | `tools/og-composer/` (`generate_og.py` blog, `generate_og_work.py` cases) |
| Cloudflare Images | `imagedelivery.net/So76NP_fFT3s9jNLvxCRFw/<id>/public` |
| Cloudflare Stream | `customer-xv1aafyshr3tbknu.cloudflarestream.com/<uid>` |
| Related docs | Site Update Playbook · Site Map · `docs/design-system.md` |

## Two things that will trip you up

- **`main` is production.** No staging gate — every commit to `main` publishes. Use a branch + PR + the Vercel preview for anything non-trivial.
- **The blog is generated.** Never hand-edit `insights/<slug>.html` — edit the Notion source (or the `article.html` template) and re-render, or your change is overwritten. Case studies and core pages are hand-edited HTML and safe to touch directly.
