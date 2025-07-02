import { createClient } from "./supabase/server";
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from "next/headers";
import {
  BlogPost,
  Category,
  Profile,
  PostWithDetails,
  CategoryWithStats,
  PostCategory,
  SeoScore,
  PostStatus,
} from "@/types/database";

// TypeScript 타입 정의
export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  view_count?: number;
  published_at: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

// 공통 유틸리티 함수들
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// 유저 관련 함수
export async function getUserByUsername(username: string): Promise<{ email: string } | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username)
    .single();

  if (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }

  return data;
}

// 포스트 관련 함수들
export async function getAllPosts(): Promise<PostWithDetails[]> {
  noStore();
  const supabase = await createClient();

  // 1. 모든 포스트 데이터 조회 (JavaScript에서 필터링)
  const { data: allPosts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching posts:", postsError);
    return [];
  }

  if (!allPosts || allPosts.length === 0) {
    return [];
  }

  // JavaScript에서 PUBLISHED 상태만 필터링
  const posts = allPosts.filter((post: any) => post.status === "PUBLISHED");

  if (posts.length === 0) {
    return [];
  }

  // 2. 작성자 정보 조회
  const authorIds = [...new Set(posts.map((post: any) => post.authorId))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .in("id", authorIds);

  // 3. 포스트-카테고리 관계 조회
  const postIds = posts.map((post: any) => post.id);
  const { data: postCategories } = await supabase
    .from("post_categories")
    .select(
      `
      *,
      categories(*)
    `
    )
    .in("postId", postIds);

  // 4. SEO 점수 조회
  const { data: seoScores } = await supabase
    .from("seo_scores")
    .select("*")
    .in("postId", postIds);

  // 5. 데이터 조합
  const transformedPosts: PostWithDetails[] = posts.map((post: any) => {
    const author = profiles?.find(
      (profile: any) => profile.id === post.authorId
    );
    const categories =
      postCategories
        ?.filter((pc: any) => pc.postId === post.id)
        .map((pc: any) => ({
          ...pc,
          category: pc.categories,
        })) || [];
    const seoScore = seoScores?.find((score: any) => score.postId === post.id);

    return {
      ...post,
      author: author || null,
      categories,
      seoScore: seoScore || null,
    };
  });

  return transformedPosts;
}

export async function getPublishedPosts(): Promise<PostWithDetails[]> {
  return getAllPosts(); // 이미 published만 가져옴
}

export async function getPostById(id: string): Promise<PostWithDetails | null> {
  noStore();
  const supabase = await createClient();

  // 1. 기본 포스트 데이터 조회
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (postError) {
    console.error("Error fetching post:", postError);
    return null;
  }

  // 2. 작성자 정보 조회
  const { data: author } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", post.authorId)
    .single();

  // 3. 포스트-카테고리 관계 조회
  const { data: postCategories } = await supabase
    .from("post_categories")
    .select(
      `
      *,
      categories(*)
    `
    )
    .eq("postId", id);

  // 4. SEO 점수 조회
  const { data: seoScore } = await supabase
    .from("seo_scores")
    .select("*")
    .eq("postId", id)
    .single();

  // 5. 데이터 조합
  const transformedPost: PostWithDetails = {
    ...post,
    author: author || null,
    categories:
      postCategories?.map((pc: any) => ({
        ...pc,
        category: pc.categories,
      })) || [],
    seoScore: seoScore || null,
  };

  return transformedPost;
}

export async function getPostBySlug(
  slug: string
): Promise<PostWithDetails | null> {
  noStore();
  const supabase = await createClient();

  // 1. 기본 포스트 데이터 조회
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (postError) {
    console.error("Error fetching post by slug:", postError);
    return null;
  }

  // 2. 작성자 정보 조회
  const { data: author } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", post.authorId)
    .single();

  // 3. 포스트-카테고리 관계 조회
  const { data: postCategories } = await supabase
    .from("post_categories")
    .select(
      `
      *,
      categories(*)
    `
    )
    .eq("postId", post.id);

  // 4. SEO 점수 조회
  const { data: seoScore } = await supabase
    .from("seo_scores")
    .select("*")
    .eq("postId", post.id)
    .single();

  // 5. 데이터 조합
  const transformedPost: PostWithDetails = {
    ...post,
    author: author || null,
    categories:
      postCategories?.map((pc: any) => ({
        ...pc,
        category: pc.categories,
      })) || [],
    seoScore: seoScore || null,
  };

  return transformedPost;
}

export async function createPost(postData: {
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  categoryIds?: string[];
  status?: PostStatus;
  featuredImage?: string;
}): Promise<BlogPost | null> {
  noStore();
  const supabase = await createClient();

  const slug = createSlug(postData.title);

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title: postData.title,
      slug,
      content: postData.content,
      excerpt: postData.excerpt,
      authorId: postData.authorId,
      status: postData.status || "DRAFT",
      featuredImage: postData.featuredImage,
      publishedAt:
        postData.status === "PUBLISHED" ? new Date().toISOString() : undefined,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return null;
  }

  // 카테고리 연결
  if (postData.categoryIds && postData.categoryIds.length > 0) {
    await Promise.all(
      postData.categoryIds.map((categoryId) =>
        supabase.from("post_categories").insert({
          postId: post.id,
          categoryId,
          isAiSuggested: false,
        })
      )
    );
  }

  // AI 분석 수행
  const allCategories = await getAllCategories();
  const aiAnalysis = await analyzePostContent(postData.title, postData.content, allCategories);

  if (aiAnalysis) {
    // posts 테이블에 AI 분석 결과 업데이트
    await supabase
      .from("posts")
      .update({
        ai_summary: aiAnalysis.summary,
        ai_writing_style_analysis: aiAnalysis.writingStyle,
      })
      .eq("id", post.id);

    // ai_suggested_tags에 추천 태그 저장
    await supabase.from("ai_suggested_tags").insert(
      aiAnalysis.suggestedTags.map((tag) => ({
        post_id: post.id,
        tag_name: tag,
        confidence_score: 0.9, // 예시 점수
      }))
    );

    // ai_suggested_categories에 추천 카테고리 저장
    const suggestedCategory = allCategories.find(c => c.name === aiAnalysis.suggestedCategory);
    if (suggestedCategory) {
        await supabase.from("ai_suggested_categories").insert({
            post_id: post.id,
            category_id: suggestedCategory.id,
            confidence_score: 0.9, // 예시 점수
        });
    }
  }

  return post as BlogPost;
}

