#!/usr/bin/env python3
"""
fetch_notion.py — build posts.json from the Notion Blogs DB.

Replaces the hand export. `render_blog.py` is unchanged: this writes the same
file it has always read, so the renderer never learns where the content came
from.

    export NOTION_TOKEN=ntn_xxx
    python3 tools/blog-renderer/fetch_notion.py                 # write posts.json
    python3 tools/blog-renderer/fetch_notion.py --verify        # diff, write nothing
    python3 tools/blog-renderer/fetch_notion.py -o /tmp/new.json

Body copy comes from `GET /v1/pages/{id}/markdown`, Notion's own markdown
rendering. That matters: the existing posts.json was produced by this same
conversion, so the output matches it line for line — including the quirks
(links absolutised to https://www.powershifter.com/..., trailing slashes
normalised, embeds emitted as raw `<embed src="...">` tags, one block per line
with no blank separators). Do not hand-roll a block-to-markdown converter here;
it would have to reproduce all of that exactly, and this endpoint already does.

Stdlib only, no deps, matching the rest of tools/.
"""

import argparse
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.request

API = "https://api.notion.com/v1"
# 2026-03-11 is the first version exposing /pages/{id}/markdown.
NOTION_VERSION = "2026-03-11"
DATA_SOURCE_ID = "7d42b885-9050-4cdf-8349-38431d6ec0e4"   # Blogs
HERE = os.path.dirname(os.path.abspath(__file__))

# Notion allows ~3 requests/second. One page of rows plus one markdown call per
# post is ~95 calls for the full set, so a courtesy delay costs about 30s total.
THROTTLE = 0.34


# ---------------------------------------------------------------- transport

CERT_HELP = """
Python can't verify Notion's TLS certificate — it has no CA roots to check
against. Nothing to do with your token.

This script already tried SSL_CERT_FILE, certifi, and the usual macOS and
Homebrew bundles. Since none worked, install certifi into THIS interpreter —
`pip3` is often a different install from the `python3` you are running:

  python3 -m pip install certifi

Or point it straight at the system bundle, which macOS does ship:

  export SSL_CERT_FILE=/etc/ssl/cert.pem

To see what your interpreter currently has:

  python3 -c "import ssl,sys;print(sys.executable);print(ssl.create_default_context().cert_store_stats())"

A count of 0 for x509_ca confirms an empty store.
"""


def _ca_candidates():
    """CA bundles worth trying, best first. A macOS python.org build ships no
    roots of its own and does not read the system keychain, so the stdlib
    default is often an empty store."""
    if os.environ.get("SSL_CERT_FILE"):
        yield "SSL_CERT_FILE", os.environ["SSL_CERT_FILE"]
    try:
        import certifi
        yield "certifi", certifi.where()
    except ImportError:
        pass
    for p in ("/etc/ssl/cert.pem",                       # macOS, LibreSSL
              "/opt/homebrew/etc/ca-certificates/cert.pem",   # brew, arm64
              "/usr/local/etc/ca-certificates/cert.pem",      # brew, intel
              "/opt/homebrew/etc/openssl@3/cert.pem",
              "/etc/pki/tls/certs/ca-bundle.crt",         # linux
              "/etc/ssl/certs/ca-certificates.crt"):
        yield p, p


def _ssl_context(verbose=False):
    for label, path in _ca_candidates():
        if not path or not os.path.isfile(path):
            continue
        try:
            ctx = ssl.create_default_context(cafile=path)
            if ctx.cert_store_stats()["x509_ca"] > 0:
                if verbose:
                    print(f"   CA bundle: {label} ({path})", file=sys.stderr)
                return ctx
        except (ssl.SSLError, OSError):
            continue
    ctx = ssl.create_default_context()          # last resort: the empty default
    if verbose:
        n = ctx.cert_store_stats()["x509_ca"]
        print(f"   CA bundle: python default ({n} roots)", file=sys.stderr)
    return ctx


_CTX = None


TOKEN_FILE = os.path.join(HERE, ".notion-token")


