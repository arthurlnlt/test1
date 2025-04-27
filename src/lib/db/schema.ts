import { IDBPDatabase } from 'idb';
import { INITIAL_POSTS } from './config';

export async function createSchema(db: IDBPDatabase) {
  // Create users store
  if (!db.objectStoreNames.contains('users')) {
    const userStore = db.createObjectStore('users', { keyPath: 'username' });
    userStore.createIndex('email', 'email', { unique: true });
  }

  // Create posts store
  if (!db.objectStoreNames.contains('posts')) {
    const postStore = db.createObjectStore('posts', { keyPath: 'id' });
    postStore.createIndex('byDate', 'createdAt');
    postStore.createIndex('byAuthor', 'author');
    
    // Add initial posts
    for (const post of INITIAL_POSTS) {
      await postStore.add(post);
    }
  }

  // Create comments store
  if (!db.objectStoreNames.contains('comments')) {
    const commentStore = db.createObjectStore('comments', { keyPath: 'id' });
    commentStore.createIndex('byPostId', 'postId');
    commentStore.createIndex('byAuthor', 'author');
  }

  // Create likes store
  if (!db.objectStoreNames.contains('likes')) {
    const likeStore = db.createObjectStore('likes', { keyPath: ['userId', 'postId'] });
    likeStore.createIndex('byPostId', 'postId');
    likeStore.createIndex('byUserId', 'userId');
  }
}