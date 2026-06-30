#!/usr/bin/env python3
"""PS case-study builder — slices shared chrome from xyon.html and regenerates
the body region per case. Tier 2/3 fact-sheet layout (no odometer dossier).
Run from the repo root. Reads cases from cases_data.py."""
import re, sys, pathlib

REPO = pathlib.Path("/Users/jpholecka2025/PS-Dot-Com")
OUT_DIR = REPO / "work"
BASE = (OUT_DIR / "xyon.html").read_text(encoding="utf-8")

# --- extract shared chrome + constant SVGs from the base -----------------
SUBHERO_ANCHOR = '<section class="sub-hero casestudy">'
FOOTER_ANCHOR = '\n<footer>'
HEAD = BASE[: BASE.index(SUBHERO_ANCHOR)]
FOOTER = BASE[BASE.index(FOOTER_ANCHOR):]

# slash-field SVG (the sub-hero weather) — whole line containing it
m = re.search(r'(<svg class="slash-field".*?</svg>)', BASE, re.S)
SLASH_FIELD = m.group(1)
# pull-slash SVG (constant decorative motif inside each pull)
m = re.search(r'(<svg class="pull-slash".*?</svg>)', BASE, re.S)
PULL_SVG = m.group(1)

# --- body-fragment helpers ------------------------------------------------
def esc(t):  # minimal: ampersands not already entities
    return re.sub(r'&(?!#?\w+;)', '&amp;', t)

def h2(t): return f"    <h2>{t}</h2>"
def h3(t): return f"    <h3>{t}</h3>"
def p(t):  return f"    <p>{esc(t)}</p>"
def comment(t): return f"    <!-- {t} -->"
def pull(eyebrow, html):
    return (f'    <aside class="pull breakout reveal">{PULL_SVG}'
            f'<span class="eyebrow">{eyebrow}</span><p>{html}</p></aside>')
def ul(items):
    lis = "\n".join(f"      <li>{esc(i)}</li>" for i in items)
    return f"    <ul>\n{lis}\n    </ul>"
def raw(html): return f"    {html}"
def quote(text, name, role, co):
    return ('    <figure class="cs-quote reveal">\n'
            f'      <blockquote>{esc(text)}</blockquote>\n'
            f'      <figcaption><span class="cs-quote-name">{name}</span>'
            f'<span class="cs-quote-role">{role}</span>'
            f'<span class="cs-quote-co">{co}</span></figcaption>\n'
            '    </figure>')
def nextcard(href, eyebrow, title):
    return (f'      <a class="post" href="/work/{href}"><span class="stream">{eyebrow}</span>'
            f'<h3>{esc(title)}</h3><span>2026</span></a>')

BODY_TMPL = """<section class="sub-hero casestudy">
  {slash}
  <div class="sub-hero-inner wrap">
    <a class="back swipe" href="/work">← Back to all Work</a>
    <span class="eyebrow">{eyebrow}</span>
    <h1 class="rise" id="title">{h1}</h1>
    <p class="sub-voice"><em class="voice mag" id="excerpt">{subvoice}</em></p>
    <div class="byline cs-meta" id="byline">
      <span class="role">Role</span><span>{role}</span>
      <span class="sep vbar">|</span>
      <span class="cats"><a href="/work">{cat}</a></span>
    </div>
  </div>
</section>

<!-- Dossier: fact sheet (Tier 2/3 — no topline odometer stats) -->
<section class="cs-dossier wrap">
  <dl class="cs-facts reveal">
    <div class="cs-fact"><dt>Client</dt><dd>{client}</dd></div>
    <div class="cs-fact"><dt>Sector</dt><dd>{sector}</dd></div>
    <div class="cs-fact"><dt>Services</dt><dd>{services}</dd></div>
    <div class="cs-fact"><dt>Platform</dt><dd>{platform}</dd></div>
  </dl>
</section>

<!-- Body — five-section authored structure -->
<article class="article-body wrap">
  <div class="prose">
{body}
  </div>
</article>

<!-- Next case -->
<section class="insights" id="next-case">
  <div class="wrap reveal">
    <h2 class="rise">Next <em class="voice mag">case</em></h2>
    <div class="posts">
{nextcards}
    </div>
  </div>
</section>

<!-- Global page closer -->
<section class="page-closer" id="contact">
  <div class="wrap">
    <h2 class="rise">Read enough? <em class="voice mag">Let's build.</em></h2>
    <p>Cinema in days. Software in weeks. You'll work directly with the people who make it — no account layer, no brief telephone.</p>
    <div class="pc-row">
      <a class="btn solid cascade" href="#">Start a project →</a>
      <a class="tel" href="tel:+16042279952">+1 (604) 227-9952</a>
    </div>
  </div>
</section>

"""

RENDER = {'h2': h2, 'h3': h3, 'p': p, 'comment': comment, 'pull': pull, 'quote': quote, 'ul': ul, 'raw': raw}
def render_body(specs):
    return "\n\n".join(RENDER[s[0]](*s[1:]) for s in specs)

def build(case):
    head = re.sub(r'<title>.*?</title>',
                  f"<title>{case['title']}</title>", HEAD, count=1, flags=re.S)
    head = re.sub(r'(<meta name="description" content=")[^"]*(">)',
                  lambda mm: mm.group(1) + case['meta'] + mm.group(2), head, count=1)
    import cases_data
    body = render_body(case['body'])
    nextcards = "\n".join(nextcard(s, *cases_data.CARD[s]) for s in case['next'])
    region = BODY_TMPL.format(
        slash=SLASH_FIELD, eyebrow=case['eyebrow'], h1=case['h1'],
        subvoice=case['subvoice'], role=case['role'], cat=case['cat'],
        client=case['client'], sector=case['sector'], services=case['services'],
        platform=case['platform'], body=body, nextcards=nextcards)
    out = head + region + FOOTER
    (OUT_DIR / f"{case['slug']}.html").write_text(out, encoding="utf-8")
    # leftover check
    stray = [w for w in ('XYON', 'xyon', 'Pimstone', "Men's") if w in region]
    return case['slug'], len(out.splitlines()), stray

if __name__ == "__main__":
    import cases_data
    names = sys.argv[1:] or [c['slug'] for c in cases_data.CASES]
    for c in cases_data.CASES:
        if c['slug'] in names:
            slug, n, stray = build(c)
            print(f"  built {slug}.html  ({n} lines)  stray={stray}")