export async function updatePost(
  id: string,
  updates: Partial<BlogPost>
): Promise<BlogPost | null> {
  noStore();
  const supabase = await createClient();

  const updateData: any = { ...updates };
  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  // slug 업데이트
  if (updates.title) {
    updateData.slug = createSlug(updates.title);
  }

  // 발행 시간 설정
  if (updates.status === "PUBLISHED" && !updates.publishedAt) {
    updateData.publishedAt = new Date().toISOString();
  }

  const { data: post, error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating post:", error);
    return null;
  }

  // AI 분석 재수행 (제목 또는 내용이 변경된 경우)
  if (updates.title || updates.content) {
    const allCategories = await getAllCategories();
    const aiAnalysis = await analyzePostContent(post.title, post.content, allCategories);

    if (aiAnalysis) {
      // posts 테이블에 AI 분석 결과 업데이트
      await supabase
        .from("posts")
        .update({
          ai_summary: aiAnalysis.summary,
          ai_writing_style_analysis: aiAnalysis.writingStyle,
        })
        .eq("id", post.id);

      // 기존 추천 데이터 삭제
      await supabase.from("ai_suggested_tags").delete().eq("post_id", post.id);
      await supabase.from("ai_suggested_categories").delete().eq("post_id", post.id);

      // ai_suggested_tags에 추천 태그 저장
      await supabase.from("ai_suggested_tags").insert(
        aiAnalysis.suggestedTags.map((tag) => ({
          post_id: post.id,
          tag_name: tag,
          confidence_score: 0.9, // 예시 점수
        }))
      );

      // ai_suggested_categories에 추천 카테고리 저장
      const suggestedCategory = allCategories.find(c => c.name === aiAnalysis.suggestedCategory);
      if (suggestedCategory) {
          await supabase.from("ai_suggested_categories").insert({
              post_id: post.id,
              category_id: suggestedCategory.id,
              confidence_score: 0.9, // 예시 점수
          });
      }
    }
  }

  return post as BlogPost;
}

export async function deletePost(id: string): Promise<boolean> {
  noStore();
  const supabase = await createClient();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    return false;
  }

  return true;
}

export async function incrementPostView(postId: string): Promise<boolean> {
  noStore();
  const supabase = await createClient();

  // 현재 조회수 가져오기
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("viewCount")
    .eq("id", postId)
    .single();

  if (fetchError) {
    console.error("Error fetching current view count:", fetchError);
    return false;
  }

  // 조회수 증가
  const { error: updateError } = await supabase
    .from("posts")
    .update({ viewCount: (post.viewCount || 0) + 1 })
    .eq("id", postId);

  if (updateError) {
    console.error("Error incrementing view count:", updateError);
    return false;
  }

  return true;
}

export async function getPopularPosts(): Promise<Partial<BlogPostSummary>[]> {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, published_at, view_count")
    .eq("status", "PUBLISHED")
    .order("view_count", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }

  return data || [];
}

