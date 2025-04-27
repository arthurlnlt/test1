import { memo } from 'react';
import { Comment as CommentType } from '../../../types/comment';
import { formatDate } from '../../../lib/utils/formatDate';

interface CommentProps {
  comment: CommentType;
}

export const Comment = memo(function Comment({ comment }: CommentProps) {
  return (
    <div className="bg-background-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{comment.author}</span>
        <span className="text-xs text-gray-500">
          {formatDate(comment.createdAt)}
        </span>
      </div>
      <p className="text-gray-300">{comment.content}</p>
    </div>
  );
});