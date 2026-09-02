---
name: ps-blog-publish
description: "Publish a Power Shifter blog post to powershifter.com — Notion draft to live page. Use when the user wants a finished post pushed live, an existing post re-rendered, a hero image uploaded to Cloudflare Images, an inline figure or animation added to a post, or asks how the blog publishing pipeline works. Trigger on \"publish this post\", \"push the blog live\", \"upload the hero image\", \"re-render the blog\", \"add a figure to the post\", or \"update the blog\". Companion to ps-blog-writer — that skill writes the post, this one ships it."
---

# Publishing a Power Shifter blog post

powershifter.com is 99 hand-maintained HTML files on Vercel with no build step. Notion is the CMS; a Python renderer turns Notion content into those files; pushing to `main` deploys. Nothing is generated at request time, so a post is not live until the HTML is committed and pushed.

This skill ships inside the repo, so it is already where the work happens. Run every command from the repo root. (On JP's machine that is `~/work/ps/powershifter.com`.)

## The pieces

| | |
|---|---|
| Notion Blogs DB | source of truth for copy, SEO fields, images, status |
| `tools/blog-renderer/fetch_notion.py` | Notion → `posts.json` |
| `tools/blog-renderer/render_blog.py` | `posts.json` → `insights/<slug>.html` + the `insights.html` card grid |
| `tools/blog-renderer/blocks/` | hand-authored HTML partials pulled in by `[[markers]]` |
| `tools/serve.py` | local preview that matches Vercel's clean-URL and redirect behaviour |
| ps-images Worker | uploads images to Cloudflare Images without the API token leaving Cloudflare |

Articles live at `insights/<slug>.html` and serve at `/insights/<slug>`. This is the only nested page set in the repo, so every internal link the renderer emits must be root-absolute (`/insights/...`).

The section is called **"Thinking in public"** in all copy. "Insights" survives only as the URL segment and directory name — never put it in visible text.

## First time on this repo

Someone arriving from a clone has three things to configure. All three are per-person and none of them belong in the repo.

1. **Notion access** to the powershifter.com CMS workspace, and to the Blogs database specifically.
2. **A Notion integration token** — `python3 tools/blog-renderer/fetch_notion.py --set-token`, pasted at the hidden prompt. Stored at `tools/blog-renderer/.notion-token`, which is gitignored.
3. **The image upload key**, in the macOS keychain under `ps-images-key`, with the `psupload` shell function in `~/.zshrc`. `worker-images/README.md` has both.

`python3 tools/blog-renderer/fetch_notion.py --check` runs a four-step preflight and names whichever piece is missing.

Python 3 and nothing else — the tools have no dependencies.

## The run

1. **Hero image.** `psupload hero.jpg` from any directory. It returns an `id` and four variant URLs. Paste the URL into the Notion row's Masthead / OG / Thumbnail fields. (The alias lives in `~/.zshrc` and reads the upload key from the macOS keychain — never ask for or handle the key itself.)

2. **Notion row.** Confirm Slug, Meta Title, Meta Description, Excerpt, Categories, Author, Publish Date. Set **Status → Published** — the renderer skips everything else, and `test-blog` besides.

3. **Fetch and render.**
   ```
   python3 tools/blog-renderer/fetch_notion.py
   python3 tools/blog-renderer/render_blog.py
   ```
   The renderer is idempotent — re-running on unchanged content produces a byte-identical tree. A non-empty diff on posts you did not touch is a signal, not noise: read it before committing.

4. **Preview.** `python3 tools/serve.py`, then open `http://localhost:8000/insights/<slug>`.

5. **Two things the renderer does not do.** Both are required and both are easy to forget:
   - **`sitemap.xml`** — add a `<url>` entry. Insights entries are alphabetical by slug; copy `changefreq` and `priority` from a neighbour rather than inventing values.
   - **`index.html`** — the home page carries one card per stream (Build / Frames / Founder's Focus), newest first. A new post usually displaces the card in its own stream. The renderer never touches `index.html`.

6. **Ship.** Work on a branch — `post/<slug>` is the convention — not directly on `main`.

   ```
   git add -A
   git commit -m "Publish: <headline>"
   git push -u origin post/<slug>
   ```

   Pushing a branch builds a **Vercel preview**: a real URL on the real infrastructure, unlisted. Check the post, the listing and the home page there — the preview is the review surface, not localhost.

   Then open a PR against `main` and merge it. **Merging to `main` is the production deploy.** Solo and confident, the same thing minus the PR:

   ```
   git checkout main && git merge --ff-only post/<slug> && git push origin main
   ```

   `--ff-only` refuses rather than creating a merge commit if anything unexpected has landed on `main`, which is the whole reason to use it.

## Inline figures and the newsletter

A line in the Notion body that is *only* `[[name]]` is replaced by `blocks/<name>.html`.

| Marker | Pulls | Numbered |
|---|---|---|
| `[[newsletter]]` | `newsletter.html` — the site's own `.signal` component | no |
| `[[fig:harvest-meter]]` | `fig-harvest-meter.html` | **yes** |

`[[fig:*]]` takes the next number in that post's `Fig. 01` / `Fig. 02` series, counted alongside the plain markdown images around it. `{{FIG}}` in the partial receives `Fig. 03`; `{{N}}` receives `03`. Anything after `: ` in the marker lands as `{{ARG}}`, run through the inline formatter — so `[[newsletter: Pricing is one dispatch of many.]]` sets that block's lead sentence.

A marker with no matching file renders an HTML comment and makes the renderer **exit non-zero**, naming the post and the file it wanted. It does not abort the run.

**Writing a partial:** self-contained — its own scoped CSS and JS inline, no CDN. Prefix local CSS variables `--ps-*` so they cannot collide with the site's design tokens, and inherit `--ink`, `--paper`, `--grey`, `--line`, `--magenta`, `--mono`, `--serif`, `--text` from the site rather than redefining them. Wrap it in `<figure class="breakout ...">` to get the site's full-width treatment, and use the site's `<figcaption><b>{{FIG}}</b><span>…</span></figcaption>` shape. An animated partial must pause off-screen via IntersectionObserver and paint a single end state under `prefers-reduced-motion`.

Verify a new partial headlessly before committing — render it in a page carrying the site's tokens, screenshot at peak and under reduced motion, and check for console errors. A figure that only breaks on someone else's machine is the expensive kind.

## Known rough edges

**Images are all on the `/public` variant.** Every post's masthead, thumbnail and OG image point at `/public`. The sized `masthead` (1920×1080), `thumb` (800×450) and `og` (1200×630) variants are the reason the upload Worker exists, but nothing uses them yet. `og` matters most — it is 1.91:1, not the 16:9 hero crop, and reusing the masthead for social is what makes scrapers crop unpredictably. Moving the set over is a deliberate change and needs the variants confirmed live first (`curl` a delivery URL per variant; a `404` means the variant is not defined in the Cloudflare dashboard).

**Home-page card titles are hand-tightened.** The cards read in sentence case ("Power Shifter launches its Rapid MVP service") while Notion holds title case ("Power Shifter Launches Rapid MVP Service"). Generating that block straight from Notion would quietly retype the row in title case. Automating it needs a decision on where the short form lives — a Notion "Card Title" field, or an overrides file in the repo.

**Notion escapes punctuation.** The markdown endpoint backslash-escapes ASCII punctuation liberally — `\$600`, `100\%`, `A \| B`. `inline()` resolves the full CommonMark set. If a stray backslash ever appears on a page, that function is where it went wrong, not the content.

**Chrome lives in all 99 files.** Nav, footer and CSS are copied verbatim into every page, and `article.html` is both a live page and the renderer's template. A chrome change is a scripted 99-file sweep, never a hand edit.

## Verify, don't assume

This pipeline has produced confident wrong answers before. Two habits that catch them:

- **Read the repo, not a summary of it.** Claims about what a page contains, what a redirect does, or what a route resolves to get checked against the files. Web-fetch summarizers confabulate, and a leading question reliably induces a false positive.
- **Never put a secret in chat.** The Cloudflare API token, the upload key and the Notion integration token live in the keychain, in Cloudflare, or in a gitignored file. The Worker's `/health` endpoint reports whether they are set, not what they are. The Vercel deploy hook URL belongs in the Notion automation and nowhere else — anyone holding it can trigger a production build.

## Branches and deploys

| | |
|---|---|
| `main` | production. Every merge deploys to powershifter.com within a minute or two. |
| any other branch | an unlisted Vercel preview build, per push. |

There is no build step — the HTML in the repo *is* what ships. A broken commit on `main` is a broken site, so the preview is worth the extra minute.

Never commit generated HTML that the renderer did not just produce. If a page needs fixing, fix the Notion content or the converter and re-render; a hand edit to `insights/<slug>.html` survives exactly until the next run.

## Working through the Cowork device bridge

Only relevant when Claude is driving git on the user's machine — skip this if you are a person at a terminal.

That sandbox cannot delete files. `git` leaves `.git/*.lock` and `.git/objects/tmp_obj_*` behind after most commands, and a stale `index.lock` wedges the next call. Move them aside rather than deleting:

```
for f in .git/*.lock; do [ -e "$f" ] && mv "$f" _to_delete/gitlocks/$(basename $f).$(date +%s%N); done
find .git/objects -name 'tmp_obj_*' -exec mv {} _to_delete/gitobjs/ \;
```

`_to_delete/` is gitignored and exists so removals have somewhere to go. It has to be emptied by hand.

Pushes need GitHub credentials the sandbox does not have — the user runs `git push` themselves. Do not report a push as done on the strength of git saying "up to date"; confirm against the live site or the user's own terminal.
