// 실제 Supabase 데이터베이스 구조에 맞춘 타입 정의

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Profile {
  id: string;
  userId: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  blogTitle: string;
  blogSubtitle?: string;
  blogDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  enhancedContent?: string;
  status: PostStatus;
  publishedAt?: string;
  featuredImage?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  // 관계 데이터
  author?: Profile;
  categories?: PostCategory[];
  seoScore?: SeoScore;
}

export interface PostCategory {
  id: string;
  postId: string;
  categoryId: string;
  confidence?: number;
  isAiSuggested: boolean;
  createdAt: string;
  // 관계 데이터
  category?: Category;
}

export interface SeoScore {
  id: string;
  postId: string;
  overallScore: number;
  readabilityScore: number;
  performanceScore: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  wordCount?: number;
  readingTime?: number;
  isProcessed: boolean;
  processedAt?: string;
  aiModel?: string;
  createdAt: string;
  updatedAt: string;
}

// Database 타입 (Supabase 클라이언트용)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Profile, "id" | "createdAt" | "updatedAt">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>;
      };
      posts: {
        Row: BlogPost;
        Insert: Omit<
          BlogPost,
          "id" | "createdAt" | "updatedAt" | "viewCount"
        > & { viewCount?: number };
        Update: Partial<Omit<BlogPost, "id" | "createdAt" | "updatedAt">>;
      };
      post_categories: {
        Row: PostCategory;
        Insert: Omit<PostCategory, "id" | "createdAt">;
        Update: Partial<Omit<PostCategory, "id" | "createdAt">>;
      };
      seo_scores: {
        Row: SeoScore;
        Insert: Omit<SeoScore, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<SeoScore, "id" | "createdAt" | "updatedAt">>;
      };
    };
    Enums: {
      PostStatus: PostStatus;
    };
  };
}

// 유틸리티 타입들
export type PostWithDetails = BlogPost & {
  author: Profile;
  categories: (PostCategory & { category: Category })[];
  seoScore?: SeoScore;
};

export type CategoryWithStats = Category & {
  postCount: number;
};
