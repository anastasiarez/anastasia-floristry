import Image from "next/image";

/**
 * Full-bleed image band used to separate sections.
 *
 * One optimised `next/image` at every width. An earlier version rendered a
 * second CSS `background-attachment: fixed` layer for desktop parallax, which
 * cost more than the effect was worth: the CSS layer gets no AVIF/WebP
 * negotiation, no srcset and no resizing, and because `display: none` does not
 * prevent an `<img>` from loading, a desktop visitor downloaded both the
 * responsive image and the full-size original. These slots are 2400px wide.
 *
 * By this project's own priority order, performance (6) outranks visual
 * fidelity to the reference design (7). If the parallax is wanted back, do it
 * with a `position: fixed` next/image inside an `overflow: hidden` wrapper so
 * there is still only one optimised image element.
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
    <div className={`relative w-full overflow-hidden ${height === "sm" ? "h-[35svh]" : "h-[60svh]"}`}>
      <Image src={image} alt={imageAlt} fill sizes="100vw" className="object-cover" />
    </div>
  );
}
