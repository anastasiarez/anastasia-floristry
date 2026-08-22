import Image from "next/image";

/**
 * Full-bleed image band used to separate sections.
 *
 * `bg-fixed` gives the slow parallax drift of the reference design on
 * desktop. It is disabled below md because iOS Safari renders fixed
 * backgrounds badly, and because next/image cannot be used for a fixed
 * background, this one case uses a plain CSS background image instead.
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
  const h = height === "sm" ? "h-[35svh]" : "h-[60svh]";

  return (
    <div className={`relative w-full overflow-hidden ${h}`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        className="object-cover md:hidden"
      />
      <div
        role="img"
        aria-label={imageAlt}
        className="absolute inset-0 hidden bg-cover bg-fixed bg-center md:block"
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
}
