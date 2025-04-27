import { openDB } from 'idb';
import { Post } from '../types/post';
import { Comment } from '../types/comment';

const DB_NAME = 'blueddit-db';
const DB_VERSION = 2; // Increment version number

const INITIAL_POSTS = [
  {
    id: '1',
    title: 'Getting Started with Web Development',
    content: 'Learn the fundamentals of web development with this comprehensive guide.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000',
    author: 'WebDevPro',
    createdAt: new Date('2024-03-15').toISOString(),
    upvotes: 0,
    comments: 0,
    liked: false
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
    liked: false
  }
];

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      console.log(`Mise à jour de la base de données : version ${oldVersion} → ${newVersion}`);

      if (oldVersion < 1) {
        // Création des object stores de la version 1
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'username' });
          userStore.createIndex('email', 'email', { unique: true });
        }
      }

      if (oldVersion < 2) {
        // Création des object stores de la version 2
        if (!db.objectStoreNames.contains('posts')) {
          const postStore = db.createObjectStore('posts', { keyPath: 'id' });
          postStore.createIndex('byDate', 'createdAt');

          // Ajout de posts initiaux
          INITIAL_POSTS.forEach((post) => {
            postStore.add(post);
          });
        }

        if (!db.objectStoreNames.contains('comments')) {
          const commentStore = db.createObjectStore('comments', { keyPath: 'id' });
          commentStore.createIndex('byPostId', 'postId');
        }

        if (!db.objectStoreNames.contains('likes')) {
          db.createObjectStore('likes', { keyPath: ['userId', 'postId'] });
        }
      }
    },
  });
};


let dbInstance: Awaited<ReturnType<typeof initDB>> | null = null;

const getDB = async () => {
  if (!dbInstance) {
    dbInstance = await initDB();
  }
  return dbInstance;
};

export const dbOperations = {
  getDB,
  
  async getAllPosts(): Promise<Post[]> {
    const db = await getDB();
    return db.getAll('posts');
  },

  async addPost(post: Post): Promise<void> {
    const db = await getDB();
    await db.add('posts', post);
  },

  async updatePost(post: Post): Promise<void> {
    const db = await getDB();
    await db.put('posts', post);
  },

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const db = await getDB();
    const index = db.transaction('comments').store.index('byPostId');
    return index.getAll(postId);
  },

  async addComment(comment: Comment): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(['comments', 'posts'], 'readwrite');
    await tx.objectStore('comments').add(comment);
    
    const post = await tx.objectStore('posts').get(comment.postId);
    if (post) {
      post.comments++;
      await tx.objectStore('posts').put(post);
    }
    
    await tx.done;
  },

  async toggleLike(userId: string, postId: string): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(['likes', 'posts'], 'readwrite');
    const likeKey = [userId, postId];
    
    const post = await tx.objectStore('posts').get(postId);
    if (!post) return;

    const hasLike = await tx.objectStore('likes').get(likeKey);
    
    if (hasLike) {
      await tx.objectStore('likes').delete(likeKey);
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else {
      await tx.objectStore('likes').add({
        userId,
        postId,
        timestamp: new Date().toISOString()
      });
      post.upvotes++;
    }
    
    await tx.objectStore('posts').put(post);
    await tx.done;
  },

  async isLiked(userId: string, postId: string): Promise<boolean> {
    const db = await getDB();
    const like = await db.get('likes', [userId, postId]);
    return !!like;
  }
};