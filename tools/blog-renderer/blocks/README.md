# Block partials

Hand-authored HTML dropped into a post's body by a marker line in the Notion
draft. A line that is *only* `[[name]]` (or `[[name: some argument]]`) is
replaced by `<name>.html` from this directory.

This exists for the things a markdown converter cannot produce: an inline
animation, a diagram that is really a small program, a component the site
already owns. The alternative — hand-patching `insights/<slug>.html` after a
render — loses the edit the next time anything re-renders, silently.

| Marker | Pulls | Numbered |
|---|---|---|
| `[[newsletter]]` | `newsletter.html` | no |
| `[[fig:harvest-meter]]` | `fig-harvest-meter.html` | **yes** |
| `[[anything]]` | `anything.html` | no |

## Figure numbering

`[[fig:*]]` takes the next number in the post's `Fig. 01` / `Fig. 02` series,
counted alongside the plain markdown images around it. That shared counter is
the reason these are markers and not pasted HTML — a bespoke animation sitting
between two photographs has to number correctly or the captions lie.

In a `fig-*.html` partial:

- `{{FIG}}` → `Fig. 03`
- `{{N}}` → `03`

## Arguments

`{{ARG}}` in any partial receives whatever followed `: ` in the marker, run
through the same inline formatter as body text (so bold, italics and links
work). One partial with a per-post line beats two near-identical files.

## A missing partial is an error

`[[fig:nope]]` with no `fig-nope.html` renders an HTML comment and makes the
renderer exit non-zero, naming the post and the file it wanted. It does not
abort the run — one bad marker should not cost 62 pages — but it does not pass
quietly either, because the failure mode is a published page with a hole in it.

## Writing one

Match the template's own markup. `article.html` is the reference: `figure.breakout`
for anything full-width, and the component classes documented in
`docs/design-system.md`. Keep partials self-contained — inline whatever CSS and
JS they need, scoped tightly enough not to leak into the surrounding prose —
because they land inside `.prose` on a page that already carries the site's
stylesheet.
