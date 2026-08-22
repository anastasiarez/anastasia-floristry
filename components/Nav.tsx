"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";

/**
 * Primary navigation.
 *
 * Desktop: brand centred, links split evenly either side.
 * Mobile:  brand left, hamburger right, opening a full-screen drawer.
 */
// `nav` is a module-level constant, so the split never changes between renders.
const half = Math.ceil(nav.length / 2);
const leftLinks = nav.slice(0, half);
const rightLinks = nav.slice(half);

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-linen/95 backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-(--container-wide) items-center justify-between px-(--spacing-gutter) lg:h-24"
      >
        {/* Desktop: left link group */}
        <ul className="hidden flex-1 items-center gap-8 lg:flex">
          {leftLinks.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
          ))}
        </ul>

        {/* Brand */}
        <Link
          href="/"
          className="wordmark whitespace-nowrap transition-opacity hover:opacity-70 lg:text-center"
        >
          {site.name}
        </Link>

        {/* Desktop: right link group */}
        <ul className="hidden flex-1 items-center justify-end gap-8 lg:flex">
          {rightLinks.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
          ))}
        </ul>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="-mr-2 p-2 lg:hidden"
        >
          <span className="block h-px w-6 bg-ink" />
          <span className="mt-1.5 block h-px w-6 bg-ink" />
          <span className="mt-1.5 block h-px w-6 bg-ink" />
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
        // Kept mounted so the transition runs both ways; hidden from AT when closed.
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-linen transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-(--spacing-gutter)">
          <span className="wordmark">
            {site.name}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="-mr-2 p-2"
          >
            <span className="block h-px w-6 rotate-45 bg-ink" />
            <span className="-mt-px block h-px w-6 -rotate-45 bg-ink" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col items-center justify-center gap-8">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-display-2xs tracking-[0.2em] uppercase"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function NavLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`eyebrow link-underline ${active ? "text-evergreen" : ""}`}
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
