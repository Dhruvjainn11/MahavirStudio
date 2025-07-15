'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import RevenueChart from '../../components/dashboard/RevenueChart';
import TopProducts from '../../components/dashboard/TopSellingProductsList';
import RecentOrders from '../../components/dashboard/RecentOrdersTable';
import { useAdmin } from '../../context/adminContext';

export default function DashboardPage() {
  const { getAuthHeaders } = useAdmin();

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/stats`, {
        headers: {
          ...getAuthHeaders()
        }
      });
      if (!res.ok) throw new Error('Failed to load dashboard stats');
      return res.json();
    }
  });

  if (isLoading) {
    return <div className="text-center p-10 text-blue-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error.message}</div>;
  }

  const stats = data?.data;

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          <DashboardOverview overview={stats.overview} thisMonth={stats.thisMonth} />
          <RevenueChart />
          <TopProducts products={stats.topSellingProducts} />
          <RecentOrders orders={stats.recentOrders} />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
