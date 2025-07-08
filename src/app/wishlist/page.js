  "use client";

import { useEffect, useState } from "react";
import { products } from "../lib/product";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart, FiTrash2, FiStar, FiPackage, FiFilter } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../context/cartContext";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [showToast, setShowToast] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  const removeFromWishlist = (slug) => {
    const updated = wishlist.filter((item) => item !== slug);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    showToastMessage("Item removed from wishlist", "success");
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.setItem("wishlist", JSON.stringify([]));
    showToastMessage("Wishlist cleared", "success");
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showToastMessage("Item added to cart", "success");
  };

  const addAllToCart = () => {
    wishlistedProducts.forEach((product) => {
      addToCart(product);
    });
    showToastMessage(`${wishlistedProducts.length} items added to cart`, "success");
  };

  const showToastMessage = (message, type) => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.slug));

  // Filter products
  const filteredProducts = wishlistedProducts.filter((product) => {
    if (filterBy === "all") return true;
    if (filterBy === "in-stock") return product.inStock;
    if (filterBy === "out-of-stock") return !product.inStock;
    return product.category === filterBy;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, ""));
      case "rating":
        return b.rating - a.rating;
      case "brand":
        return a.brand.localeCompare(b.brand);
      default:
        return 0;
    }
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-charcoal-800 mb-2">
              Your Wishlist
            </h1>
            <p className="text-charcoal-600">
              {wishlistedProducts.length} item{wishlistedProducts.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          
          {wishlistedProducts.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={addAllToCart}
                className="flex items-center gap-2 px-4 py-2 bg-charcoal-800 text-white hover:bg-charcoal-700 rounded-lg transition-colors text-sm font-medium"
              >
                <FiShoppingCart size={16} />
                Add All to Cart
              </button>
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
              >
                <FiTrash2 size={16} />
                Clear Wishlist
              </button>
            </div>
          )}
        </div>

        {wishlistedProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto bg-beige-100 rounded-full flex items-center justify-center">
              <FiHeart size={32} className="text-beige-400" />
            </div>
            <h2 className="text-2xl font-medium text-charcoal-700 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-charcoal-500 mb-6 max-w-md mx-auto">
              Save items you love to your wishlist. Review them anytime and easily move them to your cart.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-gold-600 text-white px-6 py-3 rounded-lg hover:bg-gold-700 transition-colors font-medium"
            >
              <FiPackage size={18} />
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-beige-50 rounded-lg">
              <div className="flex items-center gap-2 flex-1">
                <FiFilter className="text-charcoal-600" size={18} />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 border border-beige-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
                >
                  <option value="all">All Items</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-charcoal-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-beige-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="brand">Brand</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {sortedProducts.map((item, index) => (
                  <motion.div
                    key={item.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="border border-beige-200 p-5 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    <Link href={`/product/${item.slug}`}>
                      <div className="relative h-60 w-full mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-charcoal-800">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-beige-100 text-charcoal-600 rounded-full">
                          {item.brand}
                        </span>
                        <div className="flex items-center gap-1">
                          <FiStar className="text-gold-500" size={12} />
                          <span className="text-xs text-charcoal-600">{item.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-charcoal-800 mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      
                      <p className="text-sm text-charcoal-500 mb-2">
                        {item.finish} Finish • {item.category}
                      </p>
                      
                      <div className="mb-3">
                        <p className="text-gold-600 font-semibold text-xl">{item.price}</p>
                        {item.inStock ? (
                          <span className="text-green-600 text-sm font-medium">In Stock</span>
                        ) : (
                          <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                        )}
                      </div>
                      
                      {item.features && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {item.features.slice(0, 2).map((feature, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-gold-50 text-gold-700 rounded">
                                {feature}
                              </span>
                            ))}
                            {item.features.length > 2 && (
                              <span className="text-xs px-2 py-1 bg-beige-100 text-charcoal-600 rounded">
                                +{item.features.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-3 mt-auto">
                        <button 
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-charcoal-800 text-white hover:bg-charcoal-700 rounded-lg transition-colors disabled:bg-charcoal-300 disabled:cursor-not-allowed"
                        >
                          <FiShoppingCart size={16} />
                          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.slug)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Remove from wishlist"
                        >
                          <FaHeart size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </section>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium ${
              showToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {showToast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
