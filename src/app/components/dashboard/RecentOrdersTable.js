'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FaClock } from 'react-icons/fa';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const RecentOrdersTable = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch recent orders');
      return res.json();
    },
  });

  const orders = data?.data?.recentOrders || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaClock className="text-blue-500" />
        Recent Orders
      </h2>

      {isLoading ? (
        <p className="text-center text-blue-500 py-6">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-6">{error.message}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 py-6">No recent orders found</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b">
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.customer}</td>
                <td className="py-2 px-4">{order.email}</td>
                <td className="py-2 px-4">₹{order.amount.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-4">{format(new Date(order.date), 'dd MMM yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentOrdersTable;
