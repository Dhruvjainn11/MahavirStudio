'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAdmin } from '@/app/context/adminContext';

export const useProducts = (params) => {
  const { getAuthHeaders } = useAdmin();

  const fetchProducts = async () => {
    const {
      page = 1,
      limit = 10,
      search = '',
      type = '',
      categoryId = '',
      brand = '',
      inStock = '',
      sortBy = 'name',
      sortOrder = 'asc',
    } = params;

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, {
      headers: getAuthHeaders(),
      params: {
        page,
        limit,
        search,
        type,
        categoryId,
        brand,
        inStock,
        sortBy,
        sortOrder,
      },
    });

    return response.data.data; // { products, pagination }
  };

  return useQuery({
    queryKey: ['products', params],
    queryFn: fetchProducts,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};
