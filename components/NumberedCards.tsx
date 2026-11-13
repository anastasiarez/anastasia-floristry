/**
 * Card row. Numbered for real sequences (the booking process on /services);
 * pass `numbered={false}` for sets that have no order (services, values).
 */
import { Reveal } from "./Reveal";

export function NumberedCards({
  items,
  numbered = true,
}: {
  items: readonly { step?: string; title: string; body: string }[];
  numbered?: boolean;
}) {
  // Column count follows the item count, so two services do not leave an empty
  // third column. Classes are mapped explicitly because Tailwind cannot see
  // interpolated class names at build time.
  const columns =
    items.length === 1
      ? "md:grid-cols-1 md:max-w-lg"
      : items.length === 2
        ? "md:grid-cols-2"
        : items.length === 4
          ? "md:grid-cols-2 lg:grid-cols-4"
          : "md:grid-cols-3";

  return (
    <ol className={`grid gap-14 md:gap-12 ${columns}`}>
      {items.map((item, i) => (
        <li key={item.title}>
          <Reveal>
          {numbered && (
            <p className="script mb-4 text-script-xs text-evergreen">
              {item.step ?? String(i + 1).padStart(2, "0")}
            </p>
          )}
          <h3 className="text-display-2xs tracking-heading md:min-h-[2lh]">{item.title}</h3>
          <p className="mt-5 text-body-sm">{item.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
