# Case-study publishing — system, mapping, and workflow

How a case study goes from Notion → a static page on the site, using `case-telus-koodo.html`
as the canonical template. Status: **TELUS & Koodo is the only fully-built example.** We are
validating the pipeline by hand-publishing a second one (Energizer) before automating it.

## The system (3 layers)

1. **Case Studies DB** — Notion database (`powershifter.com CMS`). The **index / metadata**.
   - DB: `77b9e6f8-e8ae-48f8-9697-1d4bc2c372d7` · data source `collection://906abf9b-c8f1-4ff3-9d23-9e0d2c1e576c`
   - Properties: Title, Headline, Summary/Excerpt, Services, Outcome Tier (1/2/3), Needs
     Review, Slug, Source URL, SEO Title, Meta Description, Hero Image / Thumbnail, OG Image,
     Schema Type, Status (Draft/Published/Scheduled), Asset Tracker (relation).
2. **Copy Deck pages** — under `Copy Deck — powershifter.com` (`388b37ad-cd5b-81e9-946a-f8f38d89d5ad`).
   The **slot-by-slot copy**, authored *as template sections* (EYEBROW / H1 / SUB-VOICE / byline
   table / fact sheet / 3 odometer stats / the five `the X.` sections / pull-quotes / figures /
   before-after / next-case). TELUS reference deck: `388b37ad-cd5b-81b2-9104-d3f6a7c9eafc`.
3. **HTML template** — `case-telus-koodo.html`. The render target. Now cleaned of the broken
   koodo-wordmark animation and tuned to the `web-animation-design` motion standard.

> The DB alone can't render a page — the rich content (odometer stats, figures, pull-quotes,
> before/after, next-case) lives in the **copy deck**, not DB fields. You need both. Images are
> external **Cloudflare Images** URLs, populated separately.

## Mapping (Notion → HTML slot)

| Notion source | → HTML slot |
|---|---|
| DB **Title** + **Headline** | `h1#title` = "[Client] — [Headline]" |
| DB **Summary/Excerpt** → deck **SUB-VOICE** | `.sub-voice > em.voice.mag` |
| DB **Services** → deck byline/fact | `.byline .role` + dossier `.cs-fact` Services |
| DB **SEO Title / Meta Description** | `<title>` / `<meta name="description">` |
| DB **Hero/OG Image** (Cloudflare URLs) | masthead `<img>` / `og:image` |
| DB **Slug / Status / Outcome Tier / Needs Review** | route, publish gate, outcome treatment, `[OUTCOME PLACEHOLDER]` flag |
| Deck **EYEBROW** | hero `.eyebrow` ("Category · Client") |
| Deck **Fact sheet** (`<dl>`) | dossier Client / Sector / Services / Platform |
| Deck **Topline stats** (3) | 3 `.stat` odometers (number / suffix / caption) |
| Deck **the brief./challenge./process./solution./outcome.** | the five body `<h2>` (lowercase + period — canon) |
| Deck **PULL** (eyebrow + `*mag*`) → skill `> **pull:**` | `<aside class="pull">` + `span.mag` |
| Deck **Fig 01/02**, **In-the-wild video**, **Before/after**, **Credentials**, **Next case** | `figure.breakout`, `.cs-kiosk`, before-after card, cred chips, `.post` cards |

Voice/structure rules are owned by the **`ps-case-study-writer`** skill (five-section spine,
no fabricated metrics, 2–3 pull quotes, verbatim testimonials).

## Hand-publish workflow (what we're doing manually first)

1. Pull the case study's **DB row** (metadata) + its **copy deck** page (content) from Notion.
2. Copy `case-telus-koodo.html` → `<slug>.html`. Fill every slot from the mapping above.
3. Where the source has a gap (missing image, thin outcome, no testimonial), **log it** — don't
   invent. Use the skill's `[OUTCOME PLACEHOLDER]` convention; set DB **Needs Review** if open.
4. Wire footer/next-case links; set the eyebrow convention; clean-URL route.
5. Verify locally (`.html` for the file server; clean URL on Vercel), then commit + push.
6. **Keep a build journal** (below) of what mapped cleanly vs. what fought the template —
   that evidence is what the future `case-study-publisher` skill gets built from.

## NEXT SESSION — hand-publish Energizer

- **Energizer Notion page:** `38ab37ad-cd5b-81e4-8320-fc905ca8c0cc` ("Energizer, a global leader
  in battery innovation, was sitting on a new and experimental…"). Pull this + its DB row + any
  copy-deck entry.
- Known angle (from concierge KB): **product-market fit validated in 30 days via a rapid POC** —
  likely an Outcome Tier 2/3 (qualitative / fact-of-record), so expect to use the placeholder
  convention rather than hard metrics.
- Target file: `energizer.html` → clean route `/energizer`.
- Decisions still open going in: confirm the slug/`NN-` order with JP; confirm hero/figure
  imagery (Cloudflare Images) or use plain `--ink` plates like TELUS until assets exist.

### Build journal (append as we go)
- _(empty — start logging during the Energizer publish: each slot that mapped cleanly, each
  gap, each template tweak needed.)_
