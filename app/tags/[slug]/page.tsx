import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import {
  getPostsByTagSlug,
  getAllCategories,
  getPopularPosts,
  getPostsCountByTagSlug,
} from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

const POSTS_PER_PAGE = 10;

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { slug } = await params;
  const { page } = await searchParams;
  
  const decodedSlug = decodeURIComponent(slug);
  const currentPage = Number(page) || 1;

  const [posts, totalPosts, categories, popularPosts] = await Promise.all([
    getPostsByTagSlug(decodedSlug, currentPage),
    getPostsCountByTagSlug(decodedSlug),
    getAllCategories(),
    getPopularPosts(),
  ]);

  if (!posts) {
    notFound();
  }

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const plainUser = user ? { id: user.id, email: user.email } : null;

  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-50">
      <Sidebar
        categories={categories}
        popularPosts={popularPosts}
        user={plainUser}
      />
      <MainContent
        posts={posts}
        title={`태그: ${decodedSlug}`}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
