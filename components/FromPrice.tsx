import { pricing } from "@/content/services";
import { SectionLink } from "./SectionLink";

/** "Full-service weddings from $5,000", with a link to the price guide. */
export function FromPrice({ href, linkLabel }: { href: string; linkLabel: string }) {
  return (
    <div className="mt-16">
      <p className="text-center text-display-2xs">
        {pricing.fromLabel} {pricing.minimum}
      </p>
      <SectionLink href={href}>{linkLabel}</SectionLink>
    </div>
  );
}
