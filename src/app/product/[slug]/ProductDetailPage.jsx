"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiArrowLeft, FiStar, FiCheck, FiTruck, FiShield, FiMinus, FiPlus } from "react-icons/fi"; 
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { products } from "@/app/lib/product";
import { useCart } from "@/app/context/cartContext";
import { useToast } from "@/app/components/Toast";
import { useRecentlyViewed } from "@/app/components/RecentlyViewed";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [hasAdded, setHasAdded] = useState(false);
  
  const { addToCart } = useCart();
  const toast = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Load wishlist from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  // Load product from slug
  useEffect(() => {
    if (!slug) return;
    const found = products.find((p) => p.slug === slug);
    if (found) {
      setProduct(found);
    }
  }, [slug]);

  // Save wishlist to localStorage when updated
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add to recently viewed when component mounts


  useEffect(() => {
    if (product && !hasAdded) {
      addToRecentlyViewed(product);
      setHasAdded(true); // ✅ prevents infinite loop
    }
  }, [product, addToRecentlyViewed, hasAdded]);
  

  const toggleWishlist = () => {
    if (!product) return;
    const isWished = wishlist.includes(product.slug);
    const updated = isWished
      ? wishlist.filter((id) => id !== product.slug)
      : [...wishlist, product.slug];
    setWishlist(updated);
    
    if (isWished) {
      toast.info(`${product.name} removed from wishlist`);
    } else {
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < selectedQuantity; i++) {
      addToCart(product);
    }
    toast.cartSuccess(product.name, {
      description: `Added ${selectedQuantity} item(s) to cart`
    });
  };

  const isInWishlist = wishlist.includes(product?.slug);


  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-semibold text-charcoal-800">
          Product not found 😢
        </h1>
        <Link
          href="/products"
          className="text-gold-600 mt-4 inline-block underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-25"
    >
      {/* Back Button & Breadcrumb */}
      <div className="mb-8">
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-charcoal-600 hover:text-gold-600 transition-colors mb-4"
        >
          <FiArrowLeft size={16} />
          Back to Products
        </Link>
        <div className="text-sm text-charcoal-600">
          <Link href="/" className="hover:underline">Home</Link> /
          <Link href="/products" className="hover:underline ml-1">Products</Link> /
          <span className="ml-1 text-charcoal-800 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
        {/* Product Image */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-1/2"
        >
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg bg-beige-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white px-4 py-2 rounded-lg font-medium text-charcoal-800">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Product Details */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-1/2 flex flex-col"
        >
          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-charcoal-800 mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-charcoal-500 text-lg">
                  by <span className="font-medium text-charcoal-700">{product.brand}</span>
                </p>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={i < Math.floor(product.rating) ? "fill-current" : ""} 
                      size={16}
                    />
                  ))}
                </div>
                <span className="text-sm text-charcoal-600">({product.rating})</span>
              </div>
            )}

            {/* Price */}
            <p className="text-gold-600 text-3xl font-bold">
              {product.price}
            </p>

            {/* Product Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-charcoal-600">Finish:</span>
                <span className="font-medium text-charcoal-800">{product.finish}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-charcoal-600">Category:</span>
                <span className="font-medium text-charcoal-800 capitalize">
                  {product.subcategory?.replace(/-/g, ' ')}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-charcoal-600 leading-relaxed">
              {product.description || "This premium product is crafted to enhance your space with elegance and durability. Suitable for both modern and traditional designs."}
            </p>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="font-medium text-charcoal-800 mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-charcoal-600">
                      <FiCheck className="text-green-600 flex-shrink-0" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="mt-8 space-y-6">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-charcoal-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-beige-300 rounded-lg">
                <button
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  className="p-2 hover:bg-beige-100 transition-colors"
                  disabled={selectedQuantity <= 1}
                >
                  <FiMinus size={16} />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                  {selectedQuantity}
                </span>
                <button
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  className="p-2 hover:bg-beige-100 transition-colors"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex  sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-base font-medium rounded-lg transition-colors ${
                  product.inStock
                    ? "bg-charcoal-800 text-white hover:bg-charcoal-700"
                    : "bg-beige-200 text-charcoal-400 cursor-not-allowed"
                }`}
              >
                <FiShoppingCart />
                {product.inStock ? `Add  to Cart` : "Out of Stock"}
              </button>
              <button  
                onClick={toggleWishlist}
                className={`p-4 rounded-lg transition-colors w-max ${
                  isInWishlist
                    ? "bg-gold-100 text-gold-600 hover:bg-gold-200"
                    : "bg-beige-100 text-charcoal-800 hover:bg-beige-200"
                }`}
              >
                {isInWishlist ? <FaHeart size={20} /> : <FiHeart size={20} />}
              </button>
            </div>
 
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-beige-200">
              <div className="text-center">
                <FiTruck className="text-gold-600 mx-auto mb-2" size={24} />
                <p className="text-xs text-charcoal-600">Free Delivery</p>
              </div>
              <div className="text-center">
                <FiShield className="text-gold-600 mx-auto mb-2" size={24} />
                <p className="text-xs text-charcoal-600">1 Year Warranty</p>
              </div>
              <div className="text-center">
                <FiCheck className="text-gold-600 mx-auto mb-2" size={24} />
                <p className="text-xs text-charcoal-600">Quality Assured</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Related Products Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20"
      >
        <h2 className="text-3xl font-serif text-charcoal-800 mb-8">You Might Also Like</h2>
        
        {products.filter(p => p.slug !== product.slug && p.subcategory === product.subcategory).length > 0 ? (
          <div className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4">
            {products
              .filter(p => p.slug !== product.slug && p.subcategory === product.subcategory)
              .slice(0, 4)
              .map((item, i) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="min-w-[280px] bg-white border border-beige-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <Link href={`/product/${item.slug}`}>
                    <div className="p-4">
                      <div className="relative h-48 w-full mb-4 rounded-xl overflow-hidden bg-beige-100">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-charcoal-800 group-hover:text-gold-600 transition-colors">
                          {item.name}
                        </h4>
                        {item.brand && (
                          <p className="text-sm text-charcoal-500">{item.brand}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-gold-600 font-bold text-lg">{item.price}</p>
                          {item.rating && (
                            <div className="flex items-center gap-1 text-gold-500">
                              <FiStar className="fill-current" size={14} />
                              <span className="text-sm">{item.rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-charcoal-500 capitalize">
                          {item.finish} Finish
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-beige-50 rounded-2xl">
            <p className="text-charcoal-500">No related products found in this category.</p>
            <Link 
              href="/products" 
              className="inline-block mt-4 text-gold-600 hover:text-gold-700 font-medium"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </motion.div>

    </motion.section>
  );
}
