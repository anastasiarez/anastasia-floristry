# Anastasia Floristry — site

Static marketing site for a wedding and event florist based in Canada.
Next.js App Router, Tailwind v4, TypeScript. Every page is prerendered at
build time. The only server-side code is the contact form handler.

## Commands

```bash
pnpm dev           # local dev server on :3000
pnpm build         # production build, also type-checks
pnpm lint
pnpm contrast      # WCAG AA audit of the palette (exits non-zero on failure)
pnpm seo           # SEO/crawlability audit against a running server
pnpm placeholders  # generate placeholder images for any missing photo path
```

Run `pnpm contrast` after touching any colour, and `pnpm seo` after touching
metadata, headings or structured data.

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

| Role | Currently | Reference design used |
|---|---|---|
| Display | Jost 300 | Made Canvas Light (commercial) |
| Script | Parisienne | La Charlune Regular (commercial) |
| Body | Poppins 300/400 | Poppins (free, same) |

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

## SEO

- Per-page `metadata` exports set title and description. Every page also sets
  `alternates.canonical`.
- `app/sitemap.ts` is generated from the nav, so adding a nav entry adds a
  sitemap entry automatically.
- `app/layout.tsx` emits `Florist` structured data built from `content/site.ts`.
  Keeping the address and service area accurate there is the highest-value SEO
  work on this site, because local results are where the traffic comes from.

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

## Known local quirk

`pnpm` 12 RC mislinks `sharp` (peer-suffixed store path), so
`node_modules/sharp` can be a broken symlink and `pnpm placeholders` fails
with `ERR_MODULE_NOT_FOUND`. Fix:

```bash
rm -f node_modules/sharp && ln -s "../$(ls -d node_modules/.pnpm/sharp@*_*/node_modules/sharp | head -1)" node_modules/sharp
```

Only affects the placeholder script. Vercel provides its own image optimizer,
so this never affects a deploy.


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
others explicitly, all currently allowed. To opt out of one, give it its own
rule with `disallow: "/"`. Note `Google-Extended` controls Gemini and AI
Overviews only, it does not affect normal Google ranking.

## Photo ingest pipeline

She dumps photos, the pipeline places them. Two stages, reviewable in between:

```bash
# 1. she drops any number of photos, any names/sizes, into incoming/
pnpm ingest:scan     # measures each, proposes slot assignments
#    review incoming/assignment.json, override any `source` by hand
pnpm ingest:build    # cover-crops and writes public/images/
pnpm ingest:build --dry   # report without writing
```

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

## Her real business facts

Taken from her previous site, floweryoursoul.ca. These are real, not invented:

- Previously **Flower Your Soul**, Instagram `@flower_your_soul`. The new
  domain implies a rebrand to **Anastasia Floristry** — confirm before launch.
- Based in **Southwestern Ontario**, serving Hamilton, Brantford, Brant,
  Cambridge, Kitchener, Waterloo, Guelph, Elora, Elmira, Burlington, Oakville.
  Her exact home base is still a TODO in `content/site.ts`.
- **Two** packages: Signature Weddings and Intimate Celebrations. Do not invent
  a third to balance a layout; the components handle any count.
- Real pricing bands live in `content/services.ts` and are surfaced in the FAQ.
  Publishing them filters enquiries and is the most useful content on the site.
- Her background (rural Ukraine, gardens, a corporate career before floristry,
  150+ weddings) is the most distinctive thing about her story. It belongs
  prominently on /about, not buried.

## Dependency ceiling (tested, do not just bump blindly)

Current: Next 16.3.2, React 19.2.8, Tailwind 4.3.3, TypeScript 6.0.3,
ESLint 9.39.5, @types/node 24.13.3, sharp 0.35.3.

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

Retest with: `pnpm lint && pnpm build && pnpm contrast`. Lint is the canary
here; the build survives combinations that lint does not.

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
