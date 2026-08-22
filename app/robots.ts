import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * robots.txt
 *
 * While `site.indexable` is false we still ALLOW crawling. That is
 * deliberate: a `Disallow` would prevent crawlers from ever reading the
 * `noindex` served on each page, which is the usual reason pages get stuck in
 * the index. Allow the crawl, refuse the indexing. We simply stop advertising
 * the sitemap so nothing actively invites a crawl of placeholder content.
 *
 * Once indexable, AI crawlers are named explicitly and allowed, because being
 * readable by ChatGPT, Claude and Perplexity is how a growing share of people
 * will find a local florist. To opt one out later, give it its own rule with
 * `disallow: "/"`. Note `Google-Extended` governs Gemini and AI Overviews
 * only; it does not affect normal Google ranking.
 */
export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) {
    return {
      rules: [{ userAgent: "*", allow: "/" }],
      host: site.url,
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
