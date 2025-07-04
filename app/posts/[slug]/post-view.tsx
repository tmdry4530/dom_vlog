"use client";

import { PostWithDetails, Comment, BlogPostSummary } from "@/types/database";
import { BlogPostSummary as BlogPostSummaryType } from "@/lib/db";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Tag, MessageSquare, Link2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { deletePostAction, incrementViewAction } from "./actions";
import { CommentList } from "@/components/comments/comment-list";
import { CommentForm } from "@/components/comments/comment-form";
import { Separator } from "@/components/ui/separator";

type PlainUser = {
  id: string;
} | null;

type PostViewProps = {
  post: PostWithDetails;
  user: PlainUser;
  comments: Comment[];
  relatedPosts: BlogPostSummaryType[];
};

export default function PostView({ post, user, comments, relatedPosts }: PostViewProps) {
  useEffect(() => {
    incrementViewAction(post.id);
  }, [post.id]);

  const isAuthor = user && user.id === post.author_id;

  return (
    <main className="flex-1 p-8 relative max-w-4xl mx-auto">
      {/* Post Actions */}
      {isAuthor && (
        <div className="flex gap-2 mb-6">
          <Link href={`/posts/${post.slug}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              수정
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 포스트가 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deletePostAction(post.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Post content */}
      <div
        className="prose prose-invert text-zinc-300 mt-8"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-zinc-700">
          <div className="flex items-center gap-2 mb-4 text-zinc-400">
            <Tag className="h-5 w-5" />
            <h3 className="text-lg font-semibold">태그</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(({ tags }) => (
              tags && (
                <Link href={`/tags/${tags.slug}`} key={tags.id}>
                  <span className="inline-block bg-zinc-700 text-zinc-300 px-3 py-1 rounded-full text-sm hover:bg-zinc-600 transition-colors">
                    {tags.name}
                  </span>
                </Link>
              )
            ))}
          </div>
        </div>
      )}

      <Separator className="my-12 bg-zinc-700" />

      {/* Comments Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare />
            댓글 ({comments.length})
          </h2>
        </div>
        <CommentForm postId={post.id.toString()} user={user} />
        <CommentList comments={comments} postId={post.id.toString()} user={user} />
      </div>

      {/* Related Posts Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <>
          <Separator className="my-12 bg-zinc-700" />
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Link2 />
                관련 글
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link href={`/posts/${relatedPost.slug}`} key={relatedPost.id}>
                  <div className="p-4 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
                    <h3 className="font-semibold text-lg text-zinc-50">{relatedPost.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      {new Date(relatedPost.published_at!).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
