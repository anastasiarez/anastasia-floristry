# TODO

Live at https://anastasiafloristry.com — structurally complete, still wearing
placeholders. Run `pnpm check` for the current machine-readable state.

As of the last check: **37 TODO markers, 13 placeholder alt texts, 1 unfilled
fact, 19 placeholder images.**

---

## 0. Decide now, because it is already public

- [ ] **Should Google index it yet?** `robots.txt` currently allows
      everything, so crawlers can index placeholder copy, "TODO" alt text and
      thin pages — under a visual identity that is about to change. First
      impressions with search engines are sticky, and there is no upside to
      being indexed before the brand and photos land. Recommend a temporary
      `noindex`, lifted at launch. A few lines, trivial to remove.

- [ ] **Confirm her home base.** `content/site.ts` guesses `Brantford` because
      her service list centres on Brant. This feeds the `Florist` structured
      data, which is the highest-value local-SEO field on the site. A wrong
      city actively hurts.

---

## Blocked on the brand designer

She is waiting on a branding professional, so **everything visual below is
provisional**. Do not invest effort here until that work lands.

What is currently a placeholder standing in for real brand work:

- [ ] **Logo / wordmark.** The header is just the business name set in Jost.
- [ ] **Favicon and app icons.** Still the Next.js default logo in the browser
      tab. Pointless to design now if a real mark is coming. When it arrives:
      replace `app/favicon.ico`, and add `app/icon.png` (512px) and
      `app/apple-icon.png` (180px) — Next picks both up automatically.
- [ ] **Palette.** The seven colours were extracted from the reference
      template, then darkened to pass WCAG AA. A brand palette will replace
      them, and will need re-checking with `pnpm contrast`.
- [ ] **Typography.** `Jost` and `Parisienne` are free stand-ins for the
      reference design's two commercial fonts. A designer will likely specify
      real ones.
- [ ] **Social card.** `app/opengraph-image.tsx` is generated from the palette
      and the name, so it changes when they do.

**The swap is cheap by design.** Every colour and type value lives in the one
`@theme` block in `app/globals.css`, and the fonts are two `next/font`
declarations in `app/layout.tsx`. Nothing is hardcoded in components, so
adopting a brand is editing one file plus two font lines, not a rebuild.

### Identity inconsistencies to settle at the same time

Three identities are currently live in one flow. Not urgent while branding is
pending, but they need to agree before launch:

- site says **Anastasia Floristry**
- Instagram link points at **@flower_your_soul**
- enquiries deliver to **floweryoursoul@gmail.com**
- Resend account is **anastasiia.rn@gmail.com**

If the new brand holds, set up an inbox on the new domain and point
`inquiryInbox` at it (`content/site.ts`).

---

## 1. Blocking a real launch

Things a visitor would notice today.

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

- [ ] **Google Business Profile.** Not a code task, and still the single
      highest-return item on this list for a local florist. "Florist near me"
      traffic comes from here, not from the website. Takes about an hour.

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
