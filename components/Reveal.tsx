import type { ReactNode } from "react";

/**
 * Fades content up as it scrolls into view. CSS only: the `.reveal` class
 * drives a scroll-driven animation (`animation-timeline: view()`) in
 * app/globals.css.
 *
 * Browsers without scroll-driven animations, and anyone with reduced motion,
 * simply see the content with no fade. Nothing is ever hidden waiting for
 * JavaScript, which is why this replaced an IntersectionObserver version that
 * needed an inline script, a failsafe timer and a hydration workaround.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
