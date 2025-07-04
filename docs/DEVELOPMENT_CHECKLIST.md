# 🚀 개발 작업 우선순위 체크리스트

## 📊 현재 프로젝트 상태

- ✅ UI/UX 구현 완료
- ✅ 데이터베이스 스키마 설계 완료
- ⚠️ 실제 데이터베이스 연결 미구현 (시뮬레이션 상태)
- ⚠️ 프로토타입 단계

---

## 🔥 높은 우선순위 (즉시 구현 필요)

### 1. 실제 데이터베이스 연결 구현

- [x] Supabase 프로젝트 생성 및 설정 (📋 [가이드](SUPABASE_SETUP.md) 참조)
- [x] 환경 변수 설정 (.env.local)
- [x] 데이터베이스 마이그레이션 스크립트 실행
- [x] `lib/db.ts` 실제 DB 연결로 교체
- [x] CRUD 작업 실제 구현
- [ ] 데이터베이스 연결 테스트 (사용자 환경 설정 후)

### 2. 에러 처리 시스템 구축

- [ ] 글로벌 에러 바운더리 구현 (`app/error.tsx`)
- [ ] 로딩 상태 컴포넌트 구현 (`app/loading.tsx`)
- [ ] 404 페이지 구현 (`app/not-found.tsx`)
- [ ] API 에러 처리 로직 추가
- [ ] 사용자 친화적 에러 메시지 구현

### 3. SEO 최적화

- [ ] 메타데이터 동적 생성 (`generateMetadata`)
- [ ] Open Graph 태그 설정
- [ ] Twitter Card 설정
- [ ] 구조화된 데이터 추가 (JSON-LD)
- [ ] 사이트맵 생성 (`app/sitemap.ts`)
- [ ] robots.txt 설정

---

## ⚡ 중간 우선순위

### 4. 사용자 인증 시스템

- [ ] NextAuth.js 또는 Supabase Auth 설정
- [ ] 로그인/회원가입 페이지
- [ ] 사용자 세션 관리
- [ ] 보호된 라우트 구현
- [ ] 사용자 프로필 페이지

### 5. 댓글 시스템 UI 구현

- [ ] 댓글 작성 폼 컴포넌트
- [ ] 댓글 목록 컴포넌트
- [ ] 중첩 댓글 (대댓글) 기능
- [ ] 댓글 승인/삭제 기능
- [ ] 비회원 댓글 기능

### 6. 검색 기능 실제 구현

- [ ] 전체 텍스트 검색 기능
- [ ] 카테고리별 필터링
- [ ] 태그별 필터링
- [ ] 검색 결과 페이지
- [ ] 검색어 하이라이팅

### 7. 관리자 대시보드

- [ ] 관리자 인증 시스템
- [ ] 포스트 작성/편집 인터페이스
- [ ] 포스트 목록 관리
- [ ] 댓글 관리
- [ ] 통계 대시보드

---

## 🔧 낮은 우선순위

### 8. 성능 최적화

- [ ] 이미지 최적화 구현
- [ ] 코드 스플리팅 적용
- [ ] 캐싱 전략 구현
- [ ] 번들 크기 최적화
- [ ] Core Web Vitals 개선

### 9. 추가 기능

- [ ] PWA 기능 구현
- [ ] 다국어 지원 (i18n)
- [ ] 다크/라이트 테마 토글
- [ ] RSS 피드 생성
- [ ] 소셜 미디어 공유 기능

### 10. 품질 보증

- [ ] 단위 테스트 작성
- [ ] 통합 테스트 구현
- [ ] E2E 테스트 설정
- [ ] 성능 모니터링 도구 설정
- [ ] 접근성 검증

---

## 📋 각 우선순위별 세부 체크리스트

### 🔥 1순위: 데이터베이스 연결

```bash
# 필요한 패키지 (pnpm 사용)
pnpm add @supabase/supabase-js

# 환경 변수 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**수정 완료된 파일:**

- [x] `lib/db.ts` - 실제 Supabase 클라이언트로 교체 완료
- [x] `app/posts/[id]/actions.ts` - 실제 DB 작업 구현 완료
- [x] `lib/supabase/client.ts` - 브라우저 클라이언트 생성
- [x] `lib/supabase/server.ts` - 서버 클라이언트 생성
- [x] `types/database.ts` - TypeScript 타입 정의 생성
- [ ] `components/main-content.tsx` - 실제 데이터 페칭 (다음 단계)

### 🔥 2순위: 에러 처리

**생성이 필요한 파일:**

- [ ] `app/error.tsx`
- [ ] `app/loading.tsx`
- [ ] `app/not-found.tsx`
- [ ] `components/ui/error-boundary.tsx`

### 🔥 3순위: SEO

**수정이 필요한 파일:**

- [ ] `app/layout.tsx` - 메타데이터 개선
- [ ] `app/posts/[id]/page.tsx` - 동적 메타데이터
- [ ] `app/sitemap.ts` - 새로 생성
- [ ] `app/robots.txt` - 새로 생성

---

## 🎯 단계별 실행 가이드

### Phase 1: 핵심 기능 완성 (1-2주)

1. 데이터베이스 연결 구현
2. 기본 에러 처리
3. SEO 기본 설정

### Phase 2: 사용자 경험 개선 (2-3주)

1. 사용자 인증 시스템
2. 댓글 시스템
3. 검색 기능

### Phase 3: 관리 및 최적화 (2-4주)

1. 관리자 대시보드
2. 성능 최적화
3. 테스트 및 모니터링

---

## ⚠️ 주의사항

### 코드 보존 원칙

- ✅ 사용자가 수정한 코드는 되돌리지 않음
- ✅ 기존 스타일링 및 컴포넌트 구조 유지
- ✅ 점진적 개선으로 기존 기능 영향 최소화

### 품질 기준

- ✅ TypeScript Strict 모드 준수
- ✅ ESLint 규칙 준수
- ✅ 접근성 고려 (ARIA, 시맨틱 HTML)
- ✅ 반응형 디자인 유지

### 성능 기준

- ✅ 서버 컴포넌트 우선 사용
- ✅ 클라이언트 컴포넌트 최소화
- ✅ 이미지 최적화 필수
- ✅ 번들 크기 모니터링

### 패키지 관리 기준

- ✅ **pnpm 사용 필수**: npm/yarn 대신 pnpm만 사용
- ✅ **pnpm-lock.yaml 관리**: 버전 관리에 포함하여 일관성 유지
- ✅ **의존성 정기 검토**: `pnpm audit` 및 `pnpm outdated` 정기 실행
- ✅ **번들 크기 고려**: 패키지 추가 시 크기 영향도 검토

### pnpm 명령어 치트시트

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm add [pkg]    # 패키지 설치
pnpm add -D [pkg] # 개발 의존성 설치
pnpm remove [pkg] # 패키지 제거
pnpm audit        # 보안 검사
pnpm outdated     # 업데이트 확인
```

---

_이 체크리스트는 프로젝트 진행에 따라 업데이트됩니다._
