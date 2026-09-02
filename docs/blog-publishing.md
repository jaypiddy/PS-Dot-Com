# Publishing a blog post

Notion holds the writing. A script in this repo turns it into web pages. Pushing
to `main` puts them on powershifter.com.

The section is called **Thinking in public** everywhere a reader can see it. The
word "insights" survives only inside web addresses and directory names — never
put it in visible copy.

This is the same process as the `ps-blog-publish` skill in `.claude/skills/`,
written for reading rather than invoking. Change both together.

---

## Before your first publish

One-time, per person.

1. **Notion access** to the powershifter.com CMS workspace, and the Blogs
   database specifically.
2. **Clone this repo.** Python 3 is the only requirement — the tools have no
   dependencies.
3. **Add your Notion token:**

   ```
   python3 tools/blog-renderer/fetch_notion.py --set-token
   ```

   Paste it at the hidden prompt. It lands in `tools/blog-renderer/.notion-token`,
   which is gitignored. Never paste a token into a chat, a doc, or a commit.

4. **Set up image uploads.** Get the upload key from JP, then:

   ```
   security add-generic-password -a "$USER" -s ps-images-key -w
   ```

   and add to `~/.zshrc`:

   ```
   psupload() {
     curl -s -X POST https://ps-images.jp-440.workers.dev/upload \
       -H "X-Upload-Key: $(security find-generic-password -s ps-images-key -w)" \
       -F file=@"$1"
   }
   ```

5. **Confirm:** `python3 tools/blog-renderer/fetch_notion.py --check` runs a
   four-step preflight and names whichever piece is missing.

---

## 1. Write it in Notion

New row in the Blogs database. The body of the Notion page is the article.

Required, because they are the SEO:

| Field | What it is |
|---|---|
| Slug | The bit after the slash in the address. Lowercase, hyphens, no spaces. |
| Meta Title | What shows in Google and the browser tab. May differ from the headline. |
| Meta Description | The grey sentence under the Google result. |
| Excerpt | The sentence on the card in the listing. |
| Categories | Build, Frames, or Founder's Focus. One. |
| Author, Publish Date | |

For voice, use the `ps-blog-writer` skill or read the catalogue.

**One paragraph per line.** Notion exports one block per line, so a hand-wrapped
paragraph becomes several paragraphs on the page.

## 2. Upload the hero image

```
psupload hero.jpg
```

Prints an `id` and four addresses. Copy the `public` one into three Notion
fields: **Masthead Image**, **OG Image**, **Thumbnail Image**.

## 3. Figures and the newsletter (optional)

A line in the body that is *only* a marker, on its own line:

```
[[fig:harvest-meter]]
[[newsletter: Pricing is one dispatch of many.]]
```

`[[fig:*]]` pulls `tools/blog-renderer/blocks/fig-*.html` and takes the next
number in that post's `Fig. 01` / `Fig. 02` series, counted alongside the plain
images around it. `[[newsletter]]` drops in the site's own signup component; the
text after the colon becomes its lead sentence. One per post, near the midpoint.

The partial has to exist first — see `tools/blog-renderer/blocks/README.md` for
how to write one. A marker with nothing behind it stops the build and names the
missing file, so a post cannot ship with a hole in it.

## 4. Status → Published

Nothing else gets built. This is the switch, and it puts nothing on the internet
by itself.

## 5. Fetch and render

```
git checkout main && git pull
git checkout -b post/<slug>
python3 tools/blog-renderer/fetch_notion.py
python3 tools/blog-renderer/render_blog.py
```

The renderer is deterministic — re-running on unchanged content produces a
byte-identical tree. **If it reports changes to posts you did not touch, stop and
read the diff.** That is a signal, not noise.

## 6. Preview locally

```
python3 tools/serve.py
```

Open `http://localhost:8000/insights/<slug>`. `Ctrl-C` stops it. This matches
Vercel's clean-URL and redirect behaviour, which a plain file:// open does not.

## 7. The two edits the script will not make

Manual, every time, with no warning if you skip them.

1. **`sitemap.xml`** — add a `<url>` entry. The insights entries are alphabetical
   by slug; copy `changefreq` and `priority` from a neighbour rather than
   inventing values.
2. **`index.html`** — the home page carries one card per stream (Build, Frames,
   Founder's Focus), newest first. A new post usually displaces the card in its
   own stream.

Home-page card titles are hand-tightened to sentence case and shorter than the
Notion title. Match that, don't paste the headline.

## 8. Ship

```
git add -A
git commit -m "Publish: <headline>"
git push -u origin post/<slug>
```

Pushing a branch builds an unlisted **Vercel preview** on real infrastructure.
Review the post, the listing and the home page there — the preview is the review
surface, not localhost.

Then PR against `main` and merge. **Merging to `main` is the production deploy.**

Solo, the same thing minus the PR:

```
git checkout main && git merge --ff-only post/<slug> && git push origin main
```

`--ff-only` refuses rather than creating a merge commit if something unexpected
has landed on `main`. That refusal is the reason to use it.

---

## Branches and deploys

| | |
|---|---|
| `main` | Production. Every merge deploys within a minute or two. |
| any other branch | An unlisted Vercel preview build, per push. |

There is no build step — the HTML in this repo *is* what ships. A broken commit
on `main` is a broken site.

---

## When it looks wrong

| What you see | What it means |
|---|---|
| The post isn't on the site | Status isn't **Published**, or step 8 never happened. Check Notion first — it's the more common one. |
| Post is live, home page shows the old one | The `index.html` edit got skipped. Step 7. |
| A figure is missing, gap in its place | The marker has no partial behind it. The build names the file — read the last lines of the Terminal. |
| Social preview crops oddly | Known. Every post uses one image size for everything. See Open items. |
| A stray backslash, like `\$600` | `inline()` in `render_blog.py`, not the content. Don't edit the HTML. |

---

## Rules that keep this from breaking

**Notion is the master copy.** Editing `insights/<slug>.html` directly works
until the next render, which overwrites it. Fix the Notion content or the
converter instead.

**Site chrome lives in all 99 files.** Nav, footer and CSS are copied verbatim
into every page, and `article.html` is both a live page and the renderer's
template. A nav change is a scripted sweep across every file, never a hand edit
to one.

**Articles are one directory down.** They live at `insights/<slug>.html` and
serve at `/insights/<slug>` — the only nested page set in the repo. Every
internal link must be root-absolute: `/insights/...`, never `insights/...`.

**No secrets in chat, docs, or commits.** The Cloudflare API token, the upload
key and the Notion token belong in Cloudflare, the keychain, and a gitignored
file respectively. The Vercel deploy hook URL belongs in a Notion automation and
nowhere else — anyone holding it can trigger a production build.

---

## Open items

Known and unfinished, recorded so nobody rediscovers them as bugs.

- **Image variants aren't in use.** Every post's masthead, thumbnail and social
  image point at the same `public` file. The correctly-cropped `masthead`
  (1920×1080), `thumb` (800×450) and `og` (1200×630) variants are why
  `worker-images/` exists, but nothing consumes them yet. `og` is the one that
  matters — 1.91:1, a different shape from the 16:9 hero, which is why social
  previews crop unpredictably. Confirm the variants resolve before switching.
- **The home-page card block is hand-maintained.** Automating it needs a decision
  on where the short sentence-case card title lives: a Notion field, or an
  overrides file here.
- **Publishing isn't one click.** A Vercel deploy hook exists and a Notion
  automation on `Status → Published` could fire it, but fetch and render still
  run on someone's machine first — so the hook alone would deploy stale content.
