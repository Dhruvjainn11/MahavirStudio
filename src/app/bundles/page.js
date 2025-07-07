"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart, FiEye, FiStar, FiPackage, FiCheck } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import { useCart } from "../context/cartContext";
import { useToast } from "../components/Toast";
import { ProductCardSkeleton } from "../components/LoadingSpinner";

// Bundle data
const bundles = [
  {
    id: "bathroom-essential",
    name: "Bathroom Essential Bundle",
    description: "Complete bathroom accessories set including towel rail, soap dispenser, and toilet paper holder",
    category: "Bathroom",
    image: "/hardware1.jpg",
    originalPrice: 4299,
    bundlePrice: 3499,
    savings: 800,
    rating: 4.7,
    reviews: 124,
    inStock: true,
    products: [
      { name: "Premium Towel Rail", price: 1599, image: "/hardware1.jpg" },
      { name: "Luxury Soap Dispenser", price: 899, image: "/hardware2.jpg" },
      { name: "Toilet Paper Holder", price: 699, image: "/hardware3.jpg" },
      { name: "Bathroom Hook Set", price: 1102, image: "/hardware4.png" }
    ],
    features: ["Chrome Finish", "Rust Proof", "Easy Installation", "Modern Design"]
  },
  {
    id: "door-hardware-premium",
    name: "Premium Door Hardware Bundle",
    description: "Complete door hardware set with handles, knobs, and hinges for 3 doors",
    category: "Door Hardware",
    image: "/hardware3.jpg",
    originalPrice: 5997,
    bundlePrice: 4799,
    savings: 1198,
    rating: 4.8,
    reviews: 89,
    inStock: true,
    products: [
      { name: "Brushed Brass Handle (3 pcs)", price: 3897, image: "/hardware1.jpg" },
      { name: "Matte Black Knob (3 pcs)", price: 2397, image: "/hardware2.jpg" },
      { name: "Premium Hinges (6 pcs)", price: 1800, image: "/hardware5.png" }
    ],
    features: ["Premium Quality", "Matching Finish", "Heavy Duty", "Professional Grade"]
  },
  {
    id: "kitchen-cabinet-bundle",
    name: "Kitchen Cabinet Hardware Bundle",
    description: "Complete kitchen cabinet hardware including handles, knobs, and drawer slides",
    category: "Kitchen",
    image: "/hardware5.png",
    originalPrice: 6499,
    bundlePrice: 5199,
    savings: 1300,
    rating: 4.6,
    reviews: 156,
    inStock: true,
    products: [
      { name: "Cabinet Handles (10 pcs)", price: 2990, image: "/hardware1.jpg" },
      { name: "Drawer Knobs (8 pcs)", price: 1992, image: "/hardware2.jpg" },
      { name: "Soft Close Hinges (12 pcs)", price: 2400, image: "/hardware3.jpg" },
      { name: "Drawer Slides (6 pairs)", price: 1800, image: "/hardware4.png" }
    ],
    features: ["Soft Close", "Smooth Operation", "Durable", "Modern Style"]
  },
  {
    id: "bedroom-door-bundle",
    name: "Bedroom Door Bundle",
    description: "Elegant door hardware set perfect for bedroom doors with privacy locks",
    category: "Door Hardware",
    image: "/hardware4.png",
    originalPrice: 4199,
    bundlePrice: 3399,
    savings: 800,
    rating: 4.5,
    reviews: 73,
    inStock: true,
    products: [
      { name: "Privacy Door Handle (2 pcs)", price: 1998, image: "/hardware1.jpg" },
      { name: "Door Knob with Lock (2 pcs)", price: 1598, image: "/hardware2.jpg" },
      { name: "Door Stopper (2 pcs)", price: 398, image: "/hardware3.jpg" },
      { name: "Decorative Hinges (4 pcs)", price: 1200, image: "/hardware5.png" }
    ],
    features: ["Privacy Lock", "Quiet Operation", "Elegant Design", "Easy Install"]
  },
  {
    id: "bathroom-luxury-bundle",
    name: "Luxury Bathroom Bundle",
    description: "Premium bathroom accessories with gold finish for a luxurious feel",
    category: "Bathroom",
    image: "/hardware2.jpg",
    originalPrice: 7999,
    bundlePrice: 6399,
    savings: 1600,
    rating: 4.9,
    reviews: 45,
    inStock: true,
    products: [
      { name: "Gold Towel Rail Set", price: 2499, image: "/hardware1.jpg" },
      { name: "Luxury Soap Dispenser", price: 1299, image: "/hardware2.jpg" },
      { name: "Premium Shower Caddy", price: 1899, image: "/hardware3.jpg" },
      { name: "Bathroom Mirror Frame", price: 1999, image: "/hardware4.png" },
      { name: "Toilet Brush Holder", price: 599, image: "/hardware5.png" }
    ],
    features: ["Gold Finish", "Luxury Design", "Corrosion Resistant", "Premium Quality"]
  },
  {
    id: "office-door-bundle",
    name: "Office Door Bundle",
    description: "Professional door hardware bundle suitable for office environments",
    category: "Door Hardware",
    image: "/hardware1.jpg",
    originalPrice: 3599,
    bundlePrice: 2899,
    savings: 700,
    rating: 4.4,
    reviews: 92,
    inStock: false,
    products: [
      { name: "Professional Door Handle (2 pcs)", price: 1798, image: "/hardware1.jpg" },
      { name: "Door Closer (2 pcs)", price: 1200, image: "/hardware2.jpg" },
      { name: "Name Plate Holder (2 pcs)", price: 299, image: "/hardware3.jpg" },
      { name: "Office Hinges (4 pcs)", price: 800, image: "/hardware4.png" }
    ],
    features: ["Professional Grade", "Self Closing", "Durable", "Modern Look"]
  }
];

