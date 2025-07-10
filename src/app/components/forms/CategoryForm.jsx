'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModalStore } from '../../store/modalStore';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CategoryForm() {
  const queryClient = useQueryClient();
  const { modalData, activeModals, closeModal } = useModalStore();
  const isEdit = !!modalData?.categoryForm;
  const isVisible = activeModals['categoryForm'];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    type: 'hardware'
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const { name, description, imageUrl, type } = modalData.categoryForm;
      setFormData({ name, description, imageUrl, type });
    }
  }, [modalData, isEdit]);

  const mutation = useMutation({
    mutationFn: (data) => {
      const url = isEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${modalData.categoryForm._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;
      const method = isEdit ? 'PUT' : 'POST';

      return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => {
        if (!res.ok) throw new Error('Failed to save category');
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      closeModal('categoryForm');
    },
    onError: (err) => {
      alert(err.message || 'Something went wrong');
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, imageUrl: result.secure_url }));
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h2>
          <button onClick={() => closeModal('categoryForm')}>
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="hardware">Hardware</option>
              <option value="paint">Paint</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Uploaded"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => closeModal('categoryForm')}
              className="px-4 py-2 text-sm bg-gray-100 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isLoading || isUploading}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {mutation.isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
