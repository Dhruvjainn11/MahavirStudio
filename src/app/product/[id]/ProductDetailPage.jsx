"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Info,
  Eye,
  StarHalf,
} from 'lucide-react';

// --- IMPORTANT: Adjust these import paths to your actual files ---
import { useToast } from '@/app/components/Toast'; // Your custom toast hook
import { useAuth } from '@/app/context/authContext'; // Your AuthContext hook
// --- End IMPORTANT ---

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // Removed local 'error' state, as error will handle all error messages
  // const [error, setError] = useState(null);

  // UI state
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentWishlistItemId, setCurrentWishlistItemId] = useState(null); // Used for removing from wishlist
  const [addedToCart, setAddedToCart] = useState(false); // For button feedback
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Initialize your specific toast functions
  // Destructuring only success and error (renamed error for clarity)
  const { success, error} = useToast();

  // Get token from your AuthContext
  const { token } = useAuth();

  // Function to fetch product details and initialize user-specific states (wishlist, cart)
  const fetchProductAndUserStates = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      // Removed setError(null);
      
      // Fetch product details
      const productRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
      setProduct(productRes.data);

      if (token) {
        // Set Authorization header for all subsequent axios calls in this component instance
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user's wishlist to check if this product is favorited
        const wishlistRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`);
        const userWishlistItems = wishlistRes.data.items; // Assuming your wishlist GET returns { items: [...] }

        const foundInWishlist = userWishlistItems.find(item => item.productId?._id === productRes.data._id);
        if (foundInWishlist) {
          setIsFavorited(true);
          setCurrentWishlistItemId(foundInWishlist._id); // Store the actual _id of the wishlist item for deletion
        } else {
          setIsFavorited(false);
          setCurrentWishlistItemId(null);
        }

        // Optional: Fetch user's cart to pre-set quantity if product is already in cart
        // For now, quantity defaults to 1 on page load. You could extend this if needed.

      } else {
        // User is not authenticated, so disable wishlist/cart specific UI states
        setIsFavorited(false);
        setCurrentWishlistItemId(null);
        // Do not display "Please log in" toast immediately on page load, only when they try to interact
      }

    } catch (err) {
      console.error('API fetch error:', err);
      // Directly using error for fetch errors, no local state update needed
      error(err.response?.data?.message || 'Failed to load product details.');
      // Removed conditional error for 401 status, as general error covers it.
    } finally {
      setLoading(false);
    }
  }, [id, token]); // Dependencies for useCallback

  useEffect(() => {
    fetchProductAndUserStates();
  }, [fetchProductAndUserStates]);


  const handleAddToCart = async () => {
    if (!product) {
      error("Product data not loaded.");
      return;
    }
    if (!token) {
      error("Please log in to add items to cart.");
      return;
    }

    // Removed toastLoading call
    setAddedToCart(true); // For immediate button feedback

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        { productId: product._id, quantity: quantity },
      );
      success(`${res.data.addedItem.productId.name}  added to cart!`);
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err);
      error(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAddedToCart(false); // Reset button state
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) {
      error("Product data not loaded.");
      return;
    }
    if (!token) {
      error("Please log in to manage your wishlist.");
      return;
    }

    // Removed toastLoading call
    
    try {
      if (isFavorited) {
        // Remove from wishlist
        if (!currentWishlistItemId) {
            error("Cannot remove, wishlist item ID not found.");
            return;
        }
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${currentWishlistItemId}`);
        setIsFavorited(false);
        setCurrentWishlistItemId(null);
        success(`${product.name} removed from wishlist.`);
      } else {
        // Add to wishlist
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
          { productId: product._id }
        );
        setIsFavorited(true);
        // After adding, find the specific _id of the newly added wishlist item from the response
        const newItem = res.data.items.find(item => item.productId?._id === product._id);
        if (newItem) {
            setCurrentWishlistItemId(newItem._id);
        }
        success(`${product.name} added to wishlist!`);
      }
    } catch (err) {
      console.error("Wishlist operation failed:", err.response?.data || err);
      error(err.response?.data?.message || 'Failed to update wishlist.');
    }
  };

  // --- UI Rendering Functions (unchanged from previous version) ---
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Product Not Found (after loading) ---
  // The global error handling is now done by error.
  // This 'product not found' check is for when the product API returns 200 but no product data,
  // or after a soft error where `setProduct(null)` might still be true.
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Image Navigation */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Favorite Button (Wishlist) */}
                <button
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={image.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(product.rating.average ?? 0)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.average?.toFixed(1)} ({product.rating.count || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="text-gray-600 leading-relaxed">
                {showFullDescription ? product.fullDescription || product.description : product.description}
              </p>
              {product.fullDescription && product.fullDescription !== product.description && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            {/* Features - This section will not render if product.features is not provided by backend */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Key Features</h3>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {product.stock !== undefined && (
                  <span className="text-sm text-gray-600">
                    {product.stock} items in stock
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !token} // Disable if out of stock or not logged in
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : product.stock > 0 && token
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {product.stock > 0 ? (token ? 'Add to Cart' : 'Log in to Add') : 'Out of Stock'}
                      </>
                    )}
                  </div>
                </button>

                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-600">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.fullDescription || product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}