"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── animation helpers ─────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;
const FU  = { hidden: { opacity: 0, y: 36 },  show: { opacity: 1, y: 0,    transition: { duration: 1,   ease } } };
const FS  = { hidden: { opacity: 0, scale:.9}, show: { opacity: 1, scale:1, transition: { duration: 1,   ease } } };
const FL  = { hidden: { opacity: 0, x: -48 }, show: { opacity: 1, x: 0,    transition: { duration: 1,   ease } } };
const FR  = { hidden: { opacity: 0, x:  48 }, show: { opacity: 1, x: 0,    transition: { duration: 1,   ease } } };
const FI  = { hidden: { opacity: 0 },          show: { opacity: 1,           transition: { duration: .8         } } };
const vp  = { once: true, margin: "-10%" } as const;

function delay(d: number) {
  return { transition: { delay: d, duration: 1, ease } };
}

/* ─── nav data ──────────────────────────────────────────── */
const NAV = [
  { label: "Suites",            target: "philosophy" },
  { label: "Amenities",         target: "amenities"  },
  { label: "For Professionals", target: "difference" },
  { label: "Gallery",           target: "gallery"    },
  { label: "Find a Pro",        target: "findpro"    },
  { label: "About",             target: "footer"     },
];

/* ─── difference cards ──────────────────────────────────── */
const DIFF = [
  {
    icon: <svg width="32" height="34" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 25V10a10 10 0 0 1 20 0v15"/><circle cx="12" cy="11" r="1.2" fill="currentColor" stroke="none"/></svg>,
    title: "Design-led suites",
    body:  "The most beautiful private suites in the category — finished to feel like a destination, not a cubicle.",
  },
  {
    icon: <svg width="32" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 20c0-8 8-15 17-15 0 9-7 17-15 17a2 2 0 0 1-2-2Z"/><path d="M5 19C9 14 13 11 17 8"/></svg>,
    title: "Wellness under one roof",
    body:  "Hair, skin, nails, brows, massage and more — a full sensory experience for every client.",
  },
  {
    icon: <svg width="32" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>,
    title: "Independence, supported",
    body:  "Own your business and your hours. Lean on LUXYN for the front desk, upkeep, and marketing.",
  },
  {
    icon: <svg width="32" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 19h18"/><path d="M5 19a7 7 0 0 1 14 0"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1.1" fill="currentColor" stroke="none"/></svg>,
    title: "On-site care",
    body:  "A real person on site every day to welcome your clients and keep your space effortless.",
  },
];

