'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import RevenueChart from '../../components/dashboard/RevenueChart';
import TopProducts from '../../components/dashboard/TopSellingProductsList';
import RecentOrders from '../../components/dashboard/RecentOrdersTable';
import OrdersByStatusChart from '../../components/dashboard/OrdersByStatusChart';
import { useAdmin } from '../../context/adminContext';
import { FiActivity, FiTrendingUp, FiPackage, FiShoppingCart } from 'react-icons/fi';

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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-500 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-10 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="text-red-600 text-xl font-medium mb-2">Error Loading Dashboard</h3>
          <p className="text-red-500">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.data;

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                  <p className="text-gray-500 mt-1">
                    Welcome back! Here`s what`s happening with your store today.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                    <FiActivity className="text-blue-500" />
                    <span className="text-sm font-medium">Real-time Data</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                    <FiTrendingUp className="text-green-500" />
                    <span className="text-sm font-medium">
                      {stats?.thisMonth?.revenueGrowth >= 0 ? '+' : ''}
                      {stats?.thisMonth?.revenueGrowth}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <DashboardOverview overview={stats.overview} thisMonth={stats.thisMonth} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RevenueChart />
                  <OrdersByStatusChart />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <TopProducts products={stats.topSellingProducts} />
                <RecentOrders orders={stats.recentOrders} />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}