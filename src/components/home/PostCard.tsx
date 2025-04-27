import { memo } from 'react';
import { ArrowRight, MessageCircle, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { PostModal } from './PostModal';
import { useStore } from '../../lib/store';
import { Post } from '../../types/post';

interface PostCardProps extends Post {}

export const PostCard = memo(function PostCard(post: PostCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toggleLike } = useStore();

  return (
    <>
      <div className="bg-background-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
            <span>Posted by {post.author}</span>
            <span>•</span>
            <span>{post.createdAt}</span>
          </div>
          <h3 className="text-xl text-white font-semibold mb-2">{post.title}</h3>
          <p className="text-gray-300 mb-4 line-clamp-2">{post.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center space-x-1 transition-colors ${
                  post.liked ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{post.upvotes}</span>
              </button>
              <div className="flex items-center space-x-1 text-gray-400">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-primary-400 hover:text-primary-300 flex items-center transition-colors"
            >
              Learn more
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={post}
      />
    </>
  );
});