import { CreateSubjectButton } from './CreateSubjectButton';
import { PostCard } from './post/PostCard';
import { Sidebar } from '../layout/Sidebar';
import { useStore } from '../../lib/store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HomePage() {
  const { topicId } = useParams();
  const { initializeStore, posts, topics } = useStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Filter posts by selected topic if topicId is provided
  const filteredPosts = topicId 
    ? posts.filter(post => post.topic?.id === parseInt(topicId))
    : posts;

  // Group and sort posts by topic
  const postsByTopic = topics
    .filter(topic => topicId ? topic.id === parseInt(topicId) : true)
    .map(topic => ({
      topic,
      posts: filteredPosts
        .filter(post => post.topic?.id === topic.id)
        .sort((a, b) => b.upvotes - a.upvotes)
    }))
    .filter(group => group.posts.length > 0);

  const handleScroll = (container: HTMLElement | null, direction: 'left' | 'right') => {
    if (container) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {topicId 
              ? `Posts in ${topics.find(t => t.id === parseInt(topicId))?.description}`
              : 'All Posts'
            }
          </h1>
          <CreateSubjectButton />
        </div>
        
        {postsByTopic.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg mb-4">No posts found.</p>
            <p>Be the first to create a post!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {postsByTopic.map(({ topic, posts }) => (
              <div key={topic.id} className="relative">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  #{topic.description}
                </h2>
                <div className="relative group">
                  <button
                    onClick={() => handleScroll(document.getElementById(`topic-${topic.id}`), 'left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-800/90 p-2 rounded-full hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  
                  <div
                    id={`topic-${topic.id}`}
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
                  >
                    {posts.map((post) => (
                      <div key={post.id} className="flex-none w-[300px]">
                        <PostCard {...post} />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleScroll(document.getElementById(`topic-${topic.id}`), 'right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-800/90 p-2 rounded-full hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}