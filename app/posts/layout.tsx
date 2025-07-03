import { Sidebar } from "@/components/sidebar";
import { getAllCategories, getPopularPosts } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categories = await getAllCategories();
  const popularPosts = await getPopularPosts();

  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-50">
      <Sidebar categories={categories} popularPosts={popularPosts} user={user} />
      {children}
    </div>
  );
}