def _dedupe(tok):
    """A hidden prompt echoes nothing, so it invites pasting two or three times.
    If the value is one string repeated, return the single copy."""
    n = len(tok)
    for size in range(20, n // 2 + 1):
        if n % size == 0 and tok == tok[:size] * (n // size):
            return tok[:size], n // size
    return tok, 1


def _token():
    """A file beside this script wins over the environment. Shell exports are
    easy to get wrong — history replays a stale one, a startup file overrides
    it — and this sidesteps all of that. Add .notion-token to .gitignore."""
    try:
        with open(TOKEN_FILE, encoding="utf-8") as f:
            tok = f.read().strip()
            if tok:
                return tok, f"file {TOKEN_FILE}"
    except FileNotFoundError:
        pass
    return (os.environ.get("NOTION_TOKEN") or "").strip(), "env NOTION_TOKEN"


def _req(method, path, body=None, retries=4, allow_404=False):
    global _CTX
    if _CTX is None:
        _CTX = _ssl_context()
    token, src = _token()
    if not token:
        sys.exit("No token found.\n\n"
                 "  python3 tools/blog-renderer/fetch_notion.py --set-token\n\n"
                 "prompts for it and stores it, without the shell or clipboard\n"
                 "being involved. Create the integration at\n"
                 "https://www.notion.so/profile/integrations and share the Blogs\n"
                 "database with it under Content access.")
    # A bearer token cannot contain whitespace — the HTTP header would be
    # malformed. Fail here with something readable instead of a stack trace
    # from http.client.
    token, copies = _dedupe(token)
    if copies > 1 and path.endswith("/users/me"):
        print(f"   (token was stored {copies}x over — using one copy)", file=sys.stderr)
    if any(c.isspace() for c in token) or not token.startswith(("ntn_", "secret_")):
        sys.exit(f"That does not look like a Notion token (from {src}).\n"
                 f"  length {len(token)}, starts {token[:12]!r}\n\n"
                 "It should be ~50 characters beginning 'ntn_', on one line.\n"
                 "Re-enter it with:\n"
                 "  python3 tools/blog-renderer/fetch_notion.py --set-token")
    if token.startswith("<") or token.strip() in ("", "ntn_xxx"):
        sys.exit(f"NOTION_TOKEN is still a placeholder ({token[:40]}).\n"
                 "Paste the real secret from the integration's Access token field.")
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, method=method, headers={
        "Authorization": "Bearer " + token,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    })
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=60, context=_CTX) as r:
                time.sleep(THROTTLE)
                return json.loads(r.read())
        except ssl.SSLCertVerificationError:
            sys.exit(CERT_HELP)
        except urllib.error.HTTPError as e:
            payload = e.read().decode(errors="replace")
            # 429 = rate limited, 5xx = transient. Anything else is ours to fix.
            if e.code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                wait = float(e.headers.get("Retry-After", 2 ** attempt))
                print(f"  {e.code} on {path} — retrying in {wait:.0f}s", file=sys.stderr)
                time.sleep(wait)
                continue
            # A relation pointing at a database the integration cannot see is a
            # gap in one field, not a reason to abandon 94 records.
            if e.code == 404 and allow_404:
                return None
            sys.exit(f"\n{method} {path} failed: HTTP {e.code}\n{payload}\n")
        except urllib.error.URLError as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
                continue
            sys.exit(f"\n{method} {path} failed: {e.reason}\n")


# ------------------------------------------------------- property unpacking
# Every Notion property type comes back in its own shape. These flatten each
# one to what posts.json holds.

def _plain(prop):
    """rich_text / title -> a plain string."""
    if not prop:
        return ""
    items = prop.get("rich_text") or prop.get("title") or []
    return "".join(i.get("plain_text", "") for i in items).strip()


def _checkbox(prop):
    return bool(prop and prop.get("checkbox"))


def _select(prop):
    if not prop:
        return ""
    sel = prop.get("select") or prop.get("status")
    return (sel or {}).get("name", "")


def _multi(prop):
    if not prop:
        return []
    return [o["name"] for o in prop.get("multi_select") or []]