/* ─── amenity cards ─────────────────────────────────────── */
const AMEN = [
  { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>,  title: "24/7 SECURE ACCESS",  body: "Your business, your hours. Complete autonomy with a state-of-the-art security system for peace of mind." },
  { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="5"/><circle cx="7" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>, title: "ON-SITE LAUNDRY",    body: "Complimentary high-capacity laundry facilities designed to keep your workflow seamless and stress-free." },
  { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 9h12v5a5 5 0 0 1-10 0z"/><path d="M17 10h2a2 2 0 0 1 0 5h-2"/><path d="M8 4v2M11.5 3v2"/></svg>, title: "CLIENT LOUNGE",      body: "A sophisticated waiting area with specialty coffee and refreshments to delight your guests from arrival." },
  { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9a16 16 0 0 1 20 0"/><path d="M5 12.5a11 11 0 0 1 14 0"/><path d="M8.5 16a6 6 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1.1" fill="currentColor" stroke="none"/></svg>, title: "HIGH-SPEED FIBER",    body: "Dedicated enterprise-grade Wi-Fi for seamless booking, processing, and social media management." },
  { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>, title: "DAILY COMMON CARE",  body: "Professional cleaning of all shared areas ensures the facility always reflects your high standards." },
  { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 14c-2.2 0-4 1.8-4 5 3.2 0 5-1.8 5-4"/><path d="M19 3l2 2-9.5 9.5-2-2z"/></svg>, title: "CUSTOM BRANDING",    body: "Paint and decorate your suite to match your brand's unique identity and professional aesthetic." },
];

/* ─── shared button styles ──────────────────────────────── */
const btnGold = "h-[40px] px-6 rounded-full font-bold text-[13px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(194,160,107,.45)] cursor-pointer";
const btnOutline = "h-[40px] px-6 rounded-full font-bold text-[13px] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer";

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY]   = useState(0);
  const [heroH,   setHeroH]     = useState(750);
  const heroRef  = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  /* smooth-scroll — resolves whichever layout (desktop / mobile) is visible */
  const nav = (id: string) => {
    const candidates = [document.getElementById(id), document.getElementById("m-" + id)]
      .filter(Boolean) as HTMLElement[];
    const el = candidates.find(e => e.offsetParent !== null) ?? candidates[0];
    if (!el) return;
    window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 64), behavior: "smooth" });
  };
  const menuNav = (id: string) => { setMenuOpen(false); setTimeout(() => nav(id), 50); };

  /* measure hero height once */
  useEffect(() => { if (heroRef.current) setHeroH(heroRef.current.offsetHeight); }, []);

  /* viewport zoom */
  useEffect(() => {
    const apply = () => {
      const el = document.getElementById("pageRoot");
      if (!el) return;
      /* desktop canvas only — below lg the dedicated mobile layout takes over */
      if (window.innerWidth < 1024) { el.style.zoom = ""; return; }
      el.style.zoom = String(window.innerWidth / 1440);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  /* scroll effects */
  useEffect(() => {
    const tick = () => {
      setScrollY(window.scrollY);
      const dh = document.documentElement.scrollHeight - window.innerHeight || 1;
      const p = document.getElementById("prog");
      if (p) p.style.width = Math.min(100, (window.scrollY / dh) * 100) + "%";
      if (heroBgRef.current && window.scrollY < heroH * 1.5)
        heroBgRef.current.style.transform = `translate3d(0,${window.scrollY * 0.28}px,0)`;
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      window.removeEventListener("keydown", onKey);
    };
  }, [heroH]);

  const showTop = scrollY > 900;

  return (
    <div className="relative overflow-x-hidden">

      {/* ── progress bar ─────────────────────────────── */}
      <div id="prog" className="fixed top-0 left-0 h-[3px] bg-champagne z-[120]" style={{ width: 0, transition: "width .1s linear" }} />


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
            style={{ background: "rgba(5,12,24,.72)", backdropFilter: "blur(8px)" }}
            onClick={e => { if (e.target === e.currentTarget) setMenuOpen(false); }}
          >
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-3 left-[4%] right-[4%] sm:left-[5%] sm:right-[5%] rounded-[24px] sm:rounded-[28px] px-7 sm:px-14 py-7 sm:py-8"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(48px) saturate(1.6) brightness(1.1)",
                WebkitBackdropFilter: "blur(48px) saturate(1.6) brightness(1.1)",
                border: "1px solid rgba(255,255,255,.22)",
                boxShadow: "0 8px 64px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.28), inset 0 -1px 0 rgba(255,255,255,.06)",
              }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-[background] duration-300 hover:bg-white/10"
                style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M1 1 L13 13 M13 1 L1 13"/>
                </svg>
              </button>
              <div className="mt-7 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-1 sm:gap-x-20 sm:gap-y-0">
                {NAV.map(({ label, target }) => (
                  <button key={label} onClick={() => menuNav(target)} className="menu-link text-left">
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── back to top ──────────────────────────────── */}
      <motion.button
        onClick={() => nav("hero")}
        className="fixed right-7 bottom-7 w-[50px] h-[50px] rounded-full flex items-center justify-center z-[115] cursor-pointer"
        style={{ background: "rgb(194,160,107)", boxShadow: "0 10px 26px rgba(0,0,0,.3)" }}
        animate={{ opacity: showTop ? 1 : 0, y: showTop ? 0 : 12, pointerEvents: showTop ? "auto" : "none" }}
        transition={{ duration: 0.4 }}
        whileHover={{ boxShadow: "0 16px 34px rgba(194,160,107,.55)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(20,35,59)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </motion.button>

      {/* ═══════════════ MOBILE LAYOUT (< lg) ══════════ */}
      <div className="lg:hidden">
        <MobileLanding nav={nav} onMenu={() => setMenuOpen(true)} />
      </div>

      {/* ═══════════════ DESKTOP CANVAS (≥ lg, zoomed) ══ */}
      <div className="hidden lg:block">
      <div id="pageRoot" style={{ position: "relative", width: 1440, fontFamily: "'Inter',sans-serif" }}>

        {/* ── HERO ───────────────────────────────────── */}
        <section
          ref={heroRef}
          id="hero"
          className="relative overflow-hidden flex items-center justify-center"
          style={{ width: 1440, height: 775, background: "rgb(20,35,59)" }}
        >
          <div
            ref={heroBgRef}
            className="absolute will-change-transform"
            style={{ left: 0, top: "-8%", width: 1440, height: "124%", background: "url(/assets/hero-bg.png) center/cover no-repeat" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(110deg,rgba(20,35,59,.86) 0%,rgba(20,35,59,.45) 46%,rgba(20,35,59,.08) 70%)" }} />

          {/* in-hero top bar */}
          <div className="absolute z-[5]" style={{ left: 100, top: 24, width: 1240, height: 50 }}>
            <button
              onClick={() => setMenuOpen(true)}
              className="absolute left-0 top-0 w-[50px] h-[50px] rounded-full flex items-center justify-center transition-[background] duration-300 hover:bg-white/20"
              style={{ background: "rgba(255,255,255,.1)", backdropFilter: "blur(9.8px)", boxShadow: "inset 0 0 0 1px rgb(255,248,248)" }}
            >
              <HamburgerSVG />
            </button>
            <button
              onClick={() => nav("cta")}
              className={`absolute right-0 top-[5px] ${btnGold}`}
              style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)", fontFamily: "'Inter',sans-serif" }}
            >
              Lease a Suite
            </button>
          </div>
          {/* logo */}
          <div
            className="absolute z-[5]"
            style={{ left: 595, top: 24, width: 251, height: 72, background: "url(/assets/logo.png) 51.02% 65.351%/119.522% 416.667% no-repeat" }}
          />

          {/* hero content */}
          <div className="relative z-[4]" style={{ width: 1440, height: 560 }}>
            {/* left copy */}
            <motion.div
              className="absolute flex flex-col"
              style={{ left: 182, top: 120, width: 513 }}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13 } } }}
            >
              <motion.h1
                variants={FU}
                className="m-0 font-display font-medium text-white"
                style={{ fontSize: 52, lineHeight: 1.0, letterSpacing: "-0.01em" }}
              >
                Space to do your best work.<br />A calm home for your craft.
              </motion.h1>
              <motion.p
                variants={FU}
                className="font-ui font-normal text-white/40"
                style={{ marginTop: 18, width: 499, fontSize: 12, lineHeight: 1.6 }}
              >
                LUXYN leases private, design-led suites to independent beauty and wellness professionals — giving you the freedom to build, serve, and grow in an elevated space.
              </motion.p>
              <motion.div variants={FU} className="flex gap-3 items-center" style={{ marginTop: 30 }}>
                <button
                  onClick={() => nav("cta")}
                  className={btnGold}
                  style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)", fontFamily: "'Inter',sans-serif" }}
                >
                  Lease a Suite
                </button>
                <button
                  onClick={() => nav("findpro")}
                  className={btnOutline}
                  style={{ boxShadow: "inset 0 0 0 1px rgb(194,160,107)", color: "rgb(194,160,107)", fontFamily: "'Inter',sans-serif" }}
                >
                  Book a Tour
                </button>
              </motion.div>
            </motion.div>

            {/* right: arch + quote */}
            <motion.div
              className="absolute"
              style={{ left: 787, top: 14, width: 456, height: 533 }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="floaty absolute"
                style={{ left: 0, top: 6, width: 417, height: 521, borderRadius: "500px 500px 0 0", background: "rgb(238,237,241)", boxShadow: "inset 0 0 0 5px rgb(184,153,104)", overflow: "hidden" }}
              >
                <div
                  style={{
                    position: "absolute", left: 0, top: -6, width: 417, height: 533,
                    borderRadius: "3333px 3333px 0 0",
                    background: "linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)),url(/assets/hero-arch.png) 50% 0%/125% 132.27% no-repeat",
                    boxShadow: "inset 0 0 0 5px rgb(184,153,104)",
                  }}
                />
              </div>
              <div
                className="floaty2 absolute flex items-start rounded-[32px]"
                style={{
                  left: -48, top: 338, width: 240, height: 143, padding: 32,
                  background: "rgb(250,249,252)",
                  boxShadow: "inset 0 0 0 1px rgba(196,198,207,.3),0 24px 48px rgba(10,22,40,.28)",
                }}
              >
                <span className="font-ui italic text-[rgb(2,36,72)]" style={{ fontSize: 16, lineHeight: 1.6 }}>
                  &quot;A space that honors the artistry of my work.&quot;
                </span>
              </div>
            </motion.div>
          </div>

          {/* champagne marquee */}
          <div
            className="absolute left-0 bottom-0 overflow-hidden flex items-center z-[5]"
            style={{ width: 1440, height: 39, background: "rgb(194,160,107)" }}
          >
            <div className="marq">
              {[0, 1].map(i => (
                <span key={i} className="font-ui text-white pr-[.29em]" style={{ fontSize: 16, letterSpacing: ".29em" }}>
                  SALON · WELLNESS · SPA · Private Suites · Premium Amenities · Flexible Leasing · Client-Friendly Location ·{" "}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHILOSOPHY ─────────────────────────────── */}
        <section id="philosophy" className="relative overflow-hidden" style={{ width: 1440, minHeight: 775, background: "rgb(243,236,220)" }}>
          <div className="absolute" style={{ left: 144, top: 123, width: 466 }}>
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="block font-ui font-semibold text-[rgb(198,155,95)]"
              style={{ fontSize: 12, letterSpacing: 1.8 }}
            >
              OUR PHILOSOPHY
            </motion.span>
            <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
              className="font-editorial font-normal text-[rgb(2,36,72)]"
              style={{ margin: "26px 0 0", width: 466, fontSize: 34, lineHeight: 1.1 }}
            >
              A refined space for professionals who care deeply about their work.
            </motion.h2>
            <motion.p initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.16)}
              className="font-ui font-normal text-[rgb(67,71,78)]"
              style={{ margin: "34px 0 0", width: 466, fontSize: 16, lineHeight: 1.6 }}
            >
              LUXYN was founded on the belief that environment dictates energy. We provide more than just four walls; we provide a curated atmosphere designed to enhance the client experience and support your professional growth with architectural elegance.
            </motion.p>
            <motion.div initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.24)}
              className="flex flex-col gap-2"
              style={{ marginTop: 34, borderTop: "1px solid rgba(196,198,207,.5)", borderBottom: "1px solid rgba(196,198,207,.5)", padding: "16px 0" }}
            >
              <span className="font-ui font-semibold italic text-[rgb(2,36,72)]" style={{ fontSize: 16, lineHeight: 1.6 }}>
                &quot;Luxyn has completely transformed how my clients perceive my brand.&quot;
              </span>
              <span className="font-ui font-semibold text-[rgb(67,71,78)]" style={{ fontSize: 12, letterSpacing: 1.8 }}>
                — SARAH J., MASTER COLORIST
              </span>
            </motion.div>
          </div>

          {/* arch image 1 */}
          <motion.div
            initial="hidden" whileInView="show" viewport={vp} variants={FR}
            className="absolute group overflow-hidden"
            style={{ left: 633, top: 235, width: 323, height: 450, borderRadius: "500px 500px 0 0" }}
          >
            <div
              className="absolute inset-0 transition-[transform] duration-[900ms] group-hover:-translate-y-[10px] group-hover:scale-[1.06]"
              style={{ background: "url(/assets/about-2.png) 50% 50%/139.319% 100% no-repeat", borderRadius: "500px 500px 0 0" }}
            />
          </motion.div>

          {/* arch image 2 */}
          <motion.div
            initial="hidden" whileInView="show" viewport={vp} variants={FR} {...delay(0.14)}
            className="absolute group overflow-hidden"
            style={{ left: 972, top: 155, width: 323, height: 450, borderRadius: "500px 500px 0 0" }}
          >
            <div
              className="absolute inset-0 transition-[transform] duration-[900ms] group-hover:-translate-y-[10px] group-hover:scale-[1.06]"
              style={{ background: "url(/assets/about-1.png) 50% 50%/139.319% 100% no-repeat", borderRadius: "500px 500px 0 0" }}
            />
          </motion.div>
        </section>

        {/* ── DIVERSE ARTISTRY ───────────────────────── */}
        <section id="gallery" className="relative overflow-hidden" style={{ width: 1440, minHeight: 775, background: "rgb(251,248,241)" }}>
          <div className="absolute flex flex-col items-center" style={{ left: 299, top: 70, width: 843 }}>
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="font-ui font-semibold text-[rgb(198,155,95)]" style={{ fontSize: 12, letterSpacing: 1.8 }}
            >
              DIVERSE ARTISTRY
            </motion.span>
            <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
              className="font-display font-semibold text-[rgb(33,58,92)] text-center"
              style={{ margin: "10px 0 0", width: 843, fontSize: 46, lineHeight: 1.0 }}
            >
              A space for independent beauty &amp; wellness professionals.
            </motion.h2>
          </div>

          <div className="absolute flex gap-4 items-start" style={{ left: 106, top: 227, width: 1229, height: 483 }}>
            {/* tall left */}
            <motion.div initial="hidden" whileInView="show" viewport={vp} variants={FS}
              className="gallery-card relative overflow-hidden flex-shrink-0 rounded-[32px]"
              style={{ width: 228, height: 483, background: "#fff" }}
            >
              <div className="absolute transition-transform duration-[800ms] hover:scale-[1.07]" style={{ left: -5, top: 0, width: 252, height: 488, background: "url(/assets/gallery-1.png) 41.808% 8.108%/634.711% 218.337% no-repeat" }} />
              <div className="card-overlay absolute bottom-0 left-0 right-0 z-[3] flex items-end justify-center" style={{ height: "52%", padding: "0 14px 24px", background: "linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,0) 100%)" }}>
                <span className="card-label font-accent font-normal text-white text-center" style={{ fontSize: 11, letterSpacing: 3 }}>Estheticians</span>
              </div>
            </motion.div>

            <div className="flex flex-col gap-4" style={{ width: 985 }}>
              <div className="flex gap-4 items-center">
                {[
                  { w:454, h:231, bg:"url(/assets/gallery-2.png) 7.79% 7.154%/355.556% 268.766% no-repeat", iL:-17, iT:-96, iW:471, iH:416, label:"Hair Stylists", d:0.08 },
                  { w:515, h:231, bg:"url(/assets/gallery-2.png) 49.597% 81.944%/366.587% 272.34% no-repeat",  iL:0,   iT:-244,iW:567, iH:508, label:"Colorists",    d:0.16 },
                ].map(({ w, h, bg, iL, iT, iW, iH, label, d }) => (
                  <motion.div key={label} initial="hidden" whileInView="show" viewport={vp} variants={FS} {...delay(d)}
                    className="gallery-card relative overflow-hidden rounded-[32px]" style={{ width: w, height: h }}
                  >
                    <div className="absolute transition-transform duration-[800ms] hover:scale-[1.07]" style={{ left: iL, top: iT, width: iW, height: iH, background: bg }} />
                    <div className="card-overlay absolute bottom-0 left-0 right-0 z-[3] flex items-end justify-center" style={{ height: "55%", padding: "0 14px 18px", background: "linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,0) 100%)" }}>
                      <span className="card-label font-accent font-normal text-white text-center" style={{ fontSize: 11, letterSpacing: 3 }}>{label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4 items-end">
                {[
                  { w:406, h:230, bg:"url(/assets/gallery-1.png) 16.764% 94.851%/447.813% 358.042% no-repeat", iL:0,   iT:-89,  iW:406, iH:339, label:"Brow & Lash Artists",  d:0.12 },
                  { w:233, h:227, bg:"url(/assets/gallery-2.png) 90% 81.364%/378.325% 281.319% no-repeat",      iL:-10, iT:0,    iW:253, iH:227, label:"Nail Artists",         d:0.20 },
                  { w:314, h:231, bg:"url(/assets/gallery-2.png) 88.462% 8.602%/391.837% 274.531% no-repeat",   iL:-16, iT:-142, iW:392, iH:373, label:"Massage & Wellness",   d:0.28 },
                ].map(({ w, h, bg, iL, iT, iW, iH, label, d }) => (
                  <motion.div key={label} initial="hidden" whileInView="show" viewport={vp} variants={FS} {...delay(d)}
                    className="gallery-card relative overflow-hidden rounded-[32px]" style={{ width: w, height: h }}
                  >
                    <div className="absolute transition-transform duration-[800ms] hover:scale-[1.07]" style={{ left: iL, top: iT, width: iW, height: iH, background: bg }} />
                    <div className="card-overlay absolute bottom-0 left-0 right-0 z-[3] flex items-end justify-center" style={{ height: "55%", padding: "0 14px 18px", background: "linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,0) 100%)" }}>
                      <span className="card-label font-accent font-normal text-white text-center" style={{ fontSize: 11, letterSpacing: 3 }}>{label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── THE LUXYN DIFFERENCE ───────────────────── */}
        <section id="difference" className="relative overflow-hidden" style={{ width: 1440, minHeight: 555, background: "rgb(244,238,225)" }}>
          <div className="absolute flex flex-col items-center gap-3" style={{ left: 270, top: 61, width: 900 }}>
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 13, letterSpacing: 4 }}
            >
              THE LUXYN DIFFERENCE
            </motion.span>
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
              className="font-display font-semibold text-[rgb(33,58,92)]" style={{ fontSize: 46, lineHeight: 1.0 }}
            >
              A sanctuary, not a rented room
            </motion.span>
          </div>
          <div className="absolute flex gap-6 items-start" style={{ left: 120, top: 191, width: 1200 }}>
            {DIFF.map(({ icon, title, body }, i) => (
              <motion.div
                key={title}
                initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(i * 0.09)}
                className="flex flex-col gap-3.5 rounded-[12px] transition-[transform,box-shadow] duration-[400ms] cursor-default"
                style={{ width: 282, height: 276, background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)", padding: "32px 26px" }}
                whileHover={{ y: -8, boxShadow: "inset 0 0 0 1px rgb(225,216,194), 0 22px 44px rgba(33,58,92,.14)" }}
              >
                <span className="text-[rgb(33,58,92)]">{icon}</span>
                <span className="font-display font-semibold text-[rgb(33,58,92)]" style={{ fontSize: 24, lineHeight: 1.0 }}>{title}</span>
                <span className="font-accent font-normal opacity-85 text-[rgb(22,38,60)]" style={{ fontSize: 14.5, lineHeight: 1.5 }}>{body}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BANNER ─────────────────────────────────── */}
        <section id="banner" className="relative overflow-hidden flex items-center justify-center" style={{ width: 1440, height: 550, background: "rgb(244,238,225)" }}>
          <div className="absolute" style={{ left: 0, top: "-15%", width: 1440, height: "130%", background: "url(/assets/cta-bg.png) center/cover no-repeat" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgb(20,35,59) 0%,rgba(45,79,127,.5) 50%,rgba(70,122,194,0) 100%)" }} />
          <div className="relative z-[2] flex flex-col items-center gap-6 text-center" style={{ maxWidth: 760, padding: "0 40px" }}>
            <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="m-0 font-display font-bold text-white" style={{ fontSize: 72, lineHeight: 1.0 }}
            >
              Your suite. Your schedule. Your brand.
            </motion.h2>
            <motion.p initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.14)}
              className="m-0 font-ui font-medium text-[rgb(255,220,164)]" style={{ maxWidth: 610, fontSize: 16, lineHeight: 1.5 }}
            >
              Create a space that feels like your own, serve clients with privacy, and grow your business inside a calm, elevated environment.
            </motion.p>
          </div>
        </section>

        {/* ── AMENITIES ──────────────────────────────── */}
        <section id="amenities" className="relative overflow-hidden flex flex-col items-center justify-center" style={{ width: 1440, height: 835, background: "rgb(20,35,59)", gap: 48 }}>
          <div className="absolute opacity-50 pointer-events-none" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 1550, height: "120%", background: "url(/assets/amenities-illustration.png) center/cover no-repeat" }} />
          <div className="relative z-[2] flex flex-col items-center gap-4">
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 13, letterSpacing: 4 }}
            >
              AMENITIES
            </motion.span>
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
              className="font-display font-bold text-white text-center" style={{ width: 448, fontSize: 44, lineHeight: 1.0 }}
            >
              Designed around comfort, care, and craft.
            </motion.span>
          </div>
          <div className="relative z-[2] grid" style={{ width: 1152, gridTemplateColumns: "1fr 1fr 1fr", gridAutoRows: "250.78px", gap: 24 }}>
            {AMEN.map(({ icon, title, body }, i) => (
              <motion.div
                key={title}
                initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(i * 0.08)}
                className="flex flex-col gap-[15px] rounded-[32px] bg-white p-10 cursor-default"
                style={{ boxShadow: "inset 0 0 0 1px rgba(196,198,207,.2)" }}
                whileHover={{ y: -8, boxShadow: "0 26px 50px rgba(0,0,0,.28)" }}
              >
                <span className="text-[rgb(198,155,95)]">{icon}</span>
                <span className="font-ui font-medium text-[rgb(2,36,72)]" style={{ fontSize: 14, letterSpacing: 1.4 }}>{title}</span>
                <span className="font-ui font-normal text-[rgb(67,71,78)]" style={{ fontSize: 16, lineHeight: 1.6 }}>{body}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FIND A PRO ─────────────────────────────── */}
        <section id="findpro" className="relative overflow-hidden flex items-center" style={{ width: 1440, minHeight: 756, background: "rgb(244,238,225)" }}>
          <motion.div
            initial="hidden" whileInView="show" viewport={vp} variants={FL}
            className="absolute overflow-hidden"
            style={{ left: 144, top: 120, width: 516, height: 516, borderRadius: "500px 500px 0 0", background: "url(/assets/findpro-a.png) center/cover no-repeat", boxShadow: "0 28px 60px rgba(20,35,59,.18)" }}
            whileHover={{ y: -10, boxShadow: "0 40px 80px rgba(20,35,59,.28)" }}
          />
          <motion.div
            initial="hidden" whileInView="show" viewport={vp} variants={FL} {...delay(0.12)}
            className="absolute floaty"
            style={{ left: 172, top: 81, width: 460, height: 555, background: "url(/assets/findpro-stylist.png) bottom center/contain no-repeat", filter: "drop-shadow(0 24px 36px rgba(20,35,59,.32))" }}
            whileHover={{ y: -8, scale: 1.02 }}
          />
          <div className="absolute flex flex-col items-start" style={{ left: 780, top: 250, width: 516, gap: 28 }}>
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="font-ui font-semibold text-[rgb(74,98,106)]" style={{ fontSize: 12, letterSpacing: 1.8 }}
            >
              FOR CLIENTS
            </motion.span>
            <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
              className="m-0 font-display font-bold text-[rgb(2,36,72)]" style={{ width: 516, fontSize: 44, lineHeight: 1.0 }}
            >
              Looking for a professional?
            </motion.h2>
            <motion.p initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.16)}
              className="m-0 font-ui font-normal text-[rgb(67,71,78)]" style={{ width: 516, fontSize: 16, lineHeight: 1.6 }}
            >
              Explore independent beauty and wellness professionals working from LUXYN.
            </motion.p>
            <motion.button
              initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.24)}
              onClick={() => nav("gallery")}
              className="h-[48px] px-8 rounded-full font-ui font-bold text-white cursor-pointer transition-[transform,box-shadow,background] duration-300 hover:-translate-y-0.5"
              style={{ fontSize: 13, letterSpacing: .5, background: "rgb(20,35,59)" }}
              whileHover={{ boxShadow: "0 14px 30px rgba(20,35,59,.32)" }}
            >
              Find a Pro
            </motion.button>
          </div>
        </section>

        {/* ── READY CTA ──────────────────────────────── */}
        <section id="cta" className="relative overflow-hidden flex items-center justify-center" style={{ width: 1440, height: 448, background: "rgb(20,35,59)" }}>
          <div className="absolute inset-0 opacity-25 overflow-hidden" style={{ background: "linear-gradient(180deg,rgb(20,35,59) 0%,rgb(55,96,161) 100%)" }}>
            {[1100, 1450, 1800, 2150].map((s, i) => (
              <div key={i} className="absolute rounded-full" style={{ left: "50%", top: "118%", width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, border: `1px solid rgba(255,255,255,${0.5 - i * 0.08})` }} />
            ))}
          </div>
          <div className="relative z-[2] flex flex-col items-center gap-6 text-center" style={{ maxWidth: 1176, padding: "0 40px" }}>
            <div className="flex flex-col items-center gap-4">
              <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
                className="font-display font-bold text-white" style={{ fontSize: 44, lineHeight: 1.05 }}
              >
                Ready to make LUXYN your new professional home?
              </motion.span>
              <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
                className="font-ui font-normal text-white" style={{ fontSize: 16 }}
              >
                Book a private tour and explore available suites designed for your next chapter.
              </motion.span>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.16)} className="flex gap-3">
              <button onClick={() => nav("findpro")} className={btnGold} style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)", fontFamily: "'Inter',sans-serif" }}>Lease a Suite</button>
              <button onClick={() => nav("gallery")}  className={btnOutline} style={{ boxShadow: "inset 0 0 0 1px rgb(194,160,107)", color: "rgb(194,160,107)", fontFamily: "'Inter',sans-serif" }}>Book a Tour</button>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────── */}
        <section id="footer" className="relative overflow-hidden" style={{ width: 1440, minHeight: 624, background: "linear-gradient(180deg,rgb(26,45,76) 49.52%,rgb(62,120,197) 100%)" }}>
          <div className="absolute flex flex-col items-center" style={{ left: 429, top: 35, width: 583, gap: 26 }}>
            <button onClick={() => nav("hero")} className="cursor-pointer" style={{ width: 194, height: 63, background: "url(/assets/logo.png) 50% 66.194%/146.25% 455.339% no-repeat" }} />
            <div className="flex items-center" style={{ gap: 48 }}>
              {[
                { label: "Suites",            id: "gallery"    },
                { label: "For Professionals", id: "difference" },
                { label: "Find a Pro",        id: "findpro"    },
                { label: "Amenities",         id: "amenities"  },
                { label: "Contact",           id: "cta"        },
              ].map(({ label, id }) => (
                <button key={label} onClick={() => nav(id)}
                  className="font-accent text-white cursor-pointer whitespace-nowrap transition-colors duration-300 hover:text-champagne"
                  style={{ fontSize: 14.5 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="absolute left-0 w-full h-px" style={{ top: 223, background: "rgb(138,146,157)" }} />
          <motion.div
            initial="hidden" whileInView="show" viewport={vp} variants={FI}
            className="absolute"
            style={{ left: 0, top: 268, width: 1440, height: 301, background: "url(/assets/logo.png) 50% 60.271%/146.25% 699.668% no-repeat" }}
          />
          <div className="absolute flex justify-between items-start" style={{ left: 80, top: 569, width: 1280 }}>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookies Settings"].map(l => (
                <button key={l} className="font-ui text-white/85 transition-colors duration-300 hover:text-white cursor-pointer" style={{ fontSize: 14 }}>{l}</button>
              ))}
            </div>
            <span className="font-ui text-white" style={{ fontSize: 16 }}>© 2026 LUXYN. All rights reserved.</span>
          </div>
        </section>

      </div>{/* /pageRoot */}
      </div>{/* /desktop */}
    </div>
  );
}

