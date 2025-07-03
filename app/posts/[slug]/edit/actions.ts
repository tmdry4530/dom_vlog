"use server";

import { updatePost } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updatePostAction(
  prevState: { message: string; slug?: string },
  formData: FormData
) {
  const postId = formData.get("postId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!postId || !title || !content) {
    return { message: "필수 필드가 누락되었습니다." };
  }

  // In a real app, you'd add authorization here to ensure the user can edit this post.
  const updatedPost = await updatePost(postId, {
    title,
    content,
  });

  if (!updatedPost) {
    return { message: "글 수정에 실패했습니다." };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${updatedPost.slug}`);

  return { message: "성공", slug: updatedPost.slug };
}
