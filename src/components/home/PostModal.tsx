import { memo } from 'react';
import { X, ThumbsUp, MessageCircle, Share2, BookmarkPlus } from 'lucide-react';
import { CommentSection } from './CommentSection';
import { useStore } from '../../lib/store';
import { Post } from '../../types/post';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export const PostModal = memo(function PostModal({ isOpen, onClose, post }: PostModalProps) {
  if (!isOpen) return null;

  const { toggleLike } = useStore();
  const longContent = `${post.content}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

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
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <span>Posted by {post.author}</span>
            <span>•</span>
            <span>{post.createdAt}</span>
          </div>
          
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg mb-6"
          />
          
          <div className="space-y-4 text-gray-300">
            {longContent.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-gray-700 pt-4">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => toggleLike(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.liked ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
                }`}
              >
                <ThumbsUp className="h-5 w-5" />
                <span>{post.upvotes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments}</span>
              </button>
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