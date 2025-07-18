// hooks/useClientProducts.js
'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useClientProducts = (params = {}) => {
  const fetchProducts = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      params, // you can send page, search, etc
    });
    console.log("API response:", response.data);

    return response.data; // assuming { products, pagination }
  };

  return useQuery({
    queryKey: ['client-products', params],
    queryFn: fetchProducts,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};
