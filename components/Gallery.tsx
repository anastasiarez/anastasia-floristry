import Image from "next/image";

type GalleryImage = { src: string; alt: string; portrait?: boolean };

/**
 * Portfolio grid.
 *
 * Portrait images span two rows so the grid keeps the uneven, editorial
 * rhythm of the reference design without needing a JS masonry library.
 */
export function Gallery({ images }: { images: readonly GalleryImage[] }) {
  return (
    <ul className="grid auto-rows-[minmax(0,14rem)] grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
      {images.map((img) => (
        <li
          key={img.src}
          className={`relative overflow-hidden ${img.portrait ? "row-span-2" : ""}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </li>
      ))}
    </ul>
  );
}
