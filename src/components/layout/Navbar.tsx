import { LogOut, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { useStore } from '../../lib/store';
import { useState, useCallback, useMemo } from 'react';
import { searchPosts } from '../../lib/utils/search';

export function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated } = useAuth();
  const { posts } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Memoize search results to prevent unnecessary recalculations
  const searchResults = useMemo(() => 
    searchPosts(searchQuery, posts),
    [searchQuery, posts]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(!!e.target.value);
  }, []);

  const handleResultClick = useCallback((postId: string) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/post/${postId}`);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return (
    <nav className="bg-background-lighter text-white p-4 flex items-center justify-between shadow-lg relative z-50">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-bold text-primary-400 hover:text-primary-300">
          Eco Forum
        </Link>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="bg-background px-4 py-1 rounded-md pl-10 w-64 text-white placeholder-gray-400 border border-background-card focus:border-primary-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-1.5 h-5 w-5 text-gray-400" />
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-background-lighter rounded-md shadow-lg overflow-hidden max-h-96 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="w-full text-left px-4 py-3 hover:bg-background-card border-b border-background last:border-0"
                >
                  <div className="text-sm font-medium text-white">{result.title}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    by {result.author} • {result.topic?.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <Link to="/lobby" className="text-gray-300 hover:text-primary-400">
          Lobby
        </Link>
        <Link to="/trending" className="text-gray-300 hover:text-primary-400">
          Trending
        </Link>
        <Link to="/community" className="text-gray-300 hover:text-primary-400">
          Community
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-primary-400 hover:text-primary-300">
              {user?.username}
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-primary-400 flex items-center"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-primary-400 hover:text-primary-300">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}