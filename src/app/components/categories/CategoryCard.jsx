'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useModalStore } from '../../store/modalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CategoryCard({ category }) {
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{category.type}</p>
            {category.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{category.description}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => openModal('categoryForm', category)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
            title="Edit category"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
            title="Delete category"
            disabled={deleteMutation.isLoading}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    
  );
}
