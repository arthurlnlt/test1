import { useParams, useNavigate } from 'react-router-dom';
import { Share2, BookmarkPlus, ArrowLeft } from 'lucide-react';
import { PostHeader } from './PostHeader';
import { PostActions } from './PostActions';
import { CommentSection } from '../comments/CommentSection';
import { Sidebar } from '../../layout/Sidebar';
import { useStore } from '../../../lib/store';
import { ZoomableImage } from '../../common/ZoomableImage';

export function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { posts, toggleLike } = useStore();
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-background-lighter flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Post not found</h2>
            <button
              onClick={() => navigate('/')}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 justify-center mx-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              Return to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-background-lighter">
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to home
          </button>

          <article className="bg-background-card rounded-lg overflow-hidden shadow-xl">
            <ZoomableImage
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
            
            <div className="p-6">
              <PostHeader author={post.author} createdAt={post.createdAt} />
              <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
              
              <div className="prose prose-invert max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-300 mb-4">{paragraph}</p>
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
          </article>
        </div>
      </div>
    </div>
  );
}