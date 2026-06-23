import Link from "next/link";
import { site } from "../_lib/site";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

/** Shared chrome for the legal/utility pages (privacy, terms, cookies).
 *  Server component — purely presentational, no client JS. */
export default function LegalLayout({
  title,
  updated,
  current,
  children,
}: {
  title: string;
  updated: string;
  /** Pathname of the current page, e.g. "/cookies" — highlights its cross-link. */
  current?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen" style={{ background: "rgb(243,236,220)", fontFamily: "var(--font-inter), sans-serif" }}>
      {/* header band */}
      <header className="relative overflow-hidden" style={{ background: "rgb(20,35,59)" }}>
        {/* decorative concentric arcs — brand motif */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {[
            { w: "w-[150vw] sm:w-[520px]", stroke: 5, opacity: 0.14 },
            { w: "w-[220vw] sm:w-[760px]", stroke: 4, opacity: 0.10 },
            { w: "w-[300vw] sm:w-[1040px]", stroke: 2, opacity: 0.06 },
          ].map(({ w, stroke, opacity }, i) => (
            <div
              key={i}
              className={`absolute rounded-full aspect-square ${w}`}
              style={{ left: "85%", top: "0%", transform: "translate(-50%, -55%)", border: `${stroke}px solid rgba(225,216,194,${opacity})` }}
            />
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-[820px] px-6 pt-28 pb-14 sm:pt-32 sm:pb-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-accent font-semibold transition-opacity duration-300 hover:opacity-70"
            style={{ color: "rgb(194,160,107)", fontSize: 13, letterSpacing: 1 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to {site.name}
          </Link>

          <p className="font-accent font-semibold" style={{ margin: "30px 0 0", color: "rgb(194,160,107)", fontSize: 12, letterSpacing: 4 }}>
            LEGAL
          </p>
          <h1 className="font-display font-semibold text-white" style={{ margin: "12px 0 0", fontSize: "clamp(34px,7vw,54px)", lineHeight: 1.04 }}>
            {title}
          </h1>
          <span
            className="mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-ui"
            style={{ background: "rgba(225,216,194,.10)", boxShadow: "inset 0 0 0 1px rgba(225,216,194,.22)", color: "rgba(255,255,255,.7)", fontSize: 12.5, letterSpacing: 0.3 }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "rgb(194,160,107)" }} aria-hidden="true" />
            Last updated {updated}
          </span>
        </div>
      </header>

      {/* body */}
      <div className="mx-auto w-full max-w-[820px] px-6 py-12 sm:py-16">
        {/* elevated document card */}
        <div
          className="rounded-[20px] bg-white px-6 py-8 sm:px-10 sm:py-12"
          style={{ boxShadow: "inset 0 0 0 1px rgb(232,224,205), 0 24px 60px rgba(20,35,59,.08)" }}
        >
          <div
            className="mb-8 flex items-start gap-3 rounded-[14px] px-4 py-3.5"
            style={{ background: "rgba(194,160,107,.10)", boxShadow: "inset 0 0 0 1px rgba(194,160,107,.30)" }}
          >
            <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(160,128,72)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            <p className="m-0 font-ui" style={{ color: "rgb(67,71,78)", fontSize: 13.5, lineHeight: 1.6 }}>
              <strong style={{ color: "rgb(2,36,72)" }}>Template notice:</strong> this is placeholder
              legal copy. Replace it with policy reviewed by your own counsel before launch.
            </p>
          </div>

          <article className="legal-prose">{children}</article>
        </div>

        {/* cross-links + contact */}
        <div className="mt-10 flex flex-col gap-6 rounded-[20px] px-6 py-8 sm:px-10" style={{ background: "rgba(20,35,59,.04)", boxShadow: "inset 0 0 0 1px rgb(232,224,205)" }}>
          <div className="flex flex-col gap-2">
            <h2 className="m-0 font-display font-semibold" style={{ color: "rgb(2,36,72)", fontSize: 22, lineHeight: 1.2 }}>
              Questions about this policy?
            </h2>
            <p className="m-0 font-ui" style={{ color: "rgb(67,71,78)", fontSize: 14.5, lineHeight: 1.6 }}>
              Reach our team at{" "}
              <a href={`mailto:${site.contact.email}`} style={{ color: "rgb(160,128,72)", textDecoration: "underline" }}>
                {site.contact.email}
              </a>
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {LEGAL_LINKS.map(({ label, href }) => {
              const active = href === current;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="rounded-full px-4 py-2 font-ui font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  style={
                    active
                      ? { background: "rgb(20,35,59)", color: "rgb(225,216,194)", fontSize: 13 }
                      : { background: "white", color: "rgb(33,58,92)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)", fontSize: 13 }
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/"
            className="inline-flex h-[48px] w-fit items-center justify-center rounded-full px-7 font-ui font-bold transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)", fontSize: 14, letterSpacing: 0.3 }}
          >
            Back to home
          </Link>
        </div>

      </div>
      </main>
      <SiteFooter />
    </>
  );
}
