"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi"; 
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { products } from "@/app/lib/product"; // adjust this path to match your setup

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
   const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  // Save wishlist to localStorage when updated
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = () => {
    if (!product) return;
    const isWished = wishlist.includes(product.slug);
    const updated = isWished
      ? wishlist.filter((id) => id !== product.slug)
      : [...wishlist, product.slug];
    setWishlist(updated);
  };

  const isInWishlist = wishlist.includes(product?.slug);


  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-semibold text-charcoal-800">
          Product not found 😢
        </h1>
        <Link
          href="/products"
          className="text-gold-600 mt-4 inline-block underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-20" >
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-charcoal-600 ">
        <Link href="/" className="hover:underline">Home</Link> /
        <Link href="/products" className="hover:underline ml-1">Products</Link> /
        <span className="ml-1 text-charcoal-800 font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:items-start">
        {/* Product Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl sm:text-3xl font-serif text-charcoal-800">
              {product.name}
            </h1>
            <p className="text-base sm:text-lg text-charcoal-500">
              Finish: <span className="font-medium">{product.finish}</span>
            </p>
            <p className="text-gold-600 text-xl sm:text-2xl font-bold">
              {product.price}
            </p>
            <p className="text-charcoal-600 leading-relaxed text-sm sm:text-base">
              This premium hardware product is crafted to enhance your space with elegance and durability. Suitable for both modern and traditional designs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base bg-charcoal-800 text-white rounded-md hover:bg-charcoal-700 transition">
              <FiShoppingCart /> Add to Cart
            </button>
            <button  onClick={toggleWishlist}
              className={`p-3 rounded-md transition ${
                isInWishlist
                  ? "bg-gold-100 text-gold-600 hover:bg-gold-200"
                  : "bg-beige-100 text-charcoal-800 hover:bg-beige-200"
              }`}>
              {isInWishlist ? <FaHeart size={20} /> : <FiHeart size={20} />}
            </button>
          </div>
        </div>

        
      </div>
      {/* Related Products Section */}
<div className="mt-20">
  <h2 className="text-2xl font-serif text-charcoal-800 mb-6">Related Products</h2>
  <div className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide">
    {products
      .filter(
        (p) =>
          p.slug !== product.slug &&
          p.subcategory === product.subcategory
      )
      .map((item, i) => (
        <Link
          href={`/product/${item.slug}`}
          key={i}
          className="min-w-[250px] bg-white border border-beige-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          </div>
          <h4 className="text-base font-semibold text-charcoal-800">{item.name}</h4>
          <p className="text-gold-500 font-medium">{item.price}</p>
        </Link>
      ))}
  </div>
</div>

    </section>
  );
}
