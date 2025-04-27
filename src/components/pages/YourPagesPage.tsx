import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { useStore } from '../../lib/store';
import { PostCard } from '../home/post/PostCard';
import { Sidebar } from '../layout/Sidebar';
import { LogIn, Edit } from 'lucide-react';
import { useState } from 'react';
import { EditPostModal } from '../home/post/EditPostModal';
import { Post } from '../../types/post';

export function YourPagesPage() {
  const navigate = useNavigate();
  const { currentUsername, isAuthenticated } = useAuth();
  const { posts } = useStore();
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const userPosts = posts.filter(post => post.author === currentUsername);

  if (!isAuthenticated) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-md mx-auto mt-20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Sign in to view your pages</h2>
            <p className="text-gray-400 mb-6">
              You need to be signed in to view and manage your pages.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Your Pages</h1>
        
        {userPosts.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg mb-4">You haven't created any pages yet.</p>
            <button
              onClick={() => navigate('/')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Go back home to create your first page
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <div key={post.id} className="relative group">
                <button
                  onClick={() => setEditingPost(post)}
                  className="absolute top-2 right-2 z-10 bg-blue-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-500"
                >
                  <Edit className="h-4 w-4 text-white" />
                </button>
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}

        {editingPost && (
          <EditPostModal
            post={editingPost}
            isOpen={true}
            onClose={() => setEditingPost(null)}
          />
        )}
      </main>
    </div>
  );
}