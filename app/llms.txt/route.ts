import { cacheLife } from "next/cache";
import { routes, site } from "@/content/site";
import { seo } from "@/content/seo";
import { services } from "@/content/services";

/**
 * /llms.txt
 *
 * An emerging (not yet standardised) convention: a plain-Markdown summary of
 * a site for AI assistants, so they can get the facts without parsing HTML.
 *
 * Honest assessment: adoption is not universal and the payoff is unproven.
 * It costs one small file and cannot hurt, so it is worth having. It is
 * generated from the same content files as the site, so it stays accurate.
 */


/**
 * The document body is a plain string, so it can be cached. A Response is a
 * class instance and cannot cross the `use cache` boundary, which is why the
 * caching sits here rather than on the handler itself.
 */
async function buildBody() {
  "use cache";
  // Without a profile, "use cache" revalidates every 15 minutes, which kept
  // regenerating the sitemap lastmod. Nothing here changes between deploys.
  cacheLife("max");

  const body = `# ${site.name}

> ${site.tagline} based in ${site.location.city}, ${site.location.region}, ${site.location.country}.
> Serving ${site.location.serviceArea}.

## About

${site.name} is a wedding and event florist. Services are quoted individually
based on venue, season and scale.

- Location: ${site.location.city}, ${site.location.region}, ${site.location.country}
- Service area: ${site.location.serviceArea}
- Contact: ${site.contact.email}

## Services

${services.map((s) => `- **${s.name}** — ${s.summary}`).join("\n")}

## Pages

${routes.map((r) => `- [${r.label}](${new URL(r.href, site.url)})`).join("\n")}

## Page summaries

${Object.entries(seo)
  .filter(([, v]) => v.description)
  .map(([k, v]) => `- **${k}** — ${v.description}`)
  .join("\n")}
`;

  return body;
}

export async function GET() {
  return new Response(await buildBody(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
