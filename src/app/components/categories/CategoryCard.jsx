'use client';

import { PencilIcon } from '@heroicons/react/24/outline';
import { useModalStore } from '../../store/modalStore';

export default function CategoryCard({ category }) {
  const { openModal } = useModalStore();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={category.imageUrl || '/placeholder.png'}
            alt={category.name}
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <p className="text-sm text-gray-500">{category.type}</p>
            {category.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{category.description}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => openModal('categoryForm', category)}
          className="text-blue-600 hover:text-blue-800"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
