"use client";

import { useEffect } from "react";
import { E, S } from "../lib/dc";

/**
 * LUXYN landing page — recreated from the Claude Design handoff
 * (project/LUXYN Landing.dc.html). Inline styles are transcribed verbatim
 * (asset urls rebased to /assets/...). Anchored to the design's native 1440px
 * desktop width, centered, per the original.
 */
export default function Landing() {
  // smooth-scroll to a section (ports the design's `navClick`)
  const nav = (target: string) => {
    const el = document.getElementById(target);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: y < 0 ? 0 : y, behavior: "smooth" });
  };

  // scale page content to fit viewport width
  useEffect(() => {
    const apply = () => {
      const el = document.getElementById("pageRoot");
      if (!el) return;
      const scale = Math.min(1, window.innerWidth / 1440);
      el.style.zoom = String(scale);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // scroll-driven nav reveal, progress bar, parallax, back-to-top, scrollspy
  useEffect(() => {
    const spyIds = ["gallery", "difference", "findpro", "amenities", "footer"];
    const onScroll = () => {
      const y = window.scrollY || 0;
      const doc = document.documentElement;
      const dh = doc.scrollHeight - window.innerHeight || 1;
      const navbar = document.getElementById("navbar");
      const progress = document.getElementById("progress");
      const totop = document.getElementById("totop");
      const heroBg = document.getElementById("heroBg");
      const hero = document.getElementById("hero");
      if (progress)
        progress.style.width =
          Math.min(100, Math.max(0, (y / dh) * 100)) + "%";
      if (navbar) {
        const trigger = hero ? hero.offsetHeight - 90 : 600;
        if (y > trigger) navbar.classList.add("nav-show");
        else navbar.classList.remove("nav-show");
      }
      if (totop) {
        const on = y > 900;
        totop.style.opacity = on ? "1" : "0";
        totop.style.pointerEvents = on ? "auto" : "none";
        totop.style.transform = on ? "translateY(0)" : "translateY(12px)";
      }
      if (heroBg && y < window.innerHeight * 1.5) {
        heroBg.style.transform = "translate3d(0," + y * 0.28 + "px,0)";
      }
      let active: string | null = null;
      const probe = y + window.innerHeight * 0.36;
      spyIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (probe >= top && probe < top + el.offsetHeight) active = id;
      });
      document.querySelectorAll("[data-nav]").forEach((l) => {
        const link = l as HTMLElement;
        if (link.dataset.target === active) link.classList.add("active");
        else link.classList.remove("active");
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    requestAnimationFrame(onScroll);
    const t = setTimeout(onScroll, 160);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t);
    };
  }, []);

  return (
    <div style={S("position:relative")}>
      {/* scroll progress bar */}
      <div
        id="progress"
        style={S(
          "position:fixed;top:0;left:0;height:3px;width:0;background:rgb(194,160,107);z-index:120"
        )}
      ></div>

      {/* sticky nav */}
      <div
        id="navbar"
        style={S("position:fixed;top:0;left:0;width:100vw;z-index:110")}
      >
        <div
          className="nbinner"
          style={S(
            "width:100%;max-width:1440px;margin:0 auto;height:72px;padding:0 100px;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between"
          )}
        >
          <div
            data-target="hero"
            onClick={() => nav("hero")}
            style={S(
              "width:150px;height:44px;cursor:pointer;background:url(/assets/logo.png) 51.02% 65.351%/119.522% 416.667% no-repeat"
            )}
          ></div>
          <div
            className="nblinks"
            style={S("display:flex;align-items:center;gap:34px")}
          >
            <span className="navlink" data-nav="1" data-target="gallery" onClick={() => nav("gallery")}>
              Suites
            </span>
            <span className="navlink" data-nav="1" data-target="difference" onClick={() => nav("difference")}>
              For Professionals
            </span>
            <span className="navlink" data-nav="1" data-target="findpro" onClick={() => nav("findpro")}>
              Find a Pro
            </span>
            <span className="navlink" data-nav="1" data-target="amenities" onClick={() => nav("amenities")}>
              Amenities
            </span>
            <span className="navlink" data-nav="1" data-target="footer" onClick={() => nav("footer")}>
              Contact
            </span>
          </div>
          <E
            data-target="cta"
            onClick={() => nav("cta")}
            css="height:40px;border-radius:333px;background:rgb(194,160,107);display:flex;align-items:center;justify-content:center;padding:0 24px;cursor:pointer;transition:transform .35s,box-shadow .35s,background .35s"
            hover="transform:translateY(-2px);box-shadow:0 12px 26px rgba(194,160,107,.45);background:rgb(206,173,120)"
          >
            <span style={S("font-family:'Inter',sans-serif;font-weight:700;font-size:13px;color:rgb(20,35,59);white-space:nowrap")}>
              Lease a Suite
            </span>
          </E>
        </div>
      </div>

      {/* back to top */}
      <div
        id="totop"
        data-target="hero"
        onClick={() => nav("hero")}
        style={S(
          "position:fixed;right:28px;bottom:28px;width:50px;height:50px;border-radius:50%;background:rgb(194,160,107);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:115;opacity:0;pointer-events:none;transform:translateY(12px);transition:opacity .4s,transform .4s,box-shadow .35s;box-shadow:0 10px 26px rgba(0,0,0,.3)"
        )}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(20,35,59)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"></path>
        </svg>
      </div>

      <div id="pageRoot" style={S("position:relative;width:1440px;margin:0 auto;font-family:'Inter',sans-serif")}>

        {/* ============ HERO ============ */}
        <section id="hero" data-screen-label="Hero" style={S("position:relative;width:1440px;height:775px;overflow:hidden;background:rgb(20,35,59);display:flex;align-items:center;justify-content:center")}>
          <div id="heroBg" style={S("position:absolute;left:0;top:-8%;width:1440px;height:124%;background:url(/assets/hero-bg.png) center/cover no-repeat;will-change:transform")}></div>
          <div style={S("position:absolute;inset:0;background:linear-gradient(110deg,rgba(20,35,59,.86) 0%,rgba(20,35,59,.45) 46%,rgba(20,35,59,.08) 70%)")}></div>

          {/* in-hero top bar */}
          <div style={S("position:absolute;left:100px;top:24px;width:1240px;height:50px;z-index:5")}>
            <E css="position:absolute;left:0;top:0;width:50px;height:50px;border-radius:333px;background:rgba(255,255,255,.1);backdrop-filter:blur(9.8px);box-shadow:inset 0 0 0 1px rgb(255,248,248);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .35s" hover="background:rgba(255,255,255,.22)">
              <svg width="22" height="16" viewBox="0 0 22 16" fill="rgb(255,255,255)">
                <path d="M1.571 0H9.429a1.6 1.6 0 0 1 0 3.2H1.571a1.6 1.6 0 0 1 0-3.2ZM12.571 12.8h7.858a1.6 1.6 0 0 1 0 3.2h-7.858a1.6 1.6 0 0 1 0-3.2ZM1.571 6.4h18.858a1.6 1.6 0 0 1 0 3.2H1.571a1.6 1.6 0 0 1 0-3.2Z"></path>
              </svg>
            </E>
            <E data-target="cta" onClick={() => nav("cta")} css="position:absolute;left:1104px;top:5px;height:40px;border-radius:333px;background:rgb(194,160,107);display:flex;align-items:center;justify-content:center;padding:0 24px;cursor:pointer;transition:transform .35s,box-shadow .35s,background .35s" hover="transform:translateY(-2px);box-shadow:0 12px 26px rgba(194,160,107,.45);background:rgb(206,173,120)">
              <span style={S("font-family:'Inter',sans-serif;font-weight:700;font-size:13px;color:rgb(20,35,59);white-space:nowrap")}>Lease a Suite</span>
            </E>
          </div>
          <div style={S("position:absolute;left:595px;top:24px;width:251px;height:72px;z-index:5;background:url(/assets/logo.png) 51.02% 65.351%/119.522% 416.667% no-repeat")}></div>

          {/* centered content */}
          <div style={S("position:relative;width:1440px;height:560px;z-index:4")}>
            <div style={S("position:absolute;left:182px;top:120px;width:513px")}>
              <E as="h1" className="rv" css="margin:0;width:513px;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:48px;line-height:1.0;color:rgb(255,255,255)">
                Space to do your best work.<br />A calm home for your craft.
              </E>
              <E as="p" className="rv" css="transition-delay:120ms;margin:18px 0 0;width:499px;font-family:'Inter',sans-serif;font-weight:400;font-size:12px;line-height:1.0;color:rgba(255,255,255,.4)">
                LUXYN leases private, design-led suites to independent beauty and wellness professionals — giving you the freedom to build, serve, and grow in an elevated space.
              </E>
              <E className="rv" css="transition-delay:240ms;margin-top:30px;display:flex;flex-direction:row;gap:12px;align-items:center">
                <E data-target="cta" onClick={() => nav("cta")} css="height:40px;border-radius:333px;background:rgb(194,160,107);display:flex;align-items:center;justify-content:center;padding:0 24px;cursor:pointer;transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s,background .35s" hover="transform:translateY(-2px);box-shadow:0 12px 26px rgba(194,160,107,.45);background:rgb(206,173,120)">
                  <span style={S("font-family:'Inter',sans-serif;font-weight:700;font-size:13px;color:rgb(20,35,59);white-space:nowrap")}>Lease a Suite</span>
                </E>
                <E data-target="findpro" onClick={() => nav("findpro")} css="height:40px;border-radius:333px;box-shadow:inset 0 0 0 1px rgb(194,160,107);display:flex;align-items:center;justify-content:center;padding:0 24px;cursor:pointer;transition:transform .35s,background .35s,box-shadow .35s" hover="transform:translateY(-2px);background:rgba(194,160,107,.14);box-shadow:inset 0 0 0 1px rgb(194,160,107),0 8px 20px rgba(194,160,107,.2)">
                  <span style={S("font-family:'Inter',sans-serif;font-weight:700;font-size:13px;color:rgb(194,160,107);white-space:nowrap")}>Book a Tour</span>
                </E>
              </E>
            </div>

            <E className="rv rv-s" css="transition-delay:200ms;position:absolute;left:787px;top:14px;width:456px;height:533px;border-radius:500px 500px 0 0;box-shadow:inset 0 0 0 5px rgb(184,153,104);padding:6px 39px 6px 0;box-sizing:border-box">
              <div className="floaty" style={S("position:absolute;left:0;top:6px;width:417px;height:521px;border-radius:500px 500px 0 0;background:rgb(238,237,241);box-shadow:inset 0 0 0 5px rgb(184,153,104);overflow:hidden")}>
                <div style={S("position:absolute;left:0;top:-6px;width:417px;height:533px;overflow:hidden;border-radius:3333px 3333px 0 0;background:linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)),url(/assets/hero-arch.png) 50% 0%/125% 132.27% no-repeat;box-shadow:inset 0 0 0 5px rgb(184,153,104)")}></div>
              </div>
              <div className="floaty2" style={S("position:absolute;left:-48px;top:338px;width:240px;height:143px;border-radius:32px;background:rgb(250,249,252);box-shadow:inset 0 0 0 1px rgba(196,198,207,.3),0 24px 48px rgba(10,22,40,.28);display:flex;align-items:flex-start;padding:32px")}>
                <span style={S("font-family:'Inter',sans-serif;font-style:italic;font-size:16px;line-height:25.6px;color:rgb(2,36,72)")}>&quot;A space that honors the artistry of my work.&quot;</span>
              </div>
            </E>
          </div>

          {/* marquee */}
          <div style={S("position:absolute;left:0;bottom:0;width:1440px;height:39px;overflow:hidden;background:rgb(194,160,107);display:flex;align-items:center;z-index:5")}>
            <div className="marq">
              <span style={S("font-family:'Inter',sans-serif;font-size:16px;letter-spacing:.29em;color:rgb(255,255,255);padding-right:.29em")}>SALON · WELLNESS · SPA · Private Suites · Premium Amenities · Flexible Leasing · Client-Friendly Location · </span>
              <span style={S("font-family:'Inter',sans-serif;font-size:16px;letter-spacing:.29em;color:rgb(255,255,255);padding-right:.29em")}>SALON · WELLNESS · SPA · Private Suites · Premium Amenities · Flexible Leasing · Client-Friendly Location · </span>
            </div>
          </div>
        </section>

        {/* ============ ABOUT / PHILOSOPHY ============ */}
        <section id="philosophy" data-screen-label="Philosophy" style={S("position:relative;width:1440px;min-height:775px;overflow:hidden;background:rgb(243,236,220)")}>
          <div style={S("position:absolute;left:144px;top:123px;width:466px")}>
            <E as="span" className="rv" css="display:block;font-family:'Inter',sans-serif;font-weight:600;font-size:12px;letter-spacing:1.8px;color:rgb(198,155,95)">OUR PHILOSOPHY</E>
            <E as="h2" className="rv" css="transition-delay:80ms;margin:26px 0 0;width:466px;font-family:'EB Garamond',serif;font-weight:400;font-size:32px;line-height:35.2px;color:rgb(2,36,72)">A refined space for professionals who care deeply about their work.</E>
            <E as="p" className="rv" css="transition-delay:160ms;margin:34px 0 0;width:466px;font-family:'Inter',sans-serif;font-weight:400;font-size:16px;line-height:25.6px;color:rgb(67,71,78)">LUXYN was founded on the belief that environment dictates energy. We provide more than just four walls; we provide a curated atmosphere designed to enhance the client experience and support your professional growth with architectural elegance.</E>
            <E className="rv" css="transition-delay:240ms;margin-top:34px;border:1px solid rgba(196,198,207,.5);padding:16px 0;display:flex;flex-direction:column;gap:8px">
              <span style={S("font-family:'Inter',sans-serif;font-weight:600;font-style:italic;font-size:16px;line-height:25.6px;color:rgb(2,36,72)")}>&quot;Luxyn has completely transformed how my clients perceive my brand.&quot;</span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:600;font-size:12px;letter-spacing:1.8px;color:rgb(67,71,78)")}>— SARAH J., MASTER COLORIST</span>
            </E>
          </div>
          <E className="rv rv-r" css="position:absolute;left:633px;top:155px;width:323px;height:530px">
            <E css="position:absolute;left:0;top:80px;width:323px;height:450px;overflow:hidden;border-radius:500px 500px 0 0;transition:transform .8s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-10px)">
              <E css="position:absolute;inset:0;background:url(/assets/about-2.png) 50% 50%/139.319% 100% no-repeat;transition:transform .9s cubic-bezier(.16,1,.3,1)" hover="transform:scale(1.06)"></E>
            </E>
          </E>
          <E className="rv rv-r" css="transition-delay:140ms;position:absolute;left:972px;top:155px;width:323px;height:450px">
            <E css="position:absolute;left:0;top:0;width:323px;height:450px;overflow:hidden;border-radius:500px 500px 0 0;transition:transform .8s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-10px)">
              <E css="position:absolute;inset:0;background:url(/assets/about-1.png) 50% 50%/139.319% 100% no-repeat;transition:transform .9s cubic-bezier(.16,1,.3,1)" hover="transform:scale(1.06)"></E>
            </E>
          </E>
        </section>

        {/* ============ DIVERSE ARTISTRY (GALLERY) ============ */}
        <section id="gallery" data-screen-label="Diverse Artistry" style={S("position:relative;width:1440px;min-height:775px;overflow:hidden;background:rgb(251,248,241)")}>
          <div style={S("position:absolute;left:299px;top:70px;width:843px;display:flex;flex-direction:column;align-items:center")}>
            <E as="span" className="rv" css="font-family:'Inter',sans-serif;font-weight:600;font-size:12px;letter-spacing:1.8px;color:rgb(198,155,95)">DIVERSE ARTISTRY</E>
            <E as="h2" className="rv" css="transition-delay:80ms;margin:10px 0 0;width:843px;text-align:center;font-family:'Cormorant Garamond',serif;font-weight:600;font-size:44px;line-height:1.0;color:rgb(33,58,92)">A space for independent beauty &amp; wellness professionals.</E>
          </div>
          <div style={S("position:absolute;left:106px;top:227px;width:1229px;height:483px;display:flex;flex-direction:row;gap:16px;align-items:flex-start")}>
            {/* tall left card */}
            <E className="rv rv-s gallery-card" css="width:228px;height:483px;border-radius:32px;overflow:hidden;background:#fff;position:relative">
              <E css="position:absolute;left:-5px;top:0;width:252px;height:488px;background:url(/assets/gallery-1.png) 41.808% 8.108%/634.711% 218.337% no-repeat;transition:transform .8s cubic-bezier(.16,1,.3,1)" hover="transform:scale(1.07)"></E>
              <div className="card-overlay" style={S("position:absolute;bottom:0;left:0;right:0;height:52%;background:linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,0) 100%);z-index:3;display:flex;align-items:flex-end;justify-content:center;padding:0 14px 24px")}>
                <span className="card-label" style={S("font-family:'Jost',sans-serif;font-weight:400;font-size:11px;letter-spacing:3px;color:#fff;text-align:center")}>Estheticians</span>
              </div>
            </E>
            <div style={S("width:985px;display:flex;flex-direction:column;gap:16px")}>
              <div style={S("display:flex;flex-direction:row;gap:16px;align-items:center")}>
                <E className="rv rv-s gallery-card" css="transition-delay:80ms;width:454px;height:231px;border-radius:32px;overflow:hidden;position:relative">
                  <E css="position:absolute;left:-17px;top:-96px;width:471px;height:416px;background:url(/assets/gallery-2.png) 7.79% 7.154%/355.556% 268.766% no-repeat;transition:transform .8s cubic-bezier(.16,1,.3,1)" hover="transform:scale(1.07)"></E>
                  <div className="card-overlay" style={S("position:absolute;bottom:0;left:0;right:0;height:55%;background:linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,0) 100%);z-index:3;display:flex;align-items:flex-end;justify-content:center;padding:0 14px 18px")}>
                    <span className="card-label" style={S("font-family:'Jost',sans-serif;font-weight:400;font-size:11px;letter-spacing:3px;color:#fff;text-align:center")}>Hair Stylists</span>
                  </div>
                </E>
                <E className="rv rv-s gallery-card" css="transition-delay:160ms;width:515px;height:231px;border-radius:32px;overflow:hidden;position:relative">
                  <E css="position:absolute;left:0;top:-244px;width:567px;height:508px;background:url(/assets/gallery-2.png) 49.597% 81.944%/366.587% 272.34% no-repeat;transition:transform .8s cubic-bezier(.16,1,.3,1)" hover="transform:scale(1.07)"></E>
                  <div className="card-overlay" style={S("position:absolute;bottom:0;left:0;right:0;height:55%;background:linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,0) 100%);z-index:3;display:flex;align-items:flex-end;justify-content:center;padding:0 14px 18px")}>
                    <span className="card-label" style={S("font-family:'Jost',sans-serif;font-weight:400;font-size:11px;letter-spacing:3px;color:#fff;text-align:center")}>Colorists</span>
                  </div>
                </E>
              </div>
              <div style={S("display:flex;flex-direction:row;gap:16px;align-items:flex-end")}>
                <E className="rv rv-s gallery-card" css="transition-delay:120ms;width:406px;height:230px;border-radius:32px;overflow:hidden;position:relative">
                  <E css="position:absolute;left:0;top:-89px;width:406px;height:339px;background:url(/assets/gallery-1.png) 16.764% 94.851%/447.813% 358.042% no-repeat;transition:transform .8s cubic-bezier(.16,1,.3,1)" hover="transform:scale(1.07)"></E>
                  <div className="card-overlay" style={S("position:absolute;bottom:0;left:0;right:0;height:55%;background:linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,0) 100%);z-index:3;display:flex;align-items:flex-end;justify-content:center;padding:0 14px 18px")}>
                    <span className="card-label" style={S("font-family:'Jost',sans-serif;font-weight:400;font-size:11px;letter-spacing:3px;color:#fff;text-align:center")}>Brow &amp; Lash Artists</span>
                  </div>
                </E>
                <E className="rv rv-s gallery-card" css="transition-delay:200ms;width:233px;height:227px;border-radius:32px;overflow:hidden;position:relative">
                  <E css="position:absolute;left:-10px;top:0;width:253px;height:227px;background:url(/assets/gallery-2.png) 90% 81.364%/378.325% 281.319% no-repeat;transition:transform .8s cubic-bezier(.16,1,.3,1)" hover="transform:scale(1.07)"></E>
                  <div className="card-overlay" style={S("position:absolute;bottom:0;left:0;right:0;height:55%;background:linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,0) 100%);z-index:3;display:flex;align-items:flex-end;justify-content:center;padding:0 14px 18px")}>
                    <span className="card-label" style={S("font-family:'Jost',sans-serif;font-weight:400;font-size:11px;letter-spacing:3px;color:#fff;text-align:center")}>Nail Artists</span>
                  </div>
                </E>
                <E className="rv rv-s gallery-card" css="transition-delay:280ms;width:314px;height:231px;border-radius:32px;overflow:hidden;position:relative">
                  <E css="position:absolute;left:-16px;top:-142px;width:392px;height:373px;background:url(/assets/gallery-2.png) 88.462% 8.602%/391.837% 274.531% no-repeat;transition:transform .8s cubic-bezier(.16,1,.3,1)" hover="transform:scale(1.07)"></E>
                  <div className="card-overlay" style={S("position:absolute;bottom:0;left:0;right:0;height:55%;background:linear-gradient(to top,rgba(28,18,8,.85) 0%,rgba(28,18,8,0) 100%);z-index:3;display:flex;align-items:flex-end;justify-content:center;padding:0 14px 18px")}>
                    <span className="card-label" style={S("font-family:'Jost',sans-serif;font-weight:400;font-size:11px;letter-spacing:3px;color:#fff;text-align:center")}>Massage &amp; Wellness</span>
                  </div>
                </E>
              </div>
            </div>
          </div>
        </section>

        {/* ============ THE LUXYN DIFFERENCE ============ */}
        <section id="difference" data-screen-label="Difference" style={S("position:relative;width:1440px;min-height:555px;overflow:hidden;background:rgb(244,238,225)")}>
          <div style={S("position:absolute;left:270px;top:61px;width:900px;display:flex;flex-direction:column;align-items:center;gap:12px")}>
            <E as="span" className="rv" css="font-family:'Jost',sans-serif;font-weight:600;font-size:13px;letter-spacing:4px;color:rgb(184,153,104)">THE LUXYN DIFFERENCE</E>
            <E as="span" className="rv" css="transition-delay:80ms;font-family:'Cormorant Garamond',serif;font-weight:600;font-size:44px;line-height:1.0;color:rgb(33,58,92)">A sanctuary, not a rented room</E>
          </div>
          <div style={S("position:absolute;left:120px;top:191px;width:1200px;display:flex;flex-direction:row;gap:24px;align-items:flex-start")}>
            <E className="rv" css="width:282px;height:276px;border-radius:12px;background:rgb(252,250,244);box-shadow:inset 0 0 0 1px rgb(225,216,194);padding:32px 26px;display:flex;flex-direction:column;gap:14px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:inset 0 0 0 1px rgb(225,216,194),0 22px 44px rgba(33,58,92,.14)">
              <span style={S("color:rgb(33,58,92)")}><svg width="32" height="34" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 25V10a10 10 0 0 1 20 0v15"></path><circle cx="12" cy="11" r="1.2" fill="currentColor" stroke="none"></circle></svg></span>
              <span style={S("font-family:'Cormorant Garamond',serif;font-weight:600;font-size:24px;line-height:1.0;color:rgb(33,58,92)")}>Design-led suites</span>
              <span style={S("opacity:.85;font-family:'Jost',sans-serif;font-weight:400;font-size:14.5px;line-height:1.5;color:rgb(22,38,60)")}>The most beautiful private suites in the category — finished to feel like a destination, not a cubicle.</span>
            </E>
            <E className="rv" css="transition-delay:90ms;width:282px;height:276px;border-radius:12px;background:rgb(252,250,244);box-shadow:inset 0 0 0 1px rgb(225,216,194);padding:32px 26px;display:flex;flex-direction:column;gap:14px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:inset 0 0 0 1px rgb(225,216,194),0 22px 44px rgba(33,58,92,.14)">
              <span style={S("color:rgb(33,58,92)")}><svg width="32" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 20c0-8 8-15 17-15 0 9-7 17-15 17a2 2 0 0 1-2-2Z"></path><path d="M5 19C9 14 13 11 17 8"></path></svg></span>
              <span style={S("font-family:'Cormorant Garamond',serif;font-weight:600;font-size:24px;line-height:1.0;color:rgb(33,58,92)")}>Wellness under one roof</span>
              <span style={S("opacity:.85;font-family:'Jost',sans-serif;font-weight:400;font-size:14.5px;line-height:1.5;color:rgb(22,38,60)")}>Hair, skin, nails, brows, massage and more — a full sensory experience for every client.</span>
            </E>
            <E className="rv" css="transition-delay:180ms;width:282px;height:276px;border-radius:12px;background:rgb(252,250,244);box-shadow:inset 0 0 0 1px rgb(225,216,194);padding:32px 26px;display:flex;flex-direction:column;gap:14px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:inset 0 0 0 1px rgb(225,216,194),0 22px 44px rgba(33,58,92,.14)">
              <span style={S("color:rgb(33,58,92)")}><svg width="32" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg></span>
              <span style={S("font-family:'Cormorant Garamond',serif;font-weight:600;font-size:24px;line-height:1.0;color:rgb(33,58,92)")}>Independence, supported</span>
              <span style={S("opacity:.85;font-family:'Jost',sans-serif;font-weight:400;font-size:14.5px;line-height:1.5;color:rgb(22,38,60)")}>Own your business and your hours. Lean on LUXYN for the front desk, upkeep, and marketing.</span>
            </E>
            <E className="rv" css="transition-delay:270ms;width:282px;height:276px;border-radius:12px;background:rgb(252,250,244);box-shadow:inset 0 0 0 1px rgb(225,216,194);padding:32px 26px;display:flex;flex-direction:column;gap:14px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:inset 0 0 0 1px rgb(225,216,194),0 22px 44px rgba(33,58,92,.14)">
              <span style={S("color:rgb(33,58,92)")}><svg width="32" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 19h18"></path><path d="M5 19a7 7 0 0 1 14 0"></path><path d="M12 8V5"></path><circle cx="12" cy="4" r="1.1" fill="currentColor" stroke="none"></circle></svg></span>
              <span style={S("font-family:'Cormorant Garamond',serif;font-weight:600;font-size:24px;line-height:1.0;color:rgb(33,58,92)")}>On-site care</span>
              <span style={S("opacity:.85;font-family:'Jost',sans-serif;font-weight:400;font-size:14.5px;line-height:1.5;color:rgb(22,38,60)")}>A real person on site every day to welcome your clients and keep your space effortless.</span>
            </E>
          </div>
        </section>

        {/* ============ YOUR SUITE BANNER ============ */}
        <section id="banner" data-screen-label="Banner" style={S("position:relative;width:1440px;height:550px;overflow:hidden;background:rgb(244,238,225);display:flex;align-items:center;justify-content:center")}>
          <div style={S("position:absolute;left:0;top:-15%;width:1440px;height:130%;background:url(/assets/cta-bg.png) center/cover no-repeat")}></div>
          <div style={S("position:absolute;inset:0;background:linear-gradient(0deg,rgb(20,35,59) 0%,rgba(45,79,127,.5) 50%,rgba(70,122,194,0) 100%)")}></div>
          <div style={S("position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:24px;max-width:760px;text-align:center;padding:0 40px")}>
            <E as="h2" className="rv" css="margin:0;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:72px;line-height:1.0;color:rgb(255,255,255)">Your suite. Your schedule. Your brand.</E>
            <E as="p" className="rv" css="transition-delay:140ms;margin:0;max-width:610px;font-family:'Inter',sans-serif;font-weight:500;font-size:16px;line-height:1.5;color:rgb(255,220,164)">Create a space that feels like your own, serve clients with privacy, and grow your business inside a calm, elevated environment.</E>
          </div>
        </section>

        {/* ============ AMENITIES ============ */}
        <section id="amenities" data-screen-label="Amenities" style={S("position:relative;width:1440px;height:835px;overflow:hidden;background:rgb(20,35,59);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:48px")}>
          <div style={S("position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:1550px;height:120%;opacity:.5;background:url(/assets/amenities-illustration.png) center/cover no-repeat;pointer-events:none")}></div>
          <div style={S("position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:16px")}>
            <E as="span" className="rv" css="font-family:'Jost',sans-serif;font-weight:600;font-size:13px;letter-spacing:4px;color:rgb(184,153,104)">AMENITIES</E>
            <E as="span" className="rv" css="transition-delay:80ms;width:448px;text-align:center;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:42px;line-height:1.0;color:rgb(255,255,255)">Designed around comfort, care, and craft.</E>
          </div>
          <div style={S("position:relative;z-index:2;width:1152px;display:grid;grid-template-columns:1fr 1fr 1fr;grid-auto-rows:250.78px;gap:24px")}>
            <E className="rv" css="border-radius:32px;background:#fff;box-shadow:inset 0 0 0 1px rgba(196,198,207,.2);padding:40px;display:flex;flex-direction:column;gap:15px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:0 26px 50px rgba(0,0,0,.28)">
              <span style={S("color:rgb(198,155,95)")}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="10" width="16" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg></span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:500;font-size:14px;letter-spacing:1.4px;color:rgb(2,36,72)")}>24/7 SECURE ACCESS</span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:400;font-size:16px;line-height:25.6px;color:rgb(67,71,78)")}>Your business, your hours. Complete autonomy with a state-of-the-art security system for peace of mind.</span>
            </E>
            <E className="rv" css="transition-delay:80ms;border-radius:32px;background:#fff;box-shadow:inset 0 0 0 1px rgba(196,198,207,.2);padding:40px;display:flex;flex-direction:column;gap:15px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:0 26px 50px rgba(0,0,0,.28)">
              <span style={S("color:rgb(198,155,95)")}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="3" width="16" height="18" rx="2"></rect><circle cx="12" cy="13" r="5"></circle><circle cx="7" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></svg></span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:500;font-size:14px;letter-spacing:1.4px;color:rgb(2,36,72)")}>ON-SITE LAUNDRY</span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:400;font-size:16px;line-height:25.6px;color:rgb(67,71,78)")}>Complimentary high-capacity laundry facilities designed to keep your workflow seamless and stress-free.</span>
            </E>
            <E className="rv" css="transition-delay:160ms;border-radius:32px;background:#fff;box-shadow:inset 0 0 0 1px rgba(196,198,207,.2);padding:40px;display:flex;flex-direction:column;gap:15px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:0 26px 50px rgba(0,0,0,.28)">
              <span style={S("color:rgb(198,155,95)")}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 9h12v5a5 5 0 0 1-10 0z"></path><path d="M17 10h2a2 2 0 0 1 0 5h-2"></path><path d="M8 4v2M11.5 3v2"></path></svg></span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:500;font-size:14px;letter-spacing:1.4px;color:rgb(2,36,72)")}>CLIENT LOUNGE</span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:400;font-size:16px;line-height:25.6px;color:rgb(67,71,78)")}>A sophisticated waiting area with specialty coffee and refreshments to delight your guests from arrival.</span>
            </E>
            <E className="rv" css="transition-delay:120ms;border-radius:32px;background:#fff;box-shadow:inset 0 0 0 1px rgba(196,198,207,.2);padding:40px;display:flex;flex-direction:column;gap:15px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:0 26px 50px rgba(0,0,0,.28)">
              <span style={S("color:rgb(198,155,95)")}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9a16 16 0 0 1 20 0"></path><path d="M5 12.5a11 11 0 0 1 14 0"></path><path d="M8.5 16a6 6 0 0 1 7 0"></path><circle cx="12" cy="19.5" r="1.1" fill="currentColor" stroke="none"></circle></svg></span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:500;font-size:14px;letter-spacing:1.4px;color:rgb(2,36,72)")}>HIGH-SPEED FIBER</span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:400;font-size:16px;line-height:25.6px;color:rgb(67,71,78)")}>Dedicated enterprise-grade Wi-Fi for seamless booking, processing, and social media management.</span>
            </E>
            <E className="rv" css="transition-delay:200ms;border-radius:32px;background:#fff;box-shadow:inset 0 0 0 1px rgba(196,198,207,.2);padding:40px;display:flex;flex-direction:column;gap:15px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:0 26px 50px rgba(0,0,0,.28)">
              <span style={S("color:rgb(198,155,95)")}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"></path></svg></span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:500;font-size:14px;letter-spacing:1.4px;color:rgb(2,36,72)")}>DAILY COMMON CARE</span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:400;font-size:16px;line-height:25.6px;color:rgb(67,71,78)")}>Professional cleaning of all shared areas ensures the facility always reflects your high standards.</span>
            </E>
            <E className="rv" css="transition-delay:280ms;border-radius:32px;background:#fff;box-shadow:inset 0 0 0 1px rgba(196,198,207,.2);padding:40px;display:flex;flex-direction:column;gap:15px;transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px);box-shadow:0 26px 50px rgba(0,0,0,.28)">
              <span style={S("color:rgb(198,155,95)")}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 14c-2.2 0-4 1.8-4 5 3.2 0 5-1.8 5-4"></path><path d="M19 3l2 2-9.5 9.5-2-2z"></path></svg></span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:500;font-size:14px;letter-spacing:1.4px;color:rgb(2,36,72)")}>CUSTOM BRANDING</span>
              <span style={S("font-family:'Inter',sans-serif;font-weight:400;font-size:16px;line-height:25.6px;color:rgb(67,71,78)")}>Paint and decorate your suite to match your brand&apos;s unique identity and professional aesthetic.</span>
            </E>
          </div>
        </section>

        {/* ============ FIND A PRO ============ */}
        <section id="findpro" data-screen-label="Find a Pro" style={S("position:relative;width:1440px;min-height:756px;overflow:hidden;background:rgb(244,238,225);display:flex;align-items:center")}>
          <E className="rv rv-l" css="position:absolute;left:144px;top:120px;width:516px;height:516px;border-radius:500px 500px 0 0;overflow:hidden;background:url(/assets/findpro-a.png) center/cover no-repeat;box-shadow:0 28px 60px rgba(20,35,59,.18);transition:transform .8s cubic-bezier(.16,1,.3,1),box-shadow .5s" hover="transform:translateY(-10px);box-shadow:0 40px 80px rgba(20,35,59,.28)"></E>
          <E className="rv rv-l floaty" css="transition-delay:120ms;position:absolute;left:172px;top:81px;width:460px;height:555px;background:url(/assets/findpro-stylist.png) bottom center/contain no-repeat;filter:drop-shadow(0 24px 36px rgba(20,35,59,.32));transition:transform .7s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-8px) scale(1.02)"></E>
          <div style={S("position:absolute;left:780px;top:250px;width:516px;display:flex;flex-direction:column;align-items:flex-start;gap:28px")}>
            <E as="span" className="rv" css="font-family:'Inter',sans-serif;font-weight:600;font-size:12px;letter-spacing:1.8px;color:rgb(74,98,106)">FOR CLIENTS</E>
            <E as="h2" className="rv" css="transition-delay:80ms;margin:0;width:516px;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:42px;line-height:1.0;color:rgb(2,36,72)">Looking for a professional?</E>
            <E as="p" className="rv" css="transition-delay:160ms;margin:0;width:516px;font-family:'Inter',sans-serif;font-weight:400;font-size:16px;line-height:25.6px;color:rgb(67,71,78)">Explore independent beauty and wellness professionals working from LUXYN.</E>
            <E className="rv" data-target="gallery" onClick={() => nav("gallery")} css="transition-delay:240ms;height:48px;border-radius:333px;background:rgb(20,35,59);display:flex;align-items:center;justify-content:center;padding:0 30px;cursor:pointer;transition:transform .35s,box-shadow .35s,background .35s,opacity 1.1s cubic-bezier(.16,1,.3,1)" hover="transform:translateY(-2px);box-shadow:0 14px 30px rgba(20,35,59,.32);background:rgb(30,50,80)">
              <span style={S("font-family:'Inter',sans-serif;font-weight:700;font-size:13px;letter-spacing:.5px;color:#fff;white-space:nowrap")}>Find a Pro</span>
            </E>
          </div>
        </section>

        {/* ============ READY CTA ============ */}
        <section id="cta" data-screen-label="Ready CTA" style={S("position:relative;width:1440px;height:448px;overflow:hidden;background:rgb(20,35,59);display:flex;align-items:center;justify-content:center")}>
          <div style={S("position:absolute;left:0;top:0;width:1440px;height:100%;opacity:.25;overflow:hidden;background:linear-gradient(180deg,rgb(20,35,59) 0%,rgb(55,96,161) 100%)")}>
            <div style={S("position:absolute;left:50%;top:118%;width:1100px;height:1100px;margin-left:-550px;margin-top:-550px;border-radius:50%;border:1px solid rgba(255,255,255,.5)")}></div>
            <div style={S("position:absolute;left:50%;top:118%;width:1450px;height:1450px;margin-left:-725px;margin-top:-725px;border-radius:50%;border:1px solid rgba(255,255,255,.42)")}></div>
            <div style={S("position:absolute;left:50%;top:118%;width:1800px;height:1800px;margin-left:-900px;margin-top:-900px;border-radius:50%;border:1px solid rgba(255,255,255,.32)")}></div>
            <div style={S("position:absolute;left:50%;top:118%;width:2150px;height:2150px;margin-left:-1075px;margin-top:-1075px;border-radius:50%;border:1px solid rgba(255,255,255,.22)")}></div>
          </div>
          <div style={S("position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:24px;max-width:1176px;text-align:center;padding:0 40px")}>
            <div style={S("display:flex;flex-direction:column;align-items:center;gap:16px")}>
              <E as="span" className="rv" css="text-align:center;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:42px;line-height:1.05;color:#fff">Ready to make LUXYN your new professional home?</E>
              <E as="span" className="rv" css="transition-delay:80ms;text-align:center;font-family:'Inter',sans-serif;font-weight:400;font-size:16px;line-height:1.0;color:#fff">Book a private tour and explore available suites designed for your next chapter.</E>
            </div>
            <E className="rv" css="transition-delay:160ms;display:flex;flex-direction:row;gap:12px;align-items:center">
              <E data-target="findpro" onClick={() => nav("findpro")} css="height:40px;border-radius:333px;background:rgb(194,160,107);display:flex;align-items:center;justify-content:center;padding:0 24px;cursor:pointer;transition:transform .35s,box-shadow .35s,background .35s" hover="transform:translateY(-2px);box-shadow:0 12px 26px rgba(194,160,107,.45);background:rgb(206,173,120)">
                <span style={S("font-family:'Inter',sans-serif;font-weight:700;font-size:13px;color:rgb(20,35,59);white-space:nowrap")}>Lease a Suite</span>
              </E>
              <E data-target="gallery" onClick={() => nav("gallery")} css="height:40px;border-radius:333px;box-shadow:inset 0 0 0 1px rgb(194,160,107);display:flex;align-items:center;justify-content:center;padding:0 24px;cursor:pointer;transition:transform .35s,background .35s,box-shadow .35s" hover="transform:translateY(-2px);background:rgba(194,160,107,.14);box-shadow:inset 0 0 0 1px rgb(194,160,107),0 8px 20px rgba(194,160,107,.2)">
                <span style={S("font-family:'Inter',sans-serif;font-weight:700;font-size:13px;color:rgb(194,160,107);white-space:nowrap")}>Book a Tour</span>
              </E>
            </E>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <section id="footer" data-screen-label="Footer" style={S("position:relative;width:1440px;min-height:624px;overflow:hidden;background:linear-gradient(180deg,rgb(26,45,76) 49.52%,rgb(62,120,197) 100%)")}>
          <div style={S("position:absolute;left:429px;top:35px;width:583px;display:flex;flex-direction:column;align-items:center;gap:26px")}>
            <div data-target="hero" onClick={() => nav("hero")} style={S("width:194px;height:63px;cursor:pointer;background:url(/assets/logo.png) 50% 66.194%/146.25% 455.339% no-repeat")}></div>
            <div style={S("display:flex;flex-direction:row;gap:48px;align-items:center")}>
              <E as="span" data-target="gallery" onClick={() => nav("gallery")} css="font-family:'Jost',sans-serif;font-size:14.5px;color:#fff;cursor:pointer;white-space:nowrap;transition:color .3s" hover="color:rgb(194,160,107)">Suites</E>
              <E as="span" data-target="difference" onClick={() => nav("difference")} css="font-family:'Jost',sans-serif;font-size:14.5px;color:#fff;cursor:pointer;white-space:nowrap;transition:color .3s" hover="color:rgb(194,160,107)">For Professionals</E>
              <E as="span" data-target="findpro" onClick={() => nav("findpro")} css="font-family:'Jost',sans-serif;font-size:14.5px;color:#fff;cursor:pointer;white-space:nowrap;transition:color .3s" hover="color:rgb(194,160,107)">Find a Pro</E>
              <E as="span" data-target="amenities" onClick={() => nav("amenities")} css="font-family:'Jost',sans-serif;font-size:14.5px;color:#fff;cursor:pointer;white-space:nowrap;transition:color .3s" hover="color:rgb(194,160,107)">Amenities</E>
              <E as="span" data-target="cta" onClick={() => nav("cta")} css="font-family:'Jost',sans-serif;font-size:14.5px;color:#fff;cursor:pointer;white-space:nowrap;transition:color .3s" hover="color:rgb(194,160,107)">Contact</E>
            </div>
          </div>
          <div style={S("position:absolute;left:0;top:223px;width:1440px;height:1px;background:rgb(138,146,157)")}></div>
          <E className="rv" css="position:absolute;left:0;top:268px;width:1440px;height:301px;background:url(/assets/logo.png) 50% 60.271%/146.25% 699.668% no-repeat"></E>
          <div style={S("position:absolute;left:80px;top:569px;width:1280px;display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start")}>
            <div style={S("display:flex;flex-direction:row;gap:24px")}>
              <E as="span" css="font-family:'Inter',sans-serif;font-size:14px;color:rgba(255,255,255,.85);cursor:pointer;transition:color .3s" hover="color:#fff">Privacy Policy</E>
              <E as="span" css="font-family:'Inter',sans-serif;font-size:14px;color:rgba(255,255,255,.85);cursor:pointer;transition:color .3s" hover="color:#fff">Terms of Service</E>
              <E as="span" css="font-family:'Inter',sans-serif;font-size:14px;color:rgba(255,255,255,.85);cursor:pointer;transition:color .3s" hover="color:#fff">Cookies Settings</E>
            </div>
            <span style={S("font-family:'Inter',sans-serif;font-size:16px;color:#fff")}>© 2026 LUXYN. All rights reserved.</span>
          </div>
        </section>

      </div>
    </div>
  );
}
