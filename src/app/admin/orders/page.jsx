'use client';

import { useState } from 'react';
import { useOrders } from '@/app/hooks/useOrders';
import { FaSearch, FaFileExport, FaFileInvoice, FaFileCsv } from 'react-icons/fa';
import AdminLayout from '@/app/components/admin/AdminLayout';
import ProtectedRoute from '@/app/components/admin/ProtectedRoute';
import OrderDetailsModal from '@/app/components/orders/OrderDetailsModal';
import { useToast } from '@/app/components/Toast';
import { useAdmin } from '@/app/context/adminContext';
import axios from 'axios';

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { success, error: showError } = useToast();
  const { getAuthHeaders } = useAdmin();

  const {
    orders,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    useOrderDetails,
    refetch,
  } = useOrders({ page: 1, search, status, paymentStatus });

  const exportToCSV = () => {
    if (!orders || orders.length === 0) {
      showError('No orders to export');
      return;
    }

    try {
      // Prepare CSV headers
      const headers = [
        'Order ID',
        'Customer Name',
        'Customer Email',
        'Total Amount',
        'Status',
        'Payment Status',
        'Order Date',
        'Items Count'
      ].join(',');

      // Prepare CSV rows
      const rows = orders.map(order => [
        order._id,
        `"${order.userId?.name || 'Unknown'}"`,
        `"${order.userId?.email || ''}"`,
        order.totalAmount.toFixed(2),
        order.status,
        order.paymentStatus,
        new Date(order.createdAt).toLocaleDateString(),
        order.items.length
      ].join(','));

      // Combine headers and rows
      const csvContent = [headers, ...rows].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      success('Orders exported to CSV successfully');
    } catch (err) {
      console.error('Export failed:', err);
      showError('Failed to export orders');
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}/invoice`,
        {
          headers: getAuthHeaders(),
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      success('Invoice downloaded successfully');
    } catch (err) {
      console.error('Invoice download failed:', err);
      showError('Failed to download invoice');
    }
  };

  return (
    <AdminLayout>
      <ProtectedRoute>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
              >
                <FaFileCsv size={14} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No orders found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.userId?.name || 'Guest'}</div>
                          <div className="text-sm text-gray-500">{order.userId?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                            order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrderId(order._id);
                                setShowDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => downloadInvoice(order._id)}
                              className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            >
                              <FaFileInvoice size={12} />
                              Invoice
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border-t border-b border-gray-300 text-sm font-medium ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          <OrderDetailsModal
            orderId={selectedOrderId}
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            useOrderDetails={useOrderDetails}
            refetch={refetch}
          />
        </div>
      </ProtectedRoute>
    </AdminLayout>
  );
}