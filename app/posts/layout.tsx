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

  // Create plain objects to pass to the client component
  const plainUser = user ? { id: user.id, email: user.email } : null;
  const plainCategories = JSON.parse(JSON.stringify(categories));
  const plainPopularPosts = JSON.parse(JSON.stringify(popularPosts));

  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-50">
      <Sidebar categories={plainCategories} popularPosts={plainPopularPosts} user={plainUser} />
      {children}
    </div>
  );
}
