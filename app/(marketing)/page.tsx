import Landing from "../_components/Landing";
import { site } from "../_lib/site";
import { faqs, contentDates } from "../_lib/content";

/* Page-level JSON-LD for the home page only. The WebPage, BreadcrumbList,
 * FAQPage and Review all describe content that is actually rendered here (the
 * single-scroll home page shows the FAQ and the Sarah J. testimonial), so the
 * markup matches the visible page — a Google structured-data requirement. The
 * site-wide Organization / WebSite / LocalBusiness nodes live in the root
 * layout and are referenced here by @id. */
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${site.url}/#webpage`,
      url: `${site.url}/`,
      name: site.title,
      description: site.description,
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#localbusiness` },
      primaryImageOfPage: `${site.url}${site.ogImage}`,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${site.url}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      ],
    },
    {
      // FAQ rich results + a clean source for AI answer engines. Mirrors the
      // FAQ shown on this page exactly (Google requires the markup match the
      // visible content). The same Q&A also renders on /faq with its own node.
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      isPartOf: { "@id": `${site.url}/#website` },
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        datePublished: contentDates.published,
        dateModified: contentDates.updated,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      // The customer testimonial shown in the Philosophy section, marked up as a
      // Review of the business. No numeric rating is asserted (the testimonial
      // carries none); star snippets come from the AggregateRating in the root
      // layout once real, sourced ratings are set in site.ts.
      "@type": "Review",
      "@id": `${site.url}/#review-sarah-j`,
      itemReviewed: { "@id": `${site.url}/#localbusiness` },
      author: { "@type": "Person", name: "Sarah J." },
      reviewBody:
        "Luxyn has completely transformed how my clients perceive my brand.",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <Landing />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
    </>
  );
}
