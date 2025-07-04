import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import {
  getAllPosts,
  getAllCategories,
  getPopularPosts,
  getPostsCount,
  incrementVisit,
  getVisitCounts,
} from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const POSTS_PER_PAGE = 10;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await incrementVisit(); // 방문자 수 증가

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [posts, totalPosts, categories, popularPosts, visitCounts] =
    await Promise.all([
      getAllPosts(currentPage),
      getPostsCount(),
      getAllCategories(),
      getPopularPosts(),
      getVisitCounts(),
    ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const plainUser = user ? { id: user.id, email: user.email } : null;

  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-50">
      <Sidebar
        categories={categories}
        popularPosts={popularPosts}
        user={plainUser}
        visitCounts={visitCounts}
      />
      <MainContent
        posts={posts}
        title="전체 글"
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
