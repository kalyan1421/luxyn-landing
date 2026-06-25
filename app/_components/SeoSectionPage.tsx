import type { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import PageHero from "./PageHero";
import { site } from "../_lib/site";
import type { SeoPage } from "../_lib/content";

/**
 * Dedicated, indexable SEO page for a single section (e.g. /amenities). Renders a
 * focused hero — kicker, H1, intro copy, feature points and a CTA — from the
 * SeoPage content, plus WebPage + BreadcrumbList JSON-LD scoped to this URL.
 * Optional `children` add page-specific blocks (the FAQ list, the contact form).
 */
export default function SeoSectionPage({ page, children }: { page: SeoPage; children?: ReactNode }) {
  const url = `${site.url}/${page.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#localbusiness` },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: page.navLabel, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <SiteHeader />

      <main id="hero" className="relative w-full" style={{ background: "rgb(243,236,220)" }}>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: page.navLabel }]}
          kicker={page.kicker}
          h1={page.h1}
          image={{ src: page.image, alt: page.h1 }}
        >
          <div className="mt-7 max-w-[680px] flex flex-col gap-4">
            {page.intro.map((p, i) => (
              <p key={i} className="font-ui font-normal" style={{ color: "rgba(255,255,255,.78)", fontSize: 17, lineHeight: 1.7 }}>
                {p}
              </p>
            ))}
          </div>
        </PageHero>

        <section className="w-full max-w-[1000px] mx-auto px-6 lg:px-12 pt-14 pb-16 lg:pt-16 lg:pb-24">
          {page.points.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {page.points.map(({ title, body }) => (
                <div
                  key={title}
                  className="flex flex-col rounded-[14px] p-6 lg:p-7"
                  style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
                >
                  <h2 className="font-display font-bold text-[rgb(33,58,92)] text-[20px] lg:text-[22px]" style={{ lineHeight: 1.25 }}>
                    {title}
                  </h2>
                  <p className="mt-2 font-ui font-normal text-[rgb(22,38,60)] opacity-80 text-[14.5px]" style={{ lineHeight: 1.6 }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* page-specific content (FAQ list, contact form, …) */}
          {children}

          {/* CTA — hidden when it would just link to this same page. */}
          {page.cta.href !== `/${page.slug}` && (
            <a
              href={page.cta.href}
              className="inline-flex items-center justify-center h-[52px] px-10 mt-12 rounded-full font-ui font-bold text-white cursor-pointer transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(20,35,59,.32)]"
              style={{ fontSize: 15, letterSpacing: 0.5, background: "rgb(20,35,59)" }}
            >
              {page.cta.label}
            </a>
          )}
        </section>
      </main>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
