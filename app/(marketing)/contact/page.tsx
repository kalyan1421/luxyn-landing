import SeoSectionPage from "../../_components/SeoSectionPage";
import ContactPanel from "../../_components/ContactPanel";
import { seoPages, sectionMetadata } from "../../_lib/content";

// Dedicated, indexable contact page — own metadata + H1, self-canonical, with the
// enquiry form so leads convert straight from the focused page.
export const metadata = sectionMetadata("contact");

const page = seoPages.find((p) => p.slug === "contact")!;

export default function Page() {
  return (
    <SeoSectionPage page={page}>
      <ContactPanel />
    </SeoSectionPage>
  );
}
