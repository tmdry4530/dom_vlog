import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // 만료된 경우 세션을 새로고침합니다. 서버 컴포넌트에 필요합니다.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 보호된 경로에 대한 접근 제어
  if (!session && request.nextUrl.pathname.startsWith('/posts/new')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 것을 제외한 모든 요청 경로와 일치시킵니다:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * Supabase에 접근하지 않는 경로는 제외하여 불필요한 미들웨어 실행을 방지합니다.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
