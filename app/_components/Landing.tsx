"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ContactForm, { type ContactVariant } from "./ContactForm";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { site, fullAddress } from "../_lib/site";
import { faqs, contentDates } from "../_lib/content";
import { SCROLL_TARGET_KEY } from "../_lib/nav";

/* ─── animation helpers ─────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;
const FU  = { hidden: { opacity: 0, y: 36 },  show: { opacity: 1, y: 0,    transition: { duration: 1,   ease } } };
const FS  = { hidden: { opacity: 0, scale:.9}, show: { opacity: 1, scale:1, transition: { duration: 1,   ease } } };
const FL  = { hidden: { opacity: 0, x: -48 }, show: { opacity: 1, x: 0,    transition: { duration: 1,   ease } } };
const FR  = { hidden: { opacity: 0, x:  48 }, show: { opacity: 1, x: 0,    transition: { duration: 1,   ease } } };
const vp  = { once: true, margin: "-10%" } as const;

function delay(d: number) {
  return { transition: { delay: d, duration: 1, ease } };
}

/* ─── difference cards ──────────────────────────────────── */
const DIFF = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 21V9a6 6 0 0 1 12 0v12" /><path d="M10 21v-5a2 2 0 0 1 4 0v5" /></svg>,
    title: "Design-led suites",
    body:  "The most beautiful private suites in the category — finished to feel like a destination, not a cubicle.",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C12 21 7 15 12 5C17 15 12 21 12 21Z"/><path d="M11 18C6 17 4 12 5 7C7 10 11 14 11 18Z"/><path d="M13 18C18 17 20 12 19 7C17 10 13 14 13 18Z"/></svg>,
    title: "Wellness under one roof",
    body:  "Hair, skin, nails, brows, massage and more — a full sensory experience for every client.",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M6 21c0-4 3-7 6-7s6 3 6 7" /></svg>,
    title: "Independence, supported",
    body:  "Own your business and your hours. Lean on LUXYN for the front desk, upkeep, and marketing.",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="M6 16c0-6 2-8 6-8s6 2 6 8" /><path d="M4 16h16" /><path d="M10 16a2 2 0 0 0 4 0" /></svg>,
    title: "On-site care",
    body:  "A real person on site every day to welcome your clients and keep your space effortless.",
  },
];

/* ─── amenity cards ─────────────────────────────────────── */
const AMEN = [
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M10 21V7h4v14"/><path d="M5 21h14"/></svg>,  title: "24/7 SECURE ACCESS",  body: "Your business, your hours. Complete autonomy with a state-of-the-art security system for peace of mind." },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8l-8 5h16z"/><path d="M12 8V6a2 2 0 0 1 2-2"/></svg>, title: "ON-SITE LAUNDRY",    body: "Complimentary high-capacity laundry facilities designed to keep your workflow seamless and stress-free." },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h8v7a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V6z"/><path d="M14 8h2a2 2 0 0 1 0 4h-2"/><path d="M4 20h12"/></svg>, title: "CLIENT LOUNGE",      body: "A sophisticated waiting area with specialty coffee and refreshments to delight your guests from arrival." },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="16" width="16" height="4" rx="1" /><path d="M7 16v-4" /><path d="M17 16v-4" /><path d="M9 8a3 3 0 0 1 6 0" /><path d="M12 12v.01" /></svg>, title: "HIGH-SPEED FIBER",    body: "Dedicated enterprise-grade Wi-Fi for seamless booking, processing, and social media management." },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v9" /><path d="M8 11h8v4H8z" /><path d="M8 15v5" /><path d="M12 15v5" /><path d="M16 15v5" /></svg>, title: "DAILY COMMON CARE",  body: "Professional cleaning of all shared areas ensures the facility always reflects your high standards." },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3l6 6-12 12H3v-6L15 3z" /><path d="M14 6l4 4" /><path d="M9 9l-6 6" /></svg>, title: "CUSTOM BRANDING",    body: "Paint and decorate your suite to match your brand's unique identity and professional aesthetic." },
];

/* ─── shared button styles ──────────────────────────────── */
const btnGold = "h-[40px] px-6 rounded-full font-bold text-[13px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(194,160,107,.45)] cursor-pointer";
const btnOutline = "h-[40px] px-6 rounded-full font-bold text-[13px] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer";

