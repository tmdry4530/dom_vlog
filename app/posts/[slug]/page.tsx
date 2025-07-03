import { getPostBySlug } from "@/lib/db";
import PostView from "./post-view";
import { createClient } from "@/lib/supabase/server";

// This is a Server Component
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    return <div className="flex-1 p-8 text-zinc-50">게시물을 찾을 수 없습니다.</div>;
  }

  return <PostView post={post} user={user} />;
}
