import BlogIndexPage from "../../_components/BlogIndexPage";
import { blogIndexMetadata } from "../../_lib/blog";

// Dedicated, indexable blog index — own metadata, self-canonical, lists every
// article with CollectionPage/Blog JSON-LD.
export const metadata = blogIndexMetadata();

export default function Page() {
  return <BlogIndexPage />;
}
