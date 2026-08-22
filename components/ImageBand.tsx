import Image from "next/image";

/**
 * Full-bleed image band used to separate sections.
 *
 * Parallax on desktop, and still a single optimised `next/image`.
 *
 * An earlier version got the parallax from a second CSS
 * `background-attachment: fixed` layer, which was the expensive way: the CSS
 * layer gets no AVIF/WebP negotiation, no srcset and no resizing, and since
 * `display: none` does not stop an `<img>` loading, desktop downloaded both
 * the responsive image and the full-size 2400px original.
 *
 * The `.parallax-band` rule in globals.css does it with one image instead: a
 * clip-path on this container makes it the containing block for the fixed
 * image inside, so the image holds still while the page scrolls over it.
 */
export function ImageBand({
  image,
  imageAlt,
  height = "md",
}: {
  image: string;
  imageAlt: string;
  height?: "sm" | "md";
}) {
  return (
    <div
      className={`parallax-band relative w-full overflow-hidden ${
        height === "sm" ? "h-[35svh]" : "h-[60svh]"
      }`}
    >
      <Image src={image} alt={imageAlt} fill sizes="100vw" className="object-cover" />
    </div>
  );
}
