import { createClient } from "./supabase/server";
import { unstable_noStore as noStore } from "next/cache";
import {
  BlogPost,
  Category,
  Profile,
  PostWithDetails,
  CategoryWithStats,
  PostCategory,
  SeoScore,
  PostStatus,
  Tag,
  PostTag,
  BlogPostSummary,
  Comment,
} from "@/types/database";
import { analyzePostContent } from "./ai";

// --- 페이지네이션 상수 ---
const POSTS_PER_PAGE = 10;

// --- 태그 관련 함수 ---

export async function getAllTags(): Promise<Tag[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("*").order("name");
  if (error) {
    console.error("Error fetching all tags:", error);
    return [];
  }
  return data || [];
}

export async function getTagByName(name: string): Promise<Tag | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("name", name)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching tag by name:", error);
    }
    return null;
  }
  return data;
}

export async function getPostsByTagSlug(
  slug: string,
  page: number = 1
): Promise<PostWithDetails[]> {
  noStore();
  const supabase = await createClient();
  const { data: tag } = await supabase
    .from("tags")
    .select("id")
    .eq("slug", slug)
    .single();
  if (!tag) return [];

  const { data: postTags } = await supabase
    .from("post_tags")
    .select("post_id")
    .eq("tag_id", tag.id);
  if (!postTags) return [];

  const postIds = postTags.map((pt) => pt.post_id);
  const { from, to } = getPagination(page, POSTS_PER_PAGE);

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .in("id", postIds)
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching posts by tag slug:", error);
    return [];
  }
  return await enrichPostsWithDetails(posts);
}

export async function getPostsCountByTagSlug(slug: string): Promise<number> {
  noStore();
  const supabase = await createClient();
  const { data: tag } = await supabase
    .from("tags")
    .select("id")
    .eq("slug", slug)
    .single();
  if (!tag) return 0;

  const { count, error } = await supabase
    .from("post_tags")
    .select("post_id", { count: "exact" })
    .eq("tag_id", tag.id);

  if (error) {
    console.error("Error fetching posts count by tag slug:", error);
    return 0;
  }
  return count || 0;
}

// --- 포스트 관련 함수들 (수정됨) ---

// 페이지네이션 헬퍼
const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;
  return { from, to };
};

async function enrichPostsWithDetails(
  posts: BlogPost[]
): Promise<PostWithDetails[]> {
  if (!posts || posts.length === 0) return [];
  
  // 임시로 단순화된 버전 사용
  return posts.map((post) => ({
    ...post,
    author: { 
      id: post.author_id, 
      username: 'admin', 
      email: 'admin@test.com',
      full_name: 'Administrator',
      avatar_url: null,
      website: null,
      updated_at: new Date().toISOString()
    },
    categories: [],
    tags: [],
    seoScore: undefined,
  }));
}

export async function getAllPosts(
  page: number = 1
): Promise<PostWithDetails[]> {
  noStore();
  
  const supabase = await createClient();
  const { from, to } = getPagination(page - 1, POSTS_PER_PAGE);

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return await enrichPostsWithDetails(posts || []);
}

export async function getPostsCount(): Promise<number> {
  noStore();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("posts")
    .select("id", { count: "exact" })
    .eq("status", "PUBLISHED");

  if (error) {
    console.error("Error fetching posts count:", error);
    return 0;
  }

  return count || 0;
}

export async function getPostById(id: number): Promise<PostWithDetails | null> {
  noStore();
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  const enriched = await enrichPostsWithDetails([post]);
  return enriched[0] || null;
}

export async function getPostBySlug(
  slug: string
): Promise<PostWithDetails | null> {
  noStore();
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  const enriched = await enrichPostsWithDetails([post]);
  return enriched[0] || null;
}

