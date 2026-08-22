# Anastasia Floristry — AGENTS.md

> You are maintaining a six-page brochure site that has to get a florist
> booked. Not a platform. Not a design system showcase.

Static marketing site for a wedding and event florist in Southwestern Ontario.
Next.js App Router, Tailwind v4, TypeScript. Every page is prerendered at build
time. The only server-side code is the contact form handler.

Live at https://anastasiafloristry.com (currently `noindex`, see below).

---

## Note to the agent

This site is edited by AI agents, not by a developer in an IDE. Anastasia is a
florist; she works through a chat interface (v0, Claude) and cannot debug a
build. That single fact drives most of the rules here.

Adding code is a cost. Every line is something that can break in a session
nobody is watching, in a repo nobody will read. The best change to this site
adds no code at all: it edits a string in `content/`.

Read `TODO.md` before starting. It is the current state of the project.

---

## The rule that overrides everything

**Never invent a fact about her business.**

Not a price, not a lead time, not a minimum spend, not a delivery area, not a
number of weddings, not a flower that is in season in a given month. If a fact
is missing, leave the `TODO` marker exactly where it is.

An empty field is a task. A plausible-sounding invented field is a lie that
reaches a real client planning a real wedding, and nobody will catch it,
because it will read as finished.

This applies to `imageAlt` too: describe what is actually in the photograph, or
leave the TODO.

---

## Priorities, in strict order

When two of these conflict, the higher number loses.

1. **Factual accuracy about her business.** See above.
2. **The enquiry reaching her.** The contact form is the site's only job. If it
   fails it must fail loudly, never silently.
3. **Accessibility.** Guarded by `pnpm contrast`. Do not regress it for looks.
4. **Content completeness.** Visible placeholders cost her credibility.
5. **Discoverability.** SEO and structured data.
6. **Performance.** Mostly handled by `next/image`; do not undo that.
7. **Visual fidelity to the reference design.** Last. It is a reference, not a
   specification.

---

## Decision rules

Before building anything, ask:

- Does this help her get booked?
- Does this survive her editing it through a chat interface?
- Does this avoid adding a thing that can silently break?

If any answer is no, redesign or reject. Say so rather than building it anyway.

---

## Non-negotiable constraints

- **No hardcoded colours or font sizes in components.** Change the token in the
  `@theme` block of `app/globals.css`. This is what makes adopting the new
  brand a one-file edit instead of a rebuild. Applies to visual editors too:
  use the chat, not a property inspector that writes inline styles.
- **No user-facing strings in components.** They live in `content/`.
- **No bare `<img>`.** Always `next/image`.
- **No `alt=""` or `alt="image"`.** On an image-led site that is both an SEO
  and an accessibility loss.
- **No new dependency** where a platform feature or an existing dependency will
  do. The dependency list is deliberately short.
- **No disabling the TypeScript check.** With ESLint removed it is the only
  automated safety net in the build.
- **No committing her photo originals.** `incoming/` is gitignored on purpose.

---

## YAGNI ladder

Before adding code, walk the ladder. Stop at the first step that applies.

1. Does this need to exist at all? If no, skip it.
2. Is it a content change? Edit `content/`, write no code.
3. Does the platform do it? (`next/image`, `next/font`, metadata API, file
   conventions like `sitemap.ts` / `robots.ts` / `opengraph-image.tsx`.)
4. Does an already-installed dependency do it?
5. Is it one line? Keep it one line.
6. Only then: write the minimum that works.

---

## Fight for the obvious solution

If a change feels clever, it is probably wrong. This site should be boring:
a visitor understands it without being taught, and the next agent understands
the code without being told.

Push back when a request would make the site harder to maintain than it is to
use. Suggest the plainer alternative. "Simple" and "obvious" are not the same
thing; prefer obvious.

---

## Copy and voice

- **No em-dashes.** Use commas, periods, or parentheses.
- **No middle dots (`·`)** in user-facing copy.
- Plain, concrete, unhurried. She is selling craft, not urgency.
- No manufactured scarcity, no exclamation marks, no "book now before it is
  too late".
- Her background (rural Ukraine, gardens, a corporate career before floristry,
  150+ weddings) is the most distinctive thing she has. Do not flatten it into
  generic florist copy.
