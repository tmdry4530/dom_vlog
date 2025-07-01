"use client"

import { useEffect, useState } from "react"
import { incrementPostView } from "@/app/posts/[id]/actions"
import { simulateDbFetch } from "@/lib/db"

// This would typically be a Server Component fetching data
// For demonstration, we'll simulate client-side fetching and incrementing
export default function PostDetailPage({ params }: { params: { id: string } }) {
  const postId = params.id
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [postContent, setPostContent] = useState<any>(null) // Simulate post content

  useEffect(() => {
    const fetchAndIncrement = async () => {
      // Simulate fetching post content
      const content = {
        title: `게시물 제목 ${postId}`,
        date: "2023.01.01",
        category: "일반",
        fullContent: `이것은 게시물 ${postId}의 전체 내용입니다.`,
      }
      setPostContent(content)

      // Fetch current view count
      const currentViews = await simulateDbFetch(postId)
      setViewCount(currentViews)

      // Increment view count
      await incrementPostView(postId)
      // Optionally, refetch or update local state to show the new count
      setViewCount((prev) => (prev !== null ? prev + 1 : 1))
    }

    fetchAndIncrement()
  }, [postId])

  if (!postContent) {
    return <div className="flex-1 p-8 text-zinc-50">게시물 로딩 중...</div>
  }

  return (
    <main className="flex-1 p-8 relative max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-50">{postContent.title}</h1>
        <p className="text-sm text-zinc-400">
          {postContent.date} · {postContent.category}
        </p>
        {viewCount !== null && <p className="text-xs text-zinc-500 mt-2">조회수: {viewCount}</p>}
      </div>

      <div className="prose prose-invert text-zinc-300">
        <p>{postContent.fullContent}</p>
        {/* More post content here */}
      </div>
    </main>
  )
}
