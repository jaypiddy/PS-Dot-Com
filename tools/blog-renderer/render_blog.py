#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PS blog renderer — RENDERER-SPEC.md.

Reads posts.json, renders each Published post onto the article.html template
(image-hero, on branch qa/image-hero), and regenerates the insights.html card
grid. Self-contained; no Notion connection, no deps (Python 3 stdlib only).

Run from the repo root:
    python3 tools/blog-renderer/render_blog.py [posts.json]

Defaults to the handoff posts.json if no path is given. Idempotent: overwrites
insights/<slug>.html for each Published post (served at /insights/<slug> via
Vercel clean URLs) and rewrites the insights.html card grid.
"""
import json, re, sys, html, pathlib
from datetime import datetime

REPO = pathlib.Path("/Users/jpholecka2025/PS-Dot-Com")
DEFAULT_POSTS = (REPO / "tools/blog-renderer/posts.json")
# Optional export from the Notion Blogs DB to fill the NEW taxonomy + Featured +
# Photo Credit (posts.json ships these empty). Notion view → CSV export. Columns
# (case-insensitive): Slug, Categories ("Build,Frames"), Featured ("Yes"/checked),
# Photo Credit. Merged by slug; absent file → falls back to old_categories.
OVERRIDES_CSV = (REPO / "tools/blog-renderer/blog-meta.csv")
TITLE_SUFFIX = " — POWER SHIFTER Insights"

# ---------------------------------------------------------------- helpers
def esc(t):
    """Escape text for HTML body context (keep markdown tokens intact)."""
    t = re.sub(r'&(?!#?\w+;)', '&amp;', t or '')
    return t.replace('<', '&lt;').replace('>', '&gt;')

def attr(t):
    """Escape for a double-quoted attribute value."""
    return esc(t).replace('"', '&quot;')

def fmt_date(s):
    if not s: return ''
    s = s.replace('Z', '+00:00')
    for cand in (s, s[:19], s[:10]):
        try:
            dt = datetime.fromisoformat(cand)
            return f"{dt.strftime('%B')} {dt.day}, {dt.year}"
        except ValueError:
            continue
    return s

_ESC_MAP = {'<': '&lt;', '>': '&gt;', '*': '&#42;', '_': '&#95;', '[': '&#91;',
            ']': '&#93;', '(': '&#40;', ')': '&#41;', '`': '&#96;', '\\': '&#92;',
            '#': '#', '.': '.', '-': '-', '!': '!', '+': '+', '"': '&quot;'}
def inline(t):
    """Inline markdown → HTML. Resolve backslash escapes, then links, bold, italic."""
    # markdown backslash-escapes → literal entities (so they survive esc + md regexes)
    t = re.sub(r'\\([<>*_\[\]()`\\#.\-!+"])', lambda m: _ESC_MAP[m.group(1)], t or '')
    t = esc(t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
               lambda m: f'<a href="{m.group(2).strip()}">{m.group(1)}</a>', t)
    t = re.sub(r'\*\*([^*]+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*([^*\n]+?)\*(?![\w*])', r'<em>\1</em>', t)
    t = re.sub(r'(?<![\w_])_([^_\n]+?)_(?![\w_])', r'<em>\1</em>', t)
    return t

def yt_id(url):
    m = re.search(r'(?:v=|youtu\.be/|embed/)([\w-]{6,})', url)
    return m.group(1) if m else None

# ---------------------------------------------------------------- body converter
def detect_embed(s):
    """A standalone URL / bare link / raw <embed|iframe> line → (video|podcast)."""
    raw = re.search(r'<(?:embed|iframe)\b[^>]*\bsrc=["\']([^"\']+)["\']', s)
    if raw:
        url = raw.group(1)
        if 'youtu' in url:
            vid = yt_id(url); return ('video', vid) if vid else ('podcast', url)
        return ('podcast', url)   # podbean / other player iframes use the same full-bleed slot
    ml = re.fullmatch(r'\[[^\]]*\]\(([^)]+)\)', s)
    url = ml.group(1) if ml else (s if re.fullmatch(r'https?://\S+', s) else None)
    if not url:
        return None
    if 'youtu' in url:
        vid = yt_id(url)
        return ('video', vid) if vid else None
    if 'podbean' in url:
        return ('podcast', url)
    return None

def parse_blocks(md):
    lines = (md or '').replace('\r\n', '\n').split('\n')
    blocks, i, n = [], 0, len(lines)
    while i < n:
        s = lines[i].strip()
        if not s:
            i += 1; continue
        if re.fullmatch(r'</[a-zA-Z][\w-]*>', s):   # stray closing tag (e.g. </embed>)
            i += 1; continue
        if s.startswith('### '):
            blocks.append(('h3', s[4:])); i += 1; continue
        if s.startswith('## '):
            blocks.append(('h2', s[3:])); i += 1; continue
        if s.startswith('# '):
            blocks.append(('h2', s[2:])); i += 1; continue
        m = re.fullmatch(r'!\[(.*)\]\(([^)]+)\)', s)  # alt may contain nested [..](..) links
        if m:
            blocks.append(('img', (m.group(1), m.group(2).strip()))); i += 1; continue
        emb = detect_embed(s)
        if emb:
            blocks.append(emb); i += 1; continue
        if s.startswith('>'):
            q = []
            while i < n and lines[i].strip().startswith('>'):
                q.append(lines[i].strip().lstrip('>').strip()); i += 1
            blocks.append(('quote', '\n'.join(x for x in q if x))); continue
        if re.match(r'[-*]\s+', s):
            items = []
            while i < n and re.match(r'\s*[-*]\s+', lines[i]):
                raw = lines[i]
                indent = len(raw) - len(raw.lstrip())
                items.append((indent, re.sub(r'^\s*[-*]\s+', '', raw).rstrip()))
                i += 1
            blocks.append(('ul', items)); continue
        if re.match(r'\d+\.\s+', s):
            items = []
            while i < n and re.match(r'\s*\d+\.\s+', lines[i]):
                items.append(re.sub(r'^\s*\d+\.\s+', '', lines[i]).strip()); i += 1
            blocks.append(('ol', items)); continue
        # Notion exports one block per line (single-\n separated, no hard wrapping),
        # so each non-block line is its own paragraph — do NOT gather consecutive lines.
        blocks.append(('p', s)); i += 1
    return blocks

def li_bold_lead(txt):
    """Bold the lead clause before an em-dash if not already emphasized."""
    if '**' not in txt and ' — ' in txt:
        head, tail = txt.split(' — ', 1)
        return f'<strong>{inline(head)}</strong> — {inline(tail)}'
    return inline(txt)

def render_ul(items):
    """One level of nesting via indentation."""
    out, idx = [], 0
    while idx < len(items):
        indent, txt = items[idx]
        children = []
        j = idx + 1
        while j < len(items) and items[j][0] > indent:
            children.append(items[j]); j += 1
        li = li_bold_lead(txt)
        if children:
            sub = "".join(f"<li>{inline(c)}</li>" for _, c in children)
            li += f'\n        <ul>{sub}</ul>\n      '
        out.append(f'      <li>{li}</li>')
        idx = j
    return '    <ul class="changes">\n' + "\n".join(out) + '\n    </ul>'

def render_quote(text):
    """Blockquote treatment — .prose blockquote (serif italic, magenta left rule,
    readable line-height). Source quotes carry their own quotation marks/attribution."""
    body = ' '.join(s for s in text.split('\n') if s.strip()).strip()
    return f'    <blockquote>{inline(body)}</blockquote>'

def convert_body(md):
    blocks = parse_blocks(md)
    p_positions = [k for k, b in enumerate(blocks) if b[0] == 'p']
    def _substantive(txt):
        letters = re.sub(r'[^A-Za-z]', '', txt)
        return len(txt) >= 60 and not (letters and letters == letters.upper())
    # lede = first SUBSTANTIVE paragraph (skip short all-caps boilerplate like "FOR IMMEDIATE RELEASE")
    first_p = next((k for k in p_positions if _substantive(blocks[k][1])),
                   p_positions[0] if p_positions else -1)
    last_p = p_positions[-1] if p_positions else -1
    fig_n, out = 0, []
    for k, (typ, data) in enumerate(blocks):
        if typ == 'h2':
            out.append(f'    <h2>{inline(data)}</h2>')
        elif typ == 'h3':
            out.append(f'    <h3>{inline(data)}</h3>')
        elif typ == 'p':
            if k == first_p:
                # suppress the drop-cap when the lede opens on punctuation/a link
                # (e.g. a bracketed "[start your journey here]" series-nav aside)
                cls = ' class="lede"' if re.match(r'\s*[A-Za-z0-9]', data) else ' class="lede nodrop"'
            elif k == last_p:
                cls = ' class="end"'
            else:
                cls = ''
            out.append(f'    <p{cls}>{inline(data)}</p>')
        elif typ == 'img':
            fig_n += 1
            alt, url = data
            cap = (f'<span>{inline(alt)}</span>'
                   if alt and alt.strip().lower() not in ('', 'image', 'placeholder', 'img') else '')
            out.append(f'    <figure class="breakout">\n'
                       f'      <img class="fig-art" src="{attr(url)}" alt="{attr(alt)}">\n'
                       f'      <figcaption><b>Fig. {fig_n:02d}</b>{cap}</figcaption>\n'
                       f'    </figure>')
        elif typ == 'ul':
            out.append(render_ul(data))
        elif typ == 'ol':
            lis = "\n".join(f'      <li>{inline(x)}</li>' for x in data)
            out.append('    <ol class="seq">\n' + lis + '\n    </ol>')
        elif typ == 'quote':
            out.append(render_quote(data))
        elif typ == 'video':
            out.append(f'    <div class="embed video breakout"><iframe '
                       f'src="https://www.youtube.com/embed/{data}" title="Video" '
                       f'loading="lazy" allowfullscreen></iframe></div>')
        elif typ == 'podcast':
            out.append(f'    <div class="embed podcast breakout"><iframe '
                       f'src="{attr(data)}" title="Podcast" loading="lazy"></iframe></div>')
    return "\n\n".join(out)

# ---------------------------------------------------------------- template slicing
TPL = (REPO / "article.html").read_text(encoding="utf-8")
HEAD = TPL[: TPL.index('<section class="sub-hero article')]
TAIL = TPL[TPL.index('<section class="page-closer"'):]
SLASH = re.search(r'(<svg class="slash-field".*?</svg>)', TPL, re.S).group(1)

def cats_of(post):
    return post.get('categories') or post.get('old_categories') or []

def merge_overrides(posts):
    """Fill categories / featured / photo_credit from the Notion CSV export, by slug."""
    import csv
    if not OVERRIDES_CSV.exists():
        return 0
    by_slug = {p['slug']: p for p in posts}
    n = 0
    with OVERRIDES_CSV.open(encoding='utf-8-sig', newline='') as fh:
        for row in csv.DictReader(fh):
            r = {(k or '').strip().lower(): (v or '').strip() for k, v in row.items()}
            slug = r.get('slug')
            p = by_slug.get(slug)
            if not p:
                continue
            cats = [c.strip() for c in re.split(r'[;,]', r.get('categories', '')) if c.strip()]
            if cats:
                p['categories'] = cats
            p['featured'] = r.get('featured', '').lower() in ('yes', 'true', '1', '✓', 'checked', 'x')
            # Photo Credit is a Notion relation → "Name (https://notion.so/...)"; keep the name.
            pc = re.sub(r'\s*\(https?://[^)]*\)\s*$', '', r.get('photo credit', '')).strip()
            if pc:
                p['photo_credit'] = pc
            n += 1
    return n

def patch_head(post):
    h = re.sub(r'<title>.*?</title>',
               f"<title>{esc(post['seo_title'])}{TITLE_SUFFIX}</title>", HEAD, count=1, flags=re.S)
    meta = attr(post.get('meta_description', ''))
    h = re.sub(r'(<meta name="description" content=")[^"]*(">)',
               lambda m: m.group(1) + meta + m.group(2), h, count=1)
    og = (f'<meta property="og:type" content="article">\n'
          f'<meta property="og:title" content="{attr(post["seo_title"])}">\n'
          f'<meta property="og:description" content="{meta}">\n'
          f'<meta property="og:image" content="{attr(post.get("og_url",""))}">\n'
          f'<meta name="twitter:card" content="summary_large_image">\n')
    h = re.sub(r'(<meta name="description"[^>]*>\n)', lambda m: m.group(1) + og, h, count=1)
    return h

def sub_hero(post):
    dark = ' dark-overlay' if post.get('masthead_dark_overlay') else ''
    masthead = post.get('masthead_url') or post.get('thumbnail_url') or ''
    media = (f'<div class="hero-media"><img id="heroImg" src="{attr(masthead)}" alt=""></div>'
             if masthead else '<div class="hero-media"></div>')
    cats = cats_of(post)
    cat_html = " · ".join(f'<a href="/insights">{esc(c)}</a>' for c in cats)
    cat_block = (f'      <span class="sep vbar" id="catSep">|</span>\n'
                 f'      <span class="cats" id="cats">{cat_html}</span>\n') if cats else ''
    author = post.get('author') or 'Power Shifter'
    return f"""<section class="sub-hero article{dark}">
  {media}
  <div class="hero-tint"></div>
  {SLASH}
  <div class="sub-hero-inner wrap">
    <a class="back swipe" href="/insights">← Back to all Insights</a>
    <h1 class="rise" id="title">{esc(post['title'])}</h1>
    <p class="sub-voice"><em class="voice mag" id="excerpt">{esc(post.get('meta_description',''))}</em></p>
    <div class="byline" id="byline">
      <a href="/insights" id="authorEl">By {esc(author)}</a>
      <span class="sep" id="authorSep">·</span>
      <span class="date">{fmt_date(post.get('publish_date'))}</span>
{cat_block}    </div>
  </div>
  <span class="photo-credit" id="photoCredit">{esc(post.get('photo_credit') or 'Power Shifter Studios')}</span>
