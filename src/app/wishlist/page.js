"use client";

import { useEffect, useState } from "react";
import { products } from "../lib/product"; // update path if needed
import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  const removeFromWishlist = (slug) => {
    const updated = wishlist.filter((item) => item !== slug);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.slug));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-18">
      <h1 className="text-3xl sm:text-4xl font-serif text-charcoal-800 mb-10">
        Your Wishlist
      </h1>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-medium text-charcoal-700 mb-2">
            No items in wishlist 😢
          </h2>
          <Link href="/products" className="text-gold-600 underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map((item, index) => (
            <div
              key={index}
              className="border border-beige-200 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition flex flex-col"
            >
              <Link href={`/product/${item.slug}`}>
                <div className="relative h-60 w-full mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <h3 className="text-lg font-semibold text-charcoal-800 mb-1">
                {item.name}
              </h3>
              <p className="text-sm text-charcoal-500 mb-2">{item.finish} Finish</p>
              <p className="text-gold-600 font-medium text-lg mb-4">{item.price}</p>

              <div className="flex gap-3 mt-auto">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-charcoal-800 text-white hover:bg-charcoal-700 rounded-md transition-colors">
                  <FiShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.slug)}
                  className="p-2 bg-beige-100 text-charcoal-800 hover:bg-beige-200 rounded-md transition-colors"
                >
                    <FaHeart size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
