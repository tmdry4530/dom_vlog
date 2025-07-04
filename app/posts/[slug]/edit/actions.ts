"use server";

import { updatePost } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updatePostAction(
  prevState: { message: string; postId?: number },
  formData: FormData
) {
  const postIdStr = formData.get("postId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tags = formData.get("tags") as string;

  if (!postIdStr || !title || !content) {
    return { message: "필수 필드가 누락되었습니다." };
  }

  const postId = parseInt(postIdStr, 10);
  if (isNaN(postId)) {
    return { message: "유효하지 않은 포스트 ID입니다." };
  }

  const tagNames = tags ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : [];

  // In a real app, you'd add authorization here to ensure the user can edit this post.
  const updatedPost = await updatePost(postId, {
    title,
    content,
    tagNames,
  });

  if (!updatedPost) {
    return { message: "글 수정에 실패했습니다." };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${updatedPost.id}`);

  return { message: "성공", postId: updatedPost.id };
}
