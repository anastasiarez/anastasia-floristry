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
  const threeColumns = images.length >= 4;
  return (
    <ul className={`grid grid-flow-dense grid-cols-2 gap-3 md:gap-5 ${threeColumns ? "md:grid-cols-3" : ""}`}>
      {images.map((img) => (
        <li
          key={img.src}
          // Wide cells keep the 4:3 they were cropped to; the tall cell spans
          // two of them, which lands close to its 5:7 crop at every width.
          className={`relative overflow-hidden ${img.tall ? "row-span-2" : "aspect-4/3"}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={
              threeColumns
                ? "(min-width: 82.5rem) 27rem, (min-width: 768px) 33vw, 50vw"
                : "(min-width: 82.5rem) 41rem, 50vw"
            }
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </li>
      ))}
    </ul>
  );
}
