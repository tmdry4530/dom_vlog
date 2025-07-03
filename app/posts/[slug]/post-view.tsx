"use client";

import { useEffect } from "react";
import { incrementViewAction, deletePostAction } from "./actions";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostView({
  post,
  user,
}: {
  post: any;
  user: User | null;
}) {
  useEffect(() => {
    incrementViewAction(post.id);
  }, [post.id]);

  const isAuthor = user && user.id === post.author_id;

  return (
    <main className="flex-1 p-8 relative max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-50">{post.title}</h1>
        <p className="text-sm text-zinc-400">
          {new Date(post.published_at!).toLocaleDateString()}
        </p>
        <p className="text-xs text-zinc-500 mt-2">
          조회수: {post.view_count + 1}
        </p>
      </div>

      {isAuthor && (
        <div className="flex justify-end gap-2 mb-4">
          <Link href={`/posts/${post.slug}/edit`} passHref>
            <Button variant="outline">수정</Button>
          </Link>
          <form action={deletePostAction.bind(null, post.id)}>
            <Button variant="destructive" type="submit">삭제</Button>
          </form>
        </div>
      )}

      <div
        className="prose prose-invert text-zinc-300"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}
