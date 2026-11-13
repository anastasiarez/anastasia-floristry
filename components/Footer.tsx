import { cacheLife } from "next/cache";
import Link from "next/link";
import { routes, site, footerCopy } from "@/content/site";

/**
 * The copyright year is resolved when the page is prerendered, not per request.
 *
 * cacheComponents rejects a bare `new Date()` during prerender because the
 * value is non-deterministic. Marking it cached makes explicit what was already
 * true on a statically built site: the year is baked in at build time and
 * advances on the next deploy. That is the normal behaviour for a footer
 * copyright and needs no client JavaScript.
 */
async function currentYear() {
  "use cache";
  // Without a profile, "use cache" revalidates every 15 minutes; nothing here
  // changes between deploys.
  cacheLife("max");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await currentYear();

  return (
    <footer className="bg-sandstone">
      {/* Instagram is where her new work goes first, so it gets a real button
          on every page, not only a footer text link. */}
      <div className="border-b border-ink/10 px-(--spacing-gutter) py-14 text-center">
        <p>{footerCopy.instagramLead}</p>
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow btn mt-10"
        >
          {footerCopy.instagramButton}
        </a>
      </div>
      <div className="mx-auto max-w-(--container-wide) px-(--spacing-gutter) py-24">
        <div className="grid gap-14 md:grid-cols-3 md:gap-10">
          {/* Brand + service area */}
          <div>
            {/*
              The brand mark. The guidelines name the website footer as one of
              its uses, and the full lockup shrank its tagline to an unreadable
              5px here. Plain <img> as in Nav.tsx: an SVG gains nothing from
              next/image.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src="/brand/mark-ink.svg"
              alt={site.name}
              width={890}
              height={718}
              className="h-14 w-auto"
            />
            <p className="mt-5 max-w-xs text-body-sm">{site.location.serviceArea}</p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <p className="eyebrow text-evergreen">{footerCopy.explore}</p>
            <ul className="mt-5 space-y-2">
              {routes.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-body-sm link-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="eyebrow text-evergreen">{footerCopy.contact}</p>
            <ul className="mt-5 space-y-2 text-body-sm">
              <li>
                <a href={`mailto:${site.contact.email}`} className="link-underline">
                  {site.contact.email}
                </a>
              </li>
              {site.contact.phone && (
                <li>
                  <a
                    href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
                    className="link-underline"
                  >
                    {site.contact.phone}
                  </a>
                </li>
              )}
              {site.social.instagram && (
                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    {footerCopy.instagramLink}
                  </a>
                </li>
              )}
              {site.social.pinterest && (
                <li>
                  <a
                    href={site.social.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    {footerCopy.pinterestLink}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <p className="eyebrow mt-20 text-ink">
          &copy; {site.founded === year ? year : `${site.founded}–${year}`} {site.name}
        </p>
      </div>
    </footer>
  );
}
