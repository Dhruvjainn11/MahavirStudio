"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiX, FiSliders } from "react-icons/fi";

function ProductFilters({
  filters,
  onFilterChange,
  onClearFilters,
  products = [],
  mobileOpen,
  setMobileOpen
}) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    finish: true,
    price: true,
    brand: false,
    sort: true
  });

  // Local state for price inputs to prevent re-rendering issues
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || '');
  const timeoutRef = useRef(null);

  // Update local state when filters change externally
  useEffect(() => {
    setLocalMinPrice(filters.minPrice || '');
    setLocalMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  // Debounced price update function
  const debouncedPriceUpdate = useCallback((minPrice, maxPrice) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onFilterChange('minPrice', minPrice);
      onFilterChange('maxPrice', maxPrice);
    }, 500);
  }, [onFilterChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Extract unique values from products
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const uniqueSubcategories = [...new Set(products.map(p => p.subcategory))];
  const uniqueFinishes = [...new Set(products.map(p => p.finish))];
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  
  // Price range calculation
  const prices = products.map(p => parseInt(p.price.replace(/[₹,]/g, '')));
  const minPrice = Math.min(...prices) || 0;
  const maxPrice = Math.max(...prices) || 5000;

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-beige-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-charcoal-800 hover:text-gold-600 transition-colors"
      >
        <span className="text-sm font-semibold uppercase tracking-wider">{title}</span>
        <motion.div
          animate={{ rotate: expandedSections[section] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-beige-300 rounded-lg text-charcoal-800 hover:bg-beige-50 transition-colors"
        >
          <FiSliders size={16} />
          <span>Filters</span>
          {Object.values(filters).some(v => v && v !== 'all' && v !== 'All') && (
            <span className="bg-gold-500 text-white text-xs px-2 py-1 rounded-full">
              {Object.values(filters).filter(v => v && v !== 'all' && v !== 'All').length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-serif text-charcoal-800">Filters</h2>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 hover:bg-beige-100 rounded-lg transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Filters */}
      <div className="hidden md:block w-64 sticky top-24">
        <div className="bg-white border border-beige-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif text-charcoal-800">Filters</h2>
            <button
              onClick={onClearFilters}
              className="text-sm text-charcoal-500 hover:text-gold-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  );

  function FilterContent() {
    return (
      <div className="space-y-6">
        {/* Sort */}
        <FilterSection title="Sort By" section="sort">
          <select
            value={filters.sort || 'name-asc'}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full p-2 border border-beige-300 rounded-md focus:ring-gold-500 focus:border-gold-500 text-sm"
          >
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Category" section="category">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value="all"
                checked={filters.category === 'all' || !filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="mr-3 h-4 w-4 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-sm text-charcoal-700">All Categories</span>
            </label>
            {uniqueCategories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                  className="mr-3 h-4 w-4 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-sm text-charcoal-700 capitalize">
                  {category.replace(/-/g, ' ')}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Subcategory */}
        <FilterSection title="Subcategory" section="subcategory">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="subcategory"
                value="all"
                checked={filters.subcategory === 'all' || !filters.subcategory}
                onChange={(e) => onFilterChange('subcategory', e.target.value)}
                className="mr-3 h-4 w-4 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-sm text-charcoal-700">All Subcategories</span>
            </label>
            {uniqueSubcategories.map(subcategory => (
              <label key={subcategory} className="flex items-center">
                <input
                  type="radio"
                  name="subcategory"
                  value={subcategory}
                  checked={filters.subcategory === subcategory}
                  onChange={(e) => onFilterChange('subcategory', e.target.value)}
                  className="mr-3 h-4 w-4 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-sm text-charcoal-700 capitalize">
                  {subcategory.replace(/-/g, ' ')}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Finish */}
        <FilterSection title="Finish" section="finish">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.finish?.includes('all') || !filters.finish?.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    onFilterChange('finish', []);
                  }
                }}
                className="mr-3 h-4 w-4 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-sm text-charcoal-700">All Finishes</span>
            </label>
            {uniqueFinishes.map(finish => (
              <label key={finish} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.finish?.includes(finish)}
                  onChange={(e) => {
                    const currentFinishes = filters.finish || [];
                    if (e.target.checked) {
                      onFilterChange('finish', [...currentFinishes, finish]);
                    } else {
                      onFilterChange('finish', currentFinishes.filter(f => f !== finish));
                    }
                  }}
                  className="mr-3 h-4 w-4 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-sm text-charcoal-700">{finish}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brand */}
        {uniqueBrands.length > 0 && (
          <FilterSection title="Brand" section="brand">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!filters.brand?.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFilterChange('brand', []);
                    }
                  }}
                  className="mr-3 h-4 w-4 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-sm text-charcoal-700">All Brands</span>
              </label>
              {uniqueBrands.map(brand => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brand?.includes(brand)}
                    onChange={(e) => {
                      const currentBrands = filters.brand || [];
                      if (e.target.checked) {
                        onFilterChange('brand', [...currentBrands, brand]);
                      } else {
                        onFilterChange('brand', currentBrands.filter(b => b !== brand));
                      }
                    }}
                    className="mr-3 h-4 w-4 text-gold-500 focus:ring-gold-500"
                  />
                  <span className="text-sm text-charcoal-700">{brand}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection title="Price Range" section="price">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localMinPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setLocalMinPrice(value);
                  // Only trigger debounced update if value actually changed
                  if (value !== filters.minPrice) {
                    debouncedPriceUpdate(value, localMaxPrice);
                  }
                }}
                className="w-full p-2 border border-beige-300 rounded-md focus:ring-gold-500 focus:border-gold-500 text-sm"
              />
              <span className="text-charcoal-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={localMaxPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setLocalMaxPrice(value);
                  // Only trigger debounced update if value actually changed
                  if (value !== filters.maxPrice) {
                    debouncedPriceUpdate(localMinPrice, value);
                  }
                }}
                className="w-full p-2 border border-beige-300 rounded-md focus:ring-gold-500 focus:border-gold-500 text-sm"
              />
            </div>
            <div className="text-xs text-charcoal-500">
              Range: ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
            </div>
          </div>
        </FilterSection>
      </div>
    );
  }
}

export default React.memo(ProductFilters);
