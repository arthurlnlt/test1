import { useCallback } from 'react';
import { useStore } from '../store';
import { useAuth } from '../auth-context';
import { dbOperations } from '../db';

export function usePosts() {
  const { posts, toggleLike: toggleLikeInStore, addPost } = useStore();
  const { currentUsername } = useAuth();

  const handleToggleLike = useCallback(
    async (postId: string) => {
      try {
        await dbOperations.toggleLike(currentUsername, postId);
        toggleLikeInStore(postId);
      } catch (error) {
        console.error('Failed to toggle like:', error);
      }
    },
    [currentUsername, toggleLikeInStore]
  );

  const handleAddPost = useCallback(
    (data: { title: string; content: string; imageUrl: string }) => {
      return addPost(data);
    },
    [addPost]
  );

  return {
    posts,
    toggleLike: handleToggleLike,
    addPost: handleAddPost,
  };
}