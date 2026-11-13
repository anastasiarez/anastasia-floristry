import { cacheLife } from "next/cache";
import type { MetadataRoute } from "next";
import { routes, site } from "@/content/site";

/**
 * Generated from `routes` in content/site.ts, so adding a page there adds it
 * to the sitemap. Uses `routes` rather than `nav` because some indexable
 * pages (the FAQ) deliberately have no header link.
 *
 * `use cache` keeps this prerendered. Without it, the `new Date()` below makes
 * the route non-deterministic and cacheComponents downgrades the whole sitemap
 * to a per-request serverless function, which is wrong for a static file.
 *
 * Resolving lastModified at build time is also the honest value: on a static
 * site the content genuinely last changed when it was last deployed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  // Without a profile, "use cache" revalidates every 15 minutes, which kept
  // regenerating the sitemap lastmod. Nothing here changes between deploys.
  cacheLife("max");

  const lastModified = new Date();

  return routes.map((r) => ({
    url: new URL(r.href, site.url).toString(),
    lastModified,
    changeFrequency: r.href === "/" ? "monthly" : "yearly",
    priority: r.priority,
  }));
}
