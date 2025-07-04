import { getPostById } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditPostForm from "./edit-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  if (post.author_id !== user.id) {
    // Or show a more friendly "Unauthorized" page
    return <div className="flex-1 p-8 text-zinc-50">수정 권한이 없습니다.</div>;
  }

  return <EditPostForm post={post} />;
}
