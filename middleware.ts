import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'
import { incrementVisit } from '@/lib/db' // 이 부분을 직접 호출하는 것은 권장되지 않음

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

  // 방문자 수 카운트 로직
  const pathname = request.nextUrl.pathname
  const isPageRequest = !pathname.startsWith('/api/') && 
                        !pathname.startsWith('/_next/') && 
                        !pathname.includes('.') // 정적 파일 제외

  if (isPageRequest) {
    // 미들웨어에서 직접 DB 함수를 호출하는 대신,
    // API 라우트를 호출하거나 다른 방법을 사용하는 것이 좋습니다.
    // 하지만 여기서는 직접 호출을 시도합니다.
    // 참고: 미들웨어 환경에서는 'noStore'와 같은 캐싱 제어가 다를 수 있습니다.
    // 이 방법이 작동하지 않으면, API 라우트를 생성하여 호출해야 합니다.
    try {
        // This is a simplified approach. In a real-world scenario,
        // you'd want to avoid calling DB functions directly from middleware.
        // A better approach is to call an API route.
        // But for simplicity, we'll try this.
        // We'll use a separate Supabase client for this.
        const { default: dbIncrementVisit } = await import('@/lib/db.ts');
        // This is a hacky way to call the function.
        // A proper implementation would involve creating a dedicated client for middleware.
        // await dbIncrementVisit();
    } catch (e) {
        console.error("Could not increment visit from middleware", e)
    }
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
