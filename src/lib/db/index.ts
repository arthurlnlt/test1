import { openDB, IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION } from './config';
import { createSchema } from './schema';
import { Post } from '../../types/post';
import { Comment } from '../../types/comment';

let dbInstance: IDBPDatabase | null = null;

async function getDB() {
  if (!dbInstance) {
    try {
      dbInstance = await openDB(DB_NAME, DB_VERSION, {
        async upgrade(db, oldVersion, newVersion) {
          console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
          await createSchema(db);
        },
        blocked() {
          console.warn('Database upgrade blocked. Please close other tabs using this app.');
        },
        blocking() {
          dbInstance?.close();
          dbInstance = null;
        },
        terminated() {
          dbInstance = null;
        },
      });
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database initialization failed');
    }
  }
  return dbInstance;
}

export const dbOperations = {
  getDB,
  
  async resetDatabase() {
    try {
      if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
      }

      const databases = await window.indexedDB.databases();
      const exists = databases.some(db => db.name === DB_NAME);
      if (exists) {
        await window.indexedDB.deleteDatabase(DB_NAME);
      }

      dbInstance = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          createSchema(db);
        },
      });

      console.log('Database reset successful');
      return true;
    } catch (error) {
      console.error('Failed to reset database:', error);
      throw new Error('Failed to reset database');
    }
  },

  async getAllPosts(): Promise<Post[]> {
    try {
      const db = await getDB();
      const posts = await db.getAll('posts');
      return posts || [];
    } catch (error) {
      console.error('Failed to get posts:', error);
      return [];
    }
  },

  async addPost(post: Post): Promise<void> {
    try {
      const db = await getDB();
      await db.add('posts', post);
    } catch (error) {
      console.error('Failed to add post:', error);
      throw new Error('Failed to add post');
    }
  },

  async updatePost(post: Post): Promise<void> {
    try {
      const db = await getDB();
      await db.put('posts', post);
    } catch (error) {
      console.error('Failed to update post:', error);
      throw new Error('Failed to update post');
    }
  },

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    try {
      const db = await getDB();
      const index = db.transaction('comments').store.index('byPostId');
      const comments = await index.getAll(postId);
      return comments || [];
    } catch (error) {
      console.error('Failed to get comments:', error);
      return [];
    }
  },

  async addComment(comment: Comment): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction(['comments', 'posts'], 'readwrite');
      
      await tx.objectStore('comments').add(comment);
      
      const post = await tx.objectStore('posts').get(comment.postId);
      if (post) {
        post.comments++;
        await tx.objectStore('posts').put(post);
      }
      
      await tx.done;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw new Error('Failed to add comment');
    }
  },

  async toggleLike(userId: string, postId: string): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction(['likes', 'posts'], 'readwrite');
      const likeKey = [userId, postId];
      
      const post = await tx.objectStore('posts').get(postId);
      if (!post) return;

      const hasLike = await tx.objectStore('likes').get(likeKey);
      
      if (hasLike) {
        await tx.objectStore('likes').delete(likeKey);
        post.upvotes = Math.max(0, post.upvotes - 1);
        post.liked = false;
      } else {
        await tx.objectStore('likes').add({
          userId,
          postId,
          timestamp: new Date().toISOString()
        });
        post.upvotes++;
        post.liked = true;
      }
      
      await tx.objectStore('posts').put(post);
      await tx.done;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw new Error('Failed to toggle like');
    }
  },

  async isLiked(userId: string, postId: string): Promise<boolean> {
    try {
      const db = await getDB();
      const like = await db.get('likes', [userId, postId]);
      return !!like;
    } catch (error) {
      console.error('Failed to check like status:', error);
      return false;
    }
  },

  async getUser(username: string) {
    try {
      const db = await getDB();
      return await db.get('users', username);
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  async addUser(user: any) {
    try {
      const db = await getDB();
      await db.add('users', user);
    } catch (error) {
      console.error('Failed to add user:', error);
      throw new Error('Failed to add user');
    }
  }
};