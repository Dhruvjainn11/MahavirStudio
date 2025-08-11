// components/ComingSoonBundle.jsx

"use client";
import React from 'react';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import Footer from './Footer'; // Assuming you have a Footer component

const ComingSoonBundle = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <span className="text-sm md:text-base font-semibold text-gold-600 uppercase tracking-widest mb-4 block">
            A New Way to Shop
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Bundles Are Coming Soon.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            We're meticulously crafting curated collections of products to simplify your life. From <strong>"Bathroom Essentials"</strong> to <strong>"Kitchen Accessories,"</strong> you'll find everything you need in one elegant package.
          </p>
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">The Wait Is Worth It</h2>
            <p className="text-gray-500">
              Our team is putting the final touches on this new feature. Stay tuned for a seamless and premium shopping experience.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComingSoonBundle;