import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import { getAllPosts, getAllCategories, getPopularPosts } from "@/lib/db";

export default async function Home() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();
  const popularPosts = await getPopularPosts();

  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-50">
      <Sidebar categories={categories} popularPosts={popularPosts} />
      <MainContent posts={posts} />
    </div>
  );
}
