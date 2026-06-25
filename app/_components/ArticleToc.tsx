"use client";

import { useEffect, useState } from "react";

/**
 * Sticky "In this article" table of contents shown alongside the body on large
 * screens. Smooth-scrolls to each section and highlights the one currently in
 * view via an IntersectionObserver scroll-spy. Headings are passed in from the
 * server (derived from the post's h2 blocks) so the markup stays static.
 */
export default function ArticleToc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost heading currently intersecting the upper band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  const onClick = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className="sticky top-28 hidden lg:block">
      <p className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 11, letterSpacing: 3 }}>
        IN THIS ARTICLE
      </p>
      <ul className="mt-4 flex flex-col gap-1 border-l" style={{ borderColor: "rgb(225,216,194)" }}>
        {items.map((i) => {
          const on = active === i.id;
          return (
            <li key={i.id} className="-ml-px">
              <a
                href={`#${i.id}`}
                onClick={(e) => onClick(e, i.id)}
                className="block border-l-2 py-1.5 pl-4 font-ui transition-colors duration-200"
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.4,
                  borderColor: on ? "rgb(194,160,107)" : "transparent",
                  color: on ? "rgb(2,36,72)" : "rgb(120,124,131)",
                  fontWeight: on ? 600 : 400,
                }}
              >
                {i.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
