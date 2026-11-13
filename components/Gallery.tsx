import Image from "next/image";

type GalleryCell = { src: string; alt: string; tall?: boolean };

/**
 * Portfolio grid.
 *
 * The tall cell spans two rows so the grid keeps the uneven, editorial rhythm
 * of the reference design without needing a JS masonry library. Which cell is
 * tall is derived in content/portfolio.ts from the slot manifest, not passed
 * in by hand.
 */
export function Gallery({ images }: { images: readonly GalleryCell[] }) {
  // Three columns only when there are enough images to fill them: a tall cell
  // plus two short ones in three columns left a blank row. `grid-flow-dense`
  // backfills any gap a tall cell leaves.
  const columns = images.length >= 4 ? "md:grid-cols-3" : "";
  return (
    <ul
      className={`grid grid-flow-dense auto-rows-[minmax(0,14rem)] grid-cols-2 gap-3 md:auto-rows-[minmax(0,18rem)] md:gap-5 ${columns}`}
    >
      {images.map((img) => (
        <li
          key={img.src}
          className={`relative overflow-hidden ${img.tall ? "row-span-2" : ""}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={images.length >= 4 ? "(min-width: 768px) 33vw, 50vw" : "50vw"}
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </li>
      ))}
    </ul>
  );
}
