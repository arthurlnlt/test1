import { History, Home, Users, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { useStore } from '../../lib/store';

export function Sidebar() {
  const { isAuthenticated, currentUsername } = useAuth();
  const { topics } = useStore();

  return (
    <aside className="w-64 bg-background-lighter text-white p-4 min-h-screen shadow-lg overflow-y-auto">
      <div className="space-y-6">
        <Link to="/" className="block p-2 rounded hover:bg-background-card transition-colors">
          <div className="flex items-center space-x-2 text-primary-400">
            <Home size={20} />
            <span>Home Page</span>
          </div>
        </Link>

        <div>
          <p className="text-gray-400 mb-2 text-sm font-medium">Topics</p>
          <div className="space-y-1">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className="block p-2 rounded hover:bg-background-card transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Hash size={18} className="text-gray-400 group-hover:text-primary-400" />
                  <span className="text-sm">{topic.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-400 mb-2 text-sm font-medium">About you:</p>
          <Link to="/history" className="block p-2 rounded hover:bg-background-card transition-colors">
            <div className="flex items-center space-x-2">
              <History size={20} className="text-primary-400" />
              <span>History</span>
            </div>
          </Link>
          <Link 
            to={isAuthenticated ? "/your-pages" : "/login"} 
            className="block p-2 rounded hover:bg-background-card transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-primary-400" />
              <span>Your Pages</span>
              {!isAuthenticated && (
                <span className="ml-2 text-xs text-gray-400">(Sign in required)</span>
              )}
            </div>
          </Link>
        </div>

        {isAuthenticated && (
          <div>
            <p className="text-gray-400 mb-2 text-sm font-medium">Following pages:</p>
            <div className="space-y-1">
              {Array.from({ length: 7 }, (_, i) => (
                <Link
                  key={i}
                  to={`/pages/${i + 1}`}
                  className="block p-2 rounded hover:bg-background-card transition-colors"
                >
                  Pages {i + 1}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}