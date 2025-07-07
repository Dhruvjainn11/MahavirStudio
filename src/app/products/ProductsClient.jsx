"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { products } from "../lib/product";
import { useCart } from "../context/cartContext";
import ProductFilters from "../components/ProductFilters";
import { useToast } from "../components/Toast";
import { ProductCardSkeleton } from "../components/LoadingSpinner";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    subcategory: 'all',
    finish: [],
    brand: [],
    sort: 'name-asc',
    minPrice: '',
    maxPrice: ''
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const toast = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
    // Simulate loading for better UX
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (slug, productName) => {
    const isCurrentlyInWishlist = wishlist.includes(slug);
    
    if (isCurrentlyInWishlist) {
      setWishlist((prev) => prev.filter((item) => item !== slug));
      toast.info(`${productName} removed from wishlist`);
    } else {
      setWishlist((prev) => [...prev, slug]);
      toast.success(`${productName} added to wishlist!`);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.cartSuccess(item.name, {
      description: "View cart to proceed to checkout"
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      subcategory: 'all',
      finish: [],
      brand: [],
      sort: 'name-asc',
      minPrice: '',
      maxPrice: ''
    });
  };

  // Filter and sort products
  const filteredAndSortedProducts = () => {
    let filtered = products.filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Subcategory filter
      if (filters.subcategory !== 'all' && product.subcategory !== filters.subcategory) {
        return false;
      }

      // Finish filter
      if (filters.finish.length > 0 && !filters.finish.includes(product.finish)) {
        return false;
      }

      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      // Price filter
      const price = parseInt(product.price.replace(/[₹,]/g, ''));
      if (filters.minPrice && price < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && price > parseInt(filters.maxPrice)) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[₹,]/g, ''));
      const priceB = parseInt(b.price.replace(/[₹,]/g, ''));

      switch (filters.sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'newest':
          return 0; // For now, no date field
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProducts = filteredAndSortedProducts();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-12">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-charcoal-800 mb-4">
          {filters.category === 'all' ? 'All Products' : 
           filters.category === 'hardware' ? 'Hardware Products' :
           filters.category === 'paints' ? 'Paint Collection' : 'Products'}
        </h1>
        <p className="text-charcoal-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
          products={products}
          mobileOpen={mobileFiltersOpen}
          setMobileOpen={setMobileFiltersOpen}
        />

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((item, index) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="border border-beige-200 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  <Link href={`/product/${item.slug}`}>
                    <div className="relative h-60 w-full mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-charcoal-800">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-charcoal-800 group-hover:text-gold-600 transition-colors">
                          {item.name}
                        </h3>
                        {item.rating && (
                          <div className="flex items-center gap-1 text-xs text-gold-500">
                            <FiStar className="fill-current" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-charcoal-500">
                          {item.finish} Finish
                        </span>
                        {item.brand && (
                          <>
                            <span className="text-charcoal-300">•</span>
                            <span className="text-sm text-charcoal-500">
                              {item.brand}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <p className="text-gold-600 font-medium text-lg mb-4">
                        {item.price}
                      </p>
                    </div>
                  </Link>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`flex-grow flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.inStock
                          ? "bg-charcoal-800 text-white hover:bg-charcoal-700"
                          : "bg-beige-200 text-charcoal-400 cursor-not-allowed"
                      }`}
                    >
                      <FiShoppingCart /> 
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(item.slug, item.name);
                      }}
                      className={`p-2 rounded-md transition-colors ${
                        wishlist.includes(item.slug)
                          ? "bg-gold-100 text-gold-600"
                          : "bg-beige-100 text-charcoal-800 hover:bg-beige-200"
                      }`}
                    >
                      {wishlist.includes(item.slug) ? <FaHeart /> : <FiHeart />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <FiShoppingCart className="mx-auto text-4xl text-charcoal-300" />
                </div>
                <h3 className="text-xl font-medium text-charcoal-700 mb-2">
                  No products found
                </h3>
                <p className="text-charcoal-500 mb-6">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-gold-500 text-white rounded-md hover:bg-gold-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
