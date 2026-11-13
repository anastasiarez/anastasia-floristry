import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Standard vertical section. Handles the page rhythm and optional banding
 * so individual pages never set their own padding.
 */
export function Section({
  children,
  tone = "linen",
  width = "wide",
  id,
  compact = false,
  className = "",
}: {
  children: ReactNode;
  /** Half-height padding, for an intro of a sentence or two. */
  compact?: boolean;
  tone?: "linen" | "sandstone";
  width?: "wide" | "content";
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`${tone === "sandstone" ? "bg-sandstone" : "bg-linen"} ${compact ? "py-(--spacing-section-sm)" : "py-(--spacing-section)"} ${className}`}
    >
      <div
        className={`mx-auto px-(--spacing-gutter) ${
          width === "content" ? "max-w-(--container-content)" : "max-w-(--container-wide)"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * Centred eyebrow / script accent / heading / body stack. The most repeated
 * text pattern in the design.
 */
export function SectionIntro({
  eyebrow,
  accent,
  title,
  body,
  as = "h2",
}: {
  eyebrow?: string;
  accent?: string;
  title?: string;
  body?: string;
  /**
   * Heading level for `title`. Defaults to h2 because most pages already have
   * an h1 in their Hero. Pages without a Hero must pass "h1" so the page is
   * not left without one.
   */
  as?: "h1" | "h2";
}) {
  const Heading = as;

  return (
    <Reveal className="mx-auto max-w-(--container-content) text-center">
      {eyebrow && <p className="eyebrow text-evergreen">{eyebrow}</p>}
      {accent && <p className="script mt-4 text-script-sm text-mauve">{accent}</p>}
      {title && (
        <Heading className={`mt-6 ${as === "h1" ? "text-display-sm" : "text-display-xs"}`}>{title}</Heading>
      )}
      {body && <p className="mt-8">{body}</p>}
    </Reveal>
  );
}
