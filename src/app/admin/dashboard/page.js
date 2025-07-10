'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/adminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import {
  UsersIcon,
  CubeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';



export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('adminToken'); // ✅ direct read inside useEffect
  
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/stats`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setDashboardData(data.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    // ✅ Only call it on client
    if (typeof window !== 'undefined') {
      fetchDashboardData();
    }
  }, []);
  

  

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            {trend === 'up' ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>{trendValue}</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6 mt-15">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={dashboardData?.overview?.totalUsers?.toLocaleString() || '0'}
              icon={UsersIcon}
              trend="up"
              trendValue={dashboardData?.thisMonth?.userGrowth || '0%'}
              color="text-blue-600"
            />
            <StatCard
              title="Total Products"
              value={dashboardData?.overview?.totalProducts?.toLocaleString() || '0'}
              icon={CubeIcon}
              color="text-green-600"
            />
            <StatCard
              title="Total Orders"
              value={dashboardData?.overview?.totalOrders?.toLocaleString() || '0'}
              icon={ShoppingBagIcon}
              trend="up"
              trendValue={dashboardData?.thisMonth?.orderGrowth || '0%'}
              color="text-purple-600"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(dashboardData?.overview?.totalRevenue || 0)}
              icon={CurrencyDollarIcon}
              color="text-yellow-600"
            />
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
