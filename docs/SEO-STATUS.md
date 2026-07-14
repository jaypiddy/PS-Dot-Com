# SEO — status & handoff

_Last updated: 2026-07-07_

For the incoming SEO specialist. This is where the site stands, what's already
in place, and the highest-value places to start. It's a **static HTML site** (no
CMS, no build step) on **Vercel**; a git push to `main` deploys to production in
~1 minute. Sibling docs worth reading: the **Site Update Playbook** and **Site
Map** (shared separately), and `docs/design-system.md`.

## The 60-second picture

- **Live now:** `https://powershifter.com` (apex, canonical — cut over 2026-07-13; `ps-dot-com.vercel.app` still serves the same deployment as a secondary origin) — repo `github.com/jaypiddy/PS-Dot-Com`.
- **Pre-cutover:** the site will move to **`powershifter.com`** (apex, non-www — see below). The old Webflow site is still live at that domain today.
- **Scale:** 94 indexable URLs — 8 core/section pages, **23** case studies (`/work/<slug>`), **63** blog posts (`/insights/<slug>`). Clean URLs (no `.html`).
- **Content source:** case studies are hand-published HTML; blog posts are generated from a Notion export. Don't hand-edit generated blog files.

## What's already done ✅

| Area | State |
|---|---|
| **Title tags** | 100% — all 94 pages have a unique `<title>`. |
| **Meta descriptions** | 100% — all 94 pages. |
| **Open Graph + Twitter** | **Case studies (23):** full — `og:image` + `og:title` + `og:description` + `twitter:card`. **Blog (63):** full. **Core pages (7):** full — Home, About, Digital, Studios, Work, Insights, Careers now have `og:image` + `twitter:card` (added 2026-07-13). Privacy/Terms intentionally have none. |
| **OG images** | 23 case studies + 63 posts (1200×630, headline burned onto a keyframe) on **Cloudflare Images** (pipeline `tools/og-composer/`). **7 core-page brand tiles** (1200×630, brand headline on ink) stored **locally** at `/images/og/og-<page>.png` — local is the house default now; referenced by absolute URL keyed to the vercel.app base (flips at cutover). |
| **XML sitemap** | `/sitemap.xml` — all 94 URLs, with `lastmod` + priority. ⚠️ Currently keyed to the **vercel.app** domain (see cutover tasks). |
| **robots.txt** | `/robots.txt` — allows all, points to the sitemap. |
| **301 redirects** | **All 173 legacy Webflow URLs** mapped to the new site in `vercel.json` (177 rules total). Old `/blog/*`, `/our-work/*`, `/studio/*`, `/casestudies/*`, retired sections — all covered. **Inert until the domain points here.** |
| **Canonical tags** | 100% — self-referencing `rel="canonical"` on all 94 pages (keyed to the vercel.app base to match the sitemap; flips at cutover). |
| **Structured data (JSON-LD)** | `Organization` on the home page, `Article` on all 23 case studies, `BlogPosting` (with `datePublished`) on all 63 posts. All validated. |
| **Indexability** | No accidental `noindex` anywhere. Semantic HTML, heading hierarchy, and an accessibility pass are done. |
| **Media hygiene** | Local images are optimized; video is on Cloudflare Stream, share images on Cloudflare Images — not bloating the repo. |

## Where to start — gaps, roughly in priority order 🎯

1. **Analytics & Search Console — nothing is installed.** No GA4, GTM, or other tag was found in the markup. Stand up **GA4** (and GTM if you want tag flexibility), verify **Google Search Console** + **Bing Webmaster**, and **submit the sitemap** (after cutover, on the final domain). This is the biggest blind spot right now.
2. ~~**OG images for the core pages.**~~ ✅ Done 2026-07-13 — 7 brand tiles at `/images/og/`, wired on all core pages.
3. **Extend the structured data.** The basics are in place (see above). Worth adding next: `BreadcrumbList` on nested pages, and `logo` + `sameAs` (social profiles) on the `Organization` schema — the site currently has **no social links** in its markup, so those need sourcing first.
4. **Ongoing / audit:** internal-link structure, `alt` text coverage, Core Web Vitals / page speed, keyword + content strategy, and heading-hierarchy review. Standard territory — the foundation above is solid to build on.

## Domain cutover checklist (powershifter.com) — ran 2026-07-13

1. ✅ **Apex live on Vercel.** `powershifter.com` A-record → Vercel (`216.150.1.1`), Valid Configuration, cert issued, serving. ⚠️ **`www.powershifter.com` still has NO DNS record** — add `CNAME www → cname.vercel-dns.com` in Route 53 and add the `www` domain in Vercel (apex primary → auto-301 www → apex).
2. ✅ **Base domain flipped** repo-wide (`sitemap.xml`, `robots.txt`, all `rel="canonical"`, JSON-LD `url`s, og:image URLs, `BASE` in `render_blog.py`) + blog re-rendered. Concierge Worker `ALLOWED_ORIGIN`/`KB_URL` updated + redeployed (both origins allowed during transition).
3. ✅ **Redirects verified live** (see below — spot-checked 2026-07-13).
4. ⬜ **Submit the sitemap** (`https://powershifter.com/sitemap.xml`) in Search Console; watch Coverage + redirect/404 reports for the first few weeks. (GSC still not set up — see gap #1.)

## Redirect judgment calls to review

The old→new map is complete, but a few legacy URLs had no clean equivalent and got sensible defaults — confirm or redirect elsewhere (all in `vercel.json`):

- `/marketing/*` (old Contentful/headless SEO landing pages) → `/digital`
- `/join-us`, `/why-us` → `/about`
- `/casestudies/lululemon`, `/casestudies/tangram`, `/files/lululemontakebackproposal` → `/work` (no current equivalent; could be 404 instead)

## Key facts & pointers

| | |
|---|---|
| Production | `powershifter.com` (live 2026-07-13; `ps-dot-com.vercel.app` = secondary origin, canonicals point at apex) |
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
