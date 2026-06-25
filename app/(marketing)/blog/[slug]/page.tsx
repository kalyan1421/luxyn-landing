import BlogPostPage from "../../../_components/BlogPostPage";
import { blogPosts, blogPostMetadata, getPost } from "../../../_lib/blog";

// Statically generate one page per post at build time (required for `output:
// "export"`). dynamicParams=false makes any other /blog/* path a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return blogPostMetadata(slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostPage post={getPost(slug)} />;
}
