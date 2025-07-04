import {
  getPostBySlug,
  getCommentsByPostId,
  getRelatedPosts,
} from "@/lib/db";
import PostView from "./post-view";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { processMarkdown } from "@/lib/markdown";

// This is a Server Component
export default async function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  if (!slug) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const processedContent = await processMarkdown(post.content || "");
  const postWithProcessedContent = { ...post, content: processedContent };

  const tagIds = post.tags?.map((t) => t.tags?.id).filter((id): id is number => id !== undefined) || [];
  const [comments, relatedPosts] = await Promise.all([
    getCommentsByPostId(post.id),
    getRelatedPosts(post.id, tagIds),
  ]);

  return (
    <PostView
      post={postWithProcessedContent}
      comments={comments}
      relatedPosts={relatedPosts}
      user={user}
    />
  );
}