</section>"""

def related_section(post, lookup):
    rows = []
    for rel in (post.get('related') or []):
        slug = rel.get('slug')
        if slug not in lookup:      # only link to rendered (Published) posts
            continue
        meta = lookup[slug]
        rows.append((rel.get('title') or meta['title'], meta['stream'], meta['date'], slug))
        if len(rows) == 3:
            break
    if not rows:
        return ''   # collapse when zero relations
    rh = []
    for i, (title, stream, date, slug) in enumerate(rows, 1):
        rh.append(f'''      <a class="rel-row" href="/insights/{slug}">
        <span class="rel-n">{i:02d}</span>
        <span class="rel-meta"><span class="stream">{esc(stream)}</span><span class="rel-title">{esc(title)}</span></span>
        <span class="rel-date">{esc(date)}</span>
        <span class="rel-ar">→</span>
      </a>''')
    return f"""<section class="related-v2" id="related">
  <div class="wrap">
    <div class="rel-head">
      <h2>Related <em class="voice mag">reading</em></h2>
      <a class="swipe" href="/insights">All insights →</a>
    </div>
    <div class="rel-rows">
{chr(10).join(rh)}
    </div>
  </div>
</section>

"""

def render_article(post, lookup):
    body = convert_body(post.get('body_markdown', ''))
    page = (patch_head(post)
            + sub_hero(post) + "\n\n"
            + '<article class="article-body wrap">\n  <div class="prose">\n'
            + body + "\n  </div>\n</article>\n\n"
            + related_section(post, lookup)
            + TAIL)
    out_dir = REPO / "insights"
    out_dir.mkdir(exist_ok=True)
    (out_dir / f"{post['slug']}.html").write_text(page, encoding="utf-8")

# ---------------------------------------------------------------- insights grid
def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', (s or '').lower()).strip('-') or 'insights'

# New-taxonomy names → the filter-tab data-cat slugs in insights.html
CAT_SLUG = {"Build": "build", "Frames": "frames", "Founder's Focus": "ff"}
def cat_dcat(tag):
    return CAT_SLUG.get(tag, slugify(tag))

def insights_card(post, n):
    cats = cats_of(post)
    tag = cats[0] if cats else 'Insights'
    dcat = cat_dcat(tag)
    img = post.get('masthead_url') or post.get('thumbnail_url') or ''
    h3 = f'<h3>{esc(post["seo_title"])}</h3>'
    if img:
        # headline overlaid on the thumbnail (saves vertical space; scrim + soft glow for contrast)
        frame = (f'<div class="wframe has-overlay">'
                 f'<img src="{attr(img)}" alt="" style="width:100%;height:100%;object-fit:cover">'
                 f'<div class="wtint"></div>{h3}</div>')
        below = ''
    else:
        frame = '<div class="wframe slot-frame light"><span class="slot-tag dark">No thumbnail</span></div>'
        below = f'\n    {h3}'
    return f'''  <a class="wcard" data-cat="{dcat}" href="/insights/{post['slug']}">
    <span class="cmeta"><span class="cn">{n:02d}</span><span class="wtag">{esc(tag)}</span><span class="idate">{fmt_date(post.get('publish_date'))}</span></span>
    {frame}{below}
    <p class="excerpt">{esc(post.get('meta_description',''))}</p>
    <span class="wgo swipe">Read the post →</span>
  </a>'''

def feature_card(post, n):
    cats = cats_of(post)
    tag = cats[0] if cats else 'Insights'
    img = post.get('masthead_url') or post.get('thumbnail_url') or ''
    return f'''  <a class="wcard feature" data-cat="{cat_dcat(tag)}" href="/insights/{post['slug']}" id="featured">
    <div class="wframe">
      <img src="{attr(img)}" alt="" style="width:100%;height:100%;object-fit:cover">
      <div class="wtint"></div>
      <div class="wcard-overlay">
        <span class="fmeta"><span class="cn">{n:02d}</span><span class="wtag">{esc(tag)} · Featured</span><span class="idate">{fmt_date(post.get('publish_date'))}</span></span>
        <h2>{esc(post['seo_title'])}</h2>
        <p class="excerpt">{esc(post.get('meta_description',''))}</p>
        <span class="wgo swipe">Read the post →</span>
      </div>
    </div>
  </a>'''

def regen_insights(posts):
    ins = (REPO / "insights.html").read_text(encoding="utf-8")
    start = ins.index('<div class="sheet">') + len('<div class="sheet">')
    end = ins.index('</div>\n</section>', start)
    feat = next((p for p in posts if p.get('featured')), None)
    ordered = ([feat] + [p for p in posts if p is not feat]) if feat else posts
    blocks = []
    for i, p in enumerate(ordered, 1):
        blocks.append(feature_card(p, i) if p is feat else insights_card(p, i))
    cards = "\n\n".join(blocks)
    ins = ins[:start] + "\n\n" + cards + "\n\n  " + ins[end:]
    # update filter-tab counts to the published reality
    from collections import Counter
    cc = Counter()
    for p in posts:
        for c in cats_of(p):
            cc[c] += 1
    counts = {'all': len(posts), 'build': cc.get('Build', 0),
              'frames': cc.get('Frames', 0), 'ff': cc.get("Founder's Focus", 0)}
    for dc, val in counts.items():
        ins = re.sub(rf'(data-cat="{dc}"><span class="fl cascade">[^<]*</span> <span class="fc">)\d+(</span>)',
                     lambda m, v=val: m.group(1) + str(v) + m.group(2), ins, count=1)
    (REPO / "insights.html").write_text(ins, encoding="utf-8")

# ---------------------------------------------------------------- main
def main():
    src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_POSTS
    data = json.loads(src.read_text(encoding="utf-8"))
    merged = merge_overrides(data)
    pub = [p for p in data if p.get('status') == 'Published' and p.get('slug') != 'test-blog']
    pub.sort(key=lambda p: (p.get('publish_date') or ''), reverse=True)  # newest first
    if merged:
        n_cat = sum(1 for p in pub if p.get('categories'))
        n_feat = sum(1 for p in pub if p.get('featured'))
        print(f"merged overrides for {merged} rows · {n_cat}/{len(pub)} have new Categories · {n_feat} Featured")
    else:
        print("no blog-meta.csv override found — using old_categories fallback, no Featured card")
    lookup = {p['slug']: {'title': p['title'],
                          'stream': (cats_of(p)[0] if cats_of(p) else 'Insights'),
                          'date': fmt_date(p.get('publish_date'))} for p in pub}
    for p in pub:
        render_article(p, lookup)
    regen_insights(pub)
    print(f"rendered {len(pub)} article pages + regenerated insights ({len(pub)} cards)")
    no_mast = [p['slug'] for p in pub if not (p.get('masthead_url') or p.get('thumbnail_url'))]
    if no_mast:
        print("  no-image (slot-frame fallback):", no_mast)

if __name__ == "__main__":
    main()
