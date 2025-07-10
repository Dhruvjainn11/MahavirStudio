// ✅ Refactored Category Page with Zustand + React Query
'use client';

import { useEffect } from 'react';
import { useCategoryStore } from '../../store/categoryStore';
import { useModalStore } from '../../store/modalStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import CategoryForm from '../../components/forms/CategoryForm';
import SearchInput from '../../components/common/SearchInput';
import FilterDropdown from '../../components/common/FilterDropdown';
import CategoryCard from '../../components/categories/CategoryCard';

const fetchCategories = async ({ queryKey }) => {
  const [_key, search, filter] = queryKey;
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (filter && filter !== 'all') params.set('type', filter);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const { searchQuery, filterValue, setSearchQuery, setFilterValue } = useCategoryStore();
  const { openModal } = useModalStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories', searchQuery, filterValue],
    queryFn: fetchCategories,
  });

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Hardware', value: 'hardware' },
    { label: 'Paint', value: 'paint' },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600">Manage product categories and subcategories</p>
            </div>
            <button
              onClick={() => openModal('categoryForm')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add Category
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <SearchInput
              placeholder="Search categories..."
              onSearch={setSearchQuery}
              defaultValue={searchQuery}
            />
            <FilterDropdown
              options={filterOptions}
              value={filterValue}
              onChange={setFilterValue}
            />
          </div>

          {/* Loader / Error */}
          {isLoading ? (
            <div className="text-center py-12 text-blue-500">Loading...</div>
          ) : error ? (
            <div className="text-red-500">Error: {error.message}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onEdit={() => openModal('categoryForm', category)}
                />
              ))}
              {data?.length === 0 && <p className="text-gray-400">No categories found.</p>}
            </div>
          )}

          {/* Modal for Add/Edit */}
          <CategoryForm />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