// 카테고리 관련 함수들
export async function getAllCategories(): Promise<CategoryWithStats[]> {
  noStore();
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      posts(status)
    `
    )
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  // 카테고리별 발행된 포스트 수 계산
  return categories.map((category: any) => ({
    ...category,
    postCount:
      category.posts?.filter(
        (p: any) => p.status === "PUBLISHED"
      ).length || 0,
  })) as CategoryWithStats[];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  noStore();
  const supabase = await createClient();

  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return category as Category;
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  noStore();
  const supabase = await createClient();

  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }

  return category as Category;
}

export async function createCategory(categoryData: {
  name: string;
  description?: string;
  color?: string;
}): Promise<Category | null> {
  noStore();
  const supabase = await createClient();

  const slug = createSlug(categoryData.name);

  const { data: category, error } = await supabase
    .from("categories")
    .insert({
      name: categoryData.name,
      slug,
      description: categoryData.description,
      color: categoryData.color,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return null;
  }

  return category as Category;
}

// 포스트-카테고리 관계 함수들
export async function getPostsByCategory(
  categoryId: string
): Promise<PostWithDetails[]> {
  noStore();
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_authorId_fkey(*),
      categories:post_categories!inner(
        *,
        category:categories(*)
      ),
      seoScore:seo_scores(*)
    `
    )
    .eq("post_categories.categoryId", categoryId)
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }

  return posts as PostWithDetails[];
}

export async function addPostToCategory(
  postId: string,
  categoryId: string,
  confidence?: number,
  isAiSuggested: boolean = false
): Promise<boolean> {
  noStore();
  const supabase = await createClient();

  const { error } = await supabase.from("post_categories").insert({
    postId,
    categoryId,
    confidence,
    isAiSuggested,
  });

  if (error) {
    console.error("Error adding post to category:", error);
    return false;
  }

  return true;
}

export async function removePostFromCategory(
  postId: string,
  categoryId: string
): Promise<boolean> {
  noStore();
  const supabase = await createClient();

  const { error } = await supabase
    .from("post_categories")
    .delete()
    .eq("postId", postId)
    .eq("categoryId", categoryId);

  if (error) {
    console.error("Error removing post from category:", error);
    return false;
  }

  return true;
}

// 프로필 관련 함수들
export async function getProfile(userId: string): Promise<Profile | null> {
  noStore();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("userId", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return profile as Profile;
}

export async function getProfileById(id: string): Promise<Profile | null> {
  noStore();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching profile by id:", error);
    return null;
  }

  return profile as Profile;
}

export async function updateProfile(
  id: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  noStore();
  const supabase = await createClient();

  const updateData = { ...updates };
  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  return profile as Profile;
}

// SEO 점수 관련 함수들
export async function createSeoScore(
  seoData: Omit<SeoScore, "id" | "createdAt" | "updatedAt">
): Promise<SeoScore | null> {
  noStore();
  const supabase = await createClient();

  const { data: seoScore, error } = await supabase
    .from("seo_scores")
    .insert(seoData)
    .select()
    .single();

  if (error) {
    console.error("Error creating SEO score:", error);
    return null;
  }

  return seoScore as SeoScore;
}

export async function updateSeoScore(
  postId: string,
  updates: Partial<SeoScore>
): Promise<SeoScore | null> {
  noStore();
  const supabase = await createClient();

  const updateData = { ...updates };
  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  const { data: seoScore, error } = await supabase
    .from("seo_scores")
    .update(updateData)
    .eq("postId", postId)
    .select()
    .single();

  if (error) {
    console.error("Error updating SEO score:", error);
    return null;
  }

  return seoScore as SeoScore;
}

// 검색 관련 함수들
export async function searchPosts(query: string): Promise<PostWithDetails[]> {
  noStore();
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_authorId_fkey(*),
      categories:post_categories(
        *,
        category:categories(*)
      ),
      seoScore:seo_scores(*)
    `
    )
    .eq("status", "PUBLISHED")
    .or(
      `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`
    )
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error searching posts:", error);
    return [];
  }

  return posts as PostWithDetails[];
}


// AI 관련 함수들
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

async function analyzePostContent(title: string, content: string, categories: Category[]) {
  try {
    const { object: analysis } = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: z.object({
        summary: z.string().describe('콘텐츠를 3-4 문장으로 요약'),
        suggestedTags: z.array(z.string()).describe('콘텐츠와 관련된 태그 5개 제안'),
        suggestedCategory: z.enum(categories.map(c => c.name) as [string, ...string[]]).describe('가장 적합한 카테고리 제안'),
        writingStyle: z.string().describe('글쓰기 스타일 분석 (예: 분석적, 설득적, 정보 제공)'),
      }),
      prompt: `다음 블로그 게시물의 제목과 내용을 분석해주세요:\n\n제목: ${title}\n\n내용: ${content}`,
    });
    return analysis;
  } catch (error) {
    console.error("Error analyzing post content:", error);
    return null;
  }
}