def _date(prop):
    """
    -> '2021-04-22T00:00:00.000Z', the format render_blog.fmt_date parses.
    Notion returns a bare '2021-04-22' for date-only values and a full
    ISO string when a time is set.
    """
    if not prop:
        return None
    d = (prop.get("date") or {}).get("start")
    if not d:
        return None
    if len(d) == 10:                       # date only
        return d + "T00:00:00.000Z"
    if d.endswith("Z") and "." in d:       # already the shape we want
        return d
    if d.endswith("Z"):
        return d[:-1] + ".000Z"
    if "+" in d[10:]:                      # strip an offset, normalise to Z
        return d[:19] + ".000Z"
    return d + ".000Z" if len(d) == 19 else d


def _file_url(prop):
    """
    files property -> the first URL.
    An externally-hosted file (our Cloudflare Images case) carries
    {'type':'external','external':{'url':...}}; a Notion-hosted upload
    carries {'type':'file','file':{'url':...}} with a signed, expiring URL.
    """
    if not prop:
        return ""
    for f in prop.get("files") or []:
        if f.get("type") == "external":
            return f["external"]["url"]
        if f.get("type") == "file":
            return f["file"]["url"]
    return ""


def _relation_ids(prop):
    if not prop:
        return []
    return [r["id"] for r in prop.get("relation") or []]


# ------------------------------------------------------------------- fetch

class Resolver:
    """Turns relation page ids into names/slugs, fetching each id once.

    Seeded from authors.json (id -> name) so the nine author pages cost no API
    calls. Ids there are stored undashed, so both forms are keyed."""

    def __init__(self):
        self._pages = {}
        self._titles = {}
        self.unreachable = set()
        try:
            with open(os.path.join(HERE, "authors.json"), encoding="utf-8") as f:
                for k, v in json.load(f).items():
                    bare = k.replace("-", "")
                    self._titles[bare] = v
                    if len(bare) == 32:
                        self._titles["-".join((bare[:8], bare[8:12], bare[12:16],
                                               bare[16:20], bare[20:]))] = v
        except (FileNotFoundError, ValueError):
            pass

    def _page(self, pid):
        if pid not in self._pages:
            page = _req("GET", f"/pages/{pid}", allow_404=True)
            if page is None:
                self.unreachable.add(pid)
                page = {}
            self._pages[pid] = page
        return self._pages[pid]

    def title(self, pid):
        if pid in self._titles:
            return self._titles[pid]
        for p in self._page(pid).get("properties", {}).values():
            if p.get("type") == "title":
                self._titles[pid] = _plain(p)
                return self._titles[pid]
        self._titles[pid] = ""
        return ""

    def prop(self, pid, name):
        return _plain(self._page(pid).get("properties", {}).get(name))


def query_rows():
    rows, cursor = [], None
    while True:
        body = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        res = _req("POST", f"/data_sources/{DATA_SOURCE_ID}/query", body)
        rows.extend(res.get("results", []))
        if not res.get("has_more"):
            return rows
        cursor = res["next_cursor"]


def page_markdown(pid):
    res = _req("GET", f"/pages/{pid}/markdown")
    md = res.get("page_markdown") or res
    text = md.get("markdown", "") if isinstance(md, dict) else str(md)
    if isinstance(md, dict) and md.get("truncated"):
        print(f"  ! {pid} truncated by the API — body is incomplete", file=sys.stderr)
    return text.strip("\n")


def build(rows, resolver, bodies=True):
    out = []
    for i, row in enumerate(rows, 1):
        p = row["properties"]
        slug = _plain(p.get("Slug"))
        rec = {
            "slug": slug,
            "status": _select(p.get("Status")),
            "publish_date": _date(p.get("Publish Date")),
            "seo_title": _plain(p.get("Meta Title")),
            "title": _plain(p.get("Title")),
            "meta_description": _plain(p.get("Meta Description")),
            "author": "",
            "masthead_url": _file_url(p.get("Masthead Image")),
            "masthead_dark_overlay": _checkbox(p.get("Masthead Dark Overlay")),
            "thumbnail_url": _file_url(p.get("Thumbnail Image")),
            "og_url": _file_url(p.get("OG Image")),
            "old_categories": [],
            "categories": _multi(p.get("Categories")),
            "related": [],
            "legacy_webflow_id": _plain(p.get("Legacy Webflow ID")),
            "body_markdown": "",
        }

        authors = _relation_ids(p.get("Author"))
        if authors:
            rec["author"] = resolver.title(authors[0])

        rec["old_categories"] = [resolver.title(i) for i in
                                 _relation_ids(p.get("Old Categories"))]

        # `related` is a list of {"slug","title"} objects, not bare strings —
        # render_blog.related_rows() reads rel.get('title') off each one.
        related = []
        for rid in _relation_ids(p.get("Related Articles")):
            rslug = resolver.prop(rid, "Slug")
            if rslug:
                related.append({"slug": rslug, "title": resolver.title(rid)})
        rec["related"] = related

        # Fields the old blog-meta.csv supplied. Emitted here so the CSV can
        # retire; render_blog.merge_overrides still wins if the file is present.
        rec["featured"] = _checkbox(p.get("Featured"))
        credits = _relation_ids(p.get("Photo Credit"))
        rec["photo_credit"] = resolver.title(credits[0]) if credits else ""

        if bodies:
            rec["body_markdown"] = page_markdown(row["id"])

        out.append(rec)
        print(f"  [{i:>3}/{len(rows)}] {rec['status']:<9} {slug[:58]}", file=sys.stderr)

    out.sort(key=lambda r: r["slug"])
    return out


