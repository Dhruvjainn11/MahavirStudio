"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/components/Toast";
import OrderDetailsModal from "@/app/components/profile/OrderDetailsModal";

const OrdersTab = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user && user.orders?.length === 0) {
      showToast("No orders found", "info");
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Your Orders</h3>

      {user.orders?.length > 0 ? (
        <div className="space-y-4">
          {user.orders.map((order, index) => (
            <div
              key={order._id || index}
              onClick={() => setSelectedOrder(order)}
              className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition"
            >
              <div className="flex justify-between text-sm">
                <span>Order ID: {order._id?.slice(-6).toUpperCase() || "N/A"}</span>
                <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-medium">Total: ₹{order.totalAmount}</span>
                <span className="text-sm text-gold-600 capitalize">{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No orders to show.</p>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default OrdersTab;
