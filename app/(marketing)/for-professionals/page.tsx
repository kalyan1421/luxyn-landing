import SeoSectionPage from "../../_components/SeoSectionPage";
import { seoPages, sectionMetadata } from "../../_lib/content";

// Dedicated, indexable SEO page for "The LUXYN Difference" (own title,
// description, H1 and content; self-canonical).
export const metadata = sectionMetadata("for-professionals");

const page = seoPages.find((p) => p.slug === "for-professionals")!;

export default function Page() {
  return <SeoSectionPage page={page} />;
}
