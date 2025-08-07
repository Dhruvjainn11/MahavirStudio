"use client";

import { motion } from "framer-motion";
import { FiCheck, FiTruck, FiPackage, FiShoppingBag, FiHome, FiMail, FiPhone } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/app/components/Toast';
import { useAuth } from '@/app/context/authContext';
import Image from 'next/image'; // Import Next.js Image component

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { success, error } = useToast();
  const { token, isAuthenticated } = useAuth();
  console.log(token)

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setLoading(false);
        error("Order ID not found in URL. Please try again.");
        return;
      }

      if (!token || !isAuthenticated) {
        console.log("Skipping order fetch: Token not available or user not authenticated.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok) {
          setOrderData(data.order);

           // --- ADD THESE CONSOLE LOGS ---
        console.log('Order Data received by frontend:', data.order);
        console.log('Order Items array:', data.order.items);
      
        // --- END CONSOLE LOGS ---


        } else {
          error(data.message || "Failed to fetch order details. Please try again later.");
          console.error("Backend error response:", data);
        }
      } catch (err) {
        error("An unexpected error occurred while fetching order details.");
        console.error("Network or unexpected error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    }

    // Only call fetchOrderDetails if orderId exists AND (token exists AND isAuthenticated is true)
    if (orderId && token && isAuthenticated) {
        fetchOrderDetails();
    } else if (orderId && (!token || !isAuthenticated)) {
        setLoading(false);
    }

  }, [orderId, error, token, isAuthenticated]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper to determine estimated delivery if not provided directly
  const getEstimatedDelivery = (orderDate) => {
    if (!orderDate) return 'N/A';
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7); // Assuming 7 days for delivery
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Custom CSS for a simple loading spinner (replace with more elaborate CSS if needed)
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-beige-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      <p className="mt-4 text-charcoal-700">Loading order details...</p>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-beige-50 text-charcoal-700 text-center p-4">
        <p className="mb-4">Unable to load order details. Please check your URL or try again later.</p>
        <Link href="/profile/orders" className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors">
          View Order History
        </Link>
      </div>
    );
  }

  // Destructure orderData for easier access, including 'items'
  const { billingDetails, totalAmount, paymentMethod, createdAt, status, items } = orderData;
  console.log("Order Data from orderdata", billingDetails, totalAmount);

  // Determine actual order number from backend _id or a generated one for display
  const displayOrderNumber = orderData._id || `ORD-${new Date(createdAt).getTime().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-beige-50 py-24 ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.2
            }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <FiCheck className="text-white text-4xl" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-3xl md:text-4xl font-serif text-charcoal-800 mb-4"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-charcoal-600 text-lg"
          >
            Thank you for your order. We'll send you a confirmation email shortly.
          </motion.p>
        </div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-lg shadow-sm border border-beige-200 p-6 md:p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-charcoal-800 mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Order Number</span>
                  <span className="font-medium text-charcoal-800">{displayOrderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Order Date</span>
                  <span className="font-medium text-charcoal-800">
                    {formatDate(createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Estimated Delivery</span>
                  <span className="font-medium text-charcoal-800">{getEstimatedDelivery(createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Payment Method</span>
                  <span className="font-medium text-charcoal-800">{paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-4">
                  <span className="text-charcoal-800">Total Amount</span>
                  <span className="text-gold-600">₹{totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-charcoal-800 mb-4">Delivery Information</h2>
              <div className="space-y-2 text-charcoal-600">
                <p className="font-medium text-charcoal-800">{billingDetails?.name}</p>
                <p>{billingDetails?.address?.street}</p>
                <p>{billingDetails?.address?.city}, {billingDetails?.address?.state} - {billingDetails?.address?.zipCode}</p>
                <div className="flex items-center gap-2 mt-3">
                  <FiPhone size={16} />
                  <span>{billingDetails?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail size={16} />
                  <span>{billingDetails?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- NEW SECTION: Ordered Items --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-lg shadow-sm border border-beige-200 p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-semibold text-charcoal-800 mb-6">Your Items</h2>
          <div className="space-y-6">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b border-beige-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="w-20 h-20 flex-shrink-0 relative rounded-md overflow-hidden border border-gray-200">
                    {/* Use Next.js Image component for optimization */}
                    <Image
                      src={item.productId.images?.[0].url || '/placeholder-image.jpg'} // Use first image or a placeholder
                      alt={item.productId.name || 'Product Image'}
                      layout="fill" // Ensures the image fills the container
                      objectFit="cover" // Covers the area while maintaining aspect ratio
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal-800">{item.productId.name}</h3>
                    <p className="text-charcoal-600 text-sm">Quantity: {item.quantity}</p>
                    <p className="text-gold-600 font-semibold mt-1">₹{(item.productId.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-charcoal-600">No items found for this order.</p>
            )}
          </div>
        </motion.div>
        {/* --- END NEW SECTION --- */}


        {/* Order Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white rounded-lg shadow-sm border border-beige-200 p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-semibold text-charcoal-800 mb-6">Order Timeline</h2>

          <div className="space-y-6">
            {[
              {
                icon: FiCheck,
                title: "Order Confirmed",
                description: "Your order has been confirmed and is being processed",
                statusKey: "processing", // Map to backend 'processing' status
                time: formatDate(createdAt) // Use actual order creation time
              },
              {
                icon: FiPackage,
                title: "Order Shipped",
                description: "We're preparing your items for shipment",
                statusKey: "shipped", // Map to backend 'shipped' status
                time: "Updating soon" // Will need actual shippedAt date from backend
              },
              {
                icon: FiTruck,
                title: "Out for Delivery",
                description: "Your order is on its way to you",
                statusKey: "out_for_delivery", // Add this to your backend schema if you want distinct status
                time: "Updating soon"
              },
              {
                icon: FiHome,
                title: "Delivered",
                description: "Your order has arrived at your doorstep",
                statusKey: "delivered",
                time: "Updating soon" // Will need actual deliveredAt date from backend
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  // Logic to highlight current/completed steps based on backend 'status'
                  // Current step
                  status === step.statusKey ? 'bg-blue-100 text-blue-600' :
                  // Completed steps (e.g., if current status is 'shipped', 'processing' is completed)
                  (status === 'shipped' && step.statusKey === 'processing') ||
                  (status === 'out_for_delivery' && (step.statusKey === 'processing' || step.statusKey === 'shipped')) || // New condition for out_for_delivery
                  (status === 'delivered' && (step.statusKey === 'processing' || step.statusKey === 'shipped' || step.statusKey === 'out_for_delivery'))
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400' // Pending steps
                }`}>
                  <step.icon size={20} />
                </div>

                <div className="flex-1">
                  <h3 className={`font-medium ${
                    status === step.statusKey ||
                    (status === 'shipped' && step.statusKey === 'processing') ||
                    (status === 'out_for_delivery' && (step.statusKey === 'processing' || step.statusKey === 'shipped')) ||
                    (status === 'delivered' && (step.statusKey === 'processing' || step.statusKey === 'shipped' || step.statusKey === 'out_for_delivery'))
                      ? 'text-charcoal-800'
                      : 'text-charcoal-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm mt-1">{step.description}</p>
                  <p className="text-charcoal-500 text-xs mt-1">{step.time}</p>
                </div>

                {(status === step.statusKey ||
                  (status === 'shipped' && step.statusKey === 'processing') ||
                  (status === 'out_for_delivery' && (step.statusKey === 'processing' || step.statusKey === 'shipped')) || // New condition for out_for_delivery
                  (status === 'delivered' && (step.statusKey === 'processing' || step.statusKey === 'shipped' || step.statusKey === 'out_for_delivery'))) && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheck className="text-white text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-gold-50 border border-gold-200 rounded-lg p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-semibold text-charcoal-800 mb-4">Need Help?</h2>
          <p className="text-charcoal-600 mb-4">
            If you have any questions about your order, feel free to contact us.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FiMail className="text-gold-600" size={20} />
              <div>
                <p className="font-medium text-charcoal-800">Email Support</p>
                <p className="text-charcoal-600 text-sm">support@mahavirstudio.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiPhone className="text-gold-600" size={20} />
              <div>
                <p className="font-medium text-charcoal-800">Phone Support</p>
                <p className="text-charcoal-600 text-sm">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/products"
            className="px-8 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-medium text-center"
          >
            Continue Shopping
          </Link>

          <Link
            href="/profile/orders"
            className="px-8 py-3 border border-beige-300 text-charcoal-700 rounded-lg hover:bg-beige-50 transition-colors font-medium text-center"
          >
            View Order History
          </Link>
        </motion.div>
      </div>
    </div>
  );
}