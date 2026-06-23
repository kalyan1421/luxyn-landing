import { site, fullAddress } from "../../_lib/site";
import { seoPages, faqs, contentDates } from "../../_lib/content";

/**
 * /llms-full.txt — the expanded companion to /llms.txt. Inlines the full copy
 * of every page and FAQ so an AI engine can ingest the whole site in a single
 * plain-text fetch, without crawling each route. Generated from site content.
 */
export const dynamic = "force-static";

function build(): string {
  const u = site.url;

  const sections = seoPages
    .map(p => {
      const intro = p.intro.join("\n\n");
      const points = p.points.length
        ? "\n\n" + p.points.map(pt => `- ${pt.title}: ${pt.body}`).join("\n")
        : "";
      return `### ${p.h1}\nSection: ${u}/#${p.homeAnchor}\n\n${intro}${points}`;
    })
    .join("\n\n");

  const faqBlock = faqs
    .map(f => `**${f.q}**\n${f.a}`)
    .join("\n\n");

  return `# LUXYN — Full Site Content for LLMs

Site: ${site.name}
URL: ${u}
Tagline: ${site.tagline}
Location: ${fullAddress}, US
Area served: Leander, Cedar Park, and the greater Austin, TX area
Email: ${site.contact.email}
Phone: ${site.contact.phone}
Published: ${contentDates.published}
Last updated: ${contentDates.updated}

## About LUXYN
${site.description}

LUXYN was founded on the belief that environment dictates energy. It provides a
curated, design-led atmosphere that elevates the client experience and supports
each professional's growth. Professionals lease a private, lockable suite and
keep full ownership of their business, hours, pricing, brand, and clients, while
LUXYN handles the building, amenities, front desk, and upkeep.

## Sections (single-page site)

${sections}

## Frequently asked questions

${faqBlock}

## Legal
- Privacy Policy: ${u}/privacy
- Terms of Service: ${u}/terms
- Cookie Policy: ${u}/cookies
`;
}

export function GET() {
  return new Response(build(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
