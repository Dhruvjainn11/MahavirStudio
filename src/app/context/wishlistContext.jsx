// context/WishlistContext.js
'use client'; // This directive is important for client components in Next.js App Router

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/app/components/Toast'; // Adjust path to your custom useToast hook
import { useAuth } from '@/app/context/authContext'; // Assuming you have an AuthContext providing `useAuth`

// Create the Wishlist Context
const WishlistContext = createContext(null);

// Custom hook to use the Wishlist Context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Wishlist Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  const { user, token } = useAuth(); // Get user and token from your AuthContext


  // Get the base API URL from environment variables
  // IMPORTANT: Ensure NEXT_PUBLIC_API_URL is defined in your .env.local or similar
  const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Helper function for API calls, now dynamically constructing the full URL
  const apiCall = useCallback(async (method, endpoint, data = null) => {
    // Construct the full URL using the base API URL and the endpoint
    const url = `${BASE_API_URL}${endpoint}`;

    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Add authorization token if available
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        // If the API call failed, throw an error with the message from the backend
        throw new Error(result.message || response.statusText || 'Something went wrong');
      }
      return result;
    } catch (err) {
      console.error(`API Error for ${url}:`, err);
      // Use your custom error toast directly
      error(err.message || 'An unexpected error occurred during API call.');
      throw err; // Re-throw to allow specific error handling in calling functions
    }
  }, [token, error, BASE_API_URL]); // Depend on token, error toast, and BASE_API_URL

  // Fetch user's wishlist
  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Use the endpoint relative to the base API URL
      const data = await apiCall('GET', '/api/wishlist');
      setWishlistItems(data.items || []);
      success('Wishlist loaded!');
    } catch (err) {
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [apiCall, user, success]);

  // Add item to wishlist
  const addToWishlist = useCallback(async (productId) => {
    // if (!user) {
    //   error('Please log in to add items to your wishlist.');
    //   return false;
    // }
    try {
      // Use the endpoint relative to the base API URL
      const updatedWishlist = await apiCall('POST', '/api/wishlist', { productId });
      setWishlistItems(updatedWishlist.items);
      success('Product added to wishlist!');
      return true;
    } catch (err) {
      if (err.message === 'Product already in wishlist') {
        error('This product is already in your wishlist.');
      }
      return false;
    }
  }, [apiCall, user, success, error]);

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (wishlistItemId) => {
    // if (!user) {
    //   error('Please log in to remove items from your wishlist.');
    //   return false;
    // }
    try {
      // Use the endpoint relative to the base API URL
      const updatedWishlist = await apiCall('DELETE', `/api/wishlist/${wishlistItemId}`);
      setWishlistItems(updatedWishlist.items);
      success('Product removed from wishlist!');
      return true;
    } catch (err) {
      return false;
    }
  }, [apiCall, user, success, error]);

  // Check if a product is in the wishlist
  const isProductInWishlist = useCallback((productId) => {
    return wishlistItems.some(item =>
      item.productId?._id === productId || item.productId === productId
    );
  }, [wishlistItems]);

  // Effect to fetch wishlist on component mount and when user (login/logout) changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, user]);

  const contextValue = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};