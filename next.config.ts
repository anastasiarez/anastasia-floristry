import type { NextConfig } from "next";
import { previewCookie, routes, site } from "./content/site";

const nextConfig: NextConfig = {
  /**
   * Instant Navigations (Next.js 16.3).
   *
   * cacheComponents guarantees each route has an immediately renderable
   * prerendered shell. partialPrefetching brings that shell to the browser
   * for visible <Link>s before the click.
   *
   * Every page here is fully static, so the shell IS the whole page: a click
   * renders from memory with no server round trip.
   */
  /**
   * Images are still placeholders that get overwritten in place, at the same
   * path, when real photos arrive. next/image keys its cache on the URL, so a
   * long TTL would leave returning visitors looking at a stand-in after the
   * real photo shipped. A short TTL costs a little re-optimisation and removes
   * that failure mode.
   *
   * RAISE THIS AT LAUNCH, once the photos are final. Tracked in TODO.md.
   */
  images: {
    minimumCacheTTL: 300,
  },

  cacheComponents: true,
  partialPrefetching: true,

  /**
   * Pre-launch: keep non-HTML routes out of search results too.
   *
   * The `noindex` in app/layout.tsx only covers HTML pages. llms.txt,
   * sitemap.xml, robots.txt and the generated OG image cannot carry a meta
   * tag, so they need the header equivalent. llms.txt matters most here: it
   * exists specifically to feed AI assistants, and it currently describes
   * placeholder content.
   *
   * Driven by `site.indexable` in content/site.ts — flip that one flag at
   * launch and this disappears with it.
   */
  /**
   * Pre-launch: the public sees only the holding page. Every other page
   * redirects to it unless the preview cookie is set (see content/site.ts).
   * In preview mode "/" shows the full homepage instead of the holding page.
   */
  async redirects() {
    const notPreviewing = [{ type: "cookie" as const, key: previewCookie }];
    return [
      ...routes.filter(({ href }) => href !== "/").map(({ href }) => href),
      "/home-preview",
    ].map((source) => ({
      source,
      missing: notPreviewing,
      destination: "/",
      permanent: false,
    }));
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "cookie", key: previewCookie }],
          destination: "/home-preview",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  async headers() {
    if (site.indexable) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  /**
   * NOTE: there is deliberately no `eslint` key here. Next 16 removed
   * `next lint`, so the option is unrecognised and warns. ESLint is simply
   * not installed. Biome or oxlint is the intended replacement.
   *
   * TypeScript checking is left ON. With lint gone it is the only automated
   * safety net in the build.
   */
};

export default nextConfig;
