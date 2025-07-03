"use server";

import { createClient } from "@/lib/supabase/server";
import { createPost } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPostAction(
  prevState: { message: string; slug?: string },
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "로그인이 필요합니다." };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    return { message: "제목과 내용은 필수입니다." };
  }

  const newPost = await createPost({
    title,
    content,
    author_id: user.id,
    status: "PUBLISHED",
  });

  if (!newPost) {
    return { message: "글 생성에 실패했습니다." };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${newPost.slug}`);
  
  return { message: "성공", slug: newPost.slug };
}