- Prices are published deliberately. Do not soften or hide them; they filter
  enquiries, which is the point.

---

## Verify before claiming done

A change is not done because it compiled. It is done when the thing it was
supposed to affect has been observed changing.

The repo carries its own gates: a type check in the build, a content
completeness report, a WCAG contrast audit, and an SEO audit that can run
against production. Check `package.json` and run the ones the change touches.
Report their real output. Do not describe a result you did not see.

## The rule that matters

**Copy and images live in `content/`. Layout lives in `components/`.**

Editing text, adding a gallery, or changing a service means editing a file
in `content/` only. Do not hardcode user-facing strings into components.
Do not put layout decisions into content files.

| File | Holds |
|---|---|
| `content/site.ts` | Business name, domain, location, email, socials, nav |
| `content/pages.ts` | All page copy (hero, intro, values, CTA, etc.) |
| `content/services.ts` | The three services and the booking process |
| `content/portfolio.ts` | Galleries. One entry per wedding or event |
| `content/testimonials.ts` | Client quotes |

## Design tokens

All colour, type and spacing values live in the `@theme` block at the top of
`app/globals.css`. They were extracted from the reference design. Change a
value there and it propagates everywhere.

Never write a raw hex colour or a `text-[42px]` in a component. Use the
tokens: `text-taupe`, `bg-linen`, `text-display-sm`, `py-(--spacing-section)`.

Type sizes are fluid `clamp()` values, so they scale smoothly between mobile
and desktop rather than snapping at a breakpoint. If something looks wrong at
an in-between width, fix the clamp, do not add a breakpoint override.

### The three fonts

`app/layout.tsx` wires them up. Two are free substitutes for commercial fonts
used by the reference design:

| Role | Currently | Should become (brand) |
|---|---|---|
| Display | Jost 300 | **Playfair Display** or **Prata** (serif) |
| Script | Parisienne | logo only; no web script needed |
| Body | Poppins 300/400 | **Montserrat Light** |

The "currently" column is pre-brand. See the Brand identity section below for
the real specification and the sanctioned free substitutes.

To move to licensed fonts, swap the two `next/font/google` calls in
`app/layout.tsx` for `next/font/local` pointing at the woff2 files. Nothing
else changes, because `globals.css` consumes them via CSS variables.

## Images

Real photos go in `public/images/`, overwriting the placeholder at the same
path. Do not rename paths, the content files reference them.

- Always use `next/image`, never a bare `<img>`.
- Every image needs real alt text describing the arrangement. `alt=""` or
  `alt="image"` is not acceptable, it is both an SEO and accessibility loss.
- Placeholders say "REPLACE ME" across them and print their own path, so any
  that reach production are obvious.
- `pnpm placeholders` regenerates only missing files, so it is safe to run
  after real photos are added. `--force` regenerates everything.

## Nav breakpoint

The desktop split nav appears at `lg` (1024px), not `md`. The business name is
long enough that at 768px it collided with the link groups. If the name
changes, re-check this.

## Contact form

`components/ContactForm.tsx` posts to `app/api/inquiry/route.ts`, which sends
mail via Resend's REST API. Needs two environment variables in Vercel:

```
RESEND_API_KEY=
RESEND_FROM="Anastasia Floristry <hello@anastasiafloristry.com>"
```

Without them the form returns a clear error and logs the enquiry to the server
console rather than silently dropping it. There is a hidden `company` honeypot
field; a filled one is treated as a bot and quietly accepted.

## Adding a blog later

Deliberately not built yet. The clean way to add it: `content/blog/*.mdx` with
frontmatter, a `app/blog/[slug]/page.tsx` using `generateStaticParams`, and a
nav entry (which picks up the sitemap for free).

## Accessibility

The reference design's palette failed WCAG AA on 7 of 9 text combinations
(body copy 3.32:1 where 4.5 is required; 12px labels at 2.21:1). It is fixed,
and `pnpm contrast` guards it.

The rule: **`taupe`, `tan` and `clay` are for large display type, borders and
decoration only.** For anything under 24px use `text`, `accent` or `clay-tx`.
Adding a new text colour means adding a case to `scripts/contrast.mjs`.

