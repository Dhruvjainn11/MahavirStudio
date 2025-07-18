"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiHeart, FiStar, FiFilter, FiGrid, FiList, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCart } from "../context/cartContext";
import ProductFilters from "../components/ProductFilters";
import { useToast } from "../components/Toast";
import { ProductCardSkeleton } from "../components/LoadingSpinner";
import { useClientProducts } from "@/app/hooks/useClientProducts";

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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const { addToCart } = useCart();
  const toast = useToast();
  const { data, isLoading } = useClientProducts();

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
    // Simulate loading for better UX
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const products = data?.products || [];

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    
    let filtered = data.products.filter(product => {
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
      const price = typeof product.price === 'string'
        ? parseInt(product.price.replace(/[₹,]/g, ''))
        : product.price;

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
      const priceA = typeof a.price === 'string'
        ? parseInt(a.price.replace(/[₹,]/g, ''))
        : a.price;

      const priceB = typeof b.price === 'string'
        ? parseInt(b.price.replace(/[₹,]/g, ''))
        : b.price;

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
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data?.products, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    setCurrentPage(1); // Reset to first page when filters change
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
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.subcategory !== 'all') count++;
    if (filters.finish.length > 0) count++;
    if (filters.brand.length > 0) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    return count;
  };

  const getCategoryTitle = () => {
    switch (filters.category) {
      case 'hardware':
        return 'Hardware Products';
      case 'paints':
        return 'Paint Collection';
      default:
        return 'All Products';
    }
  };

  const ProductCard = ({ item, index }) => (
    <motion.div
      key={item._id || item.slug || index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={`border border-beige-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all group ${
        viewMode === 'list' ? 'flex flex-row p-4' : 'flex flex-col p-5'
      }`}
    >
      <Link href={`/product/${item._id}`} className={viewMode === 'list' ? 'flex flex-row flex-grow' : 'flex flex-col flex-grow'}>
        <div className={`relative overflow-hidden rounded-lg ${
          viewMode === 'list' ? 'h-24 w-24 mr-4 flex-shrink-0' : 'h-60 w-full mb-4'
        }`}>
          <Image
            src={item.images[0].url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!item.stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-charcoal-800">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className={`flex-grow ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-semibold text-charcoal-800 group-hover:text-gold-600 transition-colors ${
              viewMode === 'list' ? 'text-base' : 'text-lg'
            }`}>
              {item.name}
            </h3>
            {item.rating?.average ? (
              <div className="flex items-center gap-1 text-xs text-gold-500">
                <FiStar className="fill-current" />
                <span>{item.rating.average}</span>
              </div>
            ) : null}
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
          
          <p className={`text-gold-600 font-medium ${viewMode === 'list' ? 'text-base' : 'text-lg'} mb-4`}>
            {item.price}
          </p>
        </div>
      </Link>
      
      <div className={`flex gap-3 ${viewMode === 'list' ? 'ml-4 flex-col justify-center' : ''}`}>
        <button
          onClick={() => handleAddToCart(item)}
          disabled={!item.inStock}
          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            item.stock
              ? "bg-charcoal-800 text-white hover:bg-charcoal-700"
              : "bg-beige-200 text-charcoal-400 cursor-not-allowed"
          } ${viewMode === 'list' ? 'flex-shrink-0' : 'flex-grow'}`}
        >
          <FiShoppingCart /> 
          {item.stock ? "Add to Cart" : "Out of Stock"}
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
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-charcoal-600 bg-white border border-beige-200 rounded-md hover:bg-beige-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === page
                ? "bg-gold-500 text-white"
                : "text-charcoal-600 bg-white border border-beige-200 hover:bg-beige-50"
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-charcoal-600 bg-white border border-beige-200 rounded-md hover:bg-beige-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-15">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-charcoal-800 mb-2">
              {getCategoryTitle()}
            </h1>
            <p className="text-charcoal-600">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
              {filteredProducts.length !== data?.products?.length && 
                ` (${data?.products?.length || 0} total)`}
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gold-500 text-white'
                  : 'bg-beige-100 text-charcoal-600 hover:bg-beige-200'
              }`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-gold-500 text-white'
                  : 'bg-beige-100 text-charcoal-600 hover:bg-beige-200'
              }`}
            >
              <FiList />
            </button>
          </div>
        </div>
        
        {/* Active Filters Indicator */}
        <AnimatePresence>
          {getActiveFiltersCount() > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-center gap-2 text-sm text-charcoal-600"
            >
              <FiFilter className="text-gold-500" />
              <span>{getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active</span>
              <button
                onClick={clearAllFilters}
                className="text-gold-500 hover:text-gold-600 font-medium"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-beige-200 rounded-md hover:bg-beige-50 transition-colors"
        >
          <FiFilter />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-gold-500 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Enhanced Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
          products={data?.products || []}
          mobileOpen={mobileFiltersOpen}
          setMobileOpen={setMobileFiltersOpen}
        />

        {/* Products Grid/List */}
        <div className="flex-1">
          {loading || isLoading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {Array(6).fill(0).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
            
              <div 
              className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {paginatedProducts.map((item, index) => (
                  <ProductCard key={item._id || index} item={item} index={index} />
                ))}
              </div>
              <Pagination />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
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
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}