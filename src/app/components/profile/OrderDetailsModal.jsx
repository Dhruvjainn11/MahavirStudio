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

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return "N/A";
    const parts = [address.street, address.city, address.state, address.zipCode, address.country].filter(Boolean);
    return parts.join(', ');
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
        <div className="p-6 space-y-6"> {/* Increased space-y for better separation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Changed to 2 columns for wider screens */}
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order._id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800' // For confirmed, processing, shipped
                } capitalize`}>
                  {order.status}
                </span>
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800' // For refunded
                } capitalize`}>
                  {order.paymentStatus}
                </span>
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">₹{order.totalAmount}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium capitalize">{order.paymentMethod || 'N/A'}</p>
            </div>

            {order.estimatedDelivery && (
                <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>
                </div>
            )}

            {order.trackingNumber && (
              <div>
                <p className="text-sm text-gray-500">Tracking Number</p>
                <p className="font-medium">
                  {/* You might want to create a dynamic link here based on courier */}
                  <a
                    href={`https://www.google.com/search?q=track+package+${order.trackingNumber}`} // Generic Google search
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {order.trackingNumber}
                  </a>
                </p>
              </div>
            )}
          </div>

          {order.billingDetails && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-700 pb-2">Billing Details</h4>
              <p className="text-sm text-gray-700">Name: {order.billingDetails.name}</p>
              <p className="text-sm text-gray-700">Email: {order.billingDetails.email}</p>
              <p className="text-sm text-gray-700">Phone: {order.billingDetails.phone}</p>
              <p className="text-sm text-gray-700">Address: {formatAddress(order.billingDetails.address)}</p>
            </div>
          )}

          {order.shippingAddress && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-700 pb-2">Shipping Address</h4>
              <p className="text-sm text-gray-700">Address: {formatAddress(order.shippingAddress)}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-gray-700 pb-2 border-b">Items</h4>
            <ul className="divide-y">
              {order.items?.map((item) => (
                <li key={item.productId || item._id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{item.price}</p>
                </li>
              ))}
            </ul>
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