function HamburgerSVG() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="rgb(255,255,255)">
      <path d="M1.571 0H9.429a1.6 1.6 0 0 1 0 3.2H1.571a1.6 1.6 0 0 1 0-3.2ZM12.571 12.8h7.858a1.6 1.6 0 0 1 0 3.2h-7.858a1.6 1.6 0 0 1 0-3.2ZM1.571 6.4h18.858a1.6 1.6 0 0 1 0 3.2H1.571a1.6 1.6 0 0 1 0-3.2Z"/>
    </svg>
  );
}

/* ════════════════════ MOBILE LAYOUT ═══════════════════════
   A purpose-built single-column experience for < 1024px.
   Same tokens + arch motif as the desktop canvas, reflowed for
   touch: readable type, ≥48px targets, always-visible labels.   */

const ARCH = "999px 999px 0 0";                 // responsive rounded-top arch
/* Mobile entrances use CSS scroll-driven animation (see `[data-rise]` in
   globals.css), NOT framer — framer 12 + React 19 never runs mount or
   whileInView animations for elements first painted below the fold, leaving
   them stuck at the hidden state. The CSS approach can't hide content: where
   `animation-timeline: view()` is unsupported (or reduced-motion is on), the
   element simply rests at its natural, fully-visible state. */
const rev = { "data-rise": "" };