## SEO

- `content/seo.ts` holds per-page titles and meta descriptions. Do NOT derive
  descriptions by slicing body copy, that is how "TODO placeholder" ended up
  in every search snippet.
- `routes` in `content/site.ts` is the list of indexable pages and drives both
  the sitemap and `llms.txt`. `nav` is the shorter header subset. **A new page
  must be added to `routes` or it will never be crawled.**
- Every page needs exactly one `<h1>`. Pages with a `Hero` get it from there;
  pages without one must pass `as="h1"` to `SectionIntro` (see `/faq`).
- Structured data: `Florist` site-wide, `Service` per offering on `/services`,
  `FAQPage` on `/faq`.
- `app/opengraph-image.tsx` generates the social card at build time. The
  wordmark font size is computed from the name length so a longer name cannot
  overflow the canvas.

### The FAQ page is the AI-search page

`content/faq.ts` matters more than its size suggests. Question-and-answer text
with `FAQPage` schema is the format Google's answer boxes and AI assistants
extract from. Answers must lead with the answer, stand alone out of context,
and contain concrete specifics (place names, months, dollar figures, lead
times). Atmospheric writing does not get cited. Every `TODO` in that file is a
real fact that needs filling in.

### AI crawlers

`app/robots.ts` names GPTBot, ClaudeBot, PerplexityBot, Google-Extended and
others explicitly. That allowlist only applies once `site.indexable` is true;
while it is false the site serves `noindex` to everything. To opt out of one, give it its own
rule with `disallow: "/"`. Note `Google-Extended` controls Gemini and AI
Overviews only, it does not affect normal Google ranking.

## Photo ingest pipeline

She dumps photos into `incoming/`, any names and sizes. Two stages with a
review step deliberately between them: the scan measures every photo and writes
a proposed slot assignment to `incoming/assignment.json`; the build reads that
file and produces the cropped images. **Read and correct the proposal before
building.** Its `source` and `crop` values are meant to be overridden by hand.

`scripts/slots.mjs` is the **single source of truth** for every image the site
uses: path, target size, whether text sits over it, and a `rank` for how
visible it is. It feeds the placeholder generator, both ingest stages, and the
photo brief. Adding an image to the site means adding it there first.

After changing slots, run `pnpm brief` to regenerate `docs/photo-brief.md`.
Never hand-edit that file; it drifted once already.

### What the scanner decides, and what it cannot

It measures orientation, whether resolution is sufficient without upscaling,
how much of the frame a crop discards, and how visually calm the centre is
(which is what makes a photo usable behind overlaid text). Slots pick in
`rank` order, so the home hero chooses before a divider band.

It cannot judge which arrangement is her best work, which client agreed to be
shown, or which photo represents the style she wants to be hired for. Treat
`assignment.json` as a first draft.

Two guards exist because the scoring got them wrong once: anything needing
more than 15% upscale is effectively disqualified, and orientation mismatch is
near-fatal rather than a mild penalty. Before those, an 800x600 phone snap won
the 2400x1400 call-to-action that appears on every page.

### Why JPEG, not WebP

`next/image` already negotiates AVIF and WebP per browser and generates every
responsive size from the source. Pre-converting sources to WebP is
lossy-on-lossy for zero gain. Keep the highest-quality JPEG as the source.

### Bun's image API

Considered, and it is a nicer API, but Bun 1.4.0's `resize` only supports
`fit: 'fill'` (distorts) and `'inside'` (letterboxes). There is no `cover`, no
`crop`/`extract`, and `metadata()` returns only width/height/format. Fitting
arbitrary photos into fixed ratios needs cover-cropping, so this uses sharp,
which also provides `position: 'attention'` subject-aware cropping and EXIF
handling. Worth revisiting if Bun gains `cover`.

### EXIF is stripped deliberately

`.withMetadata()` is never called. Wedding photos are routinely geotagged;
publishing originals would leak the venue's coordinates and the event date.

## Her business, as it actually is

Numbers from her brother (who commissions this work), August 2026. These are
real and they should shape priorities more than any design opinion.

