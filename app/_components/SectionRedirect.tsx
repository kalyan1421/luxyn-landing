"use client";

import { useEffect } from "react";

/**
 * Entry routes like /gallery or /salon-suites are NOT separate pages — they are
 * shareable deep-links into the single-page home experience. On load this sends
 * the visitor to the matching home-page section (e.g. /#gallery), where Landing
 * smooth-scrolls to it. `replace` keeps the redirect out of the back-history,
 * so Back returns to wherever the visitor came from. A minimal link is rendered
 * for no-JS clients and crawlers.
 */
export default function SectionRedirect({ anchor, label }: { anchor: string; label: string }) {
  useEffect(() => {
    window.location.replace(`/#${anchor}`);
  }, [anchor]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgb(20,35,59)",
        color: "rgb(225,216,194)",
        fontFamily: "var(--font-inter), sans-serif",
        textAlign: "center",
        padding: 24,
      }}
    >
      <p>
        Taking you to the {label} section —{" "}
        <a href={`/#${anchor}`} style={{ color: "rgb(194,160,107)", textDecoration: "underline" }}>
          continue to LUXYN
        </a>
        .
      </p>
    </main>
  );
}
