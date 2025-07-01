"use server"

import { simulateDbUpdate } from "@/lib/db"

export async function incrementPostView(postId: string) {
  try {
    await simulateDbUpdate(postId)
    return { success: true, message: "View count incremented successfully." }
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return { success: false, message: "Failed to increment view count." }
  }
}
