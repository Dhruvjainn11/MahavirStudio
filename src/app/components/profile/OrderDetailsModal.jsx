"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/components/Toast";

const OrderDetailsModal = ({ isOpen, onClose, order, onOrderUpdate }) => {
  const { cancelOrder } = useAuth();
  const { success, error } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  if (!isOpen || !order) return null;

  const canCancel = ['pending', 'confirmed'].includes(order.status);

  const handleCancelOrder = async () => {
    if (!canCancel) return;

    setIsCancelling(true);
    try {
      const result = await cancelOrder(order._id);
      if (result.success) {
        success("Order cancelled successfully");
        onOrderUpdate(result.order); // This will trigger the removal
        onClose();
      } else {
        error(result.error || "Failed to cancel order");
      }
    } catch (err) {
      error("An error occurred while cancelling order");
    } finally {
      setIsCancelling(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order._id}</p>
            </div>
           
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium">₹{order.totalAmount}</p>
            </div>

              {canCancel && (
            <div className="pt-4 border-t">
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className={`px-4 py-2 rounded-md text-white ${
                  isCancelling 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                } transition-colors`}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                You can cancel this order as it's still in {order.status} status.
              </p>
            </div>
          )}
          </div>

          <div className="pt-4">
            <h4 className="font-semibold text-gray-700 pb-2 border-b">Items</h4>
            <ul className="divide-y">
              {order.items?.map((item, index) => (
                <li key={index} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{item.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;