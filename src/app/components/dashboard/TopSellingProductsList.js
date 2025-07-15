
'use client';

import { useQuery } from '@tanstack/react-query';
import { FaBoxOpen } from 'react-icons/fa';

const TopSellingProductsList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['top-selling-products'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch top products');
      return res.json();
    },
  });

  const products = data?.data?.topSellingProducts || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaBoxOpen className="text-blue-500" />
        Top Selling Products
      </h2>

      {isLoading ? (
        <p className="text-center text-blue-500 py-6">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-6">{error.message}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-6">No data available</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {products.map((product) => (
            <li key={product.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-500">{product.totalSold} sold</p>
              </div>
              <p className="text-sm font-semibold text-green-600">₹{product.revenue.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopSellingProductsList;
