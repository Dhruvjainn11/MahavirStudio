'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiX, 
  FiFilter,
  FiSearch,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiTool
} from 'react-icons/fi';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  products, 
  mobileOpen, 
  setMobileOpen 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    brand: false,
    finish: false,
    subcategory: false
  });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const subcategories = [...new Set(products.map(p => p.subcategory).filter(Boolean))];
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const finishes = [...new Set(products.map(p => p.finish).filter(Boolean))];
    
    return { categories, subcategories, brands, finishes };
  }, [products]);

  // Price ranges for quick selection
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 499 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
    { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: Infinity }
  ];

  // Format price using Intl API
  const formatPrice = (price) => {
    if (price === Infinity) return '∞';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle price range selection
  const handlePriceRangeSelect = (range) => {
    const minPrice = range.min === 0 ? '' : range.min.toString();
    const maxPrice = range.max === Infinity ? '' : range.max.toString();
    
    setPriceRange({ min: minPrice, max: maxPrice });
    onFilterChange('minPrice', minPrice);
    onFilterChange('maxPrice', maxPrice);
  };

  // Handle custom price input
  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
    onFilterChange(type === 'min' ? 'minPrice' : 'maxPrice', value);
  };

  // Handle array filters (brand, finish)
  const handleArrayFilterChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterType, newValues);
  };

  // Get count of products for each filter option
  const getFilterCount = (filterType, value) => {
    return products.filter(product => {
      if (filterType === 'category') return product.category === value;
      if (filterType === 'subcategory') return product.subcategory === value;
      if (filterType === 'brand') return product.brand === value;
      if (filterType === 'finish') return product.finish === value;
      return false;
    }).length;
  };

  // Filter options based on search
  const getFilteredOptions = (options, filterType) => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Clear all filters
  const handleClearAll = () => {
    setPriceRange({ min: '', max: '' });
    setSearchTerm('');
    onClearFilters();
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.subcategory !== 'all') count++;
    if (filters.finish?.length > 0) count++;
    if (filters.brand?.length > 0) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    return count;
  };

  const FilterSection = ({ title, isExpanded, onToggle, icon: Icon, children }) => (
    <div className="border-b border-beige-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left py-2 hover:text-gold-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="text-gold-500" size={16} />
          <span className="font-medium text-charcoal-800">{title}</span>
        </div>
        {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const CheckboxFilter = ({ options, filterType, selectedValues = [] }) => (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {getFilteredOptions(options, filterType).map((option) => (
        <label
          key={option}
          className="flex items-center justify-between p-2 hover:bg-beige-50 rounded-md cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleArrayFilterChange(filterType, option)}
              className="rounded border-beige-300 text-gold-500 focus:ring-gold-500"
            />
            <span className="text-sm text-charcoal-700">{option}</span>
          </div>
          <span className="text-xs text-charcoal-400 bg-beige-100 px-2 py-1 rounded-full">
            {getFilterCount(filterType, option)}
          </span>
        </label>
      ))}
    </div>
  );

  const RadioFilter = ({ options, filterType, selectedValue }) => (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center justify-between p-2 hover:bg-beige-50 rounded-md cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name={filterType}
              checked={selectedValue === option}
              onChange={() => onFilterChange(filterType, option)}
              className="border-beige-300 text-gold-500 focus:ring-gold-500"
            />
            <span className="text-sm text-charcoal-700 capitalize">{option}</span>
          </div>
          <span className="text-xs text-charcoal-400 bg-beige-100 px-2 py-1 rounded-full">
            {getFilterCount(filterType, option)}
          </span>
        </label>
      ))}
    </div>
  );

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gold-500" />
          <h2 className="text-lg font-semibold text-charcoal-800">Filters</h2>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-gold-500 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-beige-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={16} />
        <input
          type="text"
          placeholder="Search filters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-beige-200 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
        />
      </div>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
        icon={FiDollarSign}
      >
        {/* Quick Price Ranges */}
        <div className="space-y-2 mb-4">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handlePriceRangeSelect(range)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                filters.minPrice === (range.min === 0 ? '' : range.min.toString()) &&
                filters.maxPrice === (range.max === Infinity ? '' : range.max.toString())
                  ? 'bg-gold-500 text-white'
                  : 'bg-beige-50 text-charcoal-700 hover:bg-beige-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Custom Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-charcoal-700">Custom Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="flex-1 px-3 py-2 border border-beige-200 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
            />
            <span className="py-2 text-charcoal-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="flex-1 px-3 py-2 border border-beige-200 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
            />
          </div>
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
        icon={FiLayers}
      >
        <RadioFilter
          options={['all', ...filterOptions.categories]}
          filterType="category"
          selectedValue={filters.category}
        />
      </FilterSection>

      {/* Subcategory */}
      {filterOptions.subcategories.length > 0 && (
        <FilterSection
          title="Subcategory"
          isExpanded={expandedSections.subcategory}
          onToggle={() => toggleSection('subcategory')}
          icon={FiTag}
        >
          <RadioFilter
            options={['all', ...filterOptions.subcategories]}
            filterType="subcategory"
            selectedValue={filters.subcategory}
          />
        </FilterSection>
      )}

      {/* Brand */}
      {filterOptions.brands.length > 0 && (
        <FilterSection
          title="Brand"
          isExpanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
          icon={FiTag}
        >
          <CheckboxFilter
            options={filterOptions.brands}
            filterType="brand"
            selectedValues={filters.brand || []}
          />
        </FilterSection>
      )}

      {/* Finish */}
      {filterOptions.finishes.length > 0 && (
        <FilterSection
          title="Finish"
          isExpanded={expandedSections.finish}
          onToggle={() => toggleSection('finish')}
          icon={FiTool}
        >
          <CheckboxFilter
            options={filterOptions.finishes}
            filterType="finish"
            selectedValues={filters.finish || []}
          />
        </FilterSection>
      )}

      {/* Sort By */}
      <FilterSection
        title="Sort By"
        isExpanded={true}
        onToggle={() => {}}
        icon={FiFilter}
      >
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 border border-beige-200 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white"
        >
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </FilterSection>

      {/* Clear All Button */}
      {getActiveFiltersCount() > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleClearAll}
          className="w-full px-4 py-2 bg-charcoal-800 text-white rounded-md hover:bg-charcoal-700 transition-colors font-medium"
        >
          Clear All Filters
        </motion.button>
      )}
    </div>
  );

  // Mobile modal
  if (mobileOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {filterContent}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden md:block w-80 bg-white rounded-lg border border-beige-200 p-6 h-fit sticky top-4">
      {filterContent}
    </div>
  );
};

export default ProductFilters;