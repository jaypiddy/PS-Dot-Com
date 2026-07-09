# QA brief — POWER SHIFTER site (pre-launch)

_Last updated: 2026-07-08_

Context + test cases for a full pre-launch QA pass. The site is a **static multi-page
HTML** site on **Vercel** (no CMS, no build step). It's **pre-cutover**: it lives at the
dev URL below and will move to `powershifter.com` later — a few things are *intentionally*
keyed to the dev domain until then (see **Known/expected states**).

## Test environment
- **URL:** `https://ps-dot-com.vercel.app`
- **Clean URLs:** routes have no `.html` (e.g. `/work/xyon`, not `/work/xyon.html`).
- **Browsers to cover:** Chrome, Safari, Firefox, Edge (desktop) + iOS Safari & Android Chrome.
- **Breakpoints:** phone **375**, tablet **768**, desktop **1280** (min).

## What changed recently (focus areas)
This build added/changed a lot — weight testing here: **3 new Studios case studies**
(Algorithm Trap, Rapid MVP – Luma, Maple Health), all **case-study gallery images moved to
local hosting**, **hover-video** on Studios work cards, **GA4** analytics, **security headers**,
a **173-URL redirect map**, and **canonical + structured data** site-wide.

---

## Test cases

### A. Global chrome (every page)
| # | Test | Expected |
|---|---|---|
| A1 | Top nav links (Work, Digital, Studios, Insights, About) | Each loads the correct page; current page shows active state |
| A2 | "Menu +" opens the full-screen takeover; Close button | Overlay opens, links navigate, closes cleanly (no scroll-lock left behind) |
| A3 | Logo click | Returns to home `/` |
| A4 | Scroll a long page | Nav color inverts correctly over dark vs. light sections (no stuck/wrong color) |
| A5 | Footer nav + Terms/Privacy links | All resolve |
| A6 | Concierge bubble (bottom-left) → open, ask a question | AI chat returns a real reply |
| A7 | Concierge/contact form → submit a test message | Success state shown; email actually received (bd@powershifter.com) |
| A8 | Footer newsletter field | Behaves as designed (confirm expected behavior with team) |

### B. Links & routing
| # | Test | Expected |
|---|---|---|
| B1 | Click through **every** nav/card/footer link | No 404s; all resolve |
| B2 | Deep-load a nested URL directly (paste `…/work/celestial-ai`) | Loads fully (styles, nav, concierge all work — not just from in-site clicks) |
| B3 | Legacy flat redirect, e.g. `/5x5`, `/xyon` | 301s to `/work/<slug>` |
| B4 | Nonexistent URL, e.g. `/nope` | Sensible 404 (not a broken page) |

### C. Case studies (23 pages — heaviest focus)
| # | Test | Expected |
|---|---|---|
| C1 | **Every case-study gallery loads** (esp. the 5 Studios films) | All images appear — **no broken/empty image boxes** (galleries were just re-hosted locally) |
| C2 | Studios film embed (celestial-ai, iron-mountain, algorithm-trap, maple-health, rapid-mvp-launch) | Cloudflare video autoplays muted + loops in the screening room; poster shows before load |
| C3 | **Hover a Studios card** on `/work` and `/studios` | The film loop plays on hover with no visible delay and no console/network 404 |
| C4 | Visual "blocks" (`.ab`) on cases that have them (Angel Oak, TELUS Support, Allia, etc.) | Render centered, **no horizontal scrolling**, restack correctly on mobile |
| C5 | Closing "in the wild" reel (`cs-reel`) where present | Hover-to-play works |
| C6 | Proof-row odometer (metric counters) | Numbers roll up on scroll into view |
| C7 | "Next case" links at page bottom | Resolve to real case pages |

### D. Filter grids
| # | Test | Expected |
|---|---|---|
| D1 | `/work` tabs: All / Digital / Studios / Hybrid | Cards filter; counts match; smooth cross-fade |
| D2 | `/insights` tabs: All / Build / Frames / Founder's Focus | Posts filter correctly |
| D3 | Click any filter tab repeatedly | **Other tabs never disappear** (past bug — regression check) |

### E. Blog / Insights (63 posts)
| # | Test | Expected |
|---|---|---|
| E1 | Open several articles | Headline, body, images, and "related posts" all render |
| E2 | `/insights` grid | Cards load, images present, filter works |

### F. Responsive / mobile
| # | Test | Expected |
|---|---|---|
| F1 | Every page at 375 / 768 / 1280 | **No horizontal scroll/overflow** anywhere |
| F2 | Case-study dossier + blocks on mobile | Type never touches the left edge; blocks restack (past bug — regression) |
| F3 | Nav on mobile | Collapses to the takeover menu correctly |

### G. SEO / meta (spot-check — most is automated-verified)
| # | Test | Expected |
|---|---|---|
| G1 | Share a **case study** URL (Slack/LinkedIn debugger) | Shows OG image + title + description |
| G2 | Share a **core page** (home/work/digital/studios/about) | Title + description show; **image may be absent — that's pending, not a bug** |
| G3 | `/sitemap.xml` and `/robots.txt` | Both load; sitemap lists ~94 URLs |

### H. Analytics
| # | Test | Expected |
|---|---|---|
| H1 | Load the site, navigate 3–4 pages, watch **GA4 → Realtime** (property "POWERSHiFTER - GA4 - Webflow 2022") | Your session + pageviews appear |

### I. Accessibility
| # | Test | Expected |
|---|---|---|
| I1 | Keyboard-only: Tab through nav, cards, menu, concierge, form | Everything reachable; focus is always visible |
| I2 | Images | Have meaningful `alt` (decorative ones empty) |
| I3 | OS "reduce motion" on | Reveal/hover animations are suppressed, page still usable |

---

## Known / expected states — DO NOT log these as bugs
- **Canonical, sitemap, and robots point to `ps-dot-com.vercel.app`.** Correct for now; they flip to `powershifter.com` at cutover.
- **Core pages (home, work, digital, studios, about) have no `og:image` yet** — copy is in, images are a pending pass.
- **Footer "Careers"** and the **"Start a project" CTA** are `#` placeholders (not wired yet).
- **No "skip to content" link** — intentionally removed.
- **Vercel Analytics is not active** — GA4 is the analytics of record; ignore any `/_vercel/insights/*` absence.
- **`design-sprint-day-four.html`** is an unlinked dev artifact slated for deletion — not part of the site.
- **Old Webflow URLs** (`/blog/…`, `/studio/…`, `/our-work/…`) **do not redirect yet** — those rules are staged in `vercel.json` but only take effect once `powershifter.com` points at this deployment (the old site still serves that domain today).

## Out of scope (handled at cutover, not QA)
Domain move to `powershifter.com`, www→apex, Search Console / Bing verification + sitemap submission, and the canonical/sitemap domain flip.

## Already hardened (context — don't re-investigate)
A pre-launch audit already cleared: internal links, root-absolute paths, meta/canonical/JSON-LD completeness, redirect sanity, security headers (X-Frame-Options etc. + HSTS), self-hosted `hls.js`, no exposed secrets, no mixed content, and the hover-video `.webm` 404. See `docs/SEO-STATUS.md` for the SEO state.

## Reporting
Log each issue with: **URL**, **browser + device/viewport**, **steps**, **expected vs. actual**, and a **screenshot/recording**. Flag severity (blocker / major / minor / cosmetic).
