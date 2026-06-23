import type { Metadata } from "next";
import SectionRedirect from "../../_components/SectionRedirect";
import { seoPages } from "../../_lib/content";

const page = seoPages.find((p) => p.slug === "salon-suites")!;

// Deep-link entry route — redirects to the matching home-page section, so it is
// canonical to "/" and kept out of the index (the home page is the real page).
export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <SectionRedirect anchor={page.homeAnchor} label={page.navLabel} />;
}
