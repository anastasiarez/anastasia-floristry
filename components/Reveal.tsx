import type { ReactNode } from "react";

/** Fades content up as it scrolls into view. CSS only: see `.reveal` in app/globals.css. */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
