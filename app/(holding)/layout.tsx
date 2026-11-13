import { PageFade } from "@/components/PageFade";

/** The public holding page: no nav or footer while the site is rebuilt. */
export default function HoldingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main">
      <PageFade>{children}</PageFade>
    </main>
  );
}
