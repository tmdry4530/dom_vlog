"use server";

import { createClient } from "@/lib/supabase/server";
import { createPost } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPostAction(
  prevState: { message: string; postId?: number },
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
  const tags = formData.get("tags") as string;
  const slug = formData.get("slug") as string;

  if (!title || !content) {
    return { message: "제목과 내용은 필수입니다." };
  }

  const tagNames = tags ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : [];

  const newPost = await createPost({
    title,
    content,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎ가-힣]/g, '-').replace(/-+/g, '-').slice(0, 60),
    author_id: user.id,
    status: "PUBLISHED",
    tagNames,
  });

  if (!newPost) {
    return { message: "글 생성에 실패했습니다." };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${newPost.slug}`);
  
  return { message: "성공", postId: newPost.slug };
}
