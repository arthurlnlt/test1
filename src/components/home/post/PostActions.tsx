import { memo } from 'react';
import { ThumbsUp, MessageCircle } from 'lucide-react';

interface PostActionsProps {
  postId: string;
  upvotes: number;
  comments: number;
  liked: boolean;
  onLike: (postId: string) => void;
}

export const PostActions = memo(function PostActions({ 
  postId, 
  upvotes, 
  comments, 
  liked, 
  onLike 
}: PostActionsProps) {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onLike(postId)}
        className={`flex items-center space-x-1 transition-colors ${
          liked ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
        }`}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{upvotes}</span>
      </button>
      <div className="flex items-center space-x-1 text-gray-400">
        <MessageCircle className="h-4 w-4" />
        <span>{comments}</span>
      </div>
    </div>
  );
});