import { memo } from 'react';
import { X, Share2, BookmarkPlus } from 'lucide-react';
import { PostHeader } from './PostHeader';
import { PostActions } from './PostActions';
import { CommentSection } from '../comments/CommentSection';
import { useStore } from '../../../lib/store';
import { Post } from '../../../types/post';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export const PostModal = memo(function PostModal({ isOpen, onClose, post }: PostModalProps) {
  const { toggleLike } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-lighter rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background-lighter p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{post.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <PostHeader author={post.author} createdAt={post.createdAt} />
          
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg mb-6"
          />
          
          <div className="space-y-4 text-gray-300">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-gray-700 pt-4">
            <div className="flex items-center space-x-6">
              <PostActions
                postId={post.id}
                upvotes={post.upvotes}
                comments={post.comments}
                liked={post.liked}
                onLike={toggleLike}
              />
              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
              <BookmarkPlus className="h-5 w-5" />
              <span>Save</span>
            </button>
          </div>

          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
});