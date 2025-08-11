"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/components/Toast";
import { FaBoxOpen, FaCalendarAlt, FaCreditCard } from "react-icons/fa"; // Added icons for visual clarity

const OrderDetailsModal = ({ isOpen, onClose, order, onOrderUpdate }) => {
  const { cancelOrder } = useAuth();
  const { success , error } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  if (!isOpen || !order) return null;

  const canCancel = ["pending", "confirmed"].includes(order.status);

  const handleCancelOrder = async () => {
    if (!canCancel) return;

    setIsCancelling(true);
    try {
      const result = await cancelOrder(order._id);
      if (result.success) {
        success("Order cancelled successfully");
        onOrderUpdate(result.order);
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

  const formatAddress = (address) => {
    if (!address) return "N/A";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-95 md:scale-100">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 focus:outline-none transition-colors"
          >
            <span className="text-3xl font-light leading-none">&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Order Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 font-medium">Order ID</p>
              <p className="font-mono text-sm text-gray-700">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Order Date</p>
              <p className="text-gray-700 text-sm">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClasses(order.status)}`}>
                {order.status}
              </span>
            </div>
            {order.estimatedDelivery && (
              <div>
                <p className="text-sm text-gray-500 font-medium">Estimated Delivery</p>
                <p className="text-gray-700 text-sm">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            )}
            {order.trackingNumber && (
              <div>
                <p className="text-sm text-gray-500 font-medium">Tracking Number</p>
                <a
                  href={`https://www.google.com/search?q=track+package+${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {order.trackingNumber}
                </a>
              </div>
            )}
          </div>

          {/* Shipping & Billing Section */}
          {(order.shippingAddress || order.billingDetails) && (
            <>
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping & Billing</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {order.shippingAddress && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-700 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-700">{formatAddress(order.shippingAddress)}</p>
                    </div>
                  )}
                  {order.billingDetails && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-700 mb-2">Billing Details</h4>
                      <p className="text-sm text-gray-700 font-semibold">{order.billingDetails.name}</p>
                      <p className="text-sm text-gray-600">{order.billingDetails.email}</p>
                      <p className="text-sm text-gray-600">{order.billingDetails.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Items Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Items in Order</h3>
            <ul className="divide-y divide-gray-200">
              {order.items?.map((item) => (
                <li key={item.productId || item._id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">₹{item.price}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-gray-700">Total Amount</span>
              <span className="text-xl font-bold text-gray-900">₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Payment Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {canCancel && (
            <div className="w-full sm:w-auto">
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className={`w-full px-6 py-3 text-white rounded-lg transition-colors ${
                  isCancelling ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
              <p className="text-sm text-gray-500 mt-2 text-center sm:text-left">
                You can cancel this order as it's still in the {order.status} stage.
              </p>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;