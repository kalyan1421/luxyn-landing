import SeoSectionPage from "../../_components/SeoSectionPage";
import { seoPages, sectionMetadata } from "../../_lib/content";

// Dedicated, indexable SEO page for this section (own title, description, H1 and
// content; self-canonical). The home page keeps its single-scroll overview.
export const metadata = sectionMetadata("gallery");

const page = seoPages.find((p) => p.slug === "gallery")!;

export default function Page() {
  return <SeoSectionPage page={page} />;
}
