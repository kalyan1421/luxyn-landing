import type { ReactNode } from "react";

/** A crumb in the hero breadcrumb. Omit `href` for the current (non-link) page. */
export type Crumb = { label: string; href?: string };

/**
 * Shared dark-navy hero band for the marketing SEO pages and the blog. Mirrors
 * the brand motif used on the legal pages (concentric champagne arcs over deep
 * navy) so every page opens with the same premium, branded header instead of a
 * flat top. Renders an accessible breadcrumb, the kicker eyebrow and the H1;
 * `children` carries whatever sits under the headline (intro copy, a byline).
 *
 * Server component — purely presentational, no client JS.
 */
export default function PageHero({
  crumbs,
  kicker,
  h1,
  /** Narrow the hero content column to align with a narrow article body. */
  narrow = false,
  /** Optional hero image — rendered as an arched frame beside the text on
   *  desktop (the brand's "arch" motif), stacked below it on mobile. */
  image,
  children,
}: {
  crumbs: Crumb[];
  kicker: string;
  h1: string;
  narrow?: boolean;
  image?: { src: string; alt: string };
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden" style={{ background: "rgb(20,35,59)" }}>
      {/* decorative concentric arcs — brand motif */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[
          { w: "w-[150vw] sm:w-[520px]", stroke: 5, opacity: 0.14 },
          { w: "w-[220vw] sm:w-[760px]", stroke: 4, opacity: 0.1 },
          { w: "w-[300vw] sm:w-[1040px]", stroke: 2, opacity: 0.06 },
        ].map(({ w, stroke, opacity }, i) => (
          <div
            key={i}
            className={`absolute rounded-full aspect-square ${w}`}
            style={{ left: "85%", top: "0%", transform: "translate(-50%, -55%)", border: `${stroke}px solid rgba(225,216,194,${opacity})` }}
          />
        ))}
      </div>

      <div className={`relative mx-auto w-full ${narrow ? "max-w-[760px]" : "max-w-[1100px]"} px-6 lg:px-12 pt-28 pb-14 sm:pt-32 sm:pb-20`}>
        <div className={image ? "grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]" : ""}>
          <div>
            {/* breadcrumb */}
            <nav aria-label="Breadcrumb" className="font-ui text-[13px]" style={{ color: "rgba(225,216,194,.7)" }}>
              {crumbs.map((c, i) => (
                <span key={c.label}>
                  {i > 0 && <span className="mx-2" style={{ color: "rgba(225,216,194,.35)" }}>/</span>}
                  {c.href ? (
                    <a href={c.href} className="transition-opacity duration-200 hover:opacity-70">{c.label}</a>
                  ) : (
                    <span style={{ color: "rgb(255,255,255)" }}>{c.label}</span>
                  )}
                </span>
              ))}
            </nav>

            <p className="font-accent font-semibold" style={{ margin: "26px 0 0", color: "rgb(194,160,107)", fontSize: 13, letterSpacing: 4 }}>
              {kicker}
            </p>
            <h1 className="font-display font-semibold text-white" style={{ margin: "14px 0 0", fontSize: "clamp(34px,7vw,54px)", lineHeight: 1.06, letterSpacing: "-0.01em" }}>
              {h1}
            </h1>

            {children}
          </div>

          {image && (
            <div className="relative mt-2 lg:mt-0">
              <div
                className="relative mx-auto w-full max-w-[420px] overflow-hidden"
                style={{
                  aspectRatio: "4 / 5",
                  borderRadius: "260px 260px 18px 18px",
                  boxShadow: "0 28px 60px rgba(0,0,0,.4), inset 0 0 0 1px rgba(225,216,194,.25)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
