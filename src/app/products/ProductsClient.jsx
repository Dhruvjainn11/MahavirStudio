"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiFilter } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";
import { products } from "../lib/product"; // Ensure this path is correct

export default function ProductsPage() {
  const [selectedFinish, setSelectedFinish] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = products.filter((p) => {
    const matchFinish = selectedFinish === "All" || p.finish === selectedFinish;
    const matchSub = selectedSubcategory === "All" || p.subcategory === selectedSubcategory;
    return matchFinish && matchSub;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-12">
      {/* Page Heading */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-charcoal-800">
          Hardware Products
        </h1>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-beige-100 rounded-lg text-sm text-charcoal-800 border border-beige-300"
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <aside
          className={`w-full md:w-64 ${
            mobileFiltersOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="bg-white border border-beige-200 p-6 rounded-lg shadow-sm sticky top-24">
            <h3 className="font-serif text-xl mb-6 text-charcoal-800">Filters</h3>

            {/* Finish Filter */}
            <div className="mb-8">
              <p className="text-charcoal-700 font-medium mb-3">Finish</p>
              <div className="space-y-2">
                {["All", "Matte", "Glossy", "Metallic"].map((f) => (
                  <label key={f} className="flex items-center">
                    <input
                      type="radio"
                      name="finish"
                      value={f}
                      checked={selectedFinish === f}
                      onChange={() => setSelectedFinish(f)}
                      className="mr-3 h-4 w-4 border-gray-300 text-gold-500 focus:ring-gold-500"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategory Filter */}
            <div className="mb-8">
              <p className="text-charcoal-700 font-medium mb-3">Subcategory</p>
              <div className="space-y-2">
                {["All", "door-handles", "knobs"].map((sub) => (
                  <label key={sub} className="flex items-center capitalize">
                    <input
                      type="radio"
                      name="subcategory"
                      value={sub}
                      checked={selectedSubcategory === sub}
                      onChange={() => setSelectedSubcategory(sub)}
                      className="mr-3 h-4 w-4 border-gray-300 text-gold-500 focus:ring-gold-500"
                    />
                    {sub.replace(/-/g, " ")}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="border border-beige-200 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                   <Link href={`/product/${item.slug}`} key={index}>
                  <div className="relative h-60 w-full mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-charcoal-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-charcoal-500 mb-2">
                      {item.finish} Finish
                    </p>
                    <p className="text-gold-600 font-medium text-lg mb-4">
                      {item.price}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-grow flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-charcoal-800 text-white hover:bg-charcoal-700 rounded-md transition-colors">
                      <FiShoppingCart /> Add to Cart
                    </button>
                    <button className="p-2 bg-beige-100 text-charcoal-800 hover:bg-beige-200 rounded-md transition-colors">
                      <FiHeart />
                    </button>
                  </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-charcoal-700 mb-2">
                No products found
              </h3>
              <p className="text-charcoal-500">
                Try adjusting your filters to find what you are looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
