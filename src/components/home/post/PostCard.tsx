import { memo } from 'react';
import { ArrowRight, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PostHeader } from './PostHeader';
import { PostActions } from './PostActions';
import { usePosts } from '../../../lib/hooks/usePosts';
import { Post } from '../../../types/post';
import { ZoomableImage } from '../../common/ZoomableImage';

interface PostCardProps extends Post {}

export const PostCard = memo(function PostCard(post: PostCardProps) {
  const navigate = useNavigate();
  const { toggleLike } = usePosts();

  return (
    <div className="bg-background-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-[400px] flex flex-col">
      <ZoomableImage
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <PostHeader author={post.author} createdAt={post.createdAt} />
        {post.topic && (
          <div className="flex items-center gap-1 text-sm text-blue-400 mb-2">
            <Hash className="h-4 w-4" />
            <span>{post.topic.description}</span>
          </div>
        )}
        <h3 className="text-lg text-white font-semibold mb-2 line-clamp-1">{post.title}</h3>
        <div className="flex-1 flex flex-col">
          <p className="text-gray-300 text-sm line-clamp-3 mb-2">
            {post.content}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <PostActions
              postId={post.id}
              upvotes={post.upvotes}
              comments={post.comments}
              liked={post.liked}
              onLike={toggleLike}
            />
            <button 
              onClick={() => navigate(`/post/${post.id}`)}
              className="text-primary-400 hover:text-primary-300 flex items-center transition-colors text-sm"
            >
              Learn more
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});