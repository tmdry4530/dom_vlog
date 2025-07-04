// 실제 Supabase 데이터베이스 구조에 맞춘 타입 정의
// Supabase CLI로 생성된 타입 기반

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_suggested_categories: {
        Row: {
          category_id: number
          confidence_score: number | null
          created_at: string
          id: number
          post_id: number
        }
        Insert: {
          category_id: number
          confidence_score?: number | null
          created_at?: string
          id?: number
          post_id: number
        }
        Update: {
          category_id?: number
          confidence_score?: number | null
          created_at?: string
          id?: number
          post_id?: number
        }
      }
      ai_suggested_tags: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: number
          post_id: number
          tag_name: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: number
          post_id: number
          tag_name: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: number
          post_id?: number
          tag_name?: string
        }
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          id: number
          published_at: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          id?: number
          published_at?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: number
          published_at?: string | null
          title?: string
        }
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
      }
      comments: {
        Row: {
          approved: boolean | null
          author_email: string | null
          author_id: string | null
          author_name: string | null
          content: string
          created_at: string
          id: number
          parent_comment_id: number | null
          post_id: number
        }
        Insert: {
          approved?: boolean | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          content: string
          created_at?: string
          id?: number
          parent_comment_id?: number | null
          post_id: number
        }
        Update: {
          approved?: boolean | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          content?: string
          created_at?: string
          id?: number
          parent_comment_id?: number | null
          post_id?: number
        }
      }
      external_links: {
        Row: {
          display_order: number | null
          id: number
          name: string
          url: string
        }
        Insert: {
          display_order?: number | null
          id?: number
          name: string
          url: string
        }
        Update: {
          display_order?: number | null
          id?: number
          name?: string
          url?: string
        }
      }
      post_categories: {
        Row: {
          category_id: number
          confidence_score: number | null
          is_ai_suggested: boolean | null
          post_id: number
        }
        Insert: {
          category_id: number
          confidence_score?: number | null
          is_ai_suggested?: boolean | null
          post_id: number
        }
        Update: {
          category_id?: number
          confidence_score?: number | null
          is_ai_suggested?: boolean | null
          post_id?: number
        }
      }
      post_tags: {
        Row: {
          post_id: number
          tag_id: number
        }
        Insert: {
          post_id: number
          tag_id: number
        }
        Update: {
          post_id?: number
          tag_id?: number
        }
      }
      posts: {
        Row: {
          ai_summary: string | null
          ai_writing_style_analysis: string | null
          author_id: string
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: number
          meta_description: string | null
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          ai_summary?: string | null
          ai_writing_style_analysis?: string | null
          author_id: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: number
          meta_description?: string | null
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          ai_summary?: string | null
          ai_writing_style_analysis?: string | null
          author_id?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: number
          meta_description?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string
          website?: string | null
        }
      }
      seo_scores: {
        Row: {
          id: number
          post_id: number
          report: string | null
          score: number | null
          updated_at: string
        }
        Insert: {
          id?: number
          post_id: number
          report?: string | null
          score?: number | null
          updated_at?: string
        }
        Update: {
          id?: number
          post_id?: number
          report?: string | null
          score?: number | null
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
      }
      visits: {
        Row: {
          count: number
          id: number
          visited_at: string
        }
        Insert: {
          count?: number
          id?: number
          visited_at: string
        }
        Update: {
          count?: number
          id?: number
          visited_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_related_posts: {
        Args: { _current_post_id: number; _tag_ids: number[]; _limit: number }
        Returns: {
          id: number
          title: string
          slug: string
          published_at: string
          view_count: number
        }[]
      }
      get_visit_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          total: number
          today: number
          yesterday: number
        }[]
      }
      increment_visit: {
        Args: { _visited_at: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 편의를 위한 타입 별칭들
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type BlogPost = Database['public']['Tables']['posts']['Row']
export type PostCategory = Database['public']['Tables']['post_categories']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type PostTag = Database['public']['Tables']['post_tags']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type SeoScore = Database['public']['Tables']['seo_scores']['Row']
export type Visit = Database['public']['Tables']['visits']['Row']
export type Announcement = Database['public']['Tables']['announcements']['Row']
export type ExternalLink = Database['public']['Tables']['external_links']['Row']
export type AiSuggestedTag = Database['public']['Tables']['ai_suggested_tags']['Row']
export type AiSuggestedCategory = Database['public']['Tables']['ai_suggested_categories']['Row']

// 확장된 타입들 (관계 데이터 포함)
export type PostWithDetails = BlogPost & {
  author?: Profile
  categories: (PostCategory & { categories?: Category })[]
  tags: (PostTag & { tags?: Tag })[]
  seoScore?: SeoScore
}

export type CategoryWithStats = Category & {
  postCount: number
}

export type CommentWithDetails = Comment & {
  author?: Profile
  replies?: CommentWithDetails[]
}

// 블로그 포스트 요약 타입 (목록 표시용)
export interface BlogPostSummary {
  id: number
  title: string
  slug: string
  excerpt: string | null
  view_count: number | null
  published_at: string | null
  category?: {
    id: number
    name: string
    slug: string
  }
}

// Insert 타입들
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type BlogPostInsert = Database['public']['Tables']['posts']['Insert']
export type PostCategoryInsert = Database['public']['Tables']['post_categories']['Insert']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type PostTagInsert = Database['public']['Tables']['post_tags']['Insert']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type SeoScoreInsert = Database['public']['Tables']['seo_scores']['Insert']

// Update 타입들
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type BlogPostUpdate = Database['public']['Tables']['posts']['Update']
export type PostCategoryUpdate = Database['public']['Tables']['post_categories']['Update']
export type TagUpdate = Database['public']['Tables']['tags']['Update']
export type PostTagUpdate = Database['public']['Tables']['post_tags']['Update']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']
export type SeoScoreUpdate = Database['public']['Tables']['seo_scores']['Update']
