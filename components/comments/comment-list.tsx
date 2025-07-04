import { Comment } from "@/types/database";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  comments: Comment[];
  postId: string;
  user: { id: string; email?: string; } | null;
}

export function CommentList({ comments, postId, user }: CommentListProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} user={user} />
      ))}
    </div>
  );
}
