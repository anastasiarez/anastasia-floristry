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

  const half = Math.ceil(nav.length / 2);
  const left = nav.slice(0, half);
  const right = nav.slice(half);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-(--container-wide) items-center justify-between px-(--spacing-gutter) lg:h-24"
      >
        {/* Desktop: left link group */}
        <ul className="hidden flex-1 items-center gap-8 lg:flex">
          {left.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
          ))}
        </ul>

        {/* Brand */}
        <Link
          href="/"
          className="font-display text-[1.05rem] font-light tracking-[0.3em] whitespace-nowrap uppercase transition-opacity hover:opacity-70 lg:text-center lg:text-[1.25rem]"
        >
          {site.name}
        </Link>

        {/* Desktop: right link group */}
        <ul className="hidden flex-1 items-center justify-end gap-8 lg:flex">
          {right.map((item) => (
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
          <span className="block h-px w-6 bg-taupe" />
          <span className="mt-1.5 block h-px w-6 bg-taupe" />
          <span className="mt-1.5 block h-px w-6 bg-taupe" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        // Kept mounted so the transition runs both ways; hidden from AT when closed.
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-cream transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-(--spacing-gutter)">
          <span className="font-display text-[1.05rem] font-light tracking-[0.3em] uppercase">
            {site.name}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="-mr-2 p-2"
          >
            <span className="block h-px w-6 rotate-45 bg-taupe" />
            <span className="-mt-px block h-px w-6 -rotate-45 bg-taupe" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col items-center justify-center gap-8">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-display-2xs font-light tracking-[0.2em] uppercase"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
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
        className={`eyebrow link-underline ${active ? "text-accent" : ""}`}
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
