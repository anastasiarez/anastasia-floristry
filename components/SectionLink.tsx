import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The centred text link that closes a section ("See the portfolio",
 * "Enquire about your date"). One place for its spacing and style.
 */
export function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="mt-10 text-center">
      <Link href={href} className="eyebrow link-underline text-evergreen">
        {children}
      </Link>
    </div>
  );
}
