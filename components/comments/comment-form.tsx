"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { addCommentAction } from "@/app/posts/[slug]/actions";
import { Profile } from "@/types/database";

const initialState = { message: "" };

interface CommentFormProps {
  postId: string;
  user: { id: string; email?: string; } | null;
  parentId?: string;
  onCommentAdded?: () => void;
}

export function CommentForm({ postId, user, parentId, onCommentAdded }: CommentFormProps) {
  const [state, formAction] = useActionState(addCommentAction, initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    if (onCommentAdded) {
      onCommentAdded();
    }
    (event.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="postId" value={postId} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      
      {!user && (
        <div className="grid grid-cols-2 gap-4">
          <Input name="authorName" placeholder="이름" required className="bg-zinc-800 border-zinc-700" />
          <Input name="authorEmail" type="email" placeholder="이메일" required className="bg-zinc-800 border-zinc-700" />
        </div>
      )}
      
      <Textarea
        name="content"
        placeholder="댓글을 남겨주세요..."
        required
        className="bg-zinc-800 border-zinc-700"
      />
      <div className="flex justify-end">
        <Button type="submit">댓글 작성</Button>
      </div>
      {state?.message && <p className="text-red-500">{state.message}</p>}
    </form>
  );
}
