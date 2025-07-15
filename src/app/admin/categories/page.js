'use client';
import { useState } from 'react';
import ProtectedRoute from '@/app/components/admin/ProtectedRoute';
import AdminLayout from '@/app/components/admin/AdminLayout';
import CategoryTable from '@/app/components/categories/CategoryTable';




const CategoriesPage = () => {
    
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>
          <CategoryTable />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default CategoriesPage;
