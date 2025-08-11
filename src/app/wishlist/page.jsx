// app/wishlist/page.js
'use client'; // This directive is important for client components in Next.js App Router

import React from 'react';
import Image from 'next/image'; // Assuming you use Next.js Image component
import { useWishlist } from '@/app/context/wishlistContext'; // Adjust path for your WishlistContext
// Assuming you have a basic loading spinner or component
// import LoadingSpinner from '@/components/LoadingSpinner' // You'll need to create this if you haven't

const WishlistPage = () => {
  const { wishlistItems, loading, error, removeFromWishlist } = useWishlist();
  console.log(wishlistItems);
  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* <LoadingSpinner /> Your loading spinner component */}
        <p className="text-lg ml-2">Loading your wishlist...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Wishlist</h2>
        <p className="text-lg text-gray-700">{error}</p>
        <p className="text-md text-gray-500 mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-15">
      <h1 className="text-3xl font-bold text-center mb-8">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        // Empty wishlist state
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">Your wishlist is empty.</p>
          <p className="text-md text-gray-500">
            Start adding your favorite products to save them for later!
          </p>
          {/* You might add a link to your products page here */}
          <a href="/products" className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors">
            Explore Products
          </a>
        </div>
      ) : (
        // List of wishlist items
        <div className="grid grid-cols-1 gap-6">
          {wishlistItems.map((item) => {
            // Check if product details are populated (from `populate('items.productId')` in backend)
            const product = item.productId;

            // Handle cases where product data might be missing (e.g., product deleted from DB)
            if (!product) {
              return (
                <div key={item._id} className="flex items-center space-x-4 p-4 border-b border-gray-200 bg-gray-50 rounded-lg shadow-sm">
                  <p className="text-red-500 flex-grow">Product data unavailable for a saved item.</p>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              );
            }

            return (
              <div key={item._id} className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-4 border-b border-gray-200 bg-white rounded-lg shadow-sm">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={product.images[0].url || '/placeholder-image.jpg'} // Use product image or a placeholder
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-md border border-gray-100"
                  />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-xl font-bold mb-2">₹{product.price?.toFixed(2)}</p>
                  {product.availableColors && product.availableColors.length > 0 && (
                    <p className="text-gray-500 text-sm">Colors: {product.availableColors.join(', ')}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">Added on: {new Date(item.addedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                  {/* If you add cart functionality later, you can place 'Move to Cart' button here */}
                  {/* <button
                    onClick={() => console.log('Move to Cart functionality')}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    Move to Cart
                  </button> */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;