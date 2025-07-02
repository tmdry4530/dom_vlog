"use client";

import { useState } from "react";
import { BlogPostCard } from "@/components/blog-post-card";
import { ChevronUp, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PostWithDetails } from "@/types/database";
import { LoginDialog } from "@/components/login-dialog";

interface MainContentProps {
  posts: PostWithDetails[];
}

export function MainContent({ posts }: MainContentProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main className="flex-1 p-8 relative max-w-4xl mx-auto">
      <div className="flex justify-center items-center mb-8 relative">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-50">전체 글</h1>
          <p className="text-sm text-zinc-400">참돔이의 일기장</p>
        </div>
      </div>

      {/* 제목과 글 목록 사이 구분선 */}
      <Separator className="bg-zinc-700 mb-8" />

      <div className="space-y-0">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post.id}>
              <BlogPostCard
                title={post.title}
                date={new Date(
                  post.publishedAt || post.createdAt
                ).toLocaleDateString("ko-KR")}
                category={post.categories?.[0]?.category?.name || "미분류"}
                excerpt={post.excerpt || post.content.substring(0, 200) + "..."}
              />
              {/* 마지막 글이 아닌 경우에만 구분선 추가 */}
              {index < posts.length - 1 && (
                <Separator className="bg-zinc-700 my-6" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-zinc-400 py-12">
            <p>아직 작성된 글이 없습니다.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-8 right-8 space-x-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full w-12 h-12 bg-zinc-700 text-zinc-50 hover:bg-zinc-600 shadow-lg"
          onClick={() => setIsLoginOpen(true)}
        >
          <LogIn className="h-6 w-6" />
          <span className="sr-only">Login</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full w-12 h-12 bg-zinc-700 text-zinc-50 hover:bg-zinc-600 shadow-lg"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-6 w-6" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      </div>

      <LoginDialog isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </main>
  );
}
