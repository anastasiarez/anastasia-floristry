import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageFade } from "@/components/PageFade";

/**
 * The full site. Until launch it is only reachable in preview mode
 * (see app/preview/route.ts); everyone else is redirected to the holding page.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main">
        <PageFade>{children}</PageFade>
      </main>
      <Footer />
    </>
  );
}
