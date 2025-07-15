'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};

const fetchCategories = async ({ page = 1, limit = 10, search = '', type = '', sortBy = 'name', sortOrder = 'asc' }) => {
  const response = await axios.get(`http://localhost:3001/api/admin/categories`, {
    headers: {
      ...getAuthHeaders()
    },
    params: { page, limit, search, type, sortBy, sortOrder },
  });

  // ✅ Ensure response is shaped as expected
  return response.data.data; // <- This assumes backend sends { success, data: { categories, pagination } }
};

export const useCategories = (params) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => fetchCategories(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    onError: (err) => {
      console.error('❌ useCategories error:', err);
    }
  });
};
