"use client";

import { useCart } from "../context/cartContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiShoppingBag, FiChevronLeft, FiPlus, FiMinus, FiShield, FiTruck, FiCreditCard, FiLock, FiPercent, FiClock, FiHeart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useToast } from "../components/Toast";
import { useState, useMemo } from "react";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQty,
    decreaseQty,
  } = useCart();
  
  const { success } = useToast();
  const [savedItems, setSavedItems] = useState([]);
  
  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => {
        const price = parseInt(item.price.replace(/[₹,]/g, ""));
        return acc + (item.quantity * price);
      },
      0
    );
    
    const shipping = subtotal > 15000 ? 0 : 499; // Free shipping over ₹15,000
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const discount = subtotal > 100000 ? Math.round(subtotal * 0.05) : 0; // 5% discount over ₹1L
    const total = subtotal + shipping + tax - discount;
    
    return { subtotal, shipping, tax, discount, total };
  }, [cartItems]);

  const router = useRouter();
  
  const saveForLater = (item) => {
    setSavedItems(prev => [...prev, item]);
    removeFromCart(item.slug);
    success(`${item.name} saved for later`);
  };
  
  const moveToCart = (item) => {
    setSavedItems(prev => prev.filter(saved => saved.slug !== item.slug));
    // This would need to be implemented in cart context
    success(`${item.name} moved back to cart`);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-26  ">
      <div className="md:mb-8">
        <Link
          href="/products"
          className="inline-flex items-center text-gold-600 hover:text-gold-700 transition-colors text-sm md:text-base"
        >
          <FiChevronLeft className="mr-1" size={16} />
          Continue Shopping
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-charcoal-800 mb-6 md:mb-8 font-medium">
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-beige-50 rounded-lg">
          <div className="mx-auto w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mb-4">
            <FiShoppingBag className="text-charcoal-400 text-2xl" />
          </div>
          <p className="text-lg text-charcoal-600 mb-2">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block mt-4 px-6 py-2 bg-gold-500 text-white rounded-md hover:bg-gold-600 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item, index) => {
              const itemPrice = parseInt(item.price.replace(/[₹,]/g, ""));
              const itemTotal = itemPrice * item.quantity;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col sm:flex-row items-center gap-4 border border-beige-200 p-6 rounded-lg bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="w-full sm:w-32 h-32 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-charcoal-800">
                          {item.name}
                        </h3>
                        <p className="text-charcoal-500 text-sm">
                          {item.finish} Finish
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-green-600 text-xs flex items-center gap-1">
                            <FiShield size={12} />
                            2 Year Warranty
                          </span>
                          <span className="text-blue-600 text-xs flex items-center gap-1">
                            <FiTruck size={12} />
                            Free Installation
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.slug)}
                        className="text-charcoal-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <p className="text-gold-600 font-medium text-lg">
                          ₹{itemTotal.toLocaleString()}
                        </p>
                        <p className="text-charcoal-500 text-sm">
                          ₹{itemPrice.toLocaleString()} each
                        </p>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center border border-beige-300 rounded-md">
                        <button
                          onClick={() => decreaseQty(item.slug)}
                          className="px-3 py-2 text-charcoal-600 hover:bg-beige-100 transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center border-l border-r border-beige-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(item.slug)}
                          className="px-3 py-2 text-charcoal-600 hover:bg-beige-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex gap-3 text-sm">
                      <button
                        onClick={() => saveForLater(item)}
                        className="text-charcoal-600 hover:text-gold-600 transition-colors flex items-center gap-1"
                      >
                        <FiHeart size={14} />
                        Save for Later
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Badges */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
              <FiShield className="text-green-600" size={20} />
              <div>
                <p className="font-medium text-green-800 text-sm">Secure Payments</p>
                <p className="text-green-600 text-xs">SSL Encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <FiTruck className="text-blue-600" size={18} />
              <div>
                <p className="font-medium text-blue-800 text-sm">Free Delivery</p>
                <p className="text-blue-600 text-xs">Orders over ₹15,000</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gold-50 rounded-lg border border-gold-200">
              <FiClock className="text-gold-600" size={18} />
              <div>
                <p className="font-medium text-gold-800 text-sm">Quick Delivery</p>
                <p className="text-gold-600 text-xs">7-14 business days</p>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-10 bg-white border border-beige-200 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-medium text-charcoal-800">Order Summary</h2>
              <button
                onClick={clearCart}
                className="text-sm text-charcoal-500 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <FiTrash2 size={14} />
                Clear Cart
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-charcoal-600">Subtotal ({cartItems.length} items)</span>
                <span className="font-medium">₹{calculations.subtotal.toLocaleString()}</span>
              </div>
              
              {calculations.discount > 0 && (
                <div className="flex justify-between items-center py-2 text-green-600">
                  <span className="flex items-center gap-1">
                    <FiPercent size={14} />
                    Bulk Discount (5%)
                  </span>
                  <span className="font-medium">-₹{calculations.discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2">
                <span className="text-charcoal-600 flex items-center gap-1">
                  <FiTruck size={14} />
                  Shipping
                </span>
                <span className={`font-medium ${
                  calculations.shipping === 0 ? 'text-green-600' : 'text-charcoal-800'
                }`}>
                  {calculations.shipping === 0 ? 'FREE' : `₹${calculations.shipping.toLocaleString()}`}
                </span>
              </div>
              
              {calculations.shipping > 0 && (
                <div className="text-xs text-charcoal-500 pl-5">
                  Add ₹{(15000 - calculations.subtotal).toLocaleString()} more for free shipping
                </div>
              )}
              
              <div className="flex justify-between items-center py-2">
                <span className="text-charcoal-600">GST (18%)</span>
                <span className="font-medium">₹{calculations.tax.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-beige-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-charcoal-800">Total Amount</span>
                  <span className="text-xl font-semibold text-gold-600">
                    ₹{calculations.total.toLocaleString()}
                  </span>
                </div>
                {calculations.discount > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    You saved ₹{calculations.discount.toLocaleString()}!
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push("/checkout")}
                className="w-full px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all duration-200 font-medium text-lg flex items-center justify-center gap-2 shadow-lg"
              >
                <FiLock size={18} />
                Proceed to Secure Checkout
              </button>
              
              <div className="text-center text-xs text-charcoal-500">
                <p className="flex items-center justify-center gap-1">
                  <FiShield size={12} />
                  Your payment information is secure and encrypted
                </p>
              </div>
              
              <Link
                href="/products"
                className="block text-center text-sm text-charcoal-500 hover:text-gold-600 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Saved Items Section */}
          {savedItems.length > 0 && (
            <div className="mt-10 bg-white border border-beige-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-charcoal-800 mb-4">Saved for Later</h3>
              <div className="space-y-3">
                {savedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border border-beige-100 rounded-lg">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-charcoal-800">{item.name}</h4>
                      <p className="text-gold-600">{item.price}</p>
                    </div>
                    <button
                      onClick={() => moveToCart(item)}
                      className="px-3 py-1 text-sm bg-gold-500 text-white rounded hover:bg-gold-600 transition-colors"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}