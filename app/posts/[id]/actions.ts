"use server";

import { incrementPostView } from "@/lib/db";

export async function incrementViewAction(postId: string) {
  try {
    const success = await incrementPostView(postId);
    return { success };
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return { success: false, error: "Failed to increment view count" };
  }
}
