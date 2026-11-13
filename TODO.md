# TODO

> ## ⚠️ THE SITE IS SET TO `noindex` — REMOVE THIS AT LAUNCH
>
> Google and every AI crawler are currently told **not** to index the site,
> because it is publicly reachable while showing placeholder copy, "TODO" alt
> text and a look the brand designer is about to replace.
>
> **To go live in search, change one line** in `content/site.ts`:
>
> ```ts
> indexable: false,   //  ->  true
> ```
>
> That single flag drives all of it:
> - `noindex, nofollow` on every HTML page (`app/layout.tsx`)
> - `X-Robots-Tag: noindex` on llms.txt / sitemap.xml / OG image (`next.config.ts`)
> - whether robots.txt advertises the sitemap and the AI-crawler allowlist (`app/robots.ts`)
>
> Verify after flipping:
> ```bash
> curl -s https://anastasiafloristry.com/ | grep '<meta name="robots"'
> curl -sI https://anastasiafloristry.com/llms.txt | grep -i x-robots-tag
> ```
> The first should read `index, follow`; the second should return nothing.
>
> Note: robots.txt deliberately still **allows** crawling while noindexed. A
> `Disallow` would stop crawlers reading the noindex, which is how pages get
> stuck in the index. Do not "helpfully" add one.
>
> Then submit the sitemap in Google Search Console — nothing will be indexed
> until this is flipped, no matter what else is done.

Live at https://anastasiafloristry.com — structurally complete, still wearing
placeholders. Run `pnpm check` for the current machine-readable state.

As of 2026-11-13: **19 placeholder images** (every photo on the full site),
no real testimonials, and 9 facts awaiting her confirmation. Run `pnpm check`.

---

**Open questions for Anastasia live in `docs/questions-for-anastasia.md`.**
Add to that file whenever a fact or decision needs her; do not guess.

## 0. Decide now, because it is already public

- [ ] **Confirm her home base.** `content/site.ts` guesses `Brantford` because
      her service list centres on Brant. This feeds the `Florist` structured
      data, which is the highest-value local-SEO field on the site. A wrong
      city actively hurts.

---

## Brand has landed (Aug 2026)

Delivered and read: guidelines PDF, 81 web-ready RGB SVGs, and IG post/reel
templates. Specs are documented in AGENTS.md. Source files are gitignored
(144MB of EPS/PDF); Drive stays the source of truth.

Done already: the real tagline ("Weddings & Events") replaced the invented one.

- [x] Palette swapped to the seven brand colours, contrast audit passes.
- [x] Fonts: Prata (display), Montserrat (body and eyebrows), Myroge on the
      holding page.
- [x] Real wordmark in the header, brand mark as favicon and app icon.
- [x] Regenerate the OG card once palette and fonts are in. Done.
- [ ] **AT LAUNCH: raise `images.minimumCacheTTL`** in `next.config.ts`. It is
      deliberately short (300s) because placeholders are overwritten in place at
      the same path, and next/image caches by URL, so a long TTL would leave
      returning visitors seeing a stand-in after the real photo shipped.

### Strategy question the guidelines raised

- [ ] **The brand targets wedding PLANNERS; the site talks to couples.** The
      mission, vision and positioning all name planners as the customer. The
      FAQ ("how much do wedding flowers cost", "how do I book") and the enquiry
      form ("tell us about the day") are couple-facing throughout.

      It also suits her constraint better: one planner relationship can supply
      several pre-qualified weddings a year with no per-couple marketing, which
      is what capacity for 5 to 8 weddings and a small child actually needs.

      Note the tension: reels and TikTok reach couples, planners are won through
      venues and industry relationships. Two funnels, one website.

      **Her decision, not ours.** But it likely means a planner-facing page or
      section, and different FAQ questions.

### Identity inconsistencies to settle at the same time

Several identities are currently live in one flow. Not urgent while branding is
pending, but they need to agree before launch:

- site says **Anastasia Floristry**
- Instagram link points at **@anastasia_floristry** (fixed Nov 2026)
- enquiries deliver to **floweryoursoul@gmail.com**
- Resend account is **anastasiia.rn@gmail.com**

If the new brand holds, set up an inbox on the new domain and point
`inquiryInbox` at it (`content/site.ts`).

---

## 1. Blocking a real launch

Things a visitor would notice today.

- [ ] **Remove the holding page and preview mode.** Steps in AGENTS.md,
      "Holding page and preview mode".

- [ ] **Her photos.** 13 fixed slots + 3 per gallery. Drop originals in
      `incoming/`, then `pnpm ingest:scan` → review `assignment.json` →
      `pnpm ingest:build`. Sizes and ratios: `docs/photo-brief.md`.
      Instagram exports (~1080px) are too small for heroes.

