'use client';
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/components/Toast";
import OrderDetailsModal from "@/app/components/profile/OrderDetailsModal";

const OrdersTab = () => {
    const { user, fetchUserOrders } = useAuth();
    const { success, error } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Define the delay time for cancelled orders to disappear (in milliseconds)
    const CANCEL_ORDER_DISAPPEAR_DELAY = 5000; // 5 seconds

    const loadOrders = async () => {
        if (user?._id) {
            setLoading(true);
            const result = await fetchUserOrders(user._id);
            if (result.success) {
                setOrders(result.orders);
            } else {
                error(result.error || "Failed to load orders");
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [user?._id]);

    const handleOrderUpdate = (updatedOrder) => {
        if (updatedOrder.status === "cancelled") {
            // Immediately update the status to "cancelled" in the UI
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder._id ? { ...order, status: "cancelled" } : order
                )
            );

            // Set a timeout to remove the order after a delay
            setTimeout(() => {
                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order._id !== updatedOrder._id)
                );
            }, CANCEL_ORDER_DISAPPEAR_DELAY);

        } else {
            // For other status updates, just update the order normally
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                )
            );
        }
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

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading orders...</div>;
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Order History</h3>

            {orders?.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className={`border border-gray-200 rounded-xl p-6 transition-shadow duration-300 bg-white ${order.status === 'cancelled' ? 'opacity-50' : 'hover:shadow-lg'}`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex flex-col mb-4 md:mb-0">
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-mono text-sm text-gray-700">{order._id?.slice(-8).toUpperCase()}</p>
                                </div>

                                <div className="flex flex-col text-right mb-4 md:mb-0">
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="text-sm text-gray-700">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed">
                                <div>
                                    <p className="text-lg font-bold text-gray-800">₹{order.totalAmount}</p>
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getStatusClasses(order.status)}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                </div>
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