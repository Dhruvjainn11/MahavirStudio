"use client";

import { useState, useMemo } from 'react';
import { useCart } from '../context/cartContext';
import { FiSearch, FiShoppingCart, FiHeart, FiEye, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Extended paint data with shade codes and categories
const paintData = [
  {
    id: 1,
    name: "Morning Glory",
    brand: "Asian Paints",
    shadeCode: "#D4E4F7",
    hexCode: "D4E4F7",
    category: "Blues",
    finish: "Matte",
    price: 2299,
    sizes: ["1L", "4L", "10L", "20L"],
    description: "A serene blue that brings calm to any space",
    trending: true,
    image: "/paint1.jpg"
  },
  {
    id: 2,
    name: "Sunset Orange",
    brand: "Berger Paints",
    shadeCode: "#FF8C42",
    hexCode: "FF8C42",
    category: "Oranges",
    finish: "Silk",
    price: 1899,
    sizes: ["1L", "4L", "10L", "20L"],
    description: "Warm and vibrant orange for energetic spaces",
    trending: true,
    image: "/paint2.jpg"
  },
  {
    id: 3,
    name: "Forest Green",
    brand: "Nerolac",
    shadeCode: "#228B22",
    hexCode: "228B22",
    category: "Greens",
    finish: "Glossy",
    price: 2599,
    sizes: ["1L", "4L", "10L", "20L"],
    description: "Rich forest green for nature-inspired interiors",
    trending: false,
    image: "/paint1.jpg"
  },
  {
    id: 4,
    name: "Ivory White",
    brand: "Asian Paints",
    shadeCode: "#FFFFF0",
    hexCode: "FFFFF0",
    category: "Whites",
    finish: "Matte",
    price: 1799,
    sizes: ["1L", "4L", "10L", "20L"],
    description: "Classic ivory white for timeless elegance",
    trending: true,
    image: "/paint2.jpg"
  },
  {
    id: 5,
    name: "Lavender Dream",
    brand: "Dulux",
    shadeCode: "#E6E6FA",
    hexCode: "E6E6FA",
    category: "Purples",
    finish: "Satin",
    price: 2199,
    sizes: ["1L", "4L", "10L", "20L"],
    description: "Soft lavender for peaceful bedrooms",
    trending: false,
    image: "/paint1.jpg"
  },
  {
    id: 6,
    name: "Charcoal Grey",
    brand: "Berger Paints",
    shadeCode: "#36454F",
    hexCode: "36454F",
    category: "Greys",
    finish: "Matte",
    price: 2399,
    sizes: ["1L", "4L", "10L", "20L"],
    description: "Sophisticated charcoal for modern spaces",
    trending: true,
    image: "/paint2.jpg"
  },
  {
    id: 7,
    name: "Coral Blush",
    brand: "Nerolac",
    shadeCode: "#FF7F7F",
    hexCode: "FF7F7F",
    category: "Pinks",
    finish: "Silk",
    price: 2099,
    sizes: ["1L", "4L", "10L", "20L"],
    description: "Warm coral pink for welcoming spaces",
    trending: false,
    image: "/paint1.jpg"
  },
  {
    id: 8,
    name: "Ocean Blue",
    brand: "Asian Paints",
    shadeCode: "#006994",
    hexCode: "006994",
    category: "Blues",
    finish: "Glossy",
    price: 2499,
    sizes: ["1L", "4L", "10L", "20L"],
    description: "Deep ocean blue for statement walls",
    trending: true,
    image: "/paint2.jpg"
  }
];

const brands = ["All Brands", "Asian Paints", "Berger Paints", "Nerolac", "Dulux"];
const categories = ["All Categories", "Blues", "Greens", "Oranges", "Whites", "Purples", "Greys", "Pinks"];
const finishes = ["All Finishes", "Matte", "Silk", "Glossy", "Satin"];

export default function PaintsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFinish, setSelectedFinish] = useState('All Finishes');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPaint, setSelectedPaint] = useState(null);
  const [selectedSize, setSelectedSize] = useState('4L');
  const [wishlist, setWishlist] = useState([]);
  
  const { addToCart } = useCart();

  // Filter and search logic
  const filteredPaints = useMemo(() => {
    return paintData.filter(paint => {
      const matchesSearch = paint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          paint.hexCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          paint.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'All Brands' || paint.brand === selectedBrand;
      const matchesCategory = selectedCategory === 'All Categories' || paint.category === selectedCategory;
      const matchesFinish = selectedFinish === 'All Finishes' || paint.finish === selectedFinish;
      
      return matchesSearch && matchesBrand && matchesCategory && matchesFinish;
    });
  }, [searchTerm, selectedBrand, selectedCategory, selectedFinish]);

  // Get trending colors
  const trendingColors = paintData.filter(paint => paint.trending);

  // Get similar colors (mock implementation)
  const getSimilarColors = (color) => {
    return paintData.filter(paint => 
      paint.category === color.category && paint.id !== color.id
    ).slice(0, 3);
  };

  const handleAddToCart = (paint) => {
    const cartItem = {
      slug: `${paint.name.toLowerCase().replace(/\s+/g, '-')}-${selectedSize}`,
      name: `${paint.name} - ${selectedSize}`,
      price: `₹${paint.price}`,
      category: "paints",
      brand: paint.brand,
      image: paint.image,
      finish: paint.finish,
      size: selectedSize,
      shadeCode: paint.shadeCode
    };
    addToCart(cartItem);
  };

  const toggleWishlist = (paintId) => {
    setWishlist(prev => 
      prev.includes(paintId) 
        ? prev.filter(id => id !== paintId)
        : [...prev, paintId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-18">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🎨 Paint Collection</h1>
            <p className="text-lg text-gray-600 mb-6">Discover premium colors, palettes, and tools for your perfect space</p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by shade name or hex code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiFilter size={16} />
              Filters
            </button>
            
            <div className="text-sm text-gray-600">
              Showing {filteredPaints.length} of {paintData.length} colors
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white rounded-lg shadow-sm border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Finish</label>
                  <select
                    value={selectedFinish}
                    onChange={(e) => setSelectedFinish(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {finishes.map(finish => (
                      <option key={finish} value={finish}>{finish}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Trending Colors Section */}
        {!searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 Trending Colors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingColors.map(paint => (
                <motion.div
                  key={paint.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPaint(paint)}
                >
                  <div 
                    className="h-24 w-full"
                    style={{ backgroundColor: paint.shadeCode }}
                  ></div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm">{paint.name}</h3>
                    <p className="text-xs text-gray-500">{paint.brand}</p>
                    <p className="text-xs text-gray-400">#{paint.hexCode}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Paint Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPaints.map(paint => (
            <motion.div
              key={paint.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Color Preview */}
              <div className="relative">
                <div 
                  className="h-32 w-full"
                  style={{ backgroundColor: paint.shadeCode }}
                ></div>
                <button
                  onClick={() => toggleWishlist(paint.id)}
                  className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                    wishlist.includes(paint.id) 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiHeart size={16} fill={wishlist.includes(paint.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Paint Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{paint.name}</h3>
                    <p className="text-sm text-gray-600">{paint.brand}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPaint(paint)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <FiEye size={16} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{paint.finish}</span>
                  <span className="text-xs text-gray-500">#{paint.hexCode}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{paint.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">₹{paint.price}</span>
                  <button
                    onClick={() => setSelectedPaint(paint)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredPaints.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No paints found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Paint Detail Modal */}
      {selectedPaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPaint.name}</h2>
                <button
                  onClick={() => setSelectedPaint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Large Color Preview */}
              <div 
                className="h-40 w-full rounded-lg mb-4"
                style={{ backgroundColor: selectedPaint.shadeCode }}
              ></div>

              {/* Paint Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{selectedPaint.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hex Code:</span>
                  <span className="font-mono">#{selectedPaint.hexCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Finish:</span>
                  <span className="font-medium">{selectedPaint.finish}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{selectedPaint.category}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{selectedPaint.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {selectedPaint.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedSize === size
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price and Add to Cart */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-gray-900">₹{selectedPaint.price}</span>
                <button
                  onClick={() => {
                    handleAddToCart(selectedPaint);
                    setSelectedPaint(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>

              {/* Similar Colors */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Similar Colors</h3>
                <div className="grid grid-cols-3 gap-3">
                  {getSimilarColors(selectedPaint).map(similarPaint => (
                    <div
                      key={similarPaint.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedPaint(similarPaint)}
                    >
                      <div 
                        className="h-16 w-full rounded-lg mb-2"
                        style={{ backgroundColor: similarPaint.shadeCode }}
                      ></div>
                      <p className="text-xs text-gray-600 text-center">{similarPaint.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