| | |
|---|---|
| Weddings last year | 15 |
| Weddings this year | **5** |
| Average price | $5,000 to $8,000 |
| Margin | 50% acceptable, 70% good |
| Main cost lines | flowers and assistants |
| **Binding constraint** | **a 1.5-year-old child** |

At ~$6.5k average that is roughly $97k revenue last year against ~$32k this
year: a 67% volume drop with a cause that has nothing to do with marketing.

**The constraint is capacity, not demand.** This matters more than it looks:

- More enquiries actively cost her. Every call with someone who will not book
  is an hour away from her child.
- With volume capped, revenue is a function of **price per wedding**, not
  count. Six at $10k beats fifteen at $6.5k, and beats it twice over on hours.
- So the site's job is **qualification and price anchoring, not lead volume**.
  Published prices, a hard minimum, a stated service area and honest lead
  times are the highest-value content on the site. Every question the FAQ
  answers is an enquiry she does not answer by hand.
- This is why SEO, `llms.txt`, AI-search optimisation and Google Business
  Profile are deprioritised in TODO.md. Being found by 200 people to book 6
  is worse than being found by 20 of the right ones.

She is also investing continuously in **Instagram reels and TikTok**, and the
designer supplied templates for it (`Branding/Launch Graphics`, IG Post
1080x1350 and IG Reel 1080x1920). Treat social as top-of-funnel and the site
as where it converts: the site does not need to attract, it needs to close.
Prominent Instagram links matter; a blog does not.

### Prior business

Previously **Flower Your Soul** (floweryoursoul.ca, `@flower_your_soul`),
rebranded to Anastasia Floristry. Based in **Southwestern Ontario**, serving
Hamilton, Brantford, Brant, Cambridge, Kitchener, Waterloo, Guelph, Elora,
Elmira, Burlington and Oakville. Her exact home base is still unconfirmed in
`content/site.ts`.

**Two** packages: Signature Weddings and Intimate Celebrations. Do not invent a
third to balance a layout; the components handle any count.

Her background (rural Ukraine, gardens, a corporate career before floristry) is
the most distinctive thing she has. It belongs prominently on `/about`.

**Unverified claim to check before launch:** the FAQ drafts "over five years and
more than 150 weddings". With 15 last year and 5 this year, 150 implies some
very busy earlier years. It may be true, but per the rule about never
publishing an unverified business fact, she must confirm it. An understated
true figure beats an impressive one a client could question.

---

## Brand identity

From `Branding/Brand Guidelines/Anastasia Floristry - Brand Guidelines.pdf`
(August 2026). Source assets are gitignored; that PDF is the authority.

- **Name** Anastasia Floristry
- **Tagline** "Weddings & Events" — this is the real tagline and it belongs in
  `content/site.ts`. Earlier copy invented "Wedding and event florals".
- **Core values** warmth, generosity, romance, craftsmanship, elegance, care,
  confidence, growth
- **Mood** quiet luxury. Understated, considered, softness without fragility.
  European in spirit, grounded in craft. Garden roses, lilacs, hand-gathered
  branches against refined lines.

### The audience is wedding PLANNERS, not couples

This is the most consequential thing in the guidelines and the site currently
contradicts it.

The mission, vision and positioning all name planners as the customer: a floral
partner planners can stop worrying about, the name planners reach for first, a
collaborator rather than a vendor, with the reliability, follow-through and
industry credibility a planner needs to hand off a wedding and trust it comes
back beautiful.

The site as built is couple-facing throughout: the FAQ asks "how much do
wedding flowers cost" and "how do I book", and the enquiry form asks about
"the day". None of that speaks to a planner.

**It also fits her constraint better than couple acquisition does.** One planner
relationship can supply several pre-qualified weddings a year with no per-couple
marketing, which is exactly what someone with capacity for 5 to 8 weddings and
a small child needs. Note the tension worth naming: reels and TikTok reach
couples, while planners are won through venues, industry relationships and
reliability. Those are two different funnels, and only one of them is a website
job.

**Do not silently rewrite the site for planners.** It is a strategy decision for
her. But flag the mismatch whenever touching FAQ, services or form copy.

### Palette (exact, from the guidelines)

