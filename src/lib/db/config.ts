export const DB_NAME = 'blueddit-db';
export const DB_VERSION = 5; // Increment version to force schema update

export const INITIAL_POSTS = [
  {
    id: '1',
    title: 'Getting Started with Web Development',
    content: 'Learn the fundamentals of web development with this comprehensive guide.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000',
    author: 'WebDevPro',
    createdAt: new Date('2024-03-15').toISOString(),
    upvotes: 0,
    comments: 0,
    liked: false,
    topic: {
      id: 1,
      name: 'Topic-1',
      description: 'Technology and Programming'
    }
  },
  {
    id: '2',
    title: 'Modern JavaScript Techniques',
    content: 'Discover the latest JavaScript features and best practices.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
    author: 'JSMaster',
    createdAt: new Date('2024-03-14').toISOString(),
    upvotes: 0,
    comments: 0,
    liked: false,
    topic: {
      id: 2,
      name: 'Topic-2',
      description: 'Science and Research'
    }
  }
];