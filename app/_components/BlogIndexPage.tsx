import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import PageHero from "./PageHero";
import { site } from "../_lib/site";
import { blogIndex, blogPosts, formatPostDate, postUrl } from "../_lib/blog";

/**
 * The /blog index — a branded hero, a large featured lead article, a grid of the
 * remaining posts, and a closing conversion band. Emits CollectionPage + Blog +
 * breadcrumb JSON-LD listing every post so search engines understand the index.
 */
export default function BlogIndexPage() {
  const url = `${site.url}/blog`;
  // Posts are authored newest-first; sort defensively on the fixed dates.
  const posts = [...blogPosts].sort((a, b) => b.published.localeCompare(a.published));
  const [featured, ...rest] = posts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["CollectionPage", "Blog"],
        "@id": `${url}#blog`,
        url,
        name: blogIndex.title,
        description: blogIndex.description,
        isPartOf: { "@id": `${site.url}/#website` },
        inLanguage: "en-US",
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          "@id": `${postUrl(p.slug)}#article`,
          headline: p.title,
          description: p.description,
          url: postUrl(p.slug),
          datePublished: p.published,
          dateModified: p.updated,
          author: { "@type": "Organization", name: p.author, "@id": `${site.url}/#organization` },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: url },
        ],
      },
    ],
  };

  return (
    <>
      <SiteHeader />

      <main id="hero" className="relative w-full" style={{ background: "rgb(243,236,220)" }}>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: blogIndex.navLabel }]}
          kicker={blogIndex.kicker}
          h1={blogIndex.h1}
          image={{ src: blogIndex.image, alt: blogIndex.h1 }}
        >
          <p className="mt-7 max-w-[680px] font-ui font-normal" style={{ color: "rgba(255,255,255,.78)", fontSize: 17, lineHeight: 1.7 }}>
            {blogIndex.intro}
          </p>
        </PageHero>

        <section className="w-full max-w-[1060px] mx-auto px-6 lg:px-12 pt-14 pb-16 lg:pt-16 lg:pb-24">
          {/* ── Featured lead article ─────────────────────────────── */}
          <p className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 12, letterSpacing: 3 }}>
            FEATURED
          </p>
          <a
            href={`/blog/${featured.slug}`}
            className="group mt-4 grid grid-cols-1 overflow-hidden rounded-[20px] lg:grid-cols-2 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(20,35,59,.14)]"
            style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
          >
            <div className="relative overflow-hidden lg:order-2" style={{ minHeight: 260 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.image} alt={featured.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]" />
            </div>
            <div className="flex flex-col justify-center p-7 lg:order-1 lg:p-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-ui text-[13px] text-[rgb(120,124,131)]">
                <span className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ letterSpacing: 2 }}>{featured.kicker}</span>
                <span className="text-[rgb(196,198,207)]">·</span>
                <time dateTime={featured.published}>{formatPostDate(featured.published)}</time>
                <span className="text-[rgb(196,198,207)]">·</span>
                <span>{featured.readMins} min read</span>
              </div>
              <h2 className="mt-3 font-display font-bold text-[rgb(2,36,72)] text-[28px] lg:text-[34px] transition-colors duration-200 group-hover:text-[rgb(160,128,72)]" style={{ lineHeight: 1.18, letterSpacing: "-0.01em" }}>
                {featured.title}
              </h2>
              <p className="mt-3 font-ui font-normal text-[rgb(22,38,60)] opacity-80 text-[15.5px]" style={{ lineHeight: 1.65 }}>
                {featured.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-ui font-semibold text-[14.5px] text-[rgb(2,36,72)]">
                Read article <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </a>

          {/* ── Remaining articles ────────────────────────────────── */}
          {rest.length > 0 && (
            <>
              <h2 className="mt-16 font-display font-bold text-[rgb(2,36,72)] text-[24px]">More articles</h2>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                {rest.map((p) => (
                  <a
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[18px] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(20,35,59,.12)]"
                    style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]" />
                    </div>
                    <div className="flex flex-1 flex-col p-6 lg:p-7">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-ui text-[13px] text-[rgb(120,124,131)]">
                        <span className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ letterSpacing: 2 }}>{p.kicker}</span>
                        <span className="text-[rgb(196,198,207)]">·</span>
                        <span>{p.readMins} min read</span>
                      </div>
                      <h3 className="mt-3 font-display font-bold text-[rgb(33,58,92)] text-[21px] lg:text-[23px] transition-colors duration-200 group-hover:text-[rgb(160,128,72)]" style={{ lineHeight: 1.25 }}>
                        {p.title}
                      </h3>
                      <p className="mt-2 font-ui font-normal text-[rgb(22,38,60)] opacity-80 text-[14.5px]" style={{ lineHeight: 1.6 }}>
                        {p.description}
                      </p>
                      <span className="mt-auto pt-4 font-ui font-semibold text-[14px] text-[rgb(2,36,72)]">
                        Read article <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* ── Closing conversion band ───────────────────────────── */}
          <div
            className="relative mt-16 flex flex-col items-start gap-5 overflow-hidden rounded-[22px] p-8 sm:flex-row sm:items-center sm:justify-between lg:p-12"
            style={{ background: "rgb(20,35,59)" }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {[
                { w: 360, stroke: 4, opacity: 0.12 },
                { w: 540, stroke: 3, opacity: 0.08 },
              ].map(({ w, stroke, opacity }, i) => (
                <div key={i} className="absolute rounded-full" style={{ width: w, height: w, left: "82%", top: "-40%", border: `${stroke}px solid rgba(225,216,194,${opacity})` }} />
              ))}
            </div>
            <div className="relative max-w-[560px]">
              <p className="font-accent font-semibold text-[rgb(194,160,107)]" style={{ fontSize: 12, letterSpacing: 3 }}>
                READY WHEN YOU ARE
              </p>
              <h2 className="mt-2 font-display font-semibold text-white text-[26px] lg:text-[32px]" style={{ lineHeight: 1.2 }}>
                Thinking about your own suite?
              </h2>
              <p className="mt-2 font-ui font-normal text-[15px]" style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.6 }}>
                Book a private tour of LUXYN in Leander, TX and we'll walk you through the available suites and current pricing in person.
              </p>
            </div>
            <a
              href="/contact"
              className="relative inline-flex h-[52px] shrink-0 items-center justify-center rounded-full px-9 font-ui font-bold transition-transform duration-300 hover:-translate-y-0.5"
              style={{ fontSize: 15, letterSpacing: 0.4, background: "rgb(194,160,107)", color: "rgb(20,35,59)" }}
            >
              Book a tour
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
