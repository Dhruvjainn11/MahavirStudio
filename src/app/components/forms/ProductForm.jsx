// components/forms/ProductForm.jsx
'use client';
  import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModalStore } from '../../store/modalStore';
import { useProductStore } from '../../store/productStore'; // Your Zustand store for filters/form
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProductForm() {
  const queryClient = useQueryClient();
const { activeModals, modalData, closeModal } = useModalStore();
const isOpen = activeModals['productForm'];
const data = modalData['productForm'];
const isEdit = !!data;


  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    type: 'hardware',
    categoryId: '',
    availableColors: [],
    brand: '',
    model: '',
images:  [{ url: '', alt: '' }]
  });

useEffect(() => {
  if (isEdit && data) {
    setFormData({
      name: data.name || '',
      description: data.description || '',
      price: data.price?.toString() || '',
      stock: data.stock?.toString() || '',
      type: data.type || 'hardware',
      categoryId: data.categoryId?._id || data.categoryId || '',
      availableColors: data.availableColors?.map(c => c._id) || [],
      brand: data.brand || '',
      model: data.model || '',
      images: data.images?.length
        ? data.images.map(img => ({
            url: img.url || '',
            alt: img.alt || '',
          }))
        : [{ url: '', alt: '' }],
    });
  } else {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      type: 'hardware',
      categoryId: '',
      availableColors: [],
      brand: '',
      model: '',
      images: [{ url: '', alt: '' }],
    });
  }
}, [isEdit, data]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, field, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index][field] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const mutation = useMutation({
    
   mutationFn: async () => {
  const finalFormData = {
    ...formData,
    price: Number(formData.price),
    stock: Number(formData.stock),
  };

  console.log('Submitting finalFormData:', finalFormData);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${isEdit ? data._id : ''}`,
    {
      method: isEdit ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('adminToken') || '',
      },
      body: JSON.stringify(finalFormData),
    }
  );
  console.log(res)

  if (!res.ok) {
    const err = await res.json();
    console.error('Error response:', err);
    throw new Error(err.message || 'Failed to save product');
  }

  return res.json();
},

    
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      closeModal('productForm');
    },
    onError: (err) => {
      alert(err.message);
    },
  });



const fetchCategories = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('adminToken') || '',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

const { data: categoryData, isLoading: loadingCategories } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
});



if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 opacity-95 flex justify-center items-center z-50 overflow-y-auto backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-xl w-full max-w-3xl p-8 relative shadow-2xl transform transition-transform duration-300 mt-auto">
        <button onClick={() => closeModal('productForm')} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Add'} Product</h2>
          <p className="text-sm text-gray-600 mt-1">Fill in the details below to {isEdit ? 'update' : 'create'} a product</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Enter product name" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="Enter price" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Stock</label>
                <input 
                  type="number" 
                  name="stock" 
                  value={formData.stock} 
                  onChange={handleChange} 
                  placeholder="Enter stock quantity" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="hardware">Hardware</option>
                  <option value="paint">Paint</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                <input 
                  name="brand" 
                  value={formData.brand} 
                  onChange={handleChange} 
                  placeholder="Enter brand name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Model</label>
                <input 
                  name="model" 
                  value={formData.model} 
                  onChange={handleChange} 
                  placeholder="Enter model number" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
             <div>
  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
  <select
    name="categoryId"
    value={formData.categoryId}
    onChange={handleChange}
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
  >
    <option value="">Select a category</option>
    {categoryData?.data?.categories?.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>


            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={3} 
                placeholder="Enter product description" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
              />
              </div>
              </div>
             

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Product Images</h3>
            <div className="space-y-3">
              {formData.images.map((img, index) => (
                <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Image URL</label>
                      <input
                        type="url"
                        placeholder="Enter image URL"
                        value={img.url}
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Alt Text</label>
                      <input
                        placeholder="Enter image description"
                        value={img.alt}
                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newImgs = formData.images.filter((_, i) => i !== index);
                        setFormData({ ...formData, images: newImgs });
                      }}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, images: [...formData.images, { url: '', alt: '' }] })}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                <span className="mr-1">+</span> Add Another Image
              </button>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulk Import Products (CSV)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = async (event) => {
                          try {
                            const csvData = event.target?.result;
                            const rows = csvData.split('\n').map(row => row.split(','));
                            const headers = rows[0].map(header => header.trim());
                            const products = rows.slice(1).map(row => {
                              const product = {};
                              headers.forEach((header, index) => {
                                let value = row[index]?.trim() || '';
                                if (header === 'price' || header === 'stock') {
                                  value = Number(value);
                                } else if (header === 'images') {
                                  try {
                                    value = JSON.parse(value);
                                  } catch {
                                    value = [{ url: '', alt: '' }];
                                  }
                                }
                                product[header] = value;
                              });
                              return product;
                            });

                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/bulk-import`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: localStorage.getItem('adminToken') || '',
                              },
                              body: JSON.stringify({ products }),
                            });

                            if (!response.ok) {
                              throw new Error('Failed to import products');
                            }

                            queryClient.invalidateQueries(['products']);
                            alert('Products imported successfully!');
                            closeModal('productForm');
                          } catch (error) {
                            console.error('Import error:', error);
                            alert('Failed to import products. Please check your CSV format.');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const csvContent = 'name,description,price,stock,type,categoryId,brand,model,images\nExample Product,Description,100,10,hardware,category_id,Brand Name,Model123,[{"url":"image_url","alt":"image_description"}]';
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'product_template.csv';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Download Template
                  </a>
                </div>
                <p className="mt-2 text-sm text-gray-500">Upload a CSV file with product details. Download the template for the correct format.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => closeModal('productForm')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  isEdit ? 'Update Product' : 'Create Product'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    
    )}
