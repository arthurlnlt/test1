import { useState, memo } from 'react';
import { Plus } from 'lucide-react';
import { CreateSubjectModal } from './CreateSubjectModal';

export const CreateSubjectButton = memo(function CreateSubjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-md transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <Plus className="h-5 w-5" />
        Create a subject
      </button>

      <CreateSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});