"use client";

import { motion } from "framer-motion";
import { FiCheck, FiTruck, FiPackage, FiShoppingBag, FiHome, FiMail, FiPhone } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {
  const [orderNumber] = useState(() => `ORD-${Date.now().toString().slice(-6)}`);
  const [estimatedDelivery] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  return (
    <div className="min-h-screen bg-beige-50 py-12">
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
                  <span className="font-medium text-charcoal-800">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Order Date</span>
                  <span className="font-medium text-charcoal-800">
                    {new Date().toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Estimated Delivery</span>
                  <span className="font-medium text-charcoal-800">{estimatedDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Payment Method</span>
                  <span className="font-medium text-charcoal-800">Card Payment</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-charcoal-800 mb-4">Delivery Information</h2>
              <div className="space-y-2 text-charcoal-600">
                <p className="font-medium text-charcoal-800">John Doe</p>
                <p>123 Main Street, Apartment 4B</p>
                <p>Mumbai, Maharashtra - 400001</p>
                <div className="flex items-center gap-2 mt-3">
                  <FiPhone size={16} />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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
                status: "completed",
                time: "Just now"
              },
              {
                icon: FiPackage,
                title: "Order Processing",
                description: "We're preparing your items for shipment",
                status: "current",
                time: "1-2 business days"
              },
              {
                icon: FiTruck,
                title: "Shipped",
                description: "Your order is on its way to you",
                status: "pending",
                time: "3-5 business days"
              },
              {
                icon: FiHome,
                title: "Delivered",
                description: "Your order will arrive at your doorstep",
                status: "pending",
                time: "7-10 business days"
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  step.status === 'completed' ? 'bg-green-100 text-green-600' :
                  step.status === 'current' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  <step.icon size={20} />
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    step.status === 'completed' || step.status === 'current' 
                      ? 'text-charcoal-800' 
                      : 'text-charcoal-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm mt-1">{step.description}</p>
                  <p className="text-charcoal-500 text-xs mt-1">{step.time}</p>
                </div>
                
                {step.status === 'completed' && (
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
            href="/profile"
            className="px-8 py-3 border border-beige-300 text-charcoal-700 rounded-lg hover:bg-beige-50 transition-colors font-medium text-center"
          >
            View Order History
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
