import { useCallback } from 'react';
import { useStore } from '../store';

export function useComments(postId: string) {
  const { addComment: addCommentToStore, getComments } = useStore();
  const comments = getComments(postId);

  const addComment = useCallback(
    (postId: string, content: string, author: string) => {
      return addCommentToStore(postId, content, author);
    },
    [addCommentToStore]
  );

  return {
    comments,
    addComment,
  };
};