import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Search, ArrowRight, ChevronRight, LinkIcon } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-800 p-6 hidden md:block">
      <div className="h-[calc(100vh-48px)] overflow-y-auto scrollbar-hide pr-4">
        {/* Rest of the content remains the same */}
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
          <h2 className="text-xl font-semibold text-zinc-50">참돔이의 일기장</h2>
          <p className="text-sm text-zinc-400">아기잠돔</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-zinc-400 text-sm mb-8">
          <div>
            <div className="text-lg font-bold text-zinc-50">385</div>
            <div>전체</div>
          </div>
          <div>
            <div className="text-lg font-bold text-zinc-50">0</div>
            <div>오늘</div>
          </div>
          <div>
            <div className="text-lg font-bold text-zinc-50">0</div>
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

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">분류 전체보기 (42)</h3>
          <nav className="space-y-2 text-zinc-400">
            <Link href="#" className="flex items-center justify-between text-sm hover:text-zinc-50">
              Computer Science (37)
            </Link>
            <Link href="#" className="flex items-center justify-between text-sm hover:text-zinc-50">
              Frontend (0)
            </Link>
            <Link href="#" className="flex items-center justify-between text-sm hover:text-zinc-50">
              Backend (0)
            </Link>
            <Link href="#" className="flex items-center justify-between text-sm hover:text-zinc-50">
              Blockchain (4)
              <ChevronRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>

        <Separator className="bg-zinc-700 my-6" />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">블로그 메뉴</h3>
          <nav className="space-y-2 text-zinc-400">
            <Link href="#" className="block text-sm hover:text-zinc-50">
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
            <Link href="#" className="flex items-center gap-2 text-sm hover:text-zinc-50">
              <LinkIcon className="h-4 w-4" />
              깃허브
            </Link>
            <Link href="#" className="flex items-center gap-2 text-sm hover:text-zinc-50">
              <LinkIcon className="h-4 w-4" />
              트위터
            </Link>
          </nav>
        </div>

        <Separator className="bg-zinc-700 my-6" />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">공지사항</h3>
          {/* Placeholder for notices */}
          <p className="text-sm text-zinc-500">공지사항이 없습니다.</p>
        </div>

        <Separator className="bg-zinc-700 my-6" />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">인기 글</h3>
          <nav className="space-y-2 text-zinc-400">
            <Link href="#" className="block text-sm hover:text-zinc-50">
              <div className="text-zinc-50">database - mysql</div>
              <div className="text-xs text-zinc-500">2023.09.19</div>
            </Link>
            <Link href="#" className="block text-sm hover:text-zinc-50">
              <div className="text-zinc-50">Mysql</div>
              <div className="text-xs text-zinc-500">2023.09.19</div>
            </Link>
            <Link href="#" className="block text-sm hover:text-zinc-50">
              <div className="text-zinc-50">조건문/반복문</div>
              <div className="text-xs text-zinc-500">2023.09.04</div>
            </Link>
            <Link href="#" className="block text-sm hover:text-zinc-50">
              <div className="text-zinc-50">연산자</div>
              <div className="text-xs text-zinc-500">2023.09.04</div>
            </Link>
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
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">최근 댓글</h3>
          {/* Placeholder for recent comments */}
          <p className="text-sm text-zinc-500">최근 댓글이 없습니다.</p>
        </div>
      </div>
    </aside>
  )
}
