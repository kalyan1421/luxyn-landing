import type { MetadataRoute } from "next";
import { site } from "./_lib/site";
import { seoPages } from "./_lib/content";
import { blogPosts } from "./_lib/blog";

export const dynamic = "force-static";

/** Build-time stamp — kept as a fixed ISO date so the static export is
 *  deterministic. Bump this when the content meaningfully changes. */
const lastModified = "2026-06-25";

/** Key imagery surfaced to image search via the homepage entry. */
const homeImages = [
  "/assets/hero-bg.webp",
  "/assets/gallery-1.webp",
  "/assets/gallery-2.webp",
  "/assets/cta-bg.webp",
].map(p => `${site.url}${p}`);

export default function sitemap(): MetadataRoute.Sitemap {
  // The home page is the hub; each /slug is a dedicated, indexable SEO page for
  // one section (self-canonical), so they're all listed here.
  const sectionRoutes: MetadataRoute.Sitemap = seoPages.map(p => ({
    url: `${site.url}/${p.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // The blog index plus one entry per article, each stamped with its own
  // last-modified date so search engines see fresh, individually-dated content.
  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/blog`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    ...blogPosts.map(p => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.updated,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [
    { url: `${site.url}/`,        lastModified, changeFrequency: "monthly", priority: 1,   images: homeImages },
    ...sectionRoutes,
    ...blogRoutes,
    { url: `${site.url}/privacy`, lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${site.url}/terms`,   lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${site.url}/cookies`, lastModified, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
