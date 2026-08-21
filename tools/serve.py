#!/usr/bin/env python3
"""Local preview server that behaves like the Vercel deployment.

`python3 -m http.server` serves this repo badly: it needs a literal `.html`
suffix, ignores the 178 legacy redirects in vercel.json, and answers /insights
with a directory listing. Every one of those reads as a regression when it
isn't one (see CLAUDE.md, "Local preview caveat").

This reads vercel.json and applies the same rules Vercel does:
  * cleanUrls     /insights          -> insights.html
                  /insights/foo      -> insights/foo.html
  * trailingSlash /about/            -> 301 /about
  * redirects     every rule in file order, exact and pattern alike

Stdlib only, no install step:

    python3 tools/serve.py            # http://localhost:8080
    python3 tools/serve.py 3000       # pick a port

Ctrl-C to stop.
"""
import http.server, json, os, re, socketserver, sys, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = json.load(open(os.path.join(ROOT, "vercel.json"), encoding="utf-8"))
CLEAN = CFG.get("cleanUrls", False)
TRAIL = CFG.get("trailingSlash", False)
def _pattern(src):
    """A Vercel source pattern -> a compiled regex.
       /blog/:path*  matches /blog and everything under it
       /x/:id        matches exactly one more segment"""
    out = []
    for seg in src.strip("/").split("/"):
        if seg.startswith(":") and seg.endswith("*"):
            out.append("(?:/.*)?")
            break
        if seg.startswith(":"):
            out.append("/[^/]+")
        else:
            out.append("/" + re.escape(seg))
    return re.compile("^" + "".join(out) + "$")


# One ordered list, because Vercel evaluates redirects in array order and the
# first match wins. That ordering is load-bearing here: 63 explicit
# /blog/<slug> rules sit ahead of the /blog/:path* catch-all, so each legacy
# post reaches its own page instead of all of them landing on the index. A
# dict of exact rules checked before any pattern would happen to agree today
# and quietly disagree the moment a rule moves.
RULES = []
for _r in CFG.get("redirects", []):
    _src, _dst = _r["source"], _r["destination"]
    _code = 308 if _r.get("permanent") else 307
    if ":" in _src or "*" in _src:
        RULES.append((_pattern(_src), _dst, _code))
    else:
        RULES.append((_src.rstrip("/") or "/", _dst, _code))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def _send_redirect(self, to, code):
        self.send_response(code)
        self.send_header("Location", to)
        self.end_headers()

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        query = urllib.parse.urlparse(self.path).query
        suffix = f"?{query}" if query else ""

        # configured redirects (exact match, as Vercel does for these rules)
        key = path.rstrip("/") or "/"
        for match, dest, code in RULES:
            hit = match == key if isinstance(match, str) else match.match(key)
            if hit:
                return self._send_redirect(dest + suffix, code)

        # trailingSlash:false -> strip it
        if not TRAIL and len(path) > 1 and path.endswith("/"):
            return self._send_redirect(path.rstrip("/") + suffix, 308)

        if path == "/":
            self.path = "/index.html"
            return super().do_GET()

        fs = os.path.join(ROOT, path.lstrip("/"))
        if CLEAN and not os.path.isfile(fs):
            # /insights -> insights.html, /insights/foo -> insights/foo.html
            if os.path.isfile(fs + ".html"):
                self.path = path + ".html" + suffix
                return super().do_GET()
            # a real directory with an index
            if os.path.isdir(fs) and os.path.isfile(os.path.join(fs, "index.html")):
                self.path = path.rstrip("/") + "/index.html" + suffix
                return super().do_GET()
            # .html asked for explicitly -> canonicalise to the clean URL
        if CLEAN and path.endswith(".html") and os.path.isfile(fs):
            clean = path[:-5]
            if clean.endswith("/index"):
                clean = clean[:-6] or "/"
            return self._send_redirect(clean + suffix, 308)

        return super().do_GET()

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"""
  POWER SHIFTER — local preview
  cleanUrls={CLEAN}  trailingSlash={TRAIL}  redirects={len(RULES)}

    http://localhost:{port}/
    http://localhost:{port}/insights
    http://localhost:{port}/insights/designing-for-rage-how-platforms-profit-from-chaos

  Ctrl-C to stop.
""")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  stopped.")
