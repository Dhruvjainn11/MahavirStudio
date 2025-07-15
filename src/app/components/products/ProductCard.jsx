'use client';

import { PencilIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline';
import { useModalStore } from '../../store/modalStore';

export default function ProductCard({ product, onDelete }) {
  const { openModal } = useModalStore();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition duration-150 space-y-3">
      {/* Image + Info */}
      <div className="flex items-center gap-3">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="w-16 h-16 rounded-md object-cover"
          />
        ) : (
          <CubeIcon className="w-12 h-12 text-gray-400" />
        )}
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">
            {product.brand} {product.model && `- ${product.model}`}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>Type: <span className="capitalize">{product.type}</span></p>
        <p>Category: {product.categoryId?.name || 'N/A'}</p>
        <p>Stock: {product.stock}</p>
        <p>Price: <span className="font-medium">{formatCurrency(product.price)}</span></p>
      </div>

      {/* Status + Actions */}
      <div className="flex justify-between items-center pt-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            product.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.isActive ? 'Active' : 'Inactive'}
        </span>

        <div className="flex gap-3">
          <button
            onClick={() => openModal('productForm', product)}
            className="text-blue-600 hover:text-blue-800"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="text-red-600 hover:text-red-800"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
