"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types/database";
import { CommentForm } from "./comment-form";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  user: { id: string; email?: string; } | null;
}

export function CommentItem({ comment, postId, user }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={comment.author?.avatar_url} />
        <AvatarFallback>{comment.author_name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{comment.author_name || "Anonymous"}</span>
          <span className="text-xs text-zinc-400">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-zinc-300 mt-1">{comment.content}</p>
        <Button variant="link" size="sm" className="p-0 h-auto text-zinc-400" onClick={() => setShowReplyForm(!showReplyForm)}>
          Reply
        </Button>

        {showReplyForm && (
          <div className="mt-4">
            <CommentForm postId={postId} parentId={comment.id} user={user} onCommentAdded={() => setShowReplyForm(false)} />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 border-l-2 border-zinc-700 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} postId={postId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
