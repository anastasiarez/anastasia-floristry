import Link from "next/link";
import { routes, site } from "@/content/site";

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
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await currentYear();

  return (
    <footer className="bg-sandstone">
      <div className="mx-auto max-w-(--container-wide) px-(--spacing-gutter) py-24">
        <div className="grid gap-14 md:grid-cols-3 md:gap-10">
          {/* Brand + service area */}
          <div>
            {/*
              The brand mark. The guidelines name "website footer" as one of the
              submark's intended uses.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/mark-ink.svg"
              alt=""
              width={890}
              height={718}
              className="h-12 w-auto opacity-80"
            />
            <p className="wordmark mt-5">{site.name}</p>
            <p className="mt-5 max-w-xs text-body-sm">{site.location.serviceArea}</p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <p className="eyebrow text-evergreen">Explore</p>
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
            <p className="eyebrow text-evergreen">Contact</p>
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
                    Instagram
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
                    Pinterest
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
