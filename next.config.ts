import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Instant Navigations (Next.js 16.3).
   *
   * cacheComponents guarantees each route has an immediately renderable
   * prerendered shell. partialPrefetching brings that shell to the browser
   * for visible <Link>s before the click.
   *
   * Every page here is fully static, so the shell IS the whole page: a click
   * renders from memory with no server round trip. This is the one feature
   * from the 16.3 release that clearly fits a static brochure site.
   */
  cacheComponents: true,
  partialPrefetching: true,

  /**
   * NOTE: there is deliberately no `eslint` key here. Next 16 removed
   * `next lint`, so the option is unrecognised and warns. ESLint is simply not
   * installed; nothing runs it. Biome or oxlint is the intended replacement.
   *
   * TypeScript checking is left ON. With lint gone it is the only automated
   * safety net in the build.
   */
};

export default nextConfig;
