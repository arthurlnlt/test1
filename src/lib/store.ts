import { create } from 'zustand';
import { Post } from '../types/post';
import { Comment } from '../types/comment';
import { Topic, TOPICS } from '../types/topic';
import { dbOperations } from './db';

interface Store {
  posts: Post[];
  comments: Comment[];
  topics: Topic[];
  isLoading: boolean;
  error: string | null;
  initializeStore: () => Promise<void>;
  addPost: (data: { title: string; content: string; imageUrl: string; topic: Topic }, author: string) => void;
  updatePost: (post: Post) => Promise<void>;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string, author: string) => void;
  getComments: (postId: string) => Comment[];
  addTopic: (name: string, description: string) => Topic;
}

export const useStore = create<Store>((set, get) => ({
  posts: [],
  comments: [],
  topics: TOPICS,
  isLoading: false,
  error: null,

  initializeStore: async () => {
    try {
      set({ isLoading: true, error: null });
      const posts = await dbOperations.getAllPosts();
      
      const allComments: Comment[] = [];
      for (const post of posts) {
        const postComments = await dbOperations.getCommentsByPostId(post.id);
        allComments.push(...postComments);
      }

      set({ 
        posts, 
        comments: allComments,
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to initialize store:', error);
      set({ error: 'Failed to load data. Please try again.', isLoading: false });
    }
  },

  addTopic: (name: string, description: string) => {
    const newTopic: Topic = {
      id: get().topics.length + 1,
      name,
      description
    };
    set(state => ({ topics: [...state.topics, newTopic] }));
    return newTopic;
  },

  addPost: async (data, author) => {
    const newPost: Post = {
      id: Date.now().toString(),
      ...data,
      author,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      comments: 0,
      liked: false,
    };

    try {
      await dbOperations.addPost(newPost);
      set(state => ({ posts: [newPost, ...state.posts] }));
    } catch (error) {
      console.error('Failed to add post:', error);
    }
  },

  updatePost: async (post: Post) => {
    try {
      await dbOperations.updatePost(post);
      set(state => ({
        posts: state.posts.map(p => p.id === post.id ? post : p)
      }));
    } catch (error) {
      console.error('Failed to update post:', error);
      throw new Error('Failed to update post');
    }
  },

  toggleLike: (postId: string) => {
    set(state => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, liked: !post.liked, upvotes: post.liked ? post.upvotes - 1 : post.upvotes + 1 }
          : post
      ),
    }));
  },

  addComment: async (postId: string, content: string, author: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author,
      content,
      createdAt: new Date().toISOString(),
    };

    try {
      await dbOperations.addComment(newComment);
      set(state => ({
        comments: [...state.comments, newComment],
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, comments: post.comments + 1 }
            : post
        ),
      }));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  },

  getComments: (postId) => get().comments.filter(comment => comment.postId === postId),
}));