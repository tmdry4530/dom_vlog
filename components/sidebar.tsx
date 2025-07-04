"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Pencil, Search, ArrowRight, LinkIcon } from "lucide-react";
import { CategoryWithStats, BlogPostSummary } from "@/types/database";

interface SidebarProps {
  categories: CategoryWithStats[];
  popularPosts: Partial<BlogPostSummary>[];
  user: { id: string; email?: string } | null;
  visitCounts?: { total: number; today: number; yesterday: number };
}

export function Sidebar({ categories, popularPosts, user, visitCounts }: SidebarProps) {
  const totalPosts =
    categories.reduce(
      (acc, category) => acc + (category.postCount || 0),
      0
    ) || 0;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-800 p-6 hidden md:block">
      <div className="h-[calc(100vh-48px)] overflow-y-auto scrollbar-hide pr-4">
        <div className="flex flex-col items-center text-center mb-8">
          <Avatar className="w-24 h-24 mb-4 bg-zinc-700">
            <AvatarFallback className="text-zinc-400 text-4xl">
              <span className="grid grid-cols-2 gap-1">
                <span className="w-2 h-2 bg-zinc-400 rounded-full" />
                <span className="w-2 h-2 bg-zinc-400 rounded-full" />
                <span className="w-2 h-2 bg-zinc-400 rounded-full" />
                <span className="w-2 h-2 bg-zinc-400 rounded-full" />
              </span>
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-zinc-50">
            참돔이의 일기장
          </h2>
          <p className="text-sm text-zinc-400">아기잠돔</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-zinc-400 text-sm mb-8">
          <div>
            <div className="text-lg font-bold text-zinc-50">{visitCounts?.total || totalPosts}</div>
            <div>전체</div>
          </div>
          <div>
            <div className="text-lg font-bold text-zinc-50">{visitCounts?.today || 0}</div>
            <div>오늘</div>
          </div>
          <div>
            <div className="text-lg font-bold text-zinc-50">{visitCounts?.yesterday || 0}</div>
            <div>어제</div>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="검색"
            className="w-full pl-9 pr-10 bg-zinc-700 border-zinc-600 text-zinc-50 placeholder:text-zinc-400"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-50"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {user && (
          <div className="mb-8 space-y-2">
            <Link href="/posts/new" passHref>
              <Button
                variant="outline"
                className="w-full border-zinc-600 bg-zinc-700 hover:bg-zinc-600 text-zinc-50"
              >
                <Pencil className="mr-2 h-4 w-4" />
                새 글 작성
              </Button>
            </Link>
            <form action="/api/auth/logout" method="post">
              <Button
                variant="ghost"
                className="w-full justify-start text-zinc-400 hover:text-zinc-50 px-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </form>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">
            분류 전체보기 ({totalPosts})
          </h3>
          <nav className="space-y-2 text-zinc-400">
            {categories.map((category) => (
              <Link
                href={`/category/${category.slug}`}
                key={category.id}
                className="flex items-center justify-between text-sm hover:text-zinc-50"
              >
                {category.name} ({category.postCount})
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="bg-zinc-700 my-6" />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">
            블로그 메뉴
          </h3>
          <nav className="space-y-2 text-zinc-400">
            <Link href="/" className="block text-sm hover:text-zinc-50">
              홈
            </Link>
            <Link href="#" className="block text-sm hover:text-zinc-50">
              태그
            </Link>
            <Link href="#" className="block text-sm hover:text-zinc-50">
              방명록
            </Link>
          </nav>
        </div>

        <Separator className="bg-zinc-700 my-6" />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">링크</h3>
          <nav className="space-y-2 text-zinc-400">
            <Link
              href="#"
              className="flex items-center gap-2 text-sm hover:text-zinc-50"
            >
              <LinkIcon className="h-4 w-4" />
              깃허브
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-sm hover:text-zinc-50"
            >
              <LinkIcon className="h-4 w-4" />
              트위터
            </Link>
          </nav>
        </div>

        <Separator className="bg-zinc-700 my-6" />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">
            공지사항
          </h3>
          {/* Placeholder for notices */}
          <p className="text-sm text-zinc-500">공지사항이 없습니다.</p>
        </div>

        <Separator className="bg-zinc-700 my-6" />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">인기 글</h3>
          <nav className="space-y-2 text-zinc-400">
            {popularPosts.map((post) => (
              <Link
                href={`/posts/${post.slug}`}
                key={post.id}
                className="block text-sm hover:text-zinc-50"
              >
                <div className="text-zinc-50">{post.title}</div>
                <div className="text-xs text-zinc-500">
                  {new Date(post.published_at!).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="bg-zinc-700 my-6" />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">태그</h3>
          {/* Placeholder for tags */}
          <p className="text-sm text-zinc-500">태그가 없습니다.</p>
        </div>

        <Separator className="bg-zinc-700 my-6" />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">
            최근 댓글
          </h3>
          {/* Placeholder for recent comments */}
          <p className="text-sm text-zinc-500">최근 댓글이 없습니다.</p>
        </div>
      </div>
    </aside>
  );
}
