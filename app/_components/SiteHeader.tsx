"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, BLOG_LINK, scrollToId, SCROLL_TARGET_KEY } from "../_lib/nav";

const btnGold =
  "h-[40px] px-6 rounded-full font-bold text-[13px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(194,160,107,.45)] cursor-pointer";

/**
 * Site-wide header — the glass menu overlay + sticky navbar. Shared by the home
 * page, the section SEO pages and the legal pages. The menu drives the home-page
 * scroll experience: on the home page links smooth-scroll to the section; from
 * any other page they navigate home (the href is "/") and hand off the target
 * section via sessionStorage so Landing scrolls to it on arrival.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  /** Menu links: smooth-scroll on the home page; from elsewhere, store the
   *  target section and let the browser follow the "/" href, where Landing reads
   *  the hand-off and scrolls to it. */
  const onNav = (e: React.MouseEvent, id: string) => {
    const wasOpen = menuOpen;
    setMenuOpen(false);
    if (onHome) {
      e.preventDefault();
      window.setTimeout(() => scrollToId(id), wasOpen ? 60 : 0);
    } else {
      try { sessionStorage.setItem(SCROLL_TARGET_KEY, id); } catch { /* storage blocked */ }
    }
  };

  const onLogo = (e: React.MouseEvent) => {
    if (onHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /** Primary CTA: scroll to the contact section on the home page; otherwise let
   *  the browser navigate to the dedicated /contact page (which has the form). */
  const onContactCta = (e: React.MouseEvent) => {
    if (onHome) {
      e.preventDefault();
      scrollToId("contact");
    }
  };

  return (
    <>
      {/* ── glassmorphism menu overlay ────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200]"
            style={{ background: "rgba(5,12,24,.5)" }}
            onClick={e => { if (e.target === e.currentTarget) setMenuOpen(false); }}
          >
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-3 left-[4%] right-[4%] sm:left-[5%] sm:right-[5%] rounded-[24px] px-6 py-12 sm:px-16"
              style={{
                background: "rgba(33,45,63,0.85)",
                backdropFilter: "blur(24px) saturate(1.2)",
                WebkitBackdropFilter: "blur(24px) saturate(1.2)",
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="absolute top-[24px] left-[24px] sm:top-[32px] sm:left-[32px] flex items-center justify-center transition-opacity duration-300 opacity-80 hover:opacity-100 p-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgb(225,216,194)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M1 1 L13 13 M13 1 L1 13" />
                </svg>
              </button>
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 sm:gap-y-6 gap-x-12 mt-6 sm:mt-0">
                {NAV.map(({ label, id }) => (
                  <a
                    key={label}
                    href="/"
                    onClick={e => onNav(e, id)}
                    className="font-display text-left transition-opacity duration-300 hover:opacity-100 text-[22px] sm:text-[26px]"
                    style={{ color: "rgb(225,216,194)", opacity: 0.9 }}
                  >
                    {label}
                  </a>
                ))}
                {/* Blog is a real route, not a home-page scroll target — link
                    straight to it and just close the menu. */}
                <a
                  href={BLOG_LINK.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-left transition-opacity duration-300 hover:opacity-100 text-[22px] sm:text-[26px]"
                  style={{ color: "rgb(225,216,194)", opacity: 0.9 }}
                >
                  {BLOG_LINK.label}
                </a>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── sticky navbar ─────────────────────────────── */}
      <header
        className="fixed top-0 left-0 z-[100] transition-all duration-300 flex justify-center w-full"
        style={{
          paddingTop: scrolled ? 16 : 24,
          paddingBottom: scrolled ? 16 : 24,
          background: scrolled ? "rgba(13, 27, 46, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        }}
      >
        <div className="relative w-full max-w-[1240px] px-6 lg:px-12 flex items-center justify-between h-[50px]">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="w-[44px] h-[44px] md:w-[50px] md:h-[50px] rounded-full flex items-center justify-center transition-[background] duration-300 hover:bg-white/20 shrink-0"
            style={{ background: "rgba(255,255,255,.1)", backdropFilter: "blur(9.8px)", boxShadow: "inset 0 0 0 1px rgb(255,248,248)" }}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="rgb(255,255,255)">
              <path d="M1.571 0H9.429a1.6 1.6 0 0 1 0 3.2H1.571a1.6 1.6 0 0 1 0-3.2ZM12.571 12.8h7.858a1.6 1.6 0 0 1 0 3.2h-7.858a1.6 1.6 0 0 1 0-3.2ZM1.571 6.4h18.858a1.6 1.6 0 0 1 0 3.2H1.571a1.6 1.6 0 0 1 0-3.2Z" />
            </svg>
          </button>

          <a
            href="/"
            onClick={onLogo}
            aria-label="LUXYN — home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80"
          >
            <img
              src="/assets/logo.svg"
              alt="LUXYN"
              className="h-7 sm:h-9 md:h-11 w-auto"
            />
          </a>

          <a
            href="/contact"
            onClick={onContactCta}
            className={`${btnGold} hidden md:flex items-center shrink-0`}
            style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)", fontFamily: "var(--font-inter), sans-serif" }}
          >
            LEASE A SUITE
          </a>
          <a
            href="/contact"
            onClick={onContactCta}
            aria-label="Lease a suite"
            className="md:hidden flex items-center justify-center w-[44px] h-[44px] rounded-full shrink-0"
            style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </a>
        </div>
      </header>
    </>
  );
}
