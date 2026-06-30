#!/usr/bin/env python3
"""Repoint existing /work cards (href="#" -> /work/<slug>) by matching their <h3>,
fix two card titles, and insert a TELUS Support placeholder card. Already run once
(2026-06-29) — kept for reference/reuse on a future repoint pass; not idempotent
against current work.html (the href="#" targets it looks for are already gone)."""
import pathlib
W = pathlib.Path("/Users/jpholecka2025/PS-Dot-Com/work.html")
lines = W.read_text(encoding="utf-8").splitlines(keepends=True)

# (h3 substring, slug, optional new h3 text)
MAP = [
  ("Hall Constructors", "hall-constructors", None),
  ("TELUS Rewards", "telus-rewards", None),
  ("BC Women", "bcw", None),
  ("NVA", "nva", None),
  ("BC Parks Foundation", "bc-parks-foundation", None),
  ("Angel Oak", "angel-oak-home-loans", None),
  ("NCIS", "ncis-maritime", None),
  ("Phinity", "phinity", None),
  ("Delta Controls", "delta-controls", None),
  ("SxS Technologies", "5x5", "5x5 Technologies"),
  (">Luxxee<", "luxxee", "luxxee"),
]
report = []
for sub, slug, rename in MAP:
    # find the h3 line
    hi = next(i for i,l in enumerate(lines) if "<h3>" in l and sub in l)
    # walk back to nearest href="#"
    j = next(k for k in range(hi, -1, -1) if 'href="#"' in lines[k])
    lines[j] = lines[j].replace('href="#"', f'href="/work/{slug}"', 1)
    if rename:
        import re
        lines[hi] = re.sub(r'<h3>.*?</h3>', f'<h3>{rename}</h3>', lines[hi], count=1)
    report.append(f"{sub:24s}-> href={slug}  (a@line {j+1}, h3@line {hi+1})")

text = "".join(lines)

# Insert a TELUS Support placeholder card before the lululemon card
TS_CARD = '''  <a class="wcard" data-cat="digital" href="/work/telus-support">
    <div class="wframe slot-frame">
      <span class="slot-tag">TELUS Support — image pending</span>
    </div>
    <h3>TELUS Support</h3>
    <p>A self-serve redesign that cut call volume 30% and saved over $600K in year one.</p>
    <span class="wgo swipe">Read the case →</span>
  </a>

'''
marker = '  <a class="wcard" data-cat="digital" href="#">\n    <div class="wframe">'
# place before lululemon: find the lululemon card's opening <a>
idx = text.index("<h3>lululemon</h3>")
a_open = text.rfind('<a class="wcard"', 0, idx)
if "telus-support" not in text:
    text = text[:a_open] + TS_CARD + text[a_open:]
    report.append("inserted TELUS Support card before lululemon")

W.write_text(text, encoding="utf-8")
print("\n".join(report))
