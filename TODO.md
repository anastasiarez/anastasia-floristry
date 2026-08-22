# TODO

Live at https://anastasiafloristry.com — structurally complete, still wearing
placeholders. Run `pnpm check` for the current machine-readable state.

As of the last check: **37 TODO markers, 13 placeholder alt texts, 1 unfilled
fact, 19 placeholder images.**

---

## 0. Decide now, because it is already public

- [ ] **Should Google index it yet?** `robots.txt` currently allows everything,
      so crawlers can index placeholder copy, "TODO" alt text and thin pages.
      First impressions with search engines are sticky. Either accept it, or
      add a temporary `noindex` and lift it at launch (a few lines, easy to
      remove). **Ask before assuming.**

- [ ] **Resolve the brand.** Three identities are live in one flow right now:
      - site says **Anastasia Floristry**
      - Instagram link points at **@flower_your_soul**
      - enquiries deliver to **floweryoursoul@gmail.com**
      - Resend account is **anastasiia.rn@gmail.com**

      A visitor sees the inconsistency. If the new brand is the decision, set
      up an inbox on the new domain and point `inquiryInbox` at it
      (`content/site.ts`).

- [ ] **Confirm her home base.** `content/site.ts` guesses `Brantford` because
      her service list centres on Brant. This feeds the `Florist` structured
      data, which is the highest-value local-SEO field on the site. A wrong
      city actively hurts.

---

## 1. Blocking a real launch

Things a visitor would notice today.

- [ ] **Her photos.** 13 fixed slots + 3 per gallery. Drop originals in
      `incoming/`, then `pnpm ingest:scan` → review `assignment.json` →
      `pnpm ingest:build`. Sizes and ratios: `docs/photo-brief.md`.
      Instagram exports (~1080px) are too small for heroes.

- [ ] **Favicon.** Still the Next.js default logo in the browser tab.
      Replace `app/favicon.ico` (and ideally add `app/icon.png` at 512px plus
      `app/apple-icon.png` at 180px, which Next picks up automatically).

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
