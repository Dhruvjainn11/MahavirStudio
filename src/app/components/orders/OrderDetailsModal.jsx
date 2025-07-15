'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useOrderStore from '../../store/orderStore';
import { useAdmin } from '../../context/adminContext';

const statusOptions = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const paymentStatusOptions = ['pending', 'paid', 'failed', 'refunded'];

export default function OrderDetailsModal() {
  const { getAuthHeaders } = useAdmin();
  const queryClient = useQueryClient();
  const { showModal, selectedOrder, setShowModal, setSelectedOrder } = useOrderStore();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error('Failed to update order status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}/payment-status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ paymentStatus: newStatus }),
        }
      );
      if (!res.ok) throw new Error('Failed to update payment status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
    },
  });

  if (!showModal || !selectedOrder) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Order Details - {selectedOrder?._id?.slice(-8)}
          </h3>
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedOrder(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Order ID:</span> {selectedOrder._id}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Total:</span>{' '}
                  {formatCurrency(selectedOrder.totalAmount)}
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{' '}
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{' '}
                  {selectedOrder.userId?.name || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  {selectedOrder.userId?.email || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{' '}
                  {selectedOrder.userId?.phone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ">
                Order Status
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  updateOrderStatusMutation.mutate({
                    orderId: selectedOrder._id,
                    newStatus: e.target.value,
                  })
                }
                disabled={updateOrderStatusMutation.isLoading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={selectedOrder.paymentStatus}
                onChange={(e) =>
                  updatePaymentStatusMutation.mutate({
                    orderId: selectedOrder._id,
                    newStatus: e.target.value,
                  })
                }
                disabled={updatePaymentStatusMutation.isLoading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shipping Address */}
          {selectedOrder.shippingAddress && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
              <div className="text-sm">
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>
                  {selectedOrder.shippingAddress.city},{' '}
                  {selectedOrder.shippingAddress.state}
                </p>
                <p>
                  {selectedOrder.shippingAddress.zipCode},{' '}
                  {selectedOrder.shippingAddress.country}
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          {item.image && (
                            <img
                              className="h-8 w-8 rounded object-cover mr-2"
                              src={item.image}
                              alt={item.name}
                            />
                          )}
                          <span className="text-sm text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {selectedOrder.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}