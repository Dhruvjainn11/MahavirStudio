"use client";
import Image from "next/image";
import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiHeart, FiShoppingCart } from "react-icons/fi";
import { products } from "../lib/product";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "../context/cartContext";
import { useToast } from "./Toast";
import { useState, useEffect } from "react";

// const products = [
//   { name: "Brushed Brass Handle", price: "₹1,299", image: "/hardware1.jpg" },
//   { name: "Matte Black Knob", price: "₹799", image: "/hardware2.jpg" },
//   { name: "Antique Copper Handle", price: "₹1,499", image: "/hardware3.jpg" },
//   { name: "Polished Chrome Lever", price: "₹1,199", image: "/hardware4.png" },
//   { name: "Satin Nickel Knob", price: "₹899", image: "/hardware5.png" },
// ];

export default function FeaturedProducts() {
  const containerRef = useRef(null);
  const { addToCart } = useCart();
  const toast = useToast();
  const [wishlist, setWishlist] = useState([]);
  
  useEffect(() => {
    const stored = localStorage.getItem("featured-wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("featured-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  
  const handleAddToCart = (item) => {
    addToCart(item);
    toast.cartSuccess(item.name, {
      description: "Item added to cart successfully!"
    });
  };
  
  const toggleWishlist = (itemSlug, itemName) => {
    const isInWishlist = wishlist.includes(itemSlug);
    
    if (isInWishlist) {
      setWishlist(prev => prev.filter(slug => slug !== itemSlug));
      toast.info(`${itemName} removed from wishlist`);
    } else {
      setWishlist(prev => [...prev, itemSlug]);
      toast.success(`${itemName} added to wishlist!`);
    }
  };

  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth / 1.4;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 sm:py-20 md:py-24 bg-beige-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-serif text-charcoal-800 text-center mb-6">
          Featured Products
        </h2>

        {/* Arrows */}
        <div className="hidden sm:flex absolute left-0 right-0 top-[50%] justify-between px-2 z-10">
          <button
            onClick={() => scroll("left")}
            className="bg-charcoal-800 text-white p-2 rounded-full shadow-lg hover:bg-gold-500 transition"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="bg-charcoal-800 text-white p-2 rounded-full shadow-lg hover:bg-gold-500 transition"
          >
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* Carousel */}
        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-8 md:gap-10 overflow-x-auto scroll-smooth scrollbar-hide px-2 snap-x snap-mandatory"
          > 
          {products.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="min-w-[300px] sm:min-w-[360px] mt-5 md:min-w-[420px] bg-white  border-gold-200 p-3  rounded-2xl shadow-lg flex-shrink-0 flex flex-col items-center text-center hover:shadow-2xl transition-all group  snap-start "
            >
              <div className="relative w-full h-50  sm:h-64 md:h-60 mb-6 overflow-hidden rounded-xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay buttons */} 
                {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white rounded-full text-charcoal-800 hover:bg-gold-500 hover:text-white transition-all shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(item);
                    }}
                  >
                    <FiShoppingCart size={20} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 bg-white rounded-full transition-all shadow-lg ${
                      wishlist.includes(item.slug)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-charcoal-800 hover:bg-red-500 hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(item.slug, item.name);
                    }}
                  >
                    <FiHeart size={20} className={wishlist.includes(item.slug) ? 'fill-current' : ''} />
                  </motion.button>
                </div> */}
                
                {/* Badge for in stock / out of stock */}
                {item.inStock ? (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    In Stock
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>
              
              <Link href={`/product/${item.slug}`} className="w-full">
                <div className="space-y-3">
                  <h4 className="text-lg md:text-xl font-semibold text-charcoal-800 group-hover:text-gold-600 transition-colors">
                    {item.name}
                  </h4>
                  
                  {/* Product details */}
                  <div className="text-sm text-charcoal-600">
                    {item.finish && (
                      <span className="inline-block bg-beige-100 px-2 py-1 rounded-full text-xs mr-2">
                        {item.finish} Finish
                      </span>
                    )}
                    {item.brand && (
                      <span className="inline-block bg-beige-100 px-2 py-1 rounded-full text-xs">
                        {item.brand}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-gold-600 font-bold text-xl md:text-2xl">
                      {item.price}
                    </p>
                    {item.rating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span className="text-sm">★</span>
                        <span className="text-sm font-medium text-charcoal-600">{item.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
