import { site, fullAddress } from "../../_lib/site";
import { seoPages, faqs, contentDates } from "../../_lib/content";
import { blogPosts, formatPostDate } from "../../_lib/blog";

/**
 * /llms-full.txt — the expanded companion to /llms.txt. Inlines the full copy
 * of every page and FAQ so an AI engine can ingest the whole site in a single
 * plain-text fetch, without crawling each route. Generated from site content.
 */
export const dynamic = "force-static";

function build(): string {
  const u = site.url;

  // Concrete facts — only rendered once real values are set in site.ts.
  const f = site.business.facts;
  const concreteFactLines = [
    f.suiteCount && `Suites: ${f.suiteCount} private salon & wellness suites`,
    f.suiteSizeRange && `Suite size: ${f.suiteSizeRange}`,
    f.leaseTerms && `Lease terms: ${f.leaseTerms}`,
    f.yearEstablished && `Established: ${f.yearEstablished}`,
  ].filter(Boolean).join("\n");

  const sections = seoPages
    .map(p => {
      const intro = p.intro.join("\n\n");
      const points = p.points.length
        ? "\n\n" + p.points.map(pt => `- ${pt.title}: ${pt.body}`).join("\n")
        : "";
      return `### ${p.h1}\nSection: ${u}/${p.slug}\n\n${intro}${points}`;
    })
    .join("\n\n");

  const faqBlock = faqs
    .map(f => `**${f.q}**\n${f.a}`)
    .join("\n\n");

  // Inline each article in full so an AI engine ingests the whole blog in one
  // fetch. Body blocks are flattened to plain prose (headings, paragraphs, lists).
  const blogBlock = blogPosts
    .map(p => {
      const body = p.body
        .map(b => {
          if (b.type === "h2") return `#### ${b.text}`;
          if (b.type === "h3") return `##### ${b.text}`;
          if (b.type === "ul") return b.items.map(i => `- ${i}`).join("\n");
          if (b.type === "ol") return b.items.map((i, n) => `${n + 1}. ${i}`).join("\n");
          if (b.type === "quote") return `> ${b.text}`;
          if (b.type === "image") return `[Image: ${b.alt}${b.caption ? ` — ${b.caption}` : ""}]`;
          if (b.type === "cta") return `${b.text ? b.text + " " : ""}[${b.label}: ${u}${b.href}]`;
          if (b.type === "stat") return `${b.value} — ${b.label}${b.source ? ` (Source: ${b.source})` : ""}`;
          if (b.type === "table")
            return [b.columns.join(" | "), ...b.rows.map(r => r.join(" | "))].join("\n") + (b.caption ? `\n${b.caption}` : "");
          return b.text;
        })
        .join("\n\n");
      const faqBody = p.faqs?.length
        ? `\n\n##### FAQ\n\n${p.faqs.map(f => `**${f.q}**\n${f.a}`).join("\n\n")}`
        : "";
      return `### ${p.title}\nArticle: ${u}/blog/${p.slug}\nPublished: ${formatPostDate(p.published)} · Updated: ${p.updated} · ${p.readMins} min read\n\n${body}${faqBody}`;
    })
    .join("\n\n");

  return `# LUXYN — Full Site Content for LLMs

Site: ${site.name}
URL: ${u}
Tagline: ${site.tagline}
Location: ${fullAddress}, US
Area served: Leander, Cedar Park, and the greater Austin, TX area
Email: ${site.contact.email}
Phone: ${site.contact.phone}
${concreteFactLines ? concreteFactLines + "\n" : ""}Published: ${contentDates.published}
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

## Blog — guides for independent beauty & wellness pros

${blogBlock}

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
