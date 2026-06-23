import type { Metadata } from "next";
import Link from "next/link";
import { site } from "./_lib/site";
import SiteHeader from "./_components/SiteHeader";
import SiteFooter from "./_components/SiteFooter";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ background: "rgb(20,35,59)", fontFamily: "var(--font-inter), sans-serif" }}
      >
      {/* decorative concentric arcs — brand motif */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[
          { w: "w-[150vw] sm:w-[560px]", stroke: 5, opacity: 0.14 },
          { w: "w-[220vw] sm:w-[820px]", stroke: 4, opacity: 0.10 },
          { w: "w-[300vw] sm:w-[1100px]", stroke: 2, opacity: 0.06 },
        ].map(({ w, stroke, opacity }, i) => (
          <div
            key={i}
            className={`absolute rounded-full aspect-square ${w}`}
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", border: `${stroke}px solid rgba(225,216,194,${opacity})` }}
          />
        ))}
      </div>

      <div className="relative z-[2] flex flex-col items-center">
        <span className="font-display font-semibold" style={{ color: "rgb(194,160,107)", fontSize: "clamp(80px,18vw,140px)", lineHeight: 1 }}>
          404
        </span>
        <h1 className="font-display font-medium text-white" style={{ margin: "12px 0 0", fontSize: "clamp(26px,5vw,38px)", lineHeight: 1.1 }}>
          This space doesn&apos;t exist.
        </h1>
        <p className="font-ui" style={{ margin: "16px 0 0", maxWidth: 420, color: "rgba(255,255,255,.6)", fontSize: 15, lineHeight: 1.6 }}>
          The page you&apos;re looking for may have moved or never existed. Let&apos;s get you back to {site.name}.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-[50px] items-center justify-center rounded-full px-8 font-ui font-bold transition-transform duration-300 hover:-translate-y-0.5"
          style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)", fontSize: 14, letterSpacing: 0.4 }}
        >
          Back to home
        </Link>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Cookies", href: "/cookies" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-accent font-semibold transition-opacity duration-300 hover:opacity-100"
              style={{ color: "rgba(225,216,194,.7)", fontSize: 12.5, letterSpacing: 1 }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      </main>
      <SiteFooter />
    </>
  );
}
