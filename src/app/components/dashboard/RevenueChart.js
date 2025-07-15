'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const formatLabel = (item, period) => {
  if (period === 'daily') return `${item._id.day}/${item._id.month}`;
  if (period === 'weekly') return `W${item._id.week}`;
  return `${item._id.month}/${item._id.year}`;
};

const RevenueChart = () => {
  const [period, setPeriod] = useState('monthly');

  const { data, isLoading, error } = useQuery({
    queryKey: ['revenue', period],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/revenue-analytics?period=${period}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch revenue data');
      return res.json();
    }
  });

  const revenueData = data?.data?.revenueData.map(item => ({
    ...item,
    label: formatLabel(item._id, period)
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Revenue Trends</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option value="daily">Last 30 Days</option>
          <option value="weekly">Last 12 Weeks</option>
          <option value="monthly">Last 12 Months</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-center text-blue-500 py-6">Loading chart...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-6">{error.message}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;