| Token | Hex | Role |
|---|---|---|
| Ink | `#1F2936` | darkest, text and dark sections |
| Linen | `#F7F3EB` | **dominant** background |
| Sandstone | `#E0C9BF` | second most used, warm blush |
| Mauve | `#9E7E81` | accent |
| Wisteria | `#CEC5CB` | soft accent |
| Evergreen | `#646957` | deep green |
| Sage | `#ACB29A` | light green |

Hierarchy per the guidelines' own diagram, by prominence: Linen dominates, then
Sandstone, then Ink and Mauve, then Wisteria, Evergreen and Sage.

**This entirely replaces the palette extracted from the reference template.**
Note the trap: the old token names `linen` and `ink` both exist in the new
palette with *different values*, so a swap must be checked value-by-value, not
by name. Re-run the contrast audit after: these are the designer's print-first
values and several will fail AA for small text exactly as the old ones did.
Derive accessible text variants the same way, and keep the brand values for
large display type and decoration.

### Typography

| Role | Brand font | Sanctioned free substitute |
|---|---|---|
| Headline / header | **Myroge** (uppercase, regular spacing, large) | **Playfair Display Regular** or **Prata** |
| Eyebrow / button | **Sweet Sans** (uppercase, wide spacing, small) | **Poppins** or **Montserrat** |
| Subhead | **Sweet Sans** (uppercase, wide spacing, medium) | as above |
| Body / paragraph | **Montserrat Light** (regular case, small) | Montserrat is already free |
| Script | **OPTIExcelsior Script** (logo only) | — |

The guidelines explicitly name those Google alternatives, so using them is
sanctioned rather than a compromise.

**The display face changes character.** The site currently uses Jost, a
geometric sans. The brand calls for a high-contrast serif, matching the serif
wordmark. That is a real visual shift, not a swap of similar fonts.

Body should be Montserrat Light, not Poppins. Poppins remains valid for
eyebrow and button copy.

### Logo assets

`Branding/Logos/` has CMYK (print) and RGB (screen). **Use RGB.** 81 ready SVGs
there, named `<colour>_<variant>`, covering: main logo (crest over stacked
wordmark with the "Weddings & Events" rule), alt logo (single line), word logo
(no crest), brand mark (floral sprig), monogram (AF in an oval) and bird, each
in ink, black, white, evergreen, sandstone, mauve and sage.

The guidelines name the submark's uses directly, and two are ours: **website
footer** and **website favicon**. So the favicon is the brand mark or monogram,
not a letter.

Rules from the guidelines:

- Use the logo only in brand colours.
- Place it on a clutter-free, high-contrast background with generous margin.
- Never stretch it, never put it on a low-contrast pairing (their example: cream
  on white), never recolour it outside the palette.
- Clearspace unit is the middle counter of the "O". Keep it consistent across
  every variant.

## Dependency ceiling (tested, do not just bump blindly)

Current: Next 16.3.2, React 19.2.8, Tailwind 4.3.3, TypeScript 6.0.3,
@types/node 24.13.3, sharp 0.35.3. No ESLint (see below).

**pnpm is pinned to 11.22.0 via `packageManager`, and must stay there.** The
scaffold shipped `pnpm@12.0.0-rc.7`, which broke the Vercel install outright
(its `bin/pnpm` shim is corrupt on Vercel) and mislinked `sharp` locally via a
peer-suffixed store path. Install with the pinned version, not whatever `pnpm`
resolves to on your PATH, or the lockfile drifts out of sync with
`packageManager` and the deploy fails.

Two majors are available but **break the toolchain**, verified by trying them:

- **ESLint 10** — `eslint-config-next@16.3.2` pulls `eslint-plugin-react@7.37.5`,
  which crashes in `resolveBasedir` during React version detection under
  ESLint 10. Lint dies with exit 2. Stay on ESLint 9 until
  eslint-config-next ships an ESLint 10 compatible plugin set.
  (ESLint 9.39.5 reports itself as no longer supported. That warning is
  expected and is not worth breaking lint over.)
- **TypeScript 7** — `typescript-eslint@8.67.0` hard-refuses to load against
  TS 7.0 and tells you to use the TS 6 API instead. Tracking issue:
  github.com/typescript-eslint/typescript-eslint/issues/10940.
  **TypeScript 6.0.3 is the ceiling** and works fine for both lint and build.

