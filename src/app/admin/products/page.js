'use client';
import { useState } from 'react';
import ProtectedRoute from '@/app/components/admin/ProtectedRoute';
import AdminLayout from '@/app/components/admin/AdminLayout';
import ProductTable from '@/app/components/products/ProductTable';



const ProductsPage = () => {

    
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Manage Products</h1>
          <ProductTable />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default ProductsPage;
