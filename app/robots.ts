import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * robots.txt
 *
 * AI crawlers are named explicitly rather than left to the wildcard. They are
 * all currently ALLOWED, because being readable by ChatGPT, Claude and
 * Perplexity is how a growing share of people will find a local florist.
 *
 * To opt out of one later, move it to its own rule with `disallow: "/"`.
 * Note the distinction:
 *   GPTBot / ClaudeBot / CCBot   — collect data, may be used for training
 *   OAI-SearchBot / Claude-Web   — serve live answers with a citation link
 *   Google-Extended             — controls Gemini/AI Overviews use ONLY.
 *                                 It does not affect normal Google ranking.
 */
export default function robots(): MetadataRoute.Robots {
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