const categories = ['All', 'Bathroom', 'Door Hardware', 'Kitchen'];

export default function BundlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBundle, setExpandedBundle] = useState(null);
  
  const { addToCart } = useCart();
  const toast = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("bundle-wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
    // Simulate loading
    setTimeout(() => setLoading(false), 600);
  }, []);

  useEffect(() => {
    localStorage.setItem("bundle-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (bundleId, bundleName) => {
    const isInWishlist = wishlist.includes(bundleId);
    
    if (isInWishlist) {
      setWishlist(prev => prev.filter(id => id !== bundleId));
      toast.info(`${bundleName} removed from wishlist`);
    } else {
      setWishlist(prev => [...prev, bundleId]);
      toast.success(`${bundleName} added to wishlist!`);
    }
  };

  const handleAddToCart = (bundle) => {
    const bundleItem = {
      slug: bundle.id,
      name: bundle.name,
      price: `₹${bundle.bundlePrice.toLocaleString()}`,
      image: bundle.image,
      category: 'bundles',
      inStock: bundle.inStock
    };
    
    addToCart(bundleItem);
    toast.cartSuccess(bundle.name, {
      description: `Bundle saved ₹${bundle.savings}! View cart to checkout`
    });
  };

  const filteredBundles = selectedCategory === 'All' 
    ? bundles 
    : bundles.filter(bundle => bundle.category === selectedCategory);

  const toggleExpanded = (bundleId) => {
    setExpandedBundle(expandedBundle === bundleId ? null : bundleId);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif text-charcoal-800 mb-4"
        >
          Ready-Made Bundles
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-charcoal-600 max-w-3xl mx-auto"
        >
          Complete hardware solutions for your home and office. Save money with our carefully curated bundles 
          featuring premium products that work perfectly together.
        </motion.p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategory === category
                ? 'bg-charcoal-800 text-white shadow-lg'
                : 'bg-white text-charcoal-600 hover:bg-beige-100 border border-beige-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-gradient-to-r from-gold-50 to-beige-50 rounded-lg">
          <div className="text-2xl font-bold text-charcoal-800">{filteredBundles.length}</div>
          <div className="text-sm text-charcoal-600">Available Bundles</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-gold-50 to-beige-50 rounded-lg">
          <div className="text-2xl font-bold text-charcoal-800">₹{Math.max(...filteredBundles.map(b => b.savings)).toLocaleString()}</div>
          <div className="text-sm text-charcoal-600">Max Savings</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-gold-50 to-beige-50 rounded-lg">
          <div className="text-2xl font-bold text-charcoal-800">{filteredBundles.filter(b => b.inStock).length}</div>
          <div className="text-sm text-charcoal-600">In Stock</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-gold-50 to-beige-50 rounded-lg">
          <div className="text-2xl font-bold text-charcoal-800">4.7</div>
          <div className="text-sm text-charcoal-600">Avg Rating</div>
        </div>
      </div>

      {/* Bundles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Bundle Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={bundle.image}
                  alt={bundle.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Save ₹{bundle.savings}
                </div>
                
                {/* Stock Status */}
                {!bundle.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-charcoal-800">
                      Out of Stock
                    </span>
                  </div>
                )}
                
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(bundle.id, bundle.name)}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  {wishlist.includes(bundle.id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-charcoal-600" />
                  )}
                </button>
              </div>
              
              {/* Bundle Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="inline-block bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
                  {bundle.category}
                </div>
                
                {/* Bundle Name */}
                <h3 className="text-xl font-semibold text-charcoal-800 mb-2 group-hover:text-gold-600 transition-colors">
                  {bundle.name}
                </h3>
                
                {/* Description */}
                <p className="text-charcoal-600 text-sm mb-4">
                  {bundle.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <FiStar className="text-gold-500 fill-current" />
                    <span className="text-sm font-medium text-charcoal-700">{bundle.rating}</span>
                  </div>
                  <span className="text-xs text-charcoal-500">({bundle.reviews} reviews)</span>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {bundle.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-beige-100 text-charcoal-700 px-2 py-1 rounded text-xs">
                      <FiCheck className="text-green-600" />
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-charcoal-800">
                      ₹{bundle.bundlePrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-charcoal-500 line-through">
                      ₹{bundle.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    You save ₹{bundle.savings} ({Math.round((bundle.savings / bundle.originalPrice) * 100)}% off)
                  </div>
                </div>
                
                {/* Products Preview */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleExpanded(bundle.id)}
                    className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-800 transition-colors"
                  >
                    <FiPackage />
                    {bundle.products.length} items included
                    <FiEye className={`transform transition-transform ${
                      expandedBundle === bundle.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedBundle === bundle.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-2"
                    >
                      {bundle.products.map((product, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-beige-50 rounded-lg">
                          <div className="w-8 h-8 relative">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-charcoal-700">{product.name}</div>
                            <div className="text-xs text-charcoal-500">₹{product.price}</div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(bundle)}
                    disabled={!bundle.inStock}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      bundle.inStock
                        ? 'bg-charcoal-800 text-white hover:bg-charcoal-700 hover:scale-105'
                        : 'bg-beige-200 text-charcoal-400 cursor-not-allowed'
                    }`}
                  >
                    <FiShoppingCart />
                    {bundle.inStock ? 'Add Bundle to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {filteredBundles.length === 0 && !loading && (
        <div className="text-center py-12">
          <FiPackage className="mx-auto text-4xl text-charcoal-300 mb-4" />
          <h3 className="text-xl font-medium text-charcoal-700 mb-2">
            No bundles found
          </h3>
          <p className="text-charcoal-500 mb-6">
            Try selecting a different category to find available bundles.
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="px-6 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
          >
            View All Bundles
          </button>
        </div>
      )}
    </section>
  );
}
