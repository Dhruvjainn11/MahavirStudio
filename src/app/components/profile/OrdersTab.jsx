"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/components/Toast";
import OrderDetailsModal from "@/app/components/profile/OrderDetailsModal";

const OrdersTab = () => {
  const { user, fetchUserOrders } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    if (user?._id) {
      setLoading(true);
      const result = await fetchUserOrders(user._id);
      if (result.success) {
        setOrders(result.orders);
      } else {
        showToast(result.error || "Failed to load orders", "error");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?._id]);

  const handleOrderUpdate = (updatedOrder) => {
    // Remove the canceled order from the list
    if (updatedOrder.status === 'cancelled') {
      setOrders(prevOrders => prevOrders.filter(order => order._id !== updatedOrder._id));
    } else {
      // For other updates, replace the order in the list
      setOrders(prevOrders =>
        prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Your Orders</h3>

      {orders?.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition"
            >
              <div className="flex justify-between text-sm">
                <span>Order ID: {order._id?.slice(-6).toUpperCase()}</span>
                <span className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-medium">Total: ₹{order.totalAmount}</span>
                <span className="text-sm text-gold-600 capitalize">
                  {order.status}
                </span>
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
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
};

export default OrdersTab;