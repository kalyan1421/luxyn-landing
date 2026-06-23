/**
 * Shared navigation config + scroll helper used by SiteHeader and SiteFooter so
 * the chrome is identical on every page. Section links point at home-page
 * anchors (/#philosophy, …) which work from anywhere: on the home page they
 * smooth-scroll, and from another page they navigate home and then scroll.
 */

/** Primary menu (the glass overlay in the header). */
export const NAV = [
  { label: "Suites",            anchor: "philosophy" },
  { label: "Amenities",         anchor: "amenities"  },
  { label: "For Professionals", anchor: "difference" },
  { label: "Gallery",           anchor: "gallery"    },
  { label: "Find a Pro",        anchor: "findpro"    },
  { label: "FAQ",               anchor: "faq"        },
  { label: "Contact",           anchor: "contact"    },
] as const;

/** Legal/utility links shown in the footer. */
export const LEGAL = [
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms of Service", href: "/terms"   },
  { label: "Cookie Policy",    href: "/cookies" },
] as const;

export const YEAR = 2026;
export const VELVO_URL = "https://velvomedia.com";

/** Offset that matches the fixed header height so scrolled-to sections aren't
 *  hidden underneath it. */
export const SCROLL_OFFSET = 64;

/** Smooth-scroll to a section id. Returns false if it isn't on this page, so
 *  callers can fall back to normal link navigation. */
export function scrollToId(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  window.scrollTo({
    top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET),
    behavior: "smooth",
  });
  return true;
}
