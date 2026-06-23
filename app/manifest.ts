import type { MetadataRoute } from "next";
import { site } from "./_lib/site";

export const dynamic = "force-static";

/** PWA / web app manifest — lets browsers add LUXYN to a home screen and feeds
 *  install metadata to search engines. Served at /manifest.webmanifest. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#142337",
    theme_color: "#142337",
    icons: [
      {
        src: site.logo, // 1200×1200 square brand mark
        sizes: "1200x1200",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
