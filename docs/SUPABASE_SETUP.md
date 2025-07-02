# 🔥 Supabase 데이터베이스 연결 가이드

## 1️⃣ Supabase 프로젝트 생성

1. **Supabase 계정 생성**

   - [supabase.com](https://supabase.com)에 접속
   - 무료 계정 생성 (GitHub, Google 로그인 가능)

2. **새 프로젝트 생성**
   - Dashboard에서 "New project" 클릭
   - Organization 선택 (없으면 생성)
   - 프로젝트 이름: `dom-vlog` (또는 원하는 이름)
   - 비밀번호 설정 (안전한 비밀번호 사용)
   - 지역 선택: `Northeast Asia (Seoul)` 권장

## 2️⃣ 환경 변수 설정

1. **환경 변수 파일 생성**

   ```bash
   # 프로젝트 루트에서 실행
   cp .env.example .env.local  # 없으면 수동 생성
   ```

2. **.env.local 파일 내용**

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Supabase Dashboard에서 키 복사**
   - Project Settings → API
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`에 복사
   - **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사
   - **service_role** 키 → `SUPABASE_SERVICE_ROLE_KEY`에 복사

## 3️⃣ 데이터베이스 마이그레이션 실행

### 옵션 1: Supabase SQL Editor 사용 (권장)

1. **Supabase Dashboard → SQL Editor**
2. **마이그레이션 스크립트 순서대로 실행:**
   ```sql
   -- 1. scripts/001_create_blog_tables.sql 내용 복사 & 실행
   -- 2. scripts/002_add_comments_table.sql 내용 복사 & 실행
   -- 3. scripts/003_add_announcements_table.sql 내용 복사 & 실행
   -- 4. scripts/004_add_external_links_table.sql 내용 복사 & 실행
   -- 5. scripts/005_add_post_metadata_and_views.sql 내용 복사 & 실행
   ```

### 옵션 2: Supabase CLI 사용

1. **Supabase CLI 설치**

   ```bash
   pnpm add -g supabase
   ```

2. **로그인 및 프로젝트 연결**

   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. **마이그레이션 실행**
   ```bash
   # 각 스크립트를 순서대로 실행
   supabase db push --local-only scripts/001_create_blog_tables.sql
   ```

## 4️⃣ 샘플 데이터 삽입 (선택사항)

SQL Editor에서 실행:

```sql
-- 사용자 생성
INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@example.com', 'hashed_password_here');

-- 카테고리 생성
INSERT INTO categories (name, slug) VALUES
('기술', 'tech'),
('개발', 'development'),
('일상', 'daily');

-- 샘플 포스트 생성
INSERT INTO posts (
  user_id,
  category_id,
  title,
  slug,
  content,
  excerpt,
  published,
  published_at
) VALUES (
  (SELECT id FROM users WHERE username = 'admin'),
  (SELECT id FROM categories WHERE slug = 'tech'),
  '첫 번째 블로그 포스트',
  'first-blog-post',
  '이것은 첫 번째 블로그 포스트의 내용입니다.',
  '첫 번째 포스트에 대한 간단한 요약입니다.',
  true,
  NOW()
);
```

## 5️⃣ 연결 테스트

1. **개발 서버 실행**

   ```bash
   pnpm dev
   ```

2. **브라우저에서 확인**

   - http://localhost:3000 접속
   - 개발자 도구 콘솔에서 데이터베이스 연결 상태 확인

3. **데이터 확인**
   - 포스트가 정상적으로 표시되는지 확인
   - 포스트 조회 시 view_count가 증가하는지 확인

## 6️⃣ 보안 설정 (중요!)

### Row Level Security (RLS) 설정

```sql
-- posts 테이블 RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 발행된 포스트는 모든 사용자가 읽을 수 있음
CREATE POLICY "Anyone can read published posts" ON posts
FOR SELECT USING (published = true);

-- 카테고리는 모든 사용자가 읽을 수 있음
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON categories
FOR SELECT USING (true);

-- 태그는 모든 사용자가 읽을 수 있음
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read tags" ON tags
FOR SELECT USING (true);
```

## 🎯 완료 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 실행 완료
- [ ] 샘플 데이터 삽입 완료 (선택)
- [ ] 개발 서버에서 정상 동작 확인
- [ ] RLS 보안 설정 완료

## 🚨 문제 해결

### 연결 오류 발생 시

1. **환경 변수 확인**

   - `.env.local` 파일이 프로젝트 루트에 있는지 확인
   - URL과 키가 정확한지 Supabase Dashboard에서 재확인

2. **권한 문제**

   - anon 키 사용 시 RLS 정책 확인
   - service_role 키 사용 시 서버사이드에서만 사용

3. **테이블 없음 오류**
   - 마이그레이션 스크립트 재실행
   - Supabase Table Editor에서 테이블 생성 상태 확인

## 📞 지원

문제가 계속되면:

- [Supabase Discord](https://discord.supabase.com) 커뮤니티 참여
- [GitHub Issues](https://github.com/supabase/supabase/issues)에서 검색
- 프로젝트 개발자에게 문의
