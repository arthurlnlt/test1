import { memo } from 'react';
import { formatDate } from '../../../lib/utils/formatDate';

interface PostHeaderProps {
  author: string;
  createdAt: string;
}

export const PostHeader = memo(function PostHeader({ author, createdAt }: PostHeaderProps) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
      <span>Posted by {author}</span>
      <span>•</span>
      <span>{formatDate(createdAt)}</span>
    </div>
  );
});