const NAVY = "rgb(20,35,59)";
const INK  = "rgb(2,36,72)";
const BODY = "rgb(67,71,78)";
const GOLD = "rgb(194,160,107)";

/* mobile gallery tiles — reuse the desktop's single-photo crops out of the
   montage images. Percentage size/position is scale-invariant, so matching
   each tile's aspect ratio to the desktop card reproduces the exact photo. */
const M_GAL = [
  { label: "Estheticians",        img: "/assets/gallery-1.png", ar: "252 / 488", crop: "41.808% 8.108%/634.711% 218.337%" },
  { label: "Hair Stylists",       img: "/assets/gallery-2.png", ar: "471 / 416", crop: "7.79% 7.154%/355.556% 268.766%"  },
  { label: "Colorists",           img: "/assets/gallery-2.png", ar: "567 / 508", crop: "49.597% 81.944%/366.587% 272.34%" },
  { label: "Brow & Lash Artists", img: "/assets/gallery-1.png", ar: "406 / 339", crop: "16.764% 94.851%/447.813% 358.042%" },
  { label: "Nail Artists",        img: "/assets/gallery-2.png", ar: "253 / 227", crop: "90% 81.364%/378.325% 281.319%"    },
  { label: "Massage & Wellness",  img: "/assets/gallery-2.png", ar: "392 / 373", crop: "88.462% 8.602%/391.837% 274.531%" },
];

