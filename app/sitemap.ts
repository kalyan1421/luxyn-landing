import type { MetadataRoute } from "next";
import { site } from "./_lib/site";

export const dynamic = "force-static";

/** Build-time stamp — kept as a fixed ISO date so the static export is
 *  deterministic. Bump this when the content meaningfully changes. */
const lastModified = "2026-06-18";

/** Key imagery surfaced to image search via the homepage entry. */
const homeImages = [
  "/assets/hero-bg.webp",
  "/assets/gallery-1.webp",
  "/assets/gallery-2.webp",
  "/assets/cta-bg.webp",
].map(p => `${site.url}${p}`);

export default function sitemap(): MetadataRoute.Sitemap {
  // The site is a single indexable page; the /salon-suites, /gallery, … routes
  // are scroll deep-links (canonical to "/", noindex) and are intentionally
  // omitted here.
  return [
    { url: `${site.url}/`,        lastModified, changeFrequency: "monthly", priority: 1,   images: homeImages },
    { url: `${site.url}/privacy`, lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${site.url}/terms`,   lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${site.url}/cookies`, lastModified, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
