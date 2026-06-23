"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { site } from "../_lib/site";
import { seoPages } from "../_lib/content";
import { LEGAL, YEAR, VELVO_URL, scrollToId } from "../_lib/nav";

/* Social glyphs (24×24, filled). Keyed by the social handle in site.ts so any
   profile added there renders automatically — unknown keys are skipped. */
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.5.01-4.74.07-.9.04-1.39.2-1.72.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.12.33-.28.82-.32 1.72-.06 1.24-.07 1.59-.07 4.36s.01 3.12.07 4.36c.04.9.2 1.39.32 1.72.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.12.82.28 1.72.32 1.24.06 1.59.07 4.36.07s3.12-.01 4.36-.07c.9-.04 1.39-.2 1.72-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.12-.33.28-.82.32-1.72.06-1.24.07-1.59.07-4.36s-.01-3.12-.07-4.36c-.04-.9-.2-1.39-.32-1.72a2.86 2.86 0 0 0-.69-1.06 2.86 2.86 0 0 0-1.06-.69c-.33-.12-.82-.28-1.72-.32-1.24-.06-1.59-.07-4.36-.07Zm0 2.76a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 1.62a3.68 3.68 0 1 0 0 7.36 3.68 3.68 0 0 0 0-7.36Zm5.48-1.06a1.24 1.24 0 1 1-2.48 0 1.24 1.24 0 0 1 2.48 0Z" />,
  facebook: <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />,
  x: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.656l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />,
  youtube: <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.5 15.5v-7l6.5 3.5-6.5 3.5Z" />,
  pinterest: <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.17-2.01.03-2.88.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.48 1.81 1.78 0 3.14-1.87 3.14-4.58 0-2.39-1.72-4.07-4.18-4.07-2.85 0-4.52 2.14-4.52 4.34 0 .86.33 1.78.74 2.28.08.1.09.19.07.29-.08.31-.25 1-.28 1.14-.04.18-.15.22-.34.13-1.27-.59-2.06-2.44-2.06-3.93 0-3.2 2.33-6.14 6.71-6.14 3.52 0 6.26 2.51 6.26 5.86 0 3.5-2.21 6.32-5.27 6.32-1.03 0-2-.54-2.33-1.17l-.63 2.42c-.23.88-.85 1.98-1.27 2.65.96.3 1.97.45 3.03.45 5.52 0 10-4.48 10-10S17.52 2 12 2Z" />,
  linkedin: <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 17.34V10.4H6.06v6.94h2.28Zm-1.14-7.92a1.32 1.32 0 1 0 0-2.64 1.32 1.32 0 0 0 0 2.64Zm10.14 7.92v-3.8c0-2.03-1.08-2.98-2.53-2.98-1.17 0-1.69.64-1.98 1.09v-.94h-2.28c.03.64 0 6.94 0 6.94h2.28v-3.88c0-.2.01-.41.07-.56.17-.41.54-.84 1.18-.84.83 0 1.16.63 1.16 1.56v3.72h2.28Z" />,
};

function SocialLinks() {
  const entries = Object.entries(site.socials).filter(([name, url]) => url && SOCIAL_ICONS[name]);
  if (!entries.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {entries.map(([name, url]) => (
        <a
          key={name} href={url} target="_blank" rel="noopener noreferrer"
          aria-label={`LUXYN on ${name[0].toUpperCase() + name.slice(1)}`}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-white transition-[background,transform,color] duration-300 hover:-translate-y-0.5 hover:text-champagne"
          style={{ background: "rgba(255,255,255,.1)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.2)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {SOCIAL_ICONS[name]}
          </svg>
        </a>
      ))}
    </div>
  );
}

/**
 * Site-wide footer — shared by the home page and the legal pages. Section links
 * are /#anchor hrefs that smooth-scroll on the home page and navigate-then-
 * scroll from elsewhere, so the footer behaves identically on every page.
 */
export default function SiteFooter() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const onAnchor = (e: React.MouseEvent, anchor: string) => {
    if (onHome) {
      e.preventDefault();
      scrollToId(anchor);
      history.replaceState(null, "", `/#${anchor}`);
    }
  };

  const onLogo = (e: React.MouseEvent) => {
    if (onHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="relative overflow-hidden w-full pt-8 sm:pt-16 pb-4 flex flex-col items-center" style={{ background: "linear-gradient(180deg,rgb(26,45,76) 49.52%,rgb(62,120,197) 100%)" }}>
      <div className="flex flex-col items-center z-[2] gap-8 px-6">
        <a href="/" onClick={onLogo} aria-label="LUXYN — home" className="cursor-pointer transition-opacity hover:opacity-80 scale-[0.8] sm:scale-100" style={{ width: 265, height: 76, background: "url(/assets/logo.png) 51.02% 65.351%/119.522% 416.667% no-repeat" }} />

        {/* In-page section links — crawlable /#anchor hrefs that smooth-scroll. */}
        <nav aria-label="LUXYN sections" className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-10">
          {seoPages.map(({ slug, navLabel, homeAnchor }) => (
            <a key={slug} href={`/#${homeAnchor}`} onClick={e => onAnchor(e, homeAnchor)}
              className="font-accent font-light text-white whitespace-nowrap transition-colors duration-300 hover:text-champagne underline underline-offset-4 decoration-[1px] decoration-white/50 hover:decoration-champagne"
              style={{ fontSize: 18 }}
            >
              {navLabel}
            </a>
          ))}
        </nav>
        <SocialLinks />
      </div>

      <div className="w-full h-px mt-16 z-[2]" style={{ background: "rgb(138,146,157)", opacity: 0.4 }} />

      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8 }}
        className="w-full max-w-[1440px] z-[1]"
        style={{ aspectRatio: "1440 / 244" }}
      >
        <div role="img" aria-label="LUXYN" className="w-full h-full" style={{ background: "url('/assets/luxyn-wordmark.svg') center/contain no-repeat" }} />
      </motion.div>

      <div className="w-full max-w-[1240px] px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center z-[2] gap-6 pt-6">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-8 w-full md:w-auto">
          {LEGAL.map(({ label, href }) => (
            <a key={label} href={href} className="font-ui font-light text-white/85 transition-colors duration-300 hover:text-white cursor-pointer underline underline-offset-4 decoration-[1px] decoration-white/30 hover:decoration-white text-[13px] sm:text-[14px] md:text-[15.5px]">{label}</a>
          ))}
        </div>
        <span className="font-ui text-white/85 text-center text-[12px] sm:text-[14px] md:text-[16px]">© {YEAR} {site.name}. All rights reserved.</span>
      </div>

      <div className="w-full flex justify-center z-[2] pt-5 pb-1">
        <span className="font-ui text-white/55 text-center" style={{ fontSize: 13, letterSpacing: 0.2 }}>
          Designed by{" "}
          <a href={VELVO_URL} target="_blank" rel="noopener noreferrer" className="text-champagne transition-opacity duration-300 hover:opacity-70">VELVO Media</a>
        </span>
      </div>
    </footer>
  );
}