async function handleTags(
  supabase: any,
  postId: number,
  tagNames: string[]
): Promise<void> {
  await supabase.from("post_tags").delete().eq("post_id", postId);
  if (!tagNames || tagNames.length === 0) return;

  const tagUpserts = tagNames.map(async (name) => {
    const trimmedName = name.trim();
    let tag = await getTagByName(trimmedName);
    if (!tag) {
      // slug를 ID 기반으로 생성
      const slug = `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const { data: newTag } = await supabase
        .from("tags")
        .insert({ name: trimmedName, slug })
        .select()
        .single();
      tag = newTag;
    }
    return tag;
  });

  const tags = (await Promise.all(tagUpserts)).filter(Boolean) as Tag[];
  const postTagInserts = tags.map((tag) => ({
    post_id: postId,
    tag_id: tag.id,
  }));

  if (postTagInserts.length > 0) {
    await supabase.from("post_tags").insert(postTagInserts);
  }
}

export async function createPost(postData: {
  title: string;
  content: string;
  author_id: string;
  slug?: string;
  excerpt?: string;
  categoryIds?: number[];
  tagNames?: string[];
  status?: PostStatus;
  featured_image_url?: string;
}): Promise<BlogPost | null> {
  noStore();
  const supabase = await createClient();

  // posts 테이블에 실제로 존재하는 컬럼만 추출
  const { categoryIds, tagNames, ...postDataForInsert } = postData;
  
  // 포스트 생성 (slug 포함)
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      ...postDataForInsert,
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎ가-힣]/g, '-').replace(/-+/g, '-').slice(0, 60),
      published_at:
        postData.status === "PUBLISHED" ? new Date().toISOString() : undefined,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return null;
  }

  // 태그 처리
  if (postData.tagNames && postData.tagNames.length > 0) {
    await handleTags(supabase, post.id, postData.tagNames);
  }

  // 카테고리 처리 (필요시)
  if (postData.categoryIds && postData.categoryIds.length > 0) {
    const categoryInserts = postData.categoryIds.map((categoryId) => ({
      post_id: post.id,
      category_id: categoryId,
    }));
    
    const { error: categoryError } = await supabase
      .from("post_categories")
      .insert(categoryInserts);
      
    if (categoryError) {
      console.error("Error adding post categories:", categoryError);
    }
  }

  return post;
}

export async function updatePost(
  id: number,
  updates: Partial<BlogPost> & { categoryIds?: number[]; tagNames?: string[] }
): Promise<BlogPost | null> {
  noStore();
  const supabase = await createClient();
  const { categoryIds, tagNames, ...postUpdates } = updates;

  const updateData: any = { ...postUpdates };
  
  // slug는 더 이상 제목 기반으로 생성하지 않고, ID를 유지
  if (updates.status === "PUBLISHED" && !updates.published_at) {
    updateData.published_at = new Date().toISOString();
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

  if (tagNames) {
    await handleTags(supabase, post.id, tagNames);
  }

  return post as BlogPost;
}

// --- 댓글 관련 함수 ---

export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      author:profiles(*)
    `
    )
    .eq("post_id", postId)
    .eq("approved", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  // 댓글과 대댓글을 그룹화
  const commentsById: { [key: number]: Comment & { replies: Comment[] } } = {};
  const rootComments: (Comment & { replies: Comment[] })[] = [];

  for (const comment of data) {
    commentsById[comment.id] = { ...comment, replies: [] };
  }

  for (const comment of data) {
    if (comment.parent_comment_id) {
      commentsById[comment.parent_comment_id]?.replies.push(
        commentsById[comment.id]
      );
    } else {
      rootComments.push(commentsById[comment.id]);
    }
  }

  return rootComments;
}

export async function createComment(commentData: {
  postId: number;
  content: string;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
  parentCommentId?: number;
}): Promise<Comment | null> {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: commentData.postId,
      content: commentData.content,
      author_id: commentData.authorId,
      author_name: commentData.authorName,
      author_email: commentData.authorEmail,
      parent_comment_id: commentData.parentCommentId,
      approved: true, // 자동 승인
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating comment:", error);
    return null;
  }

  return data;
}

export async function getRelatedPosts(
  currentPostId: number,
  tagIds: number[]
): Promise<BlogPostSummary[]> {
  noStore();
  if (tagIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_related_posts", {
    _current_post_id: currentPostId,
    _tag_ids: tagIds,
    _limit: 5,
  });

  if (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }

  return data;
}

// --- 방문자 수 관련 함수 ---

export async function incrementVisit() {
  noStore();
  const supabase = await createClient();
  // Today in YYYY-MM-DD format for UTC
  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.rpc("increment_visit", {
    _visited_at: today,
  });

  if (error) {
    console.error("Error incrementing visit count:", error);
  }
}

export async function getVisitCounts() {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_visit_counts");

  if (error) {
    console.error("Error fetching visit counts:", error);
    return { total: 0, today: 0, yesterday: 0 };
  }

  return data;
}

// ... (The rest of the functions remain the same)
export async function deletePost(id: number): Promise<boolean> {
  noStore();
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    console.error("Error deleting post:", error);
    return false;
  }
  return true;
}

export async function incrementPostView(postId: number): Promise<boolean> {
  noStore();
  const supabase = await createClient();
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("view_count")
    .eq("id", postId)
    .single();

  if (fetchError) {
    console.error("Error fetching current view count:", fetchError);
    return false;
  }

  const { error: updateError } = await supabase
    .from("posts")
    .update({ view_count: (post.view_count || 0) + 1 })
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

  return categories.map((category: any) => ({
    ...category,
    postCount:
      category.posts?.filter((p: any) => p.status === "PUBLISHED").length || 0,
  })) as CategoryWithStats[];
}
