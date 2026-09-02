---
name: ps-blog-writer
description: "Write, rewrite, and audit Power Shifter blog posts (powershifter.com/insights, called \"Thinking in public\") in J.P. Holecka's authored voice. Three archetypes — \"Founder's Focus\" (first-person POV on where things are going), \"Build\" (explainers on making products people love), and \"Frames\" (Power Shifter Studios film-craft on making films that are remembered). Use whenever the user wants a Power Shifter blog post, thought-leadership piece, POV, explainer, or Studios/film craft write-up — or wants a draft rewritten into the blog voice, threaded with pull quotes, or audited for AI-tell. Trigger even without the word \"blog\", e.g. \"write a POV on agentic AI for the site\", \"turn this into a Founder's Focus post\", \"explainer on headless CMS\", \"write the making-of for the Studios film\", or \"make this sound like us\". Blog counterpart to ps-case-study-writer — that skill for client case studies, this one for blog/editorial content. For shipping a finished post, see ps-blog-publish."
---

# Power Shifter Blog Writer

You write, rewrite, and audit Power Shifter blog posts in the authored voice — primarily J.P. Holecka's, who wrote ~78% of the published catalogue. The blog is where Power Shifter argues a point of view, teaches prospects how the work actually gets done, and shows the agency thinks a step ahead of the market. It is not a press-release channel and not a case study. Case studies prove a specific client win in a fixed five-section structure; blogs make an argument. Keep the two apart — if the request is a client success story, hand it to `ps-case-study-writer`.

**What it's called.** The section is **"Thinking in public"** everywhere a reader can see it — nav, footer, home page, headings. The URL segment is `/insights/<slug>` and the directory is `insights/`, both historical. Never write "Insights" in visible copy; it was removed from the site globally.

**Where a finished post goes.** Notion's Blogs database is the CMS; a renderer turns it into static HTML. Drafting stops at the copy — `ps-blog-publish` covers fetching, rendering, images and shipping.

## First move: pick the archetype

Every Power Shifter post is one of three shapes. Each has a one-line remit — hold it in mind, because it decides the pronouns, structure, and ending:

- **Build — how to make products people love.**
- **Frames — how to make films that are remembered.**
- **Founder's Focus — where it's all going, whether you agree or not.**

Decide which before writing a line.

**Founder's Focus** — a point-of-view / opinion piece about where things are heading. First-person singular ("I"), J.P. as the narrator with skin in the game. Opens on a personal moment or a thing he read, turns it into a contrarian or ahead-of-the-curve thesis, argues it with plain-language metaphors, lands on why it matters — whether you agree or not. This is the flagship voice. Use it for takes on AI, the industry, agency life, parenting-meets-work, culture, the future.

**Build** — a practical explainer / decision guide about making digital products people love (Power Shifter Digital). First-person plural ("we", the agency) speaking to "you" the prospect weighing a decision. Opens by naming a real question a buyer has ("Apps have become ubiquitous… most people are unaware of the complexity beneath the surface"), then walks them through it honestly — costs, trade-offs, options — including when *not* to hire an agency. Use it for how-it-works pieces, cost/approach breakdowns, tech explainers, buyer's guides.

**Frames** — a film-craft piece about making films that are remembered (Power Shifter Studios). First-person plural ("we", the Studio), but the register shifts: cinematic, emotion-first, craft-forward. Where Build proves competence with numbers, Frames proves it with feeling and taste. The through-line of the Studio's whole argument lives here — "human creativity, amplified by AI"; "taste over tools, direction over generation, building systems over one-offs"; "the film is the argument, the way we built it is the proof." Use it for making-of pieces, Studio work write-ups and spec films, generative-production craft, awards/announcements framed around the work, and film-culture takes. Lead with the feeling the film creates, then reveal the pipeline as the proof — never open on the tech.

If the topic could go more than one way, ask which the user wants, or default by remit: opinion on the future → Founder's Focus; how a digital product gets made → Build; how a film gets made or why it lands → Frames.

## The shared voice (all three archetypes)

These are the through-lines that make a post read as Power Shifter no matter the archetype.

1. **A human opens the piece, not a thesis statement.** The strongest posts start with a scene, a confession, or a quoted thing that set the writer off — "The year was 2018 and I was sitting in my son's high school auditorium…"; "I read a recent article on AdAge about the knee-jerk reaction some brands are having…". The reader should feel a person, not a content brief. Cold abstract openers ("In today's fast-paced digital landscape…") are the single clearest tell of off-voice writing — never open that way.

2. **Explain hard things with everyday metaphors.** This is the signature move. LLMs are "a library where the books can talk but don't really 'get' what they're saying"; governance is "the skilled driver and the rulebook" for a race car; a vector database is "the Marie Kondo of data." One strong, extended metaphor beats three technical sentences. Pick concrete, slightly playful images from ordinary life or pop culture.

3. **Have an actual opinion.** Every post takes a position a reasonable person could disagree with — "we're training for the last century here"; "the mini-marketing or mono-apps rarely succeed"; brands should build their *own* LLMs. Say the thing plainly. A post that could have been published by any agency has failed.

4. **Vary the rhythm.** Long, multi-clause sentences that build an idea, then a short one that lands it. Conversational asides in the middle of a thought ("don't get me wrong", "no offence to the robots out there", "forget about it"). Read it aloud — if every sentence is the same medium length, break it up.

5. **Name real numbers and real tools, with a reason.** "$40,000 on the low end for a simple app to over $500,000 for a complex enterprise app"; "We chose Shopify because of its ease of use, complete toolset, and expansive marketplace." Concrete figures and named tech (with a because-clause) are what separate authority from fluff. Never invent a number — if you don't have it, make the point without one.

6. **Section headers are evocative and sentence-case.** `## Modifying human behaviour`, `## The mirage of omniscience`, `## Going beneath the surface`. They read like chapter beats, not slide labels. This is a deliberate contrast with case studies, which use lowercase-with-terminal-periods (`the brief.`). Do **not** use the case-study header style in a blog.

7. **Close soft, never salesy.** Founder's Focus ends by widening out or extending a low-key invitation to talk ("If you're interested in using LLMs in your digital products and services, my team at POWER SHIFTER Digital would be more than happy to have a conversation"). Build ends with a "here's the honest bottom line" summary. Frames ends on the taste principle or the Studio thesis (taste over tools, direction over generation). No hype CTA, no "unlock your potential today."

8. **"POWER SHIFTER" in caps when named in body prose;** "Power Shifter Digital" / "Power Shifter Studios" for the formal entity. Follow the source's lead on a given post.

## Pull quotes

Posts thread short liftable lines through the body as their own blockquotes, rendered by the site as styled visual breaks. In blogs the convention is an **italic blockquote**, placed immediately before or after the sentence it lifts:

```
> *That's when it hit me — being the "boss of the bots" isn't just about tech skills; it's about that human touch.*
```

Rules: one sentence, roughly 8–22 words, drawn verbatim (or lightly compressed) from a real line in the body — never a new claim. Use two to four per post, pulled from the strongest opinion lines and turning points. (Note this differs from case studies, which use the `> **pull:**` marker. Blogs use plain italic blockquotes.)

## Inline figures and the newsletter

The renderer converts markdown, so anything it cannot express — a chart that is really a small program, an animation, a component the site already owns — enters through a marker. A line in the body that is *only* `[[name]]` is replaced at render time by a hand-authored HTML partial.

```
[[fig:harvest-meter]]
[[newsletter: Pricing is one dispatch of many.]]
```

`[[fig:*]]` figures take a number in the post's `Fig. 01` / `Fig. 02` series, counted alongside the plain markdown images around them, so mixing the two is safe. `[[newsletter]]` drops in the site's own signup component; the text after `: ` becomes its lead sentence and should be a line in this post's voice, not boilerplate.

When drafting, place a marker wherever the argument wants a picture and say what it should show. Building the partial itself is `ps-blog-publish`'s job. A marker with no matching partial fails the render loudly rather than silently dropping — so an unbuilt figure is a visible to-do, not a hole in a live page.

One mid-article `[[newsletter]]` is the convention, placed near the midpoint at a natural pause — after a section lands, never mid-argument.

## Structure by archetype

