#!/usr/bin/env python3
"""Generate 1200x630 OG images for every /work case study: the case's
keyframe still (its card image) + the case H1 composited on top, in the
site's card-overlay style. Sibling of generate_og.py (which does /insights).

Keyframe = the card image on work.html (curated still for films, an
in-the-wild video frame for digital cases). Headline = the <h1 id="title">
from each work/<slug>.html. Eyebrow = POWER//SHIFTER — <CLIENT>, client
taken from the case sub-hero eyebrow ("Digital · Angel Oak Home Loans")."""
import csv, html as htmlmod, pathlib, re, subprocess, sys

REPO = pathlib.Path("/Users/jpholecka2025/PS-Dot-Com")
OUT = REPO / "og-export"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT.mkdir(exist_ok=True)

work = (REPO / "work.html").read_text()

# Keyframe override for cards that carry no <img> on the grid (slot-frame
# "image pending" placeholders) — point them at a still from the case itself.
OVERRIDE = {
    "allia-health-group": "images/allia/allia-after.jpg",  # card is an image-pending slot
}

# slug -> card image (the keyframe). Bound the <img> search to each card's own
# anchor so a placeholder card can't inherit the next card's image.
slug_img = {}
for m in re.finditer(r'<a class="wcard[^"]*"[^>]*href="/work/([^"#]+)"[^>]*>(.*?)</a>', work, re.S):
    slug, body = m.group(1), m.group(2)
    if slug in slug_img:
        continue
    if slug in OVERRIDE:
        slug_img[slug] = OVERRIDE[slug]
        continue
    im = re.search(r'<img src="([^"]+)"', body)
    if im:
        slug_img[slug] = im.group(1)

def resolve(img):
    """Local paths -> file:// absolute; remote URLs pass through."""
    if img.startswith("http"):
        return img
    return (REPO / img).as_uri()

def case_copy(slug):
    """(client, headline) scraped from the case page's sub-hero."""
    p = REPO / "work" / f"{slug}.html"
    if not p.exists():
        return None
    c = p.read_text()
    m = re.search(r'<span class="eyebrow">([^<]+)</span>\s*<h1[^>]*id="title"[^>]*>(.*?)</h1>', c, re.S)
    if not m:
        return None
    eyebrow = htmlmod.unescape(m.group(1).strip())
    client = eyebrow.split("·", 1)[1].strip() if "·" in eyebrow else eyebrow
    headline = htmlmod.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip()
    return client, headline

cases = []
for slug, img in slug_img.items():
    cc = case_copy(slug)
    if cc:
        cases.append((slug, img, cc[0], cc[1]))
cases.sort()
print(f"cases found: {len(cases)}", file=sys.stderr)

TPL = """<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://use.typekit.net/xkk7api.css">
<style>
  html,body{{margin:0;width:1200px;height:630px;overflow:hidden}}
  .og{{position:relative;width:1200px;height:630px;background:#121315}}
  .og img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
  .tint{{position:absolute;inset:0;background:linear-gradient(transparent 28%, rgba(18,19,21,.78) 100%)}}
  .copy{{position:absolute;left:64px;right:64px;bottom:56px;color:#FAFAF7}}
  .eyebrow{{font-family:"config-mono-vf",ui-monospace,monospace;font-weight:700;font-size:20px;
    letter-spacing:.2em;text-transform:uppercase;color:rgba(250,250,247,.85);display:block;margin-bottom:20px}}
  .eyebrow b{{color:#FD2E90;font-weight:700}}
  h1{{font-family:"articulat-heavy-cf","Helvetica Neue",sans-serif;font-weight:900;margin:0;
    font-size:{fs}px;line-height:1.04;letter-spacing:-.02em;
    text-shadow:0 2px 24px rgba(18,19,21,.5)}}
</style>
<div class="og">
  <img src="{img}">
  <div class="tint"></div>
  <div class="copy">
    <span class="eyebrow">POWER<b>//</b>SHIFTER — {client}</span>
    <h1>{title}</h1>
  </div>
</div>
"""

def fontsize(t):
    n = len(t)
    if n > 90: return 46
    if n > 68: return 54
    if n > 46: return 64
    return 76

manifest = []
todo = cases if len(sys.argv) < 2 else cases[:int(sys.argv[1])]
for slug, img, client, title in todo:
    page = TPL.format(img=resolve(img), client=htmlmod.escape(client.upper()),
                      title=htmlmod.escape(title), fs=fontsize(title))
    tmp = OUT / f"_work-{slug}.html"
    tmp.write_text(page)
    png = OUT / f"work-{slug}.png"
    subprocess.run(
        [CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
         "--force-device-scale-factor=1", "--window-size=1200,630",
         "--virtual-time-budget=9000", f"--screenshot={png}", tmp.as_uri()],
        capture_output=True, timeout=90)
    jpg = OUT / f"work-{slug}.jpg"
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "82",
                    str(png), "--out", str(jpg)], capture_output=True)
    png.unlink(missing_ok=True)
    tmp.unlink(missing_ok=True)
    ok = jpg.exists() and jpg.stat().st_size > 30000
    manifest.append((slug, jpg.name, client, title, "ok" if ok else "CHECK"))
    print(("ok  " if ok else "?!  ") + slug, file=sys.stderr)

with open(OUT / "manifest-work.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["slug", "file", "client", "headline", "status"])
    w.writerows(manifest)
print(f"done: {len(manifest)} images in {OUT}", file=sys.stderr)
