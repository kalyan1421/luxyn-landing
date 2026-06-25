/**
 * Shared navigation config + scroll helpers used by SiteHeader, SiteFooter and
 * Landing so the chrome behaves identically on every page.
 *
 * The home page ("/") is a single-scroll landing whose header menu smooth-
 * scrolls between sections (no URL change). Each section also has its own
 * dedicated, indexable SEO page at /slug (see app/(marketing)/<slug>), rendered
 * from the SeoPage content in content.ts. SECTIONS is the single source of truth
 * mapping a section's home-page DOM id ↔ its URL slug ↔ its nav label.
 *
 * Header menu → scrolls the home page (navigating there first if needed via the
 * SCROLL_TARGET_KEY hand-off). Footer → links to the dedicated /slug SEO pages.
 */

export interface SectionRoute {
  /** The section's DOM id on the home page (e.g. "philosophy"). */
  id: string;
  /** The clean URL slug for that section (e.g. "salon-suites"). */
  slug: string;
  /** Label shown in the header/footer navigation. */
  label: string;
}

/** Primary menu — also the section↔slug map for clean-URL navigation. */
export const SECTIONS: SectionRoute[] = [
  { id: "philosophy", slug: "salon-suites",      label: "Suites" },
  { id: "amenities",  slug: "amenities",         label: "Amenities" },
  { id: "difference", slug: "for-professionals", label: "For Professionals" },
  { id: "gallery",    slug: "gallery",           label: "Gallery" },
  { id: "findpro",    slug: "find-a-pro",        label: "Find a Pro" },
  { id: "faq",        slug: "faq",               label: "FAQ" },
  { id: "contact",    slug: "contact",           label: "Contact" },
];

/** The header/footer menu renders from the same list. */
export const NAV = SECTIONS;

/** The blog is a real multi-page section (not a home-page scroll target), so it
 *  links straight to its own route from the header menu and footer. */
export const BLOG_LINK = { slug: "blog", label: "Blog", href: "/blog" } as const;

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

/** sessionStorage key for the cross-page hand-off: when a header menu link is
 *  clicked from a page other than the home page, the target section id is stored
 *  here and the browser navigates to "/", where Landing reads it and scrolls. */
export const SCROLL_TARGET_KEY = "luxyn:scrollTo";

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