function MEyebrow({ children, color = GOLD, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) {
  return (
    <motion.span
      {...rev}
      className={`font-accent font-semibold block ${center ? "text-center" : ""}`}
      style={{ color, fontSize: 11.5, letterSpacing: 3 }}
    >
      {children}
    </motion.span>
  );
}

function MobileLanding({ nav, onMenu }: { nav: (id: string) => void; onMenu: () => void }) {
  return (
    <div className="w-full overflow-x-hidden" style={{ fontFamily: "'Inter',sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section id="m-hero" className="relative overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute inset-0" style={{ background: "url(/assets/hero-bg.png) 60% center/cover no-repeat" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(20,35,59,.78) 0%,rgba(20,35,59,.58) 45%,rgba(20,35,59,.82) 100%)" }} />

        <div className="relative z-[3]">
          {/* top bar */}
          <div className="flex items-center justify-between px-5 pt-5">
            <button
              onClick={onMenu}
              aria-label="Open menu"
              className="w-[46px] h-[46px] rounded-full flex items-center justify-center transition-colors duration-300 active:bg-white/20"
              style={{ background: "rgba(255,255,255,.1)", backdropFilter: "blur(9.8px)", boxShadow: "inset 0 0 0 1px rgb(255,248,248)" }}
            >
              <HamburgerSVG />
            </button>
            <button
              onClick={() => nav("cta")}
              className="h-[42px] px-5 rounded-full font-bold text-[12px] transition-transform duration-300 active:scale-95"
              style={{ background: GOLD, color: NAVY }}
            >
              Lease a Suite
            </button>
          </div>

          {/* logo */}
          <div className="flex justify-center mt-4">
            <div style={{ width: 156, height: 45, background: "url(/assets/logo.png) 51.02% 65.351%/119.522% 416.667% no-repeat" }} />
          </div>

          {/* copy — plain, always-visible markup; framer entrances are
              unreliable in this stack (see `rev`). data-rise gives a subtle
              scroll reveal that safely rests visible when unsupported. */}
          <div className="px-6 pt-9 text-center">
            <h1
              data-rise
              className="m-0 font-display font-medium text-white"
              style={{ fontSize: "clamp(31px,8.6vw,40px)", lineHeight: 1.06, letterSpacing: "-0.01em" }}
            >
              Space to do your best work. A calm home for your craft.
            </h1>
            <p
              data-rise
              className="font-ui font-normal mx-auto"
              style={{ marginTop: 16, maxWidth: 380, color: "rgba(255,255,255,.62)", fontSize: 14, lineHeight: 1.65 }}
            >
              LUXYN leases private, design-led suites to independent beauty and wellness professionals — the freedom to build, serve, and grow in an elevated space.
            </p>
            <div data-rise className="flex flex-col gap-3 mt-7 max-w-[340px] mx-auto">
              <button
                onClick={() => nav("cta")}
                className="h-[50px] rounded-full font-bold text-[14px] transition-transform duration-300 active:scale-[.98]"
                style={{ background: GOLD, color: NAVY }}
              >
                Lease a Suite
              </button>
              <button
                onClick={() => nav("findpro")}
                className="h-[50px] rounded-full font-bold text-[14px] transition-transform duration-300 active:scale-[.98]"
                style={{ boxShadow: `inset 0 0 0 1px ${GOLD}`, color: GOLD }}
              >
                Book a Tour
              </button>
            </div>
          </div>

          {/* arch visual + quote */}
          <div className="relative mx-auto mt-10 mb-12" style={{ width: "72%", maxWidth: 280 }}>
            <div
              className="floaty relative w-full"
              style={{ aspectRatio: "5 / 6", borderRadius: ARCH, background: "rgb(238,237,241)", boxShadow: `inset 0 0 0 4px rgb(184,153,104)`, overflow: "hidden" }}
            >
              <div className="absolute inset-0" style={{ borderRadius: ARCH, background: "linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)),url(/assets/hero-arch.png) 50% 12%/130% auto no-repeat" }} />
            </div>
            <div
              className="floaty2 absolute flex items-start rounded-[22px] p-5"
              style={{ left: -14, bottom: -26, width: 200, background: "rgb(250,249,252)", boxShadow: "inset 0 0 0 1px rgba(196,198,207,.3),0 18px 38px rgba(10,22,40,.3)" }}
            >
              <span className="font-ui italic" style={{ color: INK, fontSize: 14, lineHeight: 1.55 }}>
                &quot;A space that honors the artistry of my work.&quot;
              </span>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div className="relative z-[3] overflow-hidden flex items-center" style={{ height: 34, background: GOLD }}>
          <div className="marq">
            {[0, 1].map(i => (
              <span key={i} className="font-ui text-white pr-[.29em]" style={{ fontSize: 13, letterSpacing: ".26em" }}>
                SALON · WELLNESS · SPA · Private Suites · Premium Amenities · Flexible Leasing · Client-Friendly Location ·{" "}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ───────────────────────────────── */}
      <section id="m-philosophy" className="relative" style={{ background: "rgb(243,236,220)" }}>
        <div className="mx-auto w-full max-w-[520px] px-6 pt-16 pb-14">
          <MEyebrow>OUR PHILOSOPHY</MEyebrow>
          <motion.h2 {...rev} className="font-editorial font-normal" style={{ margin: "16px 0 0", color: INK, fontSize: "clamp(26px,7.5vw,32px)", lineHeight: 1.14 }}>
            A refined space for professionals who care deeply about their work.
          </motion.h2>
          <motion.p {...rev} className="font-ui font-normal" style={{ margin: "20px 0 0", color: BODY, fontSize: 15, lineHeight: 1.65 }}>
            LUXYN was founded on the belief that environment dictates energy. We provide more than four walls — a curated atmosphere designed to enhance the client experience and support your growth with architectural elegance.
          </motion.p>
          <motion.div {...rev} className="flex flex-col gap-2 mt-7" style={{ borderTop: "1px solid rgba(196,198,207,.6)", borderBottom: "1px solid rgba(196,198,207,.6)", padding: "16px 0" }}>
            <span className="font-ui font-semibold italic" style={{ color: INK, fontSize: 15.5, lineHeight: 1.55 }}>
              &quot;Luxyn has completely transformed how my clients perceive my brand.&quot;
            </span>
            <span className="font-ui font-semibold" style={{ color: BODY, fontSize: 11.5, letterSpacing: 1.6 }}>— SARAH J., MASTER COLORIST</span>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 mt-9">
            {["/assets/about-2.png", "/assets/about-1.png"].map((img) => (
              <motion.div
                key={img} {...rev}
                className="w-full overflow-hidden"
                style={{ aspectRatio: "3 / 4", borderRadius: ARCH, background: `url(${img}) 50% 50%/cover no-repeat` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVERSE ARTISTRY ─────────────────────────── */}
      <section id="m-gallery" className="relative" style={{ background: "rgb(251,248,241)" }}>
        <div className="mx-auto w-full max-w-[560px] px-6 pt-16 pb-14">
          <MEyebrow center>DIVERSE ARTISTRY</MEyebrow>
          <motion.h2 {...rev} className="font-display font-semibold text-center mx-auto" style={{ margin: "10px auto 0", maxWidth: 420, color: "rgb(33,58,92)", fontSize: "clamp(28px,8.4vw,38px)", lineHeight: 1.05 }}>
            A space for independent beauty &amp; wellness professionals.
          </motion.h2>
          {/* 2-col grid with explicit row-span to balance column heights and eliminate empty space */}
          <div className="mt-10" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {/* Row 1-2: left = tall Estheticians, right = stacked Colorists + Hair Stylists */}
            <motion.div {...rev} className="relative overflow-hidden rounded-[22px]" style={{ gridRow: "1 / 3", minHeight: 320 }}>
              <div className="absolute inset-0" style={{ background: `url(/assets/gallery-1.png) 41.808% 8.108%/634.711% 218.337% no-repeat` }} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ height: "50%", padding: "0 10px 16px", background: "linear-gradient(to top,rgba(28,18,8,.82) 0%,rgba(28,18,8,0) 100%)" }}>
                <span className="font-accent text-white text-center" style={{ fontSize: 11, letterSpacing: 2.4 }}>Estheticians</span>
              </div>
            </motion.div>
            <motion.div {...rev} className="relative overflow-hidden rounded-[22px]" style={{ minHeight: 150 }}>
              <div className="absolute inset-0" style={{ background: `url(/assets/gallery-2.png) 49.597% 81.944%/366.587% 272.34% no-repeat` }} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ height: "55%", padding: "0 10px 14px", background: "linear-gradient(to top,rgba(28,18,8,.82) 0%,rgba(28,18,8,0) 100%)" }}>
                <span className="font-accent text-white text-center" style={{ fontSize: 11, letterSpacing: 2.4 }}>Colorists</span>
              </div>
            </motion.div>
            <motion.div {...rev} className="relative overflow-hidden rounded-[22px]" style={{ minHeight: 150 }}>
              <div className="absolute inset-0" style={{ background: `url(/assets/gallery-2.png) 7.79% 7.154%/355.556% 268.766% no-repeat` }} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ height: "55%", padding: "0 10px 14px", background: "linear-gradient(to top,rgba(28,18,8,.82) 0%,rgba(28,18,8,0) 100%)" }}>
                <span className="font-accent text-white text-center" style={{ fontSize: 11, letterSpacing: 2.4 }}>Hair Stylists</span>
              </div>
            </motion.div>

            {/* Row 3-4: left = stacked Brow & Lash + Nail Artists, right = tall Massage & Wellness */}
            <motion.div {...rev} className="relative overflow-hidden rounded-[22px]" style={{ minHeight: 150 }}>
              <div className="absolute inset-0" style={{ background: `url(/assets/gallery-1.png) 16.764% 94.851%/447.813% 358.042% no-repeat` }} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ height: "55%", padding: "0 10px 14px", background: "linear-gradient(to top,rgba(28,18,8,.82) 0%,rgba(28,18,8,0) 100%)" }}>
                <span className="font-accent text-white text-center" style={{ fontSize: 11, letterSpacing: 2.4 }}>Brow & Lash Artists</span>
              </div>
            </motion.div>
            <motion.div {...rev} className="relative overflow-hidden rounded-[22px]" style={{ gridRow: "3 / 5", minHeight: 320 }}>
              <div className="absolute inset-0" style={{ background: `url(/assets/gallery-2.png) 88.462% 8.602%/391.837% 274.531% no-repeat` }} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ height: "50%", padding: "0 10px 16px", background: "linear-gradient(to top,rgba(28,18,8,.82) 0%,rgba(28,18,8,0) 100%)" }}>
                <span className="font-accent text-white text-center" style={{ fontSize: 11, letterSpacing: 2.4 }}>Massage & Wellness</span>
              </div>
            </motion.div>
            <motion.div {...rev} className="relative overflow-hidden rounded-[22px]" style={{ minHeight: 150 }}>
              <div className="absolute inset-0" style={{ background: `url(/assets/gallery-2.png) 90% 81.364%/378.325% 281.319% no-repeat` }} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ height: "55%", padding: "0 10px 14px", background: "linear-gradient(to top,rgba(28,18,8,.82) 0%,rgba(28,18,8,0) 100%)" }}>
                <span className="font-accent text-white text-center" style={{ fontSize: 11, letterSpacing: 2.4 }}>Nail Artists</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THE LUXYN DIFFERENCE ─────────────────────── */}
      <section id="m-difference" className="relative" style={{ background: "rgb(244,238,225)" }}>
        <div className="mx-auto w-full max-w-[520px] px-6 pt-16 pb-14">
          <MEyebrow color="rgb(184,153,104)" center>THE LUXYN DIFFERENCE</MEyebrow>
          <motion.h2 {...rev} className="font-display font-semibold text-center" style={{ margin: "10px 0 0", color: "rgb(33,58,92)", fontSize: "clamp(30px,8.6vw,40px)", lineHeight: 1.05 }}>
            A sanctuary, not a rented room
          </motion.h2>
          <div className="flex flex-col gap-4 mt-10">
            {DIFF.map(({ icon, title, body }) => (
              <motion.div
                key={title} {...rev}
                className="flex gap-4 rounded-[16px] p-6"
                style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
              >
                <span className="shrink-0 mt-0.5" style={{ color: "rgb(33,58,92)" }}>{icon}</span>
                <div className="flex flex-col gap-2">
                  <span className="font-display font-semibold" style={{ color: "rgb(33,58,92)", fontSize: 21, lineHeight: 1.1 }}>{title}</span>
                  <span className="font-accent font-normal" style={{ color: "rgb(22,38,60)", opacity: .85, fontSize: 14, lineHeight: 1.55 }}>{body}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER ───────────────────────────────────── */}
      <section id="m-banner" className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: 380, background: NAVY }}>
        <div className="absolute inset-0" style={{ background: "url(/assets/cta-bg.png) center/cover no-repeat" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgb(20,35,59) 0%,rgba(45,79,127,.55) 55%,rgba(70,122,194,.15) 100%)" }} />
        <div className="relative z-[2] flex flex-col items-center gap-5 text-center px-7 py-16">
          <motion.h2 {...rev} className="m-0 font-display font-bold text-white" style={{ fontSize: "clamp(34px,10vw,52px)", lineHeight: 1.04 }}>
            Your suite. Your schedule. Your brand.
          </motion.h2>
          <motion.p {...rev} className="m-0 font-ui font-medium" style={{ maxWidth: 420, color: "rgb(255,220,164)", fontSize: 15, lineHeight: 1.55 }}>
            Create a space that feels like your own, serve clients with privacy, and grow your business inside a calm, elevated environment.
          </motion.p>
        </div>
      </section>

      {/* ── AMENITIES ────────────────────────────────── */}
      <section id="m-amenities" className="relative overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute pointer-events-none opacity-40" style={{ left: "50%", top: 0, transform: "translateX(-50%)", width: "150%", height: "100%", background: "url(/assets/amenities-illustration.png) center/cover no-repeat" }} />
        <div className="relative z-[2] mx-auto w-full max-w-[520px] px-6 pt-16 pb-16">
          <MEyebrow color="rgb(184,153,104)" center>AMENITIES</MEyebrow>
          <motion.h2 {...rev} className="font-display font-bold text-white text-center mx-auto" style={{ margin: "10px auto 0", maxWidth: 360, fontSize: "clamp(30px,8.6vw,40px)", lineHeight: 1.06 }}>
            Designed around comfort, care, and craft.
          </motion.h2>
          <div className="flex flex-col gap-4 mt-10">
            {AMEN.map(({ icon, title, body }) => (
              <motion.div
                key={title} {...rev}
                className="flex flex-col gap-3 rounded-[22px] bg-white p-7"
                style={{ boxShadow: "inset 0 0 0 1px rgba(196,198,207,.2)" }}
              >
                <span style={{ color: "rgb(198,155,95)" }}>{icon}</span>
                <span className="font-ui font-medium" style={{ color: INK, fontSize: 13.5, letterSpacing: 1.3 }}>{title}</span>
                <span className="font-ui font-normal" style={{ color: BODY, fontSize: 15, lineHeight: 1.6 }}>{body}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIND A PRO ───────────────────────────────── */}
      <section id="m-findpro" className="relative" style={{ background: "rgb(244,238,225)" }}>
        <div className="mx-auto w-full max-w-[520px] px-6 pt-16 pb-16 flex flex-col items-center text-center">
          <motion.div
            {...rev}
            className="relative"
            style={{ width: "70%", maxWidth: 280, aspectRatio: "1 / 1" }}
          >
            <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: ARCH, background: "url(/assets/findpro-a.png) center/cover no-repeat", boxShadow: "0 24px 50px rgba(20,35,59,.2)" }} />
            <div className="floaty absolute inset-0" style={{ background: "url(/assets/findpro-stylist.png) bottom center/contain no-repeat", filter: "drop-shadow(0 18px 28px rgba(20,35,59,.32))" }} />
          </motion.div>
          <div className="mt-9"><MEyebrow color="rgb(74,98,106)" center>FOR CLIENTS</MEyebrow></div>
          <motion.h2 {...rev} className="m-0 mt-3 font-display font-bold" style={{ color: INK, fontSize: "clamp(30px,8.6vw,40px)", lineHeight: 1.05 }}>
            Looking for a professional?
          </motion.h2>
          <motion.p {...rev} className="m-0 mt-4 font-ui font-normal" style={{ maxWidth: 400, color: BODY, fontSize: 15, lineHeight: 1.65 }}>
            Explore independent beauty and wellness professionals working from LUXYN.
          </motion.p>
          <motion.button
            {...rev}
            onClick={() => nav("gallery")}
            className="h-[50px] px-9 mt-7 rounded-full font-ui font-bold text-white transition-transform duration-300 active:scale-[.98]"
            style={{ fontSize: 13.5, letterSpacing: .5, background: NAVY }}
          >
            Find a Pro
          </motion.button>
        </div>
      </section>

      {/* ── READY CTA ────────────────────────────────── */}
      <section id="m-cta" className="relative overflow-hidden flex items-center justify-center" style={{ background: NAVY }}>
        <div className="absolute inset-0 opacity-25 overflow-hidden" style={{ background: "linear-gradient(180deg,rgb(20,35,59) 0%,rgb(55,96,161) 100%)" }}>
          {[1.0, 1.6, 2.2].map((s, i) => (
            <div key={i} className="absolute rounded-full" style={{ left: "50%", top: "120%", width: `${s * 100}vw`, height: `${s * 100}vw`, transform: "translate(-50%,-50%)", border: `1px solid rgba(255,255,255,${0.5 - i * 0.12})` }} />
          ))}
        </div>
        <div className="relative z-[2] flex flex-col items-center gap-5 text-center px-7 py-16">
          <motion.h2 {...rev} className="font-display font-bold text-white" style={{ fontSize: "clamp(30px,8.6vw,40px)", lineHeight: 1.08 }}>
            Ready to make LUXYN your new professional home?
          </motion.h2>
          <motion.p {...rev} className="font-ui font-normal" style={{ color: "rgba(255,255,255,.85)", maxWidth: 380, fontSize: 15, lineHeight: 1.6 }}>
            Book a private tour and explore available suites designed for your next chapter.
          </motion.p>
          <motion.div {...rev} className="flex flex-col gap-3 w-full max-w-[320px] mt-1">
            <button onClick={() => nav("findpro")} className="h-[50px] rounded-full font-bold text-[14px] transition-transform duration-300 active:scale-[.98]" style={{ background: GOLD, color: NAVY }}>Lease a Suite</button>
            <button onClick={() => nav("gallery")} className="h-[50px] rounded-full font-bold text-[14px] transition-transform duration-300 active:scale-[.98]" style={{ boxShadow: `inset 0 0 0 1px ${GOLD}`, color: GOLD }}>Book a Tour</button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <section id="m-footer" className="relative overflow-hidden" style={{ background: "linear-gradient(180deg,rgb(26,45,76) 40%,rgb(62,120,197) 100%)" }}>
        <div className="flex flex-col items-center px-6 pt-12 pb-8">
          <button onClick={() => nav("hero")} aria-label="Back to top" style={{ width: 150, height: 44, background: "url(/assets/logo.png) 50% 66.194%/146.25% 455.339% no-repeat" }} />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-7">
            {[
              { label: "Suites",            id: "gallery"    },
              { label: "For Professionals", id: "difference" },
              { label: "Find a Pro",        id: "findpro"    },
              { label: "Amenities",         id: "amenities"  },
              { label: "Contact",           id: "cta"        },
            ].map(({ label, id }) => (
              <button key={label} onClick={() => nav(id)} className="font-accent text-white/90 transition-colors duration-300 active:text-champagne" style={{ fontSize: 14 }}>
                {label}
              </button>
            ))}
          </div>
          <div className="w-full h-px my-8" style={{ background: "rgba(138,146,157,.6)" }} />
          <div className="mx-auto" style={{ width: 200, height: 60, background: "url(/assets/logo.png) 50% 60.271%/146.25% 699.668% no-repeat", opacity: .9 }} />
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-9">
            {["Privacy Policy", "Terms of Service", "Cookies Settings"].map(l => (
              <button key={l} className="font-ui text-white/80 transition-colors duration-300 active:text-white" style={{ fontSize: 13 }}>{l}</button>
            ))}
          </div>
          <span className="font-ui text-white/90 mt-4" style={{ fontSize: 13 }}>© 2026 LUXYN. All rights reserved.</span>
        </div>
      </section>

    </div>
  );
}