# ------------------------------------------------------------------ verify

CORE = ["slug", "status", "publish_date", "seo_title", "title",
        "meta_description", "author", "masthead_url", "masthead_dark_overlay",
        "thumbnail_url", "og_url", "old_categories", "related",
        "legacy_webflow_id", "body_markdown"]


def verify(fresh, old_path):
    """Diff against the hand export. `categories` is skipped: it is empty in the
    old export and filled from blog-meta.csv at render time, so a difference
    there is expected and correct."""
    try:
        with open(old_path, encoding="utf-8") as f:
            old = {r["slug"]: r for r in json.load(f)}
    except FileNotFoundError:
        print(f"no {old_path} to compare against", file=sys.stderr)
        return 0

    new = {r["slug"]: r for r in fresh}
    problems = 0

    only_new = sorted(set(new) - set(old))
    only_old = sorted(set(old) - set(new))
    for s in only_new:
        print(f"  + new in Notion, absent from the export: {s}")
    for s in only_old:
        print(f"  - in the export, gone from Notion:       {s}")
    problems += len(only_new) + len(only_old)

    for slug in sorted(set(new) & set(old)):
        for field in CORE:
            a, b = old[slug].get(field), new[slug].get(field)
            if a == b:
                continue
            problems += 1
            print(f"\n  {slug}\n    field: {field}")
            if field == "body_markdown":
                al, bl = (a or "").split("\n"), (b or "").split("\n")
                print(f"    export {len(al)} lines / notion {len(bl)} lines")
                for n, (x, y) in enumerate(zip(al, bl)):
                    if x != y:
                        print(f"    line {n}:\n      export: {x[:150]!r}\n      notion: {y[:150]!r}")
                        break
            else:
                print(f"      export: {a!r}"[:200])
                print(f"      notion: {b!r}"[:200])

    print(f"\n{len(new)} records, {problems} difference(s)"
          + ("  — parity" if not problems else ""))
    return problems


# -------------------------------------------------------------------- main

def set_token():
    """Prompt for the token and store it. Nothing goes through the shell, the
    clipboard, or history."""
    import getpass
    print("Paste the integration's Access token, then press return.")
    print("(input is hidden; nothing is echoed)\n")
    tok = getpass.getpass("token: ").strip()
    if not tok:
        sys.exit("nothing entered.")
    if any(c.isspace() for c in tok):
        sys.exit("that contains a space or newline, so it is not the token.")
    if not tok.startswith(("ntn_", "secret_")):
        sys.exit(f"expected something starting 'ntn_', got {tok[:12]!r}.")
    tok, copies = _dedupe(tok)
    if copies > 1:
        print(f"\n(that arrived {copies}x over — keeping one copy)")
    if not 30 <= len(tok) <= 90:
        sys.exit(f"\nlength {len(tok)} is outside the expected range for a Notion\n"
                 "token (~50). Copy it again with the icon beside the field.")
    with open(TOKEN_FILE, "w", encoding="utf-8") as f:
        f.write(tok + "\n")
    os.chmod(TOKEN_FILE, 0o600)
    print(f"\nstored in {TOKEN_FILE} (mode 600)")
    print(f"length {len(tok)}, suffix {tok[-4:]!r} — check that against Notion")
    print("\nnow run:  python3 tools/blog-renderer/fetch_notion.py --check")