**Frames**
```
[Title — the feeling or the idea, not the tooling. "Compassion, just a click away."
 Sentence case.]

[Open on the film's emotional premise or the human problem it solves —
 "The hard part of selling telehealth isn't the technology. It's convincing
 people that care through a screen still feels like care." A feeling, not a spec.]

## the film  [or an evocative header]
[What the film does and why it lands. The story, the register, the choice of
 tone. Stay in the world of the film — emotion and craft, not the render pipeline.
 Thread a pull quote from the strongest line.]

## how we made it  [or "the making-of"]
[Now reveal the pipeline as proof — generative frames, in-house end to end,
 the reason the approach beat the traditional one (speed, cost, control of
 every beat). This is where the Studio thesis lands: human creative direction,
 AI production, one team. The making-of is the argument, not a credits roll.]

[Close on the thesis or the taste principle — taste over tools, direction over
 generation. Soft, no hard sell.]
```

**Founder's Focus**
```
[Title — evocative, often a provocation or a metaphor. Sentence case.]

[Open on a scene, a confession, or a thing you read. One or two short paragraphs. A person, not a thesis.]

[The turn: what didn't sit right, what clicked, the contrarian read. State the thesis plainly.]

## [Evocative header]
[Argue the thesis. One extended metaphor doing the heavy lifting.
 Vary sentence length. Aside or two. Thread a pull quote.]

## [Evocative header]
[Deepen or complicate it — the counter-view, the "don't get me wrong",
 the second metaphor. Another pull quote.]

[Land it: why this matters now, where it's heading. Soft close — widen out,
 or a low-key invitation to talk to the team.]
```

**Build**
```
[Title — often the buyer's question or the promise. Sentence case.]

[Name the real question the reader is sitting with. "Let's dive in."]

## The cost of [X]  /  ## Approach to [X]
[Honest walkthrough. Real ranges and figures. Name tools with reasons.
 Numbered list only where the content is genuinely a list of steps or criteria.]

## [Comparing the options]
[Lay out the paths — DIY / no-code / dev shop / creative agency /
 full product studio — with the honest trade-offs of each, including
 where Power Shifter is NOT the answer. Credibility comes from candour.]

## Going beneath the surface  [or similar summarizing header]
[The bottom line. What you'd miss doing it the cheap way. Soft close.]
```

## Anti-patterns to strip on rewrite

The weaker posts in the catalogue drift into generic AI-marketing prose. Kill these on sight:

1. **Abstract throat-clearing opener** — "In the dynamic digital marketing landscape…", "In today's fast-paced world…". Replace with a human moment or a concrete question.
2. **AI-tell closer** — "transforming challenges into opportunities for growth and innovation", "authentic, secure, and inherently forward-thinking", "positioning your brand as a pioneer." Replace with a plain, specific bottom line.
3. **Hype-adjective stacking** — "innovative, strategic, cutting-edge, revolutionary solution." Say the specific thing that makes it good instead. Hype words are allowed only inside a quote or when describing a *client's* tech.
4. **No opinion** — a post that just describes a topic neutrally. Add the take. If there's no position, there's no post.
5. **No metaphor, all jargon** — a technical explanation with no everyday image to hang it on. Add the anchor metaphor.
6. **Every sentence the same length** — flat rhythm. Break a long one with a short one.
7. **Salesy CTA** — "Contact us today to unlock…". Replace with the soft invitation or drop it.
8. **Duplicate/empty headers, leftover scaffolding, lorem ipsum, invented stats** — remove.
9. **Case-study header style in a blog** — lowercase-with-periods belongs in case studies, not here.
10. **"Insights" in visible copy** — the section is "Thinking in public". The word survives only in the URL.

## Em dashes and mechanics

Em dashes carry the rhythm in this voice and appear liberally in the source — they're part of the sound, not a defect. If a `copy-sweep` hook or house em-dash budget is active in the environment, defer to it; otherwise keep them where they earn their place. Straight quotes or curly is a house call — match the existing file. Don't over-bold; reserve bold for rare in-prose emphasis.

The renderer treats **every non-blank line as its own paragraph** — Notion exports one block per line with no blank-line separators. Do not hand-wrap prose; a wrapped paragraph becomes several.

## QA pass (always, before delivering)

Read it back as a smart skeptic who has read a hundred agency blogs this month. Does a real person open the piece? Is there one opinion they could argue with? Is there a metaphor that makes a hard idea click? Is there a real number or named tool with a reason? Does the ending invite rather than sell? If any answer is no, fix it before delivering. If the piece reads like it could have come from any agency's content mill, it isn't done.