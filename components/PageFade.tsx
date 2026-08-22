"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Crossfades page content on navigation.
 *
 * The reference template faded between pages (`defaultTrIn: { type: "fade",
 * duration: 0.75 }`). Keying on the pathname remounts the wrapper on every
 * route change, which replays the CSS animation.
 *
 * Shorter than the template's 0.75s on purpose: navigation here is already
 * instant (every page is prerendered and prefetched), so a long fade reads as
 * latency rather than polish. Tune `--page-fade` in globals.css.
 *
 * React's <ViewTransition> would be the better mechanism, but it is not
 * exported from React 19.2.8 in any form and needs react@experimental.
 */
export function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-fade">
      {children}
    </div>
  );
}
