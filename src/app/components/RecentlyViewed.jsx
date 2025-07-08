"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/cartContext";
import { useToast } from "./Toast";

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("mahavir_recently_viewed");
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing recently viewed:", error);
        localStorage.removeItem("mahavir_recently_viewed");
      }
    }
  }, []);

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.slug !== product.slug);
      // Add to beginning
      const updated = [product, ...filtered].slice(0, 8); // Keep only 8 items
      localStorage.setItem("mahavir_recently_viewed", JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem("mahavir_recently_viewed");
  };

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed };
}

function RecentlyViewedCard({ product, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-lg border border-beige-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2"
        >
          <Link
            href={`/product/${product.slug}`}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            title="View details"
          >
            <FiEye size={16} className="text-charcoal-700" />
          </Link>
          <button
            onClick={() => onAddToCart(product)}
            className="p-2 bg-gold-500 rounded-full hover:bg-gold-600 transition-colors"
            title="Add to cart"
          >
            <FiShoppingCart size={16} className="text-white" />
          </button>
        </motion.div>
        <div className="absolute top-2 right-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Recently Viewed
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-charcoal-800 text-sm line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gold-600">
            {product.price}
          </span>
          <span className="text-xs text-charcoal-500 flex items-center gap-1">
            <FiClock size={12} />
            Recently viewed
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecentlyViewed({ className = "" }) {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { addToCart } = useCart();
  const { cartSuccess } = useToast();

  const handleAddToCart = (product) => {
    addToCart(product);
    cartSuccess(product.name);
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 bg-beige-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-charcoal-800 mb-2">
              Recently Viewed
            </h2>
            <p className="text-charcoal-600">
              Items you've looked at recently
            </p>
          </div>
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-charcoal-500 hover:text-charcoal-700 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          <AnimatePresence>
            {recentlyViewed.map((product, index) => (
              <RecentlyViewedCard
                key={`${product.slug}-${index}`}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
