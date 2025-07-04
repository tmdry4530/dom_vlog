"use server";

import { incrementPostView, deletePost, createComment } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function incrementViewAction(postId: number) {
  try {
    await incrementPostView(postId);
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
}

export async function deletePostAction(postId: number) {
  // In a real app, you'd want to add authorization checks here
  // to ensure the user is allowed to delete this post.
  const success = await deletePost(postId);
  if (success) {
    revalidatePath("/");
    redirect("/");
  }
  // Handle failure case if needed
}

export async function addCommentAction(
  prevState: { message: string },
  formData: FormData
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const content = formData.get("content") as string;
  const postIdStr = formData.get("postId") as string;
  const parentIdStr = formData.get("parentId") as string | undefined;
  const authorName = formData.get("authorName") as string | undefined;
  const authorEmail = formData.get("authorEmail") as string | undefined;

  if (!content || !postIdStr) {
    return { message: "내용과 게시글 ID는 필수입니다." };
  }

  const postId = parseInt(postIdStr, 10);
  if (isNaN(postId)) {
    return { message: "유효하지 않은 게시글 ID입니다." };
  }

  const parentId = parentIdStr ? parseInt(parentIdStr, 10) : undefined;
  
  if (!user && (!authorName || !authorEmail)) {
    return { message: "비로그인 시 이름과 이메일은 필수입니다." };
  }

  const newComment = await createComment({
    postId,
    content,
    parentCommentId: parentId,
    authorId: user?.id,
    authorName: user ? undefined : authorName,
    authorEmail: user ? undefined : authorEmail,
  });

  if (!newComment) {
    return { message: "댓글 작성에 실패했습니다." };
  }

  revalidatePath(`/posts/${postId}`);
  return { message: "댓글이 성공적으로 작성되었습니다." };
}
