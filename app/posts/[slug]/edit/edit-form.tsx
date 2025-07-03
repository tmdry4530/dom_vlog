"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import { updatePostAction } from "./actions";
import { PostWithDetails } from "@/types/database";

const initialState = {
  message: "",
  slug: undefined,
};

export default function EditPostForm({ post }: { post: PostWithDetails }) {
  const [content, setContent] = useState(post.content || "");
  const [state, formAction] = useActionState(updatePostAction, initialState);

  useEffect(() => {
    if (state.message === "성공" && state.slug) {
      window.location.href = `/posts/${state.slug}`;
    }
  }, [state]);

  return (
    <main className="flex-1 p-8">
      <h1 className="text-4xl font-bold mb-8">글 수정</h1>
      <form action={formAction}>
        <input type="hidden" name="postId" value={post.id} />
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              제목
            </label>
            <Input
              id="title"
              name="title"
              placeholder="글의 제목을 입력하세요"
              className="bg-zinc-800 border-zinc-700"
              defaultValue={post.title}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              내용
            </label>
            <input type="hidden" name="content" value={content} />
            <div data-color-mode="dark">
              <MDEditor
                value={content}
                onChange={(value) => setContent(value || "")}
                height={500}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">수정 완료</Button>
          </div>
          {state?.message && state.message !== "성공" && (
            <p className="text-red-500 mt-4">{state.message}</p>
          )}
        </div>
      </form>
    </main>
  );
}
