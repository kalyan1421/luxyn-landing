import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import PageHero from "./PageHero";
import ArticleProgress from "./ArticleProgress";
import ArticleToc from "./ArticleToc";
import ArticleShare from "./ArticleShare";
import { site } from "../_lib/site";
import { type BlogPost, formatPostDate, postUrl, headings, otherPosts, adjacentPosts, authorBio, slugify, howToSteps } from "../_lib/blog";

/**
 * Renders a single blog article — an editorial layout with a sticky table of
 * contents, reading-progress bar, drop-cap intro, pull-quotes, a share row, an
 * author note and related reading. Emits BlogPosting + BreadcrumbList JSON-LD
 * scoped to the article URL so it can earn an article result and breadcrumb.
 */
export default function BlogPostPage({ post }: { post: BlogPost }) {
  const url = postUrl(post.slug);
  const toc = headings(post);
  const related = otherPosts(post.slug);
  const { prev, next } = adjacentPosts(post.slug);
  const firstParaIdx = post.body.findIndex((b) => b.type === "p");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        url,
        image: `${site.url}${post.image}`,
        datePublished: post.published,
        dateModified: post.updated,
        inLanguage: "en-US",
        wordCount: post.body.reduce((n, b) => n + ("text" in b && b.text ? b.text.split(/\s+/).length : 0), 0),
        author: { "@type": "Organization", name: post.author, "@id": `${site.url}/#organization` },
        publisher: { "@id": `${site.url}/#organization` },
        isPartOf: { "@id": `${site.url}/#website` },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
      // Step-by-step guides also emit HowTo, with each step deep-linking to its
      // on-page heading anchor. Steps are derived from the numbered H2s.
      ...(post.howTo
        ? [
            {
              "@type": "HowTo",
              "@id": `${url}#howto`,
              name: post.title,
              description: post.description,
              image: `${site.url}${post.image}`,
              step: howToSteps(post).map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.name,
                text: s.text,
                url: `${url}#${s.id}`,
              })),
            },
          ]
        : []),
      // Articles with an FAQ section emit FAQPage so the Q&A is eligible for an
      // FAQ rich result and gives answer engines clean question/answer pairs.
      ...(post.faqs && post.faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: post.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <ArticleProgress />
      <SiteHeader />

      <main id="hero" className="relative w-full" style={{ background: "rgb(243,236,220)" }}>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.kicker }]}
          kicker={post.kicker}
          h1={post.h1}
          narrow
          image={{ src: post.image, alt: post.title }}
        >
          {/* byline */}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-ui text-[14px]" style={{ color: "rgba(225,216,194,.7)" }}>
            <span className="font-semibold" style={{ color: "rgb(255,255,255)" }}>{post.author}</span>
            <span style={{ color: "rgba(225,216,194,.4)" }}>·</span>
            <time dateTime={post.published}>{formatPostDate(post.published)}</time>
            <span style={{ color: "rgba(225,216,194,.4)" }}>·</span>
            <span>{post.readMins} min read</span>
          </div>
        </PageHero>

        <div className="mx-auto w-full max-w-[1120px] px-6 lg:px-12 pt-14 pb-16 lg:pt-16 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
            {/* table of contents */}
            <ArticleToc items={toc} />

            {/* article body */}
            <article className="min-w-0 max-w-[720px]">
              <div className="flex flex-col gap-5">
                {post.body.map((block, i) => {
                  if (block.type === "h2") {
                    const id = slugify(block.text);
                    return (
                      <h2
                        key={i}
                        id={id}
                        className="mt-6 scroll-mt-24 font-display font-bold text-[rgb(33,58,92)] text-[24px] lg:text-[28px]"
                        style={{ lineHeight: 1.25 }}
                      >
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === "h3") {
                    return (
                      <h3
                        key={i}
                        id={slugify(block.text)}
                        className="mt-4 scroll-mt-24 font-display font-semibold text-[rgb(33,58,92)] text-[19px] lg:text-[21px]"
                        style={{ lineHeight: 1.3 }}
                      >
                        {block.text}
                      </h3>
                    );
                  }
                  if (block.type === "quote") {
                    return (
                      <blockquote
                        key={i}
                        className="my-4 rounded-r-[14px] py-2 pl-6 pr-4"
                        style={{ borderLeft: "3px solid rgb(194,160,107)", background: "rgba(194,160,107,.07)" }}
                      >
                        <p className="font-display font-medium text-[rgb(33,58,92)] text-[21px] lg:text-[24px]" style={{ lineHeight: 1.4 }}>
                          “{block.text}”
                        </p>
                      </blockquote>
                    );
                  }
                  if (block.type === "ul") {
                    return (
                      <ul key={i} className="flex flex-col gap-2.5 pl-1">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex gap-3 font-ui font-normal text-[rgb(67,71,78)]" style={{ fontSize: 17, lineHeight: 1.7 }}>
                            <span aria-hidden="true" className="mt-[10px] h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: "rgb(194,160,107)" }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === "ol") {
                    return (
                      <ol key={i} className="flex flex-col gap-2.5 pl-1">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex gap-3 font-ui font-normal text-[rgb(67,71,78)]" style={{ fontSize: 17, lineHeight: 1.7 }}>
                            <span aria-hidden="true" className="mt-[1px] flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full font-ui font-bold text-[12px] text-white" style={{ background: "rgb(194,160,107)" }}>
                              {j + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  if (block.type === "image") {
                    return (
                      <figure key={i} className="my-4">
                        <div className="overflow-hidden rounded-[16px]" style={{ boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={block.src} alt={block.alt} loading="lazy" decoding="async" className="block h-auto w-full object-cover" />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2.5 font-ui text-[13.5px] italic text-[rgb(120,124,131)]" style={{ lineHeight: 1.5 }}>
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                  if (block.type === "stat") {
                    return (
                      <div
                        key={i}
                        className="my-4 flex flex-col gap-2 rounded-[16px] p-6 sm:flex-row sm:items-center sm:gap-6"
                        style={{ background: "rgba(194,160,107,.09)", boxShadow: "inset 0 0 0 1px rgba(194,160,107,.35)" }}
                      >
                        <span className="font-display font-bold text-[rgb(160,128,72)] text-[40px] leading-none sm:shrink-0">
                          {block.value}
                        </span>
                        <span className="font-ui font-normal text-[rgb(67,71,78)]" style={{ fontSize: 16, lineHeight: 1.6 }}>
                          {block.label}
                          {block.source && (
                            <span className="mt-1 block font-ui text-[12.5px] text-[rgb(120,124,131)]">Source: {block.source}</span>
                          )}
                        </span>
                      </div>
                    );
                  }
                  if (block.type === "cta") {
                    return (
                      <div
                        key={i}
                        className="my-4 flex flex-col gap-4 rounded-[16px] p-6 sm:flex-row sm:items-center sm:justify-between"
                        style={{ background: "rgb(20,35,59)" }}
                      >
                        {block.text && (
                          <p className="font-display font-semibold text-white text-[18px]" style={{ lineHeight: 1.3 }}>
                            {block.text}
                          </p>
                        )}
                        <a
                          href={block.href}
                          className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-full px-7 font-ui font-bold transition-transform duration-300 hover:-translate-y-0.5"
                          style={{ fontSize: 14, letterSpacing: 0.4, background: "rgb(194,160,107)", color: "rgb(20,35,59)" }}
                        >
                          {block.label}
                        </a>
                      </div>
                    );
                  }
                  if (block.type === "table") {
                    return (
                      <figure key={i} className="my-4">
                        <div className="overflow-x-auto rounded-[14px]" style={{ boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}>
                          <table className="w-full border-collapse font-ui text-[15px]" style={{ color: "rgb(67,71,78)" }}>
                            <thead>
                              <tr style={{ background: "rgb(20,35,59)" }}>
                                {block.columns.map((c, k) => (
                                  <th key={k} className="px-4 py-3 text-left font-semibold text-white" style={{ fontSize: 13.5 }}>
                                    {c}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {block.rows.map((row, r) => (
                                <tr key={r} style={{ background: r % 2 ? "rgb(252,250,244)" : "rgb(255,255,255)" }}>
                                  {row.map((cell, c) => (
                                    <td
                                      key={c}
                                      className={c === 0 ? "px-4 py-3 font-semibold text-[rgb(33,58,92)]" : "px-4 py-3"}
                                      style={{ borderTop: "1px solid rgb(225,216,194)", lineHeight: 1.5 }}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2.5 font-ui text-[13.5px] italic text-[rgb(120,124,131)]" style={{ lineHeight: 1.5 }}>
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                  const dropCap =
                    i === firstParaIdx
                      ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:font-semibold first-letter:text-[58px] first-letter:leading-[0.8] first-letter:text-[rgb(160,128,72)]"
                      : "";
                  return (
                    <p key={i} className={`font-ui font-normal text-[rgb(67,71,78)] ${dropCap}`} style={{ fontSize: 17, lineHeight: 1.7 }}>
                      {block.text}
                    </p>
                  );
                })}
              </div>

              {/* FAQ */}
              {post.faqs && post.faqs.length > 0 && (
                <section id="faq" className="mt-12 scroll-mt-24" aria-label="Frequently asked questions">
                  <h2 className="font-display font-bold text-[rgb(33,58,92)] text-[24px] lg:text-[28px]" style={{ lineHeight: 1.25 }}>
                    Frequently asked questions
                  </h2>
                  <div className="mt-5 flex flex-col gap-3">
                    {post.faqs.map((f, j) => (
                      <details
                        key={j}
                        className="group rounded-[14px] p-5"
                        style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-[rgb(33,58,92)] text-[17px]" style={{ lineHeight: 1.4 }}>
                          {f.q}
                          <span aria-hidden="true" className="shrink-0 font-ui text-[22px] leading-none text-[rgb(194,160,107)] transition-transform duration-200 group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="mt-3 font-ui font-normal text-[rgb(67,71,78)]" style={{ fontSize: 16, lineHeight: 1.7 }}>
                          {f.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* CTA card */}
              <div
                className="mt-12 flex flex-col gap-4 rounded-[18px] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8"
                style={{ background: "rgb(20,35,59)" }}
              >
                <div>
                  <p className="font-accent font-semibold text-[rgb(194,160,107)]" style={{ fontSize: 12, letterSpacing: 3 }}>
                    LUXYN · LEANDER, TX
                  </p>
                  <p className="mt-1.5 font-display font-semibold text-white text-[21px]" style={{ lineHeight: 1.25 }}>
                    Ready to picture your own suite?
                  </p>
                </div>
                <a
                  href={post.cta.href}
                  className="inline-flex h-[50px] shrink-0 items-center justify-center rounded-full px-8 font-ui font-bold transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ fontSize: 14.5, letterSpacing: 0.4, background: "rgb(194,160,107)", color: "rgb(20,35,59)" }}
                >
                  {post.cta.label}
                </a>
              </div>

              {/* tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-ui font-medium text-[13px] text-[rgb(67,71,78)]"
                      style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)", borderRadius: 999, padding: "5px 13px" }}
                    >
                      #{tag.replace(/\s+/g, "")}
                    </span>
                  ))}
                </div>
              )}

              {/* share + author */}
              <div className="mt-8 flex flex-col gap-6 border-t pt-8" style={{ borderColor: "rgb(225,216,194)" }}>
                <ArticleShare url={url} title={post.title} />
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display font-bold text-white"
                    style={{ background: "rgb(20,35,59)", fontSize: 18 }}
                    aria-hidden="true"
                  >
                    L
                  </div>
                  <div>
                    <p className="font-ui font-semibold text-[15px] text-[rgb(2,36,72)]">{post.author}</p>
                    <p className="mt-1 font-ui font-normal text-[rgb(67,71,78)] text-[14px]" style={{ lineHeight: 1.6 }}>
                      {authorBio}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* prev / next pager */}
          {(prev || next) && (
            <nav className="mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2" style={{ borderColor: "rgb(225,216,194)" }} aria-label="More articles">
              {prev ? (
                <a
                  href={`/blog/${prev.slug}`}
                  className="group flex flex-col rounded-[14px] p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(20,35,59,.1)]"
                  style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
                >
                  <span className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 11, letterSpacing: 2 }}>
                    ← PREVIOUS
                  </span>
                  <span className="mt-1.5 font-display font-bold text-[rgb(33,58,92)] text-[16px] transition-colors duration-200 group-hover:text-[rgb(160,128,72)]" style={{ lineHeight: 1.35 }}>
                    {prev.title}
                  </span>
                </a>
              ) : (
                <span aria-hidden="true" className="hidden sm:block" />
              )}
              {next && (
                <a
                  href={`/blog/${next.slug}`}
                  className="group flex flex-col rounded-[14px] p-5 text-right transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(20,35,59,.1)]"
                  style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
                >
                  <span className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 11, letterSpacing: 2 }}>
                    NEXT →
                  </span>
                  <span className="mt-1.5 font-display font-bold text-[rgb(33,58,92)] text-[16px] transition-colors duration-200 group-hover:text-[rgb(160,128,72)]" style={{ lineHeight: 1.35 }}>
                    {next.title}
                  </span>
                </a>
              )}
            </nav>
          )}

          {/* related reading */}
          {related.length > 0 && (
            <section className="mt-16 border-t pt-12" style={{ borderColor: "rgb(225,216,194)" }} aria-label="Continue reading">
              <h2 className="font-display font-bold text-[rgb(2,36,72)] text-[26px]">Continue reading</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {related.map((p) => (
                  <a
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[16px] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(20,35,59,.12)]"
                    style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]" />
                    </div>
                    <div className="flex flex-col p-5 lg:p-6">
                      <span className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 12, letterSpacing: 2 }}>{p.kicker}</span>
                      <h3 className="mt-2 font-display font-bold text-[rgb(33,58,92)] text-[19px] transition-colors duration-200 group-hover:text-[rgb(160,128,72)]" style={{ lineHeight: 1.3 }}>
                        {p.title}
                      </h3>
                      <span className="mt-3 font-ui font-semibold text-[13.5px] text-[rgb(2,36,72)]">
                        Read article <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <a href="/blog" className="mt-10 inline-block font-ui font-semibold text-[15px] text-[rgb(2,36,72)] transition-colors duration-200 hover:text-[rgb(160,128,72)]">
                ← All articles
              </a>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
