'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/app/components/Toast';
import { useAdmin } from '../../context/adminContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '@/app/hooks/useCategories';
import { uploadToCloudinary } from '@/app/utils/cloudinary';

const ProductModal = ({ isOpen, onClose, initialData = null, refetch }) => {
  const { getAuthHeaders } = useAdmin();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    type: 'hardware',
    images: [],
    tags: [],
    brand: '',
    model: '',
    specifications: {},
    availableColors: [],
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: categoryData } = useCategories({ limit: 100 });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        categoryId: initialData.categoryId?._id || '',
        type: initialData.type || 'hardware',
        images: initialData.images || [],
        tags: initialData.tags || [],
        brand: initialData.brand || '',
        model: initialData.model || '',
        specifications: initialData.specifications || {},
        availableColors: initialData.availableColors?.map(c => c._id) || [],
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        type: 'hardware',
        images: [],
        tags: [],
        brand: '',
        model: '',
        specifications: {},
        availableColors: [],
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      const newImage = { url: result.secure_url, alt: formData.name || 'Product Image' };
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
      success('Image uploaded!');
    } catch (err) {
      console.error('Upload error:', err);
      error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (initialData) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${initialData._id}`, payload, {
          headers: getAuthHeaders(),
        });
        success('Product updated successfully!');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, payload, {
          headers: getAuthHeaders(),
        });
        success('Product added successfully!');
      }

      onClose();
      refetch?.();
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
            className="bg-white rounded-lg w-full max-w-2xl p-0 shadow-xl overflow-y-auto max-h-[90vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6 space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {initialData ? 'Edit Product' : 'Add Product'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Enter product name" 
                      required 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange} 
                      type="number" 
                      placeholder="0.00" 
                      required 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input 
                      name="stock" 
                      value={formData.stock} 
                      onChange={handleChange} 
                      type="number" 
                      placeholder="0" 
                      required 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      name="categoryId" 
                      value={formData.categoryId} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      required
                    >
                      <option value="">Select Category</option>
                      {categoryData?.categories?.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select 
                      name="type" 
                      value={formData.type} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hardware">Hardware</option>
                      <option value="paint">Paint</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input 
                      name="brand" 
                      value={formData.brand} 
                      onChange={handleChange} 
                      placeholder="Enter brand" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Enter product description" 
                    rows={3} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>

                {/* Improved Image Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Product Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 transition-colors hover:border-blue-400">
                    <label 
                      htmlFor="product-image" 
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center py-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          {uploading ? 'Uploading...' : 'Drag and drop or click to browse'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG up to 5MB
                        </p>
                      </div>
                      <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Uploaded Images */}
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({formData.images.length})</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {formData.images.map((img, i) => (
                          <div key={i} className="relative group aspect-square">
                            <img
                              src={img.url}
                              alt={img.alt}
                              className="w-full h-full object-cover rounded-md border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleImageDelete(i)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              title="Remove image"
                              aria-label="Remove image"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Product is active and visible to customers
                  </label>
                </div>

                <input
  type="file"
  accept=".csv"
  onChange={handleCSVUpload}
  className="hidden"
  ref={fileInputRef}
/>
<button
  onClick={() => fileInputRef.current.click()}
  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition text-sm"
>
  Upload CSV
</button>


                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {initialData ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : initialData ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;