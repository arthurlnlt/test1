import { memo, useState, useRef } from 'react';
import { X, Upload, Loader2, Image as ImageIcon, Plus } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useAuth } from '../../lib/auth-context';
import { TOPICS } from '../../types/topic';
import { Topic } from '../../types/topic';

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSubjectModal = memo(function CreateSubjectModal({
  isOpen,
  onClose,
}: CreateSubjectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', description: '' });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    topic: TOPICS[0],
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addPost } = useStore();
  const { currentUsername } = useAuth();

  const handleCreateTopic = () => {
    if (newTopic.name && newTopic.description) {
      const topic: Topic = {
        id: TOPICS.length + 1,
        name: newTopic.name,
        description: newTopic.description,
      };
      TOPICS.push(topic);
      setFormData(prev => ({ ...prev, topic }));
      setNewTopic({ name: '', description: '' });
      setIsCreatingTopic(false);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setPreviewUrl(imageUrl);
      setFormData(prev => ({ ...prev, imageUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          handleImageUpload(file);
          break;
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addPost(formData, currentUsername);
      onClose();
      setFormData({ title: '', content: '', imageUrl: '', topic: TOPICS[0] });
      setPreviewUrl('');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-lighter rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-bold text-white">Create a New Subject</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6" onPaste={handlePaste}>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-300">
                Topic
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingTopic(!isCreatingTopic)}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                {isCreatingTopic ? 'Cancel' : 'Create new topic'}
              </button>
            </div>

            {isCreatingTopic ? (
              <div className="space-y-4 bg-background-card p-4 rounded-md">
                <div>
                  <label htmlFor="topicName" className="block text-sm font-medium text-gray-300 mb-1">
                    Topic Name
                  </label>
                  <input
                    type="text"
                    id="topicName"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter topic name..."
                  />
                </div>
                <div>
                  <label htmlFor="topicDescription" className="block text-sm font-medium text-gray-300 mb-1">
                    Topic Description
                  </label>
                  <input
                    type="text"
                    id="topicDescription"
                    value={newTopic.description}
                    onChange={(e) => setNewTopic(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter topic description..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateTopic}
                  disabled={!newTopic.name || !newTopic.description}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create Topic
                </button>
              </div>
            ) : (
              <select
                id="topic"
                value={formData.topic.id}
                onChange={(e) => {
                  const topic = TOPICS.find(t => t.id === Number(e.target.value));
                  if (topic) {
                    setFormData(prev => ({ ...prev, topic }));
                  }
                }}
                className="w-full bg-background-card rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {TOPICS.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name} - {topic.description}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-background-card rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a title for your subject"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full h-24 bg-background-card rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write your content here..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Image
            </label>
            <div
              className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl('');
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors text-sm"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose file
                    </button>
                    <p className="mt-1 text-xs text-gray-400">
                      or drag and drop, paste from clipboard
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.imageUrl}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Subject'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});