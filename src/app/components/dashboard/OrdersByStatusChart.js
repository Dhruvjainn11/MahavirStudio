'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const STATUS_COLORS = {
  pending: '#fbbf24',
  confirmed: '#3b82f6',
  processing: '#6366f1',
  shipped: '#10b981',
  delivered: '#22c55e',
  cancelled: '#ef4444',
  returned: '#f43f5e',
};

const formatStatus = (status) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const OrdersByStatusChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders-by-status'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch order status stats');
      return res.json();
    },
  });

  const orderStats = data?.data?.ordersByStatus
    ? Object.entries(data.data.ordersByStatus).map(([status, count]) => ({
        status,
        count,
      }))
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders by Status</h2>

      {isLoading ? (
        <p className="text-center text-blue-500 py-6">Loading chart...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-6">{error.message}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orderStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" tickFormatter={formatStatus} />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} orders`, '']} />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              label={{ position: 'top' }}
            >
              {orderStats.map((entry, index) => (
                <cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] || '#94a3b8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default OrdersByStatusChart;
