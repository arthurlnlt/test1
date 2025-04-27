import { memo, useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../../lib/store';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = memo(function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { addComment, getComments } = useStore();
  const comments = getComments(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(postId, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-background-card rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Send
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-background-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{comment.author}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
});