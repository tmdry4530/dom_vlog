"use server";

import { incrementPostView, deletePost } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function incrementViewAction(postId: string) {
  try {
    await incrementPostView(postId);
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
}

export async function deletePostAction(postId: string) {
  // In a real app, you'd want to add authorization checks here
  // to ensure the user is allowed to delete this post.
  const success = await deletePost(postId);
  if (success) {
    revalidatePath("/");
    redirect("/");
  }
  // Handle failure case if needed
}
