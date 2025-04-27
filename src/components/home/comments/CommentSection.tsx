import { memo } from 'react';
import { CommentForm } from './CommentForm';
import { Comment } from './Comment';
import { useComments } from '../../../lib/hooks/useComments';
import { useAuth } from '../../../lib/auth-context';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = memo(function CommentSection({ postId }: CommentSectionProps) {
  const { comments, addComment } = useComments(postId);
  const { currentUsername } = useAuth();

  const handleAddComment = (content: string) => {
    addComment(postId, content, currentUsername);
  };

  return (
    <div className="mt-6 space-y-4">
      <CommentForm onSubmit={handleAddComment} />
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
});