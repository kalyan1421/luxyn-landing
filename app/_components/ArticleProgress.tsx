"use client";

import { useEffect, useState } from "react";

/**
 * A slim reading-progress bar fixed to the very top of the viewport. Tracks how
 * far the reader has scrolled through the document and fills a champagne→gold
 * gradient accordingly. Purely decorative, so it's aria-hidden.
 */
export default function ArticleProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setPct(max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[150] h-[3px] bg-transparent" aria-hidden="true">
      <div
        className="h-full origin-left transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%`, background: "linear-gradient(90deg, rgb(194,160,107), rgb(225,216,194))" }}
      />
    </div>
  );
}
