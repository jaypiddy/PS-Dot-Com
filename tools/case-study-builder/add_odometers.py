#!/usr/bin/env python3
"""Tier-1 odometer upgrade: inject a `proof-row` dossier into the 6 hard-metric
case pages. Reuses the Allia odometer pattern (digit cols + .ch separators +
.sfx units). The trigger JS + CSS already ship in the cloned chrome."""
import pathlib
REPO = pathlib.Path("/Users/jpholecka2025/PS-Dot-Com") / "work"

SEQ = "".join(f"<span>{d}</span>" for d in "01234567890123456789")
def col(d):  return f'<span class="col" style="--d:{d}">{SEQ}</span>'
def odo(num):  # num may contain digits and ',' separators
    parts = "".join(col(int(c)) if c.isdigit() else f'<span class="ch">{c}</span>' for c in num)
    # a11y: hide the rolling 0-9 columns from AT and expose the real value (sr-only)
    return f'<span class="sr-only">{num}</span><span class="odo" aria-hidden="true">{parts}</span>'
def stat(num, sfx, cap):
    s = f'<span class="sfx">{sfx}</span>' if sfx else ""
    return f'    <div class="stat"><b>{odo(num)}{s}</b><span>{cap}</span></div>'
def proofrow(stats):
    n = len(stats)
    style = f' style="grid-template-columns:repeat({n},1fr)"' if n != 3 else ""
    rows = "\n".join(stat(*s) for s in stats)
    return (f'  <span class="eyebrow cs-rec-eyebrow">The receipts</span>\n'
            f'  <div class="proof-row" id="proofRow"{style}>\n{rows}\n  </div>\n')

# slug -> [ (number, suffix|None, caption) ]
STATS = {
 'telus-support': [
    ("30", "%", "drop in call-centre volume after the first redesign"),
    ("600", "K", "saved in support costs in year one (USD)"),
    ("70", "%", "of ‘Contact Us’ visitors never came back — solved online"),
 ],
 'luxxee': [
    ("170", "K+", "luxury-watch listings aggregated from vetted sources"),
    ("18", "K", "USD: the first Rolexes sold through our eBay partnership"),
    ("33", "%", "of luxxee’s equity held by POWER SHIFTER — we co-founded it"),
 ],
 'bcw': [
    ("3,500", None, "visitors in the microsite’s first 20 days"),
    ("20", None, "days: the window that traffic landed in"),
    ("3", None, "national networks aired it — CTV, Global, CBC"),
 ],
 'delta-controls': [
    ("90", None, "seconds to configure a hub — down from five minutes"),
    ("3", "x", "faster on-site setup — engineers off the ladder"),
    ("2020", None, "Frost &amp; Sullivan Global Company of the Year, for the O3 hub"),
 ],
 'angel-oak-home-loans': [
    ("40", "%", "lift in organic leads after launch"),
    ("30", None, "days: the window that 40% lift landed in"),
 ],
 'telus-rewards': [
    ("300", "K+", "members enrolled within six months"),
    ("22", "%", "ahead of the enrollment forecast at launch"),
    ("100", "%", "of polled CSRs preferred the new agent portal"),
 ],
}

for slug, stats in STATS.items():
    f = REPO / f"{slug}.html"
    t = f.read_text(encoding="utf-8")
    if 'id="proofRow"' in t:
        print(f"  {slug}: already has proofRow — skipped"); continue
    sec = t.index('<section class="cs-dossier wrap">')
    close = t.index('</section>', sec)
    t = t[:close] + proofrow(stats) + t[close:]
    f.write_text(t, encoding="utf-8")
    print(f"  {slug}: +{len(stats)} odometer stats")
