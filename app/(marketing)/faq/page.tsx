import SeoSectionPage from "../../_components/SeoSectionPage";
import { seoPages, sectionMetadata, faqs } from "../../_lib/content";
import { site } from "../../_lib/site";

// Dedicated, indexable FAQ page — own metadata + H1, self-canonical, with the
// full Q&A visible and matching FAQPage JSON-LD for rich results.
export const metadata = sectionMetadata("faq");

const page = seoPages.find((p) => p.slug === "faq")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${site.url}/faq#faq`,
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function Page() {
  return (
    <SeoSectionPage page={page}>
      <div className="mt-10 flex flex-col gap-3 max-w-[760px]">
        {faqs.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-[14px] bg-white px-5 py-1 sm:px-7"
            style={{ boxShadow: "inset 0 0 0 1px rgb(232,224,205)" }}
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 list-none py-5 font-display font-semibold text-[rgb(2,36,72)] text-[18px] sm:text-[21px]" style={{ lineHeight: 1.3 }}>
              {q}
              <svg className="shrink-0 transition-transform duration-300 group-open:rotate-45" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgb(194,160,107)" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <p className="font-ui font-normal text-[rgb(67,71,78)] pb-5 pr-6" style={{ fontSize: 15.5, lineHeight: 1.65 }}>
              {a}
            </p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </SeoSectionPage>
  );
}