- [ ] **Alt text for every image.** 13 fields still say "TODO". On an
      image-led site this is both an SEO and a screen-reader loss. Needs one
      line per photo from her, e.g. "blush garden roses in a footed urn".

- [ ] **Real copy.** The drafts were written from facts on her old site; they
      need to be in her voice. Priority order: the `/about` bio (most-read
      block), then service descriptions, then page intros.

- [ ] **Real testimonials.** `content/testimonials.ts` is placeholder. She has
      150+ weddings behind her; named quotes convert far better than generic
      ones, and the component handles any count including one.

- [ ] **Fill the FAQ gaps.** `content/faq.ts` has real pricing bands already,
      but lead times, the Intimate Celebrations minimum, seasonal specifics
      and local growers are still `[TODO]`. This is the page Google's answer
      boxes and AI assistants quote from, so vague answers waste it.

- [ ] **Privacy policy.** The form collects name, email, event date and venue
      from Canadian residents. PIPEDA expects a privacy notice, and there is
      currently no page and no consent line on the form. Not optional once
      real enquiries start arriving.

---

## 2. Should do soon

**Reprioritised:** her constraint is capacity (5 weddings this year vs 15 last,
because of a 1.5-year-old), not demand. The site's job is qualification and
price anchoring, not lead volume. Anything that generates more enquiries she
cannot serve has been moved down.

- [ ] **Fill the FAQ gaps — now the highest-value content on the site.** Lead
      times, the Intimate Celebrations minimum, seasonal specifics, local
      growers. Every answered question is an enquiry she does not answer by
      hand, and hours are her scarcest resource.
- [ ] **Put pricing on `/services`,** not only in the FAQ. It filters.

- [ ] **AT LAUNCH: set `indexable: true`** in `content/site.ts`. See the
      banner at the top of this file. Nothing gets indexed until this happens.

- [ ] **DMARC record.** DKIM and SPF are verified; `_dmarc` is still absent.
      Resend calls it optional, but enquiries deliver to Gmail and a
      `p=none` record measurably helps inbox placement while only monitoring.
      One record: `_dmarc TXT "v=DMARC1; p=none;"` — use Resend's Auto configure.

- [ ] **Test the contact form end to end.** Config is verified to resolve, but
      no mail has actually been sent through it yet. Needs one real submission
      to confirm delivery, not just configuration.

- [ ] **Confirmation email to the enquirer.** She receives the enquiry; the
      person who sent it gets nothing back. For a vendor being compared
      against others, silence reads as "the form is broken".

- [ ] **Rate limit `/api/inquiry`.** It is a public endpoint protected only by
      a honeypot. Resend's free tier is 100 sends/day, so a trivial script
      could exhaust the quota and flood her inbox.

- [ ] **Analytics.** Currently zero visibility into whether anyone visits.
      Prefer a cookieless option (Vercel Analytics, Plausible, Fathom) so no
      cookie banner is needed and no privacy-policy complexity is added.

- [ ] **Google Search Console.** Submit the sitemap, watch indexing and
      queries. Free, and the only way to see what she actually ranks for.

- [ ] **Google Business Profile.** Demoted twice over: wedding work is not a
      "florist near me" search, and she cannot serve more volume anyway. Worth
      an hour mainly as a place to collect reviews. She has an existing profile
      from Flower Your Soul and will rename it, which correctly preserves the
      reviews.

---

## 3. Housekeeping

- [ ] **Fix commit signing.** `gpg.program` points at a missing MacGPG2 path,
      so all commits so far are unsigned:
      `git config --global gpg.program /opt/homebrew/bin/gpg`

- [ ] **Replace the linter.** ESLint was removed; Biome or oxlint is intended.
      TypeScript is currently the only automated check in the build, and
      ESLint did previously catch a real React hooks bug it cannot see.

- [ ] **Measure performance.** No Lighthouse or Core Web Vitals run yet.
      Worth a baseline once real photos are in, since images dominate here.

- [ ] **Revisit pinned versions** when the ecosystem catches up (see the
      dependency ceiling section in `CLAUDE.md`): TypeScript 7 and ESLint 10
      both break the toolchain today.

- [ ] **React `<ViewTransition>`** for page crossfades — well suited to this
      design, and the reference template did fade between pages. Blocked on
      it shipping outside `react@experimental`.

---

## Not needed

Recorded so they do not get re-litigated:

- **Cookie banner** — nothing sets a cookie. Stays true only if analytics
  remains cookieless.
- **MDX** — the right call if a blog is added, but the content is edited by an
  AI agent, and typed TS gives the agent a build-time error where MDX
  frontmatter would fail silently. See `CLAUDE.md`.
- **`<Link prefetch={true}>`** — no route has params or searchParams, so the
  default prefetch already covers the whole page.
- **Instagram as a photo source** — capped near 1080px, too small for heroes.
