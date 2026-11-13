"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Reveal anyway after this long, if the observer never reports. */
const FAILSAFE_MS = 2500;

/**
 * Fades content up as it scrolls into view.
 *
 * Matches the reference template, which faded each element in over 0.75s with
 * a 0.25s delay (`trIn: { cl: "fadeIn", d: 0.75, dl: 0.25 }` in its config).
 *
 * Two deliberate safety properties, because the hidden start state is applied
 * by CSS and therefore does not depend on this component running:
 *
 *  - The CSS only hides content behind a `js-reveal` class on <html>. If React
 *    has not mounted any Reveal within 3s (slow network, failed bundle), the
 *    inline script in app/layout.tsx removes that class and everything shows.
 *  - If scripting IS available but the observer never fires, content would stay
 *    invisible forever. So anything already on screen at mount is revealed
 *    immediately without waiting, and a failsafe timer reveals the rest
 *    regardless. An unanimated page is a cosmetic loss; an invisible one is a
 *    broken site.
 *
 * `prefers-reduced-motion` is honoured by the stylesheet, not here.
 */
export function Reveal({
  children,
  /** Seconds. Stagger siblings by passing 0, 0.12, 0.24 rather than nesting. */
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Tells the inline fallback in app/layout.tsx that React is running, so it
    // leaves the reveal animation alone.
    document.documentElement.dataset.revealReady = "1";
    const el = ref.current;
    if (!el || shown) return;

    // Already on screen (above the fold, or a reload mid-page): show at once.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const failsafe = setTimeout(() => setShown(true), FAILSAFE_MS);

    // rootMargin triggers slightly early; a 0.01 threshold is enough because a
    // tall section would never reach a high intersection ratio.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
          clearTimeout(failsafe);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [shown]);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