def check():
    """Three calls, isolating the three ways this fails: a bad token, the Blogs
    database not shared with the integration, or a workspace whose API version
    predates the markdown endpoint."""
    print("0. TLS trust store")
    global _CTX
    _CTX = _ssl_context(verbose=True)
    print()

    stored, src = _token()
    tok, copies = _dedupe(stored)
    raw = tok
    print("1. token shape")
    print(f"   source {src}")
    if copies > 1:
        print(f"   stored {len(stored)} chars — that is one token pasted {copies}x; "
              f"using a single copy")
    print(f"   length {len(tok)}   prefix {tok[:4]!r}   suffix {tok[-4:]!r}")
    if raw != tok:
        print("   ! surrounding whitespace or a newline — strip it; the header "
              "is sent verbatim")
    if any(c.isspace() for c in tok):
        print("   ! whitespace INSIDE the token — it was copied in pieces")
    if not tok.startswith("ntn_"):
        print("   ! internal integration tokens start 'ntn_'. A 'secret_' value "
              "is the older\n     format; anything else is the wrong field.")
    if len(tok) < 45:
        print("   ! shorter than expected (~50) — likely truncated on copy. Use "
              "the copy icon\n     beside the field rather than selecting it.")
    print()

    print("2. token is accepted")
    me = _req("GET", "/users/me")
    print(f"   ok — authenticated as {me.get('name') or me.get('bot', {}).get('owner', {}).get('type', 'integration')}\n")

    print("3. Blogs data source is shared with this integration")
    res = _req("POST", f"/data_sources/{DATA_SOURCE_ID}/query", {"page_size": 1})
    rows = res.get("results", [])
    if not rows:
        sys.exit("   no rows returned. Open the integration's Content access tab\n"
                 "   and add the Blogs database.")
    row = rows[0]
    slug = _plain(row["properties"].get("Slug"))
    print(f"   ok — reachable, first row: {slug}\n")

    print(f"4. markdown endpoint at Notion-Version {NOTION_VERSION}")
    md = page_markdown(row["id"])
    lines = md.split("\n")
    blanks = sum(1 for l in lines if not l.strip())
    print(f"   ok — {len(lines)} lines, {blanks} blank")
    if blanks:
        print("   ! blank lines present. The renderer treats every non-blank line as\n"
              "     its own paragraph, so this needs a look before a full run.")
    if "<unknown" in md:
        print("   ! contains <unknown> — an unsupported block type degraded.")
    print("\nall four checks passed. Run --verify next.")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("-o", "--out", default=os.path.join(HERE, "posts.json"))
    ap.add_argument("--set-token", action="store_true",
                    help="prompt for the token and store it (no shell, no clipboard)")
    ap.add_argument("--check", action="store_true",
                    help="preflight: TLS, token, database access, markdown endpoint")
    ap.add_argument("--verify", action="store_true",
                    help="diff against the existing posts.json and write nothing")
    ap.add_argument("--no-bodies", action="store_true",
                    help="properties only — fast, skips one call per post")
    args = ap.parse_args()

    if args.set_token:
        set_token()
        return

    if args.check:
        check()
        return

    print("querying the Blogs data source…", file=sys.stderr)
    rows = query_rows()
    print(f"{len(rows)} rows\n", file=sys.stderr)

    resolver = Resolver()
    records = build(rows, resolver, bodies=not args.no_bodies)

    pub = sum(1 for r in records if r["status"] == "Published")
    print(f"\n{len(records)} records, {pub} Published", file=sys.stderr)
    if resolver.unreachable:
        print(f"! {len(resolver.unreachable)} related page(s) not visible to this\n"
              "  integration — the fields pointing at them are empty. Share the\n"
              "  parent 'powershifter.com CMS' page so the linked databases\n"
              "  (Authors, Old Categories, Photo Credit) come with it.",
              file=sys.stderr)

    if args.verify:
        sys.exit(1 if verify(records, args.out) else 0)

    tmp = args.out + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
        f.write("\n")
    os.replace(tmp, args.out)      # atomic: a failed run never truncates posts.json
    print(f"wrote {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
