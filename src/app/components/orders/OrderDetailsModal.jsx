"use client";

import React, { useState } from "react";
import { useAdmin } from "@/app/context/adminContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiTruck,
  FiCreditCard,
  FiUser,
  FiMapPin,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";
import { useToast } from "@/app/components/Toast";

export default function OrderDetailsModal({
  orderId,
  isOpen,
  onClose,
  useOrderDetails,
  refetch,
}) {
  const { order, loading, error } = useOrderDetails(orderId);
  const { getAuthHeaders } = useAdmin();
  const { success, error: showError } = useToast();
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (field, value) => {
    setUpdating(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}/status`,
        { [field]: value },
        { headers: getAuthHeaders() }
      );
      success(
        `${
          field === "status" ? "Order status" : "Payment status"
        } updated successfully`
      );
      await refetch();
    } catch (err) {
      console.error("Update failed:", err);
      showError(err.response?.data?.message || "Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (value) => {
    setUpdating(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}/payment-status`,
        { paymentStatus: value },
        { headers: getAuthHeaders() }
      );
      success("Payment status updated successfully");
      await refetch();
    } catch (err) {
      console.error("Payment status update failed:", err);
      showError(
        err.response?.data?.message || "Failed to update payment status"
      );
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  const paymentOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
    { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
    {
      value: "refunded",
      label: "Refunded",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-3xl rounded-lg shadow-xl relative max-h-[90vh] flex flex-col"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            {/* Header */}
            <div className="border-b p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                  {error}
                </div>
              ) : order ? (
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiUser className="text-gray-600" />
                      <h3 className="font-semibold text-gray-800">
                        Customer Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">
                          {order.userId?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">
                          {order.userId?.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">
                          {order.userId?.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiDollarSign className="text-gray-600" />
                      <h3 className="font-semibold text-gray-800">
                        Order Summary
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-medium">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FiMapPin className="text-gray-600" />
                        <h3 className="font-semibold text-gray-800">
                          Shipping Address
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {order.shippingAddress.street}
                        </p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} -{" "}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiPackage className="text-gray-600" />
                      <h3 className="font-semibold text-gray-800">
                        Order Items ({order.items.length})
                      </h3>
                    </div>
                    <div className="divide-y">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="py-3 flex justify-between"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FiTruck className="text-gray-600" />
                        <h3 className="font-semibold text-gray-800">
                          Order Status
                        </h3>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus("status", e.target.value)}
                        disabled={updating}
                        className={`w-full p-2 border rounded-md ${
                          updating ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusOptions.find((s) => s.value === order.status)
                              ?.color || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusOptions.find((s) => s.value === order.status)
                            ?.label || order.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FiCreditCard className="text-gray-600" />
                        <h3 className="font-semibold text-gray-800">
                          Payment Status
                        </h3>
                      </div>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(e.target.value)}
                        disabled={updating}
                        className={`w-full p-2 border rounded-md ${
                          updating ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {paymentOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            paymentOptions.find(
                              (p) => p.value === order.paymentStatus
                            )?.color || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {paymentOptions.find(
                            (p) => p.value === order.paymentStatus
                          )?.label || order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {order.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Additional Notes
                      </h3>
                      <p className="text-gray-700">{order.notes}</p>
                    </div>
                  )}

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Tracking Information
                      </h3>
                      <p className="text-gray-700">
                        <span className="font-medium">Tracking Number:</span>{" "}
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
