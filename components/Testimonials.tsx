"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "./Section";
import { testimonialsCopy, type Testimonial } from "@/content/testimonials";

/**
 * Rotating testimonial band.
 *
 * All quotes are rendered into the DOM (inactive ones hidden with
 * `aria-hidden` rather than removed) so search engines index every quote
 * even though only one is visible at a time.
 */
const INTERVAL_MS = 7000;

export function Testimonials({
  items,
  tone = "linen",
}: {
  items: readonly Testimonial[];
  tone?: "cream" | "linen";
}) {
  const [index, setIndex] = useState(0);
  // A ref, not state: pausing renders nothing, and as state every mouse cross
  // re-rendered the band and restarted the rotation from zero.
  const paused = useRef(false);

  useEffect(() => {
    if (items.length < 2) return;
    // WCAG 2.2.2: no automatic movement for people who asked for less motion.
    // The dots still let them move through the quotes.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % items.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <Section tone={tone} width="content">
      <div
        className="text-center"
        // Paused while hovered or while keyboard focus is inside, so nothing
        // moves under someone who is reading or using the dots.
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
      >
        <p className="script text-script-sm text-mauve">{testimonialsCopy.accent}</p>

        {/* Grid stacking keeps the band a constant height, so rotation
            does not shift the rest of the page. */}
        <div className="mt-10 grid">
          {items.map((t, i) => (
            <blockquote
              key={t.author + i}
              aria-hidden={i !== index}
              className={`col-start-1 row-start-1 transition-opacity duration-1000 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <p className="text-display-2xs leading-relaxed tracking-[0.06em] uppercase">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="eyebrow mt-8 text-evergreen">
                {t.author}
                {t.context && <span className="text-ink">, {t.context}</span>}
              </footer>
            </blockquote>
          ))}
        </div>

        {items.length > 1 && (
          <div className="mt-12 flex justify-center gap-3">
            {items.map((t, i) => (
              <button
                key={t.author + i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={testimonialsCopy.dotLabel(i + 1, items.length)}
                aria-current={i === index}
                // 24px target (WCAG 2.5.8) around a 6px dot.
                className="flex size-6 items-center justify-center"
              >
                <span
                  className={`size-1.5 rounded-full transition-colors ${
                    i === index ? "bg-mauve" : "bg-ink/30"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
