"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, navCta, navLabels, site } from "@/content/site";

/**
 * Primary navigation.
 *
 * Desktop: brand centred, links split evenly either side. The enquiry page is
 *          a bordered button rather than a plain link.
 * Mobile:  brand left, enquiry button and hamburger right. The hamburger opens
 *          a full-screen drawer that behaves as a modal dialog.
 */
// `nav` is a module-level constant, so the split never changes between renders.
// Desktop leaves out Home: the centred logo is the home link, and dropping it
// keeps both sides clear of the logo at 1024px. The mobile menu lists it.
const desktopLinks = nav.filter((item) => item.href !== "/");
const half = Math.ceil(desktopLinks.length / 2);
const leftLinks = desktopLinks.slice(0, half);
const rightLinks = desktopLinks.slice(half);

/** The drawer only exists below this width (Tailwind `lg`). */
const DESKTOP = "(min-width: 64rem)";

export function Nav() {
  const pathname = usePathname();

  // The drawer is open for the page it was opened on. Navigating (a link, the
  // back button) changes `pathname`, so it closes itself without an effect
  // calling setState.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);

  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  // Set by the close button and Escape: focus goes back to the hamburger.
  // Following a menu link leaves it unset, so focus stays on the new page.
  const refocus = useRef(false);
  const dismiss = () => {
    refocus.current = true;
    close();
  };

  // While open: lock scroll, make the page behind inert so Tab cannot reach
  // it, and move focus into the drawer.
  useEffect(() => {
    if (!open) {
      if (refocus.current) openButton.current?.focus();
      refocus.current = false;
      return;
    }
    const behind = [
      document.querySelector("body > header"),
      document.getElementById("main"),
      // `body >` matters: testimonials use <footer> inside <main> too.
      document.querySelector("body > footer"),
    ].filter((el): el is HTMLElement => el !== null);

    document.body.style.overflow = "hidden";
    behind.forEach((el) => (el.inert = true));
    closeButton.current?.focus();

    return () => {
      document.body.style.overflow = "";
      behind.forEach((el) => (el.inert = false));
    };
  }, [open]);

  // Escape closes. Widening past the breakpoint closes too, because the drawer
  // is hidden there and would otherwise leave the page scroll-locked.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    const wide = window.matchMedia(DESKTOP);
    const onWide = () => wide.matches && close();
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-linen/95 backdrop-blur-sm">
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-(--container-wide) items-center justify-between gap-4 px-(--spacing-gutter) lg:grid lg:h-24 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
        >
          {/* Desktop: left link group */}
          <ul className="hidden flex-1 items-center gap-5 lg:flex xl:gap-8">
            {leftLinks.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </ul>

          {/* Brand */}
          <Link href="/" className="mr-auto transition-opacity hover:opacity-70 lg:mr-0" aria-label={site.name}>
            {/*
              A plain <img>, not next/image, and deliberately so. The project rule
              against bare <img> exists to guarantee photographs get responsive
              sizing and format negotiation. An SVG is resolution independent, so
              next/image would add nothing and would require enabling
              `dangerouslyAllowSVG` project-wide to serve one trusted logo.
              Explicit width/height keep it from shifting layout while loading.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/wordmark-ink.svg"
              alt={site.name}
              width={1860}
              height={279}
              className="h-6 w-auto md:h-8"
            />
          </Link>

          {/* Desktop: right link group */}
          <ul className="hidden flex-1 items-center justify-end gap-5 lg:flex xl:gap-8">
            {rightLinks.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </ul>

          {/* Mobile: enquiry button, always visible */}
          <Link href={navCta.href} className="eyebrow btn btn-sm lg:hidden">
            {navCta.label}
          </Link>

          {/* Mobile: hamburger (44px target) */}
          <button
            ref={openButton}
            type="button"
            onClick={() => setOpenOn(pathname)}
            aria-label={navLabels.open}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2.5 flex size-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className="icon-line block h-px w-6 bg-ink" />
            <span className="icon-line block h-px w-6 bg-ink" />
            <span className="icon-line block h-px w-6 bg-ink" />
          </button>
        </nav>
      </header>

      {/*
        Mobile drawer. A SIBLING of <header>, deliberately not a child.

        The header carries `backdrop-blur-sm`, and `backdrop-filter` creates a
        containing block for fixed-position descendants. While this lived inside
        the header, `fixed inset-0` resolved against the header's own 64px box
        instead of the viewport, so the "full screen" drawer was a 375x64 strip
        with the page showing through beneath it.
      */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={navLabels.menu}
        // Kept mounted so the transition runs both ways; hidden from AT when closed.
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-linen transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-(--spacing-gutter)">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wordmark-ink.svg"
            alt={site.name}
            width={1860}
            height={279}
            className="h-6 w-auto"
          />
          <button
            ref={closeButton}
            type="button"
            onClick={dismiss}
            aria-label={navLabels.close}
            className="-mr-2.5 flex size-11 flex-col items-center justify-center"
          >
            <span className="icon-line block h-px w-6 translate-y-px rotate-45 bg-ink" />
            <span className="icon-line block h-px w-6 -rotate-45 bg-ink" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col items-center justify-center gap-8">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`link-hover font-myroge text-display-2xs tracking-heading uppercase ${
                    active ? "text-evergreen" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function NavLink({
  label,
  href,
  pathname,
}: {
  label: string;
  href: string;
  pathname: string;
}) {
  const active = isActive(pathname, href);

  if (href === navCta.href) {
    return (
      <li>
        <Link href={href} aria-current={active ? "page" : undefined} className="eyebrow btn btn-sm">
          {navCta.label}
        </Link>
      </li>
    );
  }

  // Plain at rest, underline drawn in on hover. The current page keeps a
  // permanent underline plus Evergreen, so colour is not the only signal.
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`eyebrow link-hover ${active ? "text-evergreen" : ""}`}
      >
        {label}
      </Link>
    </li>
  );
}

/** Exact match for the home page, prefix match for everything else. */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