export default function Landing() {
  const [heroH,   setHeroH]     = useState(750);
  const [contactVariant, setContactVariant] = useState<ContactVariant>("lease");
  const heroRef  = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);

  /* smooth-scroll to an in-page section (header menu + in-page buttons). */
  const nav = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 64), behavior: "smooth" });
  };

  /* open the contact section pre-set to the right enquiry form */
  const openContact = (variant: ContactVariant) => { setContactVariant(variant); nav("contact"); };

  /* measure hero height once */
  useEffect(() => { if (heroRef.current) setHeroH(heroRef.current.offsetHeight); }, []);

  /* cross-page hand-off: when a header menu link is clicked from another page
     (a section SEO page or a legal page), it stores the target section and sends
     the visitor here. Scroll to it once, then clear the flag. */
  useEffect(() => {
    let id: string | null = null;
    try {
      id = sessionStorage.getItem(SCROLL_TARGET_KEY);
      if (id) sessionStorage.removeItem(SCROLL_TARGET_KEY);
    } catch { /* storage blocked — nothing to scroll to */ }
    if (!id) return;
    const target = id;
    const t = window.setTimeout(() => nav(target), 90);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* scroll effects — progress bar + hero parallax */
  useEffect(() => {
    const tick = () => {
      const dh = document.documentElement.scrollHeight - window.innerHeight || 1;
      const p = document.getElementById("prog");
      if (p) p.style.width = Math.min(100, (window.scrollY / dh) * 100) + "%";
      if (heroBgRef.current && window.scrollY < heroH * 1.5)
        heroBgRef.current.style.transform = `translate3d(0,${window.scrollY * 0.28}px,0)`;
    };
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, [heroH]);

  return (
    <div className="relative overflow-x-hidden">

      {/* ── skip to content (keyboard a11y) ──────────── */}
      <button className="skip-link" onClick={() => nav("hero")}>Skip to content</button>

      {/* ── progress bar ─────────────────────────────── */}
      <div id="prog" className="fixed top-0 left-0 h-[3px] bg-champagne z-[120]" style={{ width: 0, transition: "width .1s linear" }} />


      {/* ── site header (shared with the legal pages) ── */}
      <SiteHeader />

      {/* ═══════════════ PAGE ROOT ════════════ */}
      <div id="pageRoot" className="relative w-full overflow-x-hidden" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* ── HERO ───────────────────────────────────── */}
        <section
          ref={heroRef}
          id="hero"
          className="relative w-full overflow-hidden flex flex-col items-center justify-center lg:h-[100svh] lg:min-h-[700px] pt-36 pb-24 lg:pt-20 lg:pb-10"
          style={{ background: "rgb(20,35,59)" }}
        >
          {/* Real <img> (not a CSS background) so Googlebot-Image can crawl and
              index it — the LCP element, already preloaded in the layout head.
              eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={heroBgRef}
            src="/assets/hero-bg.webp"
            alt="Interior of a private, design-led LUXYN salon and wellness suite in Leander, TX"
            fetchPriority="high"
            decoding="async"
            className="absolute will-change-transform object-cover"
            style={{
              left: 0,
              top: "-15%",
              width: "100%",
              height: "130%",
              objectPosition: "50% 30%"
            }}
          />
          <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(110deg,rgba(20,35,59,.86) 0%,rgba(20,35,59,.45) 46%,rgba(20,35,59,.08) 70%)" }} />

          {/* hero content */}
          <div className="relative z-[4] w-full max-w-[1061px] px-6 lg:px-12 xl:px-0 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-16 lg:gap-8 xl:gap-24">
            {/* left copy */}
            <motion.div
              className="flex flex-col w-full lg:w-[45%] xl:w-[513px] shrink-0 mt-0 lg:mt-28"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13 } } }}
            >
              <motion.h1
                variants={FU}
                className="m-0 font-display font-medium text-white text-4xl sm:text-5xl lg:text-[52px]"
                style={{ lineHeight: 1.05, letterSpacing: "-0.01em" }}
              >
                Space to Do Your Best Work — Private Salon &amp; Wellness Suites in Leander, TX.
              </motion.h1>
              <motion.p
                variants={FU}
                className="font-ui font-normal text-white/40 mt-6 text-sm sm:text-[15px]"
                style={{ lineHeight: 1.6 }}
              >
                LUXYN leases private, design-led salon &amp; wellness suites in Leander, TX to independent beauty professionals — giving you the freedom to build, serve, and grow in an elevated space.
              </motion.p>
              <motion.div variants={FU} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mt-10">
                <button
                  onClick={() => openContact("lease")}
                  className={btnGold}
                  style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  LEASE A SUITE
                </button>
                <button
                  onClick={() => openContact("tour")}
                  className={btnOutline}
                  style={{ boxShadow: "inset 0 0 0 1px rgb(194,160,107)", color: "rgb(194,160,107)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  BOOK A TOUR
                </button>
              </motion.div>
            </motion.div>

            {/* right: arch + quote */}
            <motion.div
              className="relative w-full max-w-[420px] lg:max-w-none lg:w-[45%] xl:max-w-[456px] xl:w-[456px] shrink-0 flex justify-center items-center"
              style={{ aspectRatio: "456/533" }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="absolute pointer-events-none z-[1]"
                style={{
                  left: "6%", top: "3%", width: "88%", height: "94%",
                  borderRadius: "500px 500px 0 0",
                  border: "5px solid rgb(194,160,107)",
                }}
              />
              <div
                className="absolute z-[2]"
                style={{
                  left: "0%", top: "3%", width: "88%", height: "94%",
                  borderRadius: "500px 500px 0 0",
                  border: "5px solid rgb(194,160,107)",
                  overflow: "hidden"
                }}
              >
                <div
                  role="img"
                  aria-label="A beauty professional's styling space framed in a LUXYN arch suite"
                  className="absolute"
                  style={{
                    left: "-1.5%", top: "-1.5%", width: "103%", height: "103%",
                    borderRadius: "3333px 3333px 0 0",
                    background: "url(/assets/hero-arch.webp) 50% 0%/125% 132.27% no-repeat"
                  }}
                />
              </div>
              <div
                className="absolute flex flex-col justify-center rounded-[24px] z-[3]"
                style={{
                  left: "-5%", bottom: "10%", width: "55%", padding: "20px",
                  background: "rgb(255,255,255)",
                  boxShadow: "0 20px 40px rgba(10,22,40,.1)",
                }}
              >
                <span className="font-ui text-[rgb(20,35,59)] text-[12px] sm:text-[14px]" style={{ lineHeight: 1.6 }}>
                  &quot;A space that honors<br/>the artistry of my<br/>work.&quot;
                </span>
              </div>
            </motion.div>
          </div>

          {/* champagne marquee */}
          <div
            className="absolute left-0 bottom-0 w-full overflow-hidden flex items-center z-[5]"
            style={{ height: 39, background: "rgb(194,160,107)" }}
          >
            <div className="marq">
              {[0, 1].map(i => (
                <span key={i} className="font-ui text-white pr-[.29em] whitespace-nowrap" style={{ fontSize: 16, letterSpacing: ".29em" }}>
                  SALON · WELLNESS · SPA · Private Suites · Premium Amenities · Flexible Leasing · Client-Friendly Location ·{" "}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="philosophy" className="relative overflow-hidden w-full py-12 lg:py-20 flex justify-center" style={{ background: "rgb(243,236,220)" }}>
          <div className="w-full max-w-[1151px] px-6 lg:px-12 xl:px-0 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-8 xl:gap-6">
            <div className="flex flex-col w-full lg:w-[45%] xl:w-[466px] shrink-0 mx-auto lg:mx-0">
              <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
                className="block font-ui font-semibold text-[rgb(198,155,95)]"
                style={{ fontSize: 12, letterSpacing: 1.8 }}
              >
                OUR PHILOSOPHY
              </motion.span>
              <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
                className="font-editorial font-normal text-[rgb(2,36,72)] text-3xl sm:text-4xl lg:text-[34px]"
                style={{ margin: "26px 0 0", lineHeight: 1.1 }}
              >
                A refined space for professionals who care deeply about their work.
              </motion.h2>
              <motion.p initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.16)}
                className="font-ui font-normal text-[rgb(67,71,78)]"
                style={{ margin: "34px 0 0", fontSize: 16, lineHeight: 1.6 }}
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

            {/* arch images */}
            <div className="flex gap-4 sm:gap-[16px] justify-center items-center w-full lg:w-[50%] xl:w-[662px] shrink-0 mx-auto lg:mx-0">
              {/* arch image 1 */}
              <motion.div
                initial="hidden" whileInView="show" viewport={vp} variants={FR}
                className="relative group overflow-hidden shrink-0 mt-10 sm:mt-16 xl:mt-20"
                style={{ width: "48%", maxWidth: 323, aspectRatio: "323/450", borderRadius: "500px 500px 0 0" }}
              >
                <div
                  role="img" aria-label="Interior of a private, design-led LUXYN salon suite in Leander, TX"
                  className="absolute inset-0 transition-[transform] duration-[900ms] group-hover:-translate-y-[10px] group-hover:scale-[1.06]"
                  style={{ background: "url(/assets/about-2.webp) center/cover no-repeat", borderRadius: "500px 500px 0 0" }}
                />
              </motion.div>

              {/* arch image 2 */}
              <motion.div
                initial="hidden" whileInView="show" viewport={vp} variants={FR} {...delay(0.14)}
                className="relative group overflow-hidden shrink-0 mb-10 sm:mb-16 xl:mb-20"
                style={{ width: "48%", maxWidth: 323, aspectRatio: "323/450", borderRadius: "500px 500px 0 0" }}
              >
                <div
                  role="img" aria-label="A stylist's private suite at LUXYN, finished to feel like a destination"
                  className="absolute inset-0 transition-[transform] duration-[900ms] group-hover:-translate-y-[10px] group-hover:scale-[1.06]"
                  style={{ background: "url(/assets/about-1.webp) center/cover no-repeat", borderRadius: "500px 500px 0 0" }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── DIVERSE ARTISTRY ───────────────────────── */}
        <section id="gallery" className="relative overflow-hidden w-full py-12 lg:py-20 flex flex-col items-center" style={{ background: "rgb(251,248,241)" }}>
          <div className="flex flex-col items-center px-6" style={{ maxWidth: 843, marginBottom: 48 }}>
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="font-ui font-semibold text-[rgb(198,155,95)] text-center" style={{ fontSize: 12, letterSpacing: 1.8 }}
            >
              DIVERSE ARTISTRY
            </motion.span>
            <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
              className="font-display font-semibold text-[rgb(33,58,92)] text-center text-3xl sm:text-4xl lg:text-[46px]"
              style={{ margin: "10px 0 0", lineHeight: 1.1 }}
            >
              A space for independent beauty &amp; wellness professionals in Leander, TX.
            </motion.h2>
          </div>

          <div className="w-full max-w-[1229px] px-6 lg:px-12 xl:px-0 flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-4">
            {/* tall left */}
            <motion.div initial="hidden" whileInView="show" viewport={vp} variants={FS}
              className="gallery-card relative overflow-hidden flex-shrink-0 rounded-[32px] w-full h-[220px] lg:h-auto lg:w-[200px] xl:w-[228px]"
              style={{ background: "#fff" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full" style={{ aspectRatio: "228/483" }}>
                <div className="absolute transition-transform duration-[800ms] hover:scale-[1.07]" style={{ left: "-2.19%", top: "0%", width: "110.52%", height: "101.03%", background: "url(/assets/gallery-1.webp) 41.808% 8.108%/634.711% 218.337% no-repeat" }} />
              </div>
              <div className="card-overlay absolute inset-0 z-[3] flex items-end justify-center rounded-[32px]" style={{ padding: "0 14px 32px", background: "linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,.25) 100%)" }}>
                <span className="card-label font-display font-medium text-white text-center text-[15px] sm:text-[22px] tracking-[2px] sm:tracking-[4px]">Brow & Lash Artists</span>
              </div>
            </motion.div>

            <div className="flex flex-col gap-4 flex-1">
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4">
                {[
                  { smFlex: "sm:grow-[454] sm:basis-0", smAsp: "sm:aspect-[454/231]", asp: "454/231", bg:"url(/assets/gallery-2.webp) 7.79% 7.154%/355.556% 268.766% no-repeat", iL:"-3.74%", iT:"-41.56%", iW:"103.74%", iH:"180.09%", label:"Hair Stylists", d:0.08 },
                  { smFlex: "sm:grow-[515] sm:basis-0", smAsp: "sm:aspect-[515/231]", asp: "515/231", bg:"url(/assets/gallery-2.webp) 49.597% 81.944%/366.587% 272.34% no-repeat",  iL:"0%",   iT:"-105.63%",iW:"110.1%", iH:"219.91%", label:"Nail Artists",    d:0.16 },
                ].map(({ smFlex, smAsp, asp, bg, iL, iT, iW, iH, label, d }) => (
                  <motion.div key={label} initial="hidden" whileInView="show" viewport={vp} variants={FS} {...delay(d)}
                    className={`gallery-card relative overflow-hidden rounded-[32px] w-full h-[200px] sm:h-auto ${smAsp} ${smFlex}`}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full" style={{ aspectRatio: asp }}>
                      <div className="absolute transition-transform duration-[800ms] hover:scale-[1.07]" style={{ left: iL, top: iT, width: iW, height: iH, background: bg }} />
                    </div>
                    <div className="card-overlay absolute inset-0 z-[3] flex items-end justify-center rounded-[32px]" style={{ padding: "0 14px 32px", background: "linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,.25) 100%)" }}>
                      <span className="card-label font-display font-medium text-white text-center text-[15px] sm:text-[22px] tracking-[2px] sm:tracking-[4px]">{label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:flex md:flex-row gap-4 items-stretch lg:items-end">
                {[
                  { span: "",            mdFlex: "md:grow-[406] md:basis-0", mdAsp: "md:aspect-[406/230]", asp: "406/230", bg:"url(/assets/gallery-1.webp) 16.764% 94.851%/447.813% 358.042% no-repeat", iL:"0%",   iT:"-38.7%",  iW:"100%", iH:"147.39%", label:"Massage Therapists",  d:0.12 },
                  { span: "",            mdFlex: "md:grow-[233] md:basis-0", mdAsp: "md:aspect-[233/227]", asp: "233/227", bg:"url(/assets/gallery-2.webp) 90% 81.364%/378.325% 281.319% no-repeat",      iL:"-4.29%", iT:"0%",    iW:"108.58%", iH:"100%", label:"Wellness Practitioners",         d:0.20 },
                  { span: "col-span-2",  mdFlex: "md:grow-[314] md:basis-0", mdAsp: "md:aspect-[314/231]", asp: "314/231", bg:"url(/assets/gallery-2.webp) 88.462% 8.602%/391.837% 274.531% no-repeat",   iL:"-5.1%", iT:"-61.47%", iW:"124.84%", iH:"161.47%", label:"Estheticians",   d:0.28 },
                ].map(({ span, mdFlex, mdAsp, asp, bg, iL, iT, iW, iH, label, d }) => (
                  <motion.div key={label} initial="hidden" whileInView="show" viewport={vp} variants={FS} {...delay(d)}
                    className={`gallery-card relative overflow-hidden rounded-[32px] w-full h-[200px] md:h-auto ${span} ${mdAsp} ${mdFlex}`}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full" style={{ aspectRatio: asp }}>
                      <div className="absolute transition-transform duration-[800ms] hover:scale-[1.07]" style={{ left: iL, top: iT, width: iW, height: iH, background: bg }} />
                    </div>
                    <div className="card-overlay absolute inset-0 z-[3] flex items-end justify-center rounded-[32px]" style={{ padding: "0 14px 32px", background: "linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,.25) 100%)" }}>
                      <span className="card-label font-display font-medium text-white text-center text-[15px] sm:text-[22px] tracking-[2px] sm:tracking-[4px]">{label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── THE LUXYN DIFFERENCE ───────────────────── */}
        <section id="difference" className="relative overflow-hidden w-full pt-12 lg:pt-20 pb-8 lg:pb-12 flex flex-col items-center" style={{ background: "rgb(244,238,225)" }}>
          <div className="flex flex-col items-center px-6 mb-8 lg:mb-12 text-center max-w-[900px]">
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 13, letterSpacing: 4 }}
            >
              THE LUXYN DIFFERENCE
            </motion.span>
            <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
              className="m-0 font-display font-semibold text-[rgb(33,58,92)] text-3xl sm:text-4xl lg:text-[46px]" style={{ margin: "10px 0 0", lineHeight: 1.1 }}
            >
              A sanctuary, not a rented room
            </motion.h2>
          </div>
          <div className="w-full max-w-[1200px] px-6 lg:px-12 xl:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIFF.map(({ icon, title, body }, i) => (
              <motion.div
                key={title}
                initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(i * 0.09)}
                className="flex flex-col rounded-[8px] transition-[transform,box-shadow] duration-[400ms] cursor-default w-full p-6 lg:py-8 lg:px-7"
                style={{ background: "rgb(252,250,244)", boxShadow: "inset 0 0 0 1px rgb(225,216,194)" }}
                whileHover={{ y: -8, boxShadow: "inset 0 0 0 1px rgb(225,216,194), 0 22px 44px rgba(33,58,92,.08)" }}
              >
                <span className="text-[rgb(33,58,92)] mb-4 lg:mb-5 [&>svg]:w-[24px] [&>svg]:h-[24px] lg:[&>svg]:w-[28px] lg:[&>svg]:h-[28px]">{icon}</span>
                <span className="font-display font-bold text-[rgb(33,58,92)] text-[20px] lg:text-[24px] mb-2 lg:mb-3" style={{ lineHeight: 1.2 }}>{title}</span>
                <span className="font-ui font-normal opacity-80 text-[rgb(22,38,60)] text-[13.5px] lg:text-[14.5px]" style={{ lineHeight: 1.6 }}>{body}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ─────────────────────────────── */}
        <section id="banner" className="relative w-full overflow-hidden flex items-center justify-center pt-20 lg:pt-32 pb-12 lg:pb-16" style={{ background: "rgb(20,35,59)" }}>
          <div className="absolute" style={{ left: "-5%", top: "-10%", width: "110%", height: "130%", background: "url(/assets/cta-bg.webp) center/cover no-repeat" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgb(20,35,59) 0%,rgba(45,79,127,.5) 50%,rgba(70,122,194,0) 100%)" }} />
          <div className="relative z-[2] flex flex-col items-center gap-6 text-center" style={{ maxWidth: 760, padding: "0 24px" }}>
            <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="m-0 font-display font-bold text-white text-4xl sm:text-5xl lg:text-[72px]" style={{ lineHeight: 1.05 }}
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
        <section id="amenities" className="relative w-full pt-8 lg:pt-12 pb-12 lg:pb-20 flex flex-col items-center justify-center gap-12" style={{ background: "rgb(20,35,59)" }}>
          <div className="absolute opacity-50 pointer-events-none" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "110%", minWidth: 1000, height: "120%", background: "url(/assets/amenities-illustration.webp) center/cover no-repeat" }} />
          <div className="relative z-[2] flex flex-col items-center gap-4 px-6 text-center">
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 13, letterSpacing: 4 }}
            >
              AMENITIES
            </motion.span>
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
              className="font-display font-bold text-white text-center text-3xl sm:text-4xl lg:text-[44px]" style={{ maxWidth: 448, lineHeight: 1.1 }}
            >
              Designed around comfort, care, and craft.
            </motion.span>
          </div>
          <div className="relative z-[2] w-full max-w-[1240px] px-3 sm:px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
            {AMEN.map(({ icon, title, body }, i) => (
              <motion.div
                key={title}
                initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(i * 0.08)}
                className="flex flex-col justify-start rounded-[12px] sm:rounded-[24px] bg-white cursor-default p-3 sm:p-8"
                style={{ boxShadow: "inset 0 0 0 1px rgba(196,198,207,.3)" }}
                whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(20,35,59,.16)" }}
              >
                <span className="text-[rgb(198,155,95)] mb-2 sm:mb-6 [&>svg]:w-[20px] [&>svg]:h-[20px] sm:[&>svg]:w-[32px] sm:[&>svg]:h-[32px]">{icon}</span>
                <span className="font-ui font-medium text-[rgb(33,58,92)] uppercase text-[9.5px] sm:text-[13px] mb-1 sm:mb-4" style={{ letterSpacing: 1 }}>{title}</span>
                <span className="font-ui font-normal text-[rgb(67,71,78)] opacity-90 text-[10px] sm:text-[14.5px]" style={{ lineHeight: 1.45 }}>{body}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FIND A PRO ─────────────────────────────── */}
        <section id="findpro" className="relative overflow-hidden w-full py-12 lg:py-20 flex flex-col items-center justify-center" style={{ background: "rgb(244,238,225)" }}>
          <div className="w-full max-w-[1152px] px-6 lg:px-12 xl:px-0 flex flex-col-reverse lg:flex-row items-center justify-center gap-16 lg:gap-8 xl:gap-24">
            <div className="relative w-full lg:w-[45%] xl:w-[516px] shrink-0" style={{ aspectRatio: "516/590" }}>
              <motion.div
                initial="hidden" whileInView="show" viewport={vp} variants={FL}
                className="absolute overflow-hidden"
                style={{ left: "0%", top: "8.5%", width: "100%", height: "87.5%", borderRadius: "500px 500px 0 0", background: "url(/assets/findpro-a.webp) center/cover no-repeat", boxShadow: "0 28px 60px rgba(20,35,59,.18)" }}
                whileHover={{ y: -10, boxShadow: "0 40px 80px rgba(20,35,59,.28)" }}
              />
              <motion.div
                initial="hidden" whileInView="show" viewport={vp} variants={FL} {...delay(0.12)}
                className="absolute"
                style={{ left: "0%", top: "8.5%", width: "100%", height: "87.5%", clipPath: "inset(-50% -50% 0 -50%)", WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
              >
                <motion.div
                  className="absolute origin-bottom floaty"
                  style={{ left: "0%", bottom: "-5%", width: "100%", height: "120%", background: "url(/assets/findpro-stylist.webp) bottom center/contain no-repeat", filter: "drop-shadow(0 24px 36px rgba(20,35,59,.32))", willChange: "transform", WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }}
                  whileHover={{ y: -8, scale: 1.02 }}
                />
              </motion.div>
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-[45%] xl:w-[466px] shrink-0">
              <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
                className="block font-ui font-semibold text-[rgb(198,155,95)]" style={{ fontSize: 12, letterSpacing: 1.8 }}
              >
                FOR CLIENTS
              </motion.span>
              <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
                className="m-0 font-display font-semibold text-[rgb(33,58,92)] text-[28px] sm:text-[34px] lg:text-[42px]" style={{ margin: "20px 0 32px", lineHeight: 1.1 }}
              >
                Looking for a professional?
              </motion.h2>
              <motion.p initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.16)}
                className="m-0 font-ui font-normal text-[rgb(67,71,78)] text-[14px] sm:text-[16px] lg:text-[17px]" style={{ lineHeight: 1.6 }}
              >
                Explore independent beauty and wellness professionals working from LUXYN.
              </motion.p>
              <motion.button
                initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.24)}
                onClick={() => nav("gallery")}
                className="h-[52px] px-10 rounded-full font-ui font-bold text-white cursor-pointer transition-[transform,box-shadow,background] duration-300 hover:-translate-y-0.5 mt-8"
                style={{ fontSize: 15, letterSpacing: .5, background: "rgb(20,35,59)" }}
                whileHover={{ boxShadow: "0 14px 30px rgba(20,35,59,.32)" }}
              >
                FIND A PRO
              </motion.button>
            </div>
          </div>
        </section>

        {/* ── READY CTA ──────────────────────────────── */}
        <section id="cta" className="relative overflow-hidden w-full pt-24 lg:pt-32 pb-8 sm:pb-12 lg:pb-16 flex items-center justify-center" style={{ background: "rgb(26,45,76)" }}>
          <div className="absolute inset-0 overflow-hidden">
            {[
              { w: "w-[160vw] sm:w-[600px]", stroke: 5, opacity: 0.15 },
              { w: "w-[240vw] sm:w-[900px]", stroke: 4, opacity: 0.10 },
              { w: "w-[320vw] sm:w-[1200px]", stroke: 2, opacity: 0.07 }
            ].map(({ w, stroke, opacity }, i) => (
              <div key={i} className={`absolute rounded-full aspect-square ${w}`} style={{ left: "50%", top: "100%", transform: "translate(-50%, -30%)", border: `${stroke}px solid rgba(225,216,194,${opacity})` }} />
            ))}
          </div>
          <div className="relative z-[2] flex flex-col items-center gap-8 text-center" style={{ maxWidth: 1176, padding: "0 24px" }}>
            <div className="flex flex-col items-center gap-5">
              <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
                className="font-display font-normal text-white text-3xl sm:text-4xl lg:text-[44px]" style={{ lineHeight: 1.05 }}
              >
                Ready to make LUXYN your new professional home?
              </motion.span>
              <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
                className="font-ui font-normal" style={{ fontSize: 16, color: "rgba(255,255,255,0.85)" }}
              >
                Book a private tour and explore available suites designed for your next chapter.
              </motion.span>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.16)} className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto px-4 sm:px-0">
              <button onClick={() => openContact("lease")} className={`${btnGold} h-[48px] sm:h-[44px] px-4 sm:px-8 text-[13px] sm:text-[12px] tracking-wide w-full sm:w-auto flex items-center justify-center`} style={{ background: "rgb(194,160,107)", color: "rgb(20,35,59)", fontFamily: "var(--font-inter), sans-serif" }}>LEASE A SUITE</button>
              <button onClick={() => openContact("tour")} className={`${btnOutline} h-[48px] sm:h-[44px] px-4 sm:px-8 text-[13px] sm:text-[12px] tracking-wide w-full sm:w-auto flex items-center justify-center`} style={{ boxShadow: "inset 0 0 0 1px rgb(194,160,107)", color: "rgb(194,160,107)", fontFamily: "var(--font-inter), sans-serif" }}>BOOK A TOUR</button>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────── */}
        <section id="faq" className="relative overflow-hidden w-full py-12 lg:py-20 flex flex-col items-center" style={{ background: "rgb(251,248,241)" }}>
          <div className="flex flex-col items-center px-6 text-center" style={{ maxWidth: 760, marginBottom: 40 }}>
            <motion.span initial="hidden" whileInView="show" viewport={vp} variants={FU}
              className="font-accent font-semibold text-[rgb(184,153,104)]" style={{ fontSize: 13, letterSpacing: 4 }}
            >
              QUESTIONS &amp; ANSWERS
            </motion.span>
            <motion.h2 initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.08)}
              className="m-0 font-display font-semibold text-[rgb(33,58,92)] text-3xl sm:text-4xl lg:text-[44px]" style={{ margin: "10px 0 0", lineHeight: 1.1 }}
            >
              Renting a salon suite in Leander, TX
            </motion.h2>
            <motion.p initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(0.14)}
              className="font-ui text-[rgb(120,124,131)]" style={{ marginTop: 14, fontSize: 13, letterSpacing: 0.2 }}
            >
              Last updated {contentDates.updated}
            </motion.p>
          </div>

          <div className="w-full max-w-[820px] px-6 flex flex-col gap-3">
            {faqs.map(({ q, a }, i) => (
              <motion.details
                key={q}
                initial="hidden" whileInView="show" viewport={vp} variants={FU} {...delay(Math.min(i, 4) * 0.05)}
                className="group rounded-[14px] bg-white px-5 py-1 sm:px-7"
                style={{ boxShadow: "inset 0 0 0 1px rgb(232,224,205)" }}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none py-5 font-display font-semibold text-[rgb(2,36,72)] text-[18px] sm:text-[21px]" style={{ lineHeight: 1.3 }}>
                  {q}
                  <svg className="shrink-0 transition-transform duration-300 group-open:rotate-45" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgb(194,160,107)" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="font-ui font-normal text-[rgb(67,71,78)] pb-5 pr-6" style={{ fontSize: 15.5, lineHeight: 1.65 }}>
                  {a}
                </p>
              </motion.details>
            ))}
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────── */}
        <section id="contact" className="relative overflow-hidden w-full py-12 lg:py-20 flex justify-center" style={{ background: "rgb(243,236,220)" }}>
          <div className="w-full max-w-[1151px] px-6 lg:px-12 xl:px-0 flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-16">
            {/* intro + details */}
            <motion.div
              initial="hidden" whileInView="show" viewport={vp} variants={FL}
              className="flex flex-col w-full lg:w-[45%] xl:w-[488px] shrink-0"
            >
              <span className="block font-ui font-semibold text-[rgb(198,155,95)]" style={{ fontSize: 12, letterSpacing: 1.8 }}>
                GET IN TOUCH
              </span>
              <h2 className="m-0 font-display font-semibold text-[rgb(2,36,72)] text-3xl sm:text-4xl lg:text-[46px]" style={{ margin: "22px 0 0", lineHeight: 1.1 }}>
                {contactVariant === "tour" ? "Book a private tour." : "Reserve your suite at LUXYN."}
              </h2>
              <p className="font-ui font-normal text-[rgb(67,71,78)]" style={{ margin: "24px 0 0", fontSize: 16, lineHeight: 1.6 }}>
                {contactVariant === "tour"
                  ? "Pick a date and time that suits you. Our team will confirm your visit and walk you through the available suites in person."
                  : "Tell us about your craft and the space you envision. Our team will reach out to arrange a private tour and walk you through availability."}
              </p>
              <div className="flex flex-col gap-5 mt-9">
                <ContactLine type="email" />
                <ContactLine type="phone" />
                <ContactLine type="address" />
              </div>
            </motion.div>

            {/* form */}
            <motion.div
              initial="hidden" whileInView="show" viewport={vp} variants={FR} {...delay(0.12)}
              className="w-full lg:w-[50%] xl:w-[520px] shrink-0"
            >
              {/* intent switcher — keeps the two enquiry types distinct */}
              <div
                role="tablist" aria-label="Enquiry type"
                className="mb-5 flex gap-1.5 rounded-full p-1.5"
                style={{ background: "rgba(20,35,59,0.06)" }}
              >
                {([
                  { key: "lease", label: "Lease a suite" },
                  { key: "tour",  label: "Book a tour"   },
                ] as const).map(({ key, label }) => {
                  const active = contactVariant === key;
                  return (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setContactVariant(key)}
                      className="flex-1 h-[42px] rounded-full font-ui font-bold transition-all duration-300"
                      style={{
                        fontSize: 13, letterSpacing: 0.3,
                        background: active ? "rgb(20,35,59)" : "transparent",
                        color: active ? "rgb(225,216,194)" : "rgb(67,71,78)",
                        boxShadow: active ? "0 8px 20px rgba(20,35,59,.18)" : "none",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <ContactForm key={contactVariant} variant={contactVariant} />
            </motion.div>
          </div>
        </section>

      </div>{/* /pageRoot */}

      {/* ── site footer (shared with the legal pages) ── */}
      <SiteFooter />
    </div>
  );
}

/* ─── contact detail line (contact section + footer) ─────── */
const CONTACT_ICONS = {
  email: <path d="M3 5h18v14H3zM3 6l9 7 9-7" />,
  phone: <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" />,
  address: <><path d="M12 21s-7-6.4-7-11a7 7 0 0 1 14 0c0 4.6-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
};

function ContactLine({ type }: { type: "email" | "phone" | "address" }) {
  const data = {
    email:   { label: "EMAIL", value: site.contact.email, href: `mailto:${site.contact.email}` },
    phone:   { label: "CALL",  value: site.contact.phone, href: `tel:${site.contact.phoneHref}` },
    address: { label: "VISIT", value: fullAddress,        href: null as string | null },
  }[type];

  const value = data.href ? (
    <a href={data.href} className="font-ui text-[rgb(2,36,72)] text-[15.5px] transition-opacity duration-300 hover:opacity-70">{data.value}</a>
  ) : (
    <span className="font-ui text-[rgb(2,36,72)] text-[15.5px]">{data.value}</span>
  );

  return (
    <div className="flex items-start gap-3.5">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(198,155,95)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
        {CONTACT_ICONS[type]}
      </svg>
      <span className="flex flex-col gap-0.5">
        <span className="font-accent font-semibold text-[rgb(120,124,131)]" style={{ fontSize: 11, letterSpacing: 1.4 }}>{data.label}</span>
        {value}
      </span>
    </div>
  );
}