`@types/node` is deliberately pinned to **24** to match the Node 24 runtime,
not the latest 26. Types ahead of the runtime describe APIs that do not exist
in the deployed environment.

Both findings above are historical: they are why the versions are pinned, and
partly why ESLint was dropped. **Note that the TypeScript 7 blocker was
`typescript-eslint`, which is no longer installed.** The build itself survived
TS 7 when lint did not, so TS 7 may now be viable. Untested since ESLint was
removed. Verify with a real build before bumping, and expect the type checker
to be the only thing that can object.

## No linter (deliberate)

ESLint was removed. `eslint.config.mjs` is gone, the `lint` script is gone, and
there is **no `eslint` key in next.config.ts** — Next 16 dropped `next lint`, so
that option is unrecognised and warns if present. Biome or oxlint is the
intended replacement.

Consequence: **TypeScript is now the only automated safety net in the build**,
so do not disable `typescript` checking. It is worth knowing what was lost:
ESLint previously caught a real `react-hooks/set-state-in-effect` bug in the
nav that the type checker does not see. Until a replacement lands, that class
of React error has to be caught by review.

## Instant Navigations

`cacheComponents: true` and `partialPrefetching: true` are enabled. Every page
is fully static, so the prefetched shell *is* the whole page: clicking a nav
link renders from memory with no server round trip.

Cache Components is strict about non-deterministic values during prerender, and
enabling it surfaced two real latent bugs:

- `new Date().getFullYear()` in the footer failed the build. It is now a
  `"use cache"` helper, making explicit what was already true: the year is
  baked at build time and advances on deploy.
- `app/sitemap.ts` silently **downgraded from static to a per-request
  function** for the same reason. Fixed with `"use cache"`. Watch the build's
  Route table for `ƒ` appearing where `○` belongs.

Two further constraints it imposes:

- `export const dynamic` is rejected outright. Use `"use cache"` instead.
- A `"use cache"` function must be `async` and must return a **plain value**.
  It cannot return a `Response`, which is a class instance. `app/llms.txt` caches
  the body *string* and builds the `Response` outside the cached function.

### What from the 16.3 release was deliberately NOT adopted

Most of that release targets dynamic, data-driven apps. This is a six-page
static brochure site, so:

- `<Link prefetch={true}>` — pointless here. It exists to resolve `params` and
  `searchParams` before a click; no route has either, so the default prefetch
  already fetches the whole page. It would only add a server request per
  visible link.
- `'use cache'` + `cacheTag`/`updateTag` for mutations, `useOptimistic`,
  Suspense streaming, client data fetching (SWR/TanStack) — no database, no
  per-user data, no async page reads. Nothing to apply them to.
- `experimental.useOffline` — the docs explicitly say not for production.
- **React `<ViewTransition>`** — genuinely well suited to this site's look, and
  the reference design did fade between pages. But it is not exported from
  React 19.2.8 in any form, not even `unstable_`. It needs `react@experimental`,
  which does not belong on a live client site. Revisit when it ships stable.

## Content format: TypeScript, not MDX

Deliberate, and the reasoning is specific to **content being edited by an AI
agent rather than a human in a CMS**:

- **Type errors are the agent's feedback loop.** A wrong key in a typed content
  file fails `pnpm build` with an exact line. A wrong key in MDX frontmatter
  renders nothing, silently, and the agent believes it succeeded.
- The `type Service = {...}` declarations are inline schema the agent reads.
- Cross-file references work: `content/faq.ts` imports `pricing` from
  `content/services.ts`, so her real price bands cannot drift out of sync
  between the FAQ and the services page.

Two things were done to make the files agent-friendly:

1. **No string concatenation.** All prose is single-line template literals.
   `"text " + "more"` is fragile for exact-match edits. (Verified value-for-value
   identical when converted.)
2. **`pnpm check`** reports remaining TODOs, placeholder alt text, unfilled
   `[TODO]` facts, missing image files, and images that are still placeholders,
   each with `file:line`, exiting non-zero while anything is outstanding. This
   is the "required fields" signal a CMS would normally give.

MDX is still the right choice **if a blog is added** — that is long-form prose
with inline components, which is what MDX is for.
