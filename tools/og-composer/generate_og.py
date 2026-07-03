#!/usr/bin/env python3
"""Generate 1200x630 OG images for every insights card: card image +
composited headline, in the site's card-overlay style."""
import csv, html as htmlmod, pathlib, re, subprocess, sys

REPO = pathlib.Path("/Users/jpholecka2025/PS-Dot-Com")
OUT = REPO / "og-export"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT.mkdir(exist_ok=True)

src = (REPO / "insights.html").read_text()

# Each card: <a class="wcard..." href="/insights/<slug>"> ... <img src="..."> ... <h2>Title</h2>
cards = []
for m in re.finditer(
    r'<a class="wcard[^"]*"[^>]*href="/insights/([^"]+)"[^>]*>.*?<img src="([^"]+)".*?<h[23]>(.*?)</h[23]>',
    src, re.S):
    slug, img, h2 = m.group(1), m.group(2), m.group(3).strip()
    title = htmlmod.unescape(re.sub(r"<[^>]+>", "", h2))
    cards.append((slug, img, title))

print(f"cards found: {len(cards)}", file=sys.stderr)

TPL = """<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://use.typekit.net/xkk7api.css">
<style>
  html,body{{margin:0;width:1200px;height:630px;overflow:hidden}}
  .og{{position:relative;width:1200px;height:630px;background:#121315}}
  .og img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
  .tint{{position:absolute;inset:0;background:linear-gradient(transparent 30%, rgba(18,19,21,.72) 100%)}}
  .copy{{position:absolute;left:64px;right:64px;bottom:56px;color:#FAFAF7}}
  .eyebrow{{font-family:"config-mono-vf",ui-monospace,monospace;font-weight:700;font-size:20px;
    letter-spacing:.2em;text-transform:uppercase;color:rgba(250,250,247,.85);display:block;margin-bottom:20px}}
  .eyebrow b{{color:#FD2E90;font-weight:700}}
  h1{{font-family:"articulat-heavy-cf","Helvetica Neue",sans-serif;font-weight:900;margin:0;
    font-size:{fs}px;line-height:1.04;letter-spacing:-.02em;
    text-shadow:0 2px 24px rgba(18,19,21,.45)}}
</style>
<div class="og">
  <img src="{img}">
  <div class="tint"></div>
  <div class="copy">
    <span class="eyebrow">POWER<b>//</b>SHIFTER — Insights</span>
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
todo = cards if len(sys.argv) < 2 else cards[:int(sys.argv[1])]
for slug, img, title in todo:
    page = TPL.format(img=img, title=htmlmod.escape(title), fs=fontsize(title))
    tmp = OUT / f"_{slug}.html"
    tmp.write_text(page)
    png = OUT / f"{slug}.png"
    subprocess.run(
        [CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
         "--force-device-scale-factor=1", "--window-size=1200,630",
         "--virtual-time-budget=9000", f"--screenshot={png}", tmp.as_uri()],
        capture_output=True, timeout=90)
    jpg = OUT / f"{slug}.jpg"
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "82",
                    str(png), "--out", str(jpg)], capture_output=True)
    png.unlink(missing_ok=True)
    tmp.unlink(missing_ok=True)
    ok = jpg.exists() and jpg.stat().st_size > 30000
    manifest.append((slug, jpg.name, title, "ok" if ok else "CHECK"))
    print(("ok  " if ok else "?!  ") + slug, file=sys.stderr)

with open(OUT / "manifest.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["slug", "file", "title", "status"])
    w.writerows(manifest)
print(f"done: {len(manifest)} images in {OUT}", file=sys.stderr)
