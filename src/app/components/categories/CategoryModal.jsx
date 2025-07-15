'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/app/components/Toast'; // Adjust path if needed
import { useAdmin } from '../../context/adminContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryModal = ({ isOpen, onClose, initialData = null, refetch }) => {
   const { getAuthHeaders } = useAdmin();
  const { success, error } = useToast();

  const isEdit = Boolean(initialData);
const [name, setName] = useState(initialData?.name || '');
const [type, setType] = useState(initialData?.type || '');
const [description, setDescription] = useState(initialData?.description || '');
const [isActive, setIsActive] = useState(initialData?.isActive ?? true);


  const [formData, setFormData] = useState({
    name: '',
    type: 'hardware',
    description: '',
    isActive: true, 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (initialData) {
    setFormData({
      name: initialData.name || '',
      type: initialData.type || 'hardware',
      description: initialData.description || '',
      isActive: initialData.isActive ?? true,
    });
  } else {
    // Reset form if no initialData
    setFormData({
      name: '',
      type: 'hardware',
      description: '',
      isActive: true,
    });
  }
}, [initialData]);


  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        // Update
       await axios.put(
  `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${initialData._id}`,
  formData,
  {
    headers: {
      ...getAuthHeaders(),
    },
  }
);

       success(`Category ${initialData ? 'updated' : 'created'}: ${formData.name}`);

      } else {
        // Create
      await axios.post(
  `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`,
  formData,
  {
    headers: {
      ...getAuthHeaders(),
    },
  }
);

        success('Category created successfully');
      }
      onClose();
      refetch?.(); // optional refetch
    } catch (err) {
      console.error(err);
      error(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold">
              {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="hardware">Hardware</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label className="text-sm font-medium">Active</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;
