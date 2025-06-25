"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiFilter } from "react-icons/fi";
import { useState } from "react";

const products = [
  {
    name: "Brushed Brass Handle",
    price: "₹1,299",
    category: "hardware",
    finish: "Matte",
    image: "/hardware1.jpg",
  },
  {
    name: "Matte Black Knob",
    price: "₹799",
    category: "hardware",
    finish: "Glossy",
    image: "/hardware2.jpg",
  },
  {
    name: "Royal Blue Paint",
    price: "₹999",
    category: "paint",
    finish: "Matte",
    image: "/paint1.jpg",
  },
  {
    name: "Warm Grey Paint",
    price: "₹1,099",
    category: "paint",
    finish: "Metallic",
    image: "/paint2.jpg",
  },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedFinish, setSelectedFinish] = useState("All");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = products.filter((p) => {
    const matchCategory = categoryParam ? p.category === categoryParam : true;
    const matchFinish = selectedFinish === "All" ? true : p.finish === selectedFinish;
    return matchCategory && matchFinish;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-12 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-charcoal-800">
          {categoryParam
            ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Products`
            : "All Products"}
        </h1>
        <button 
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-beige-100 rounded-lg"
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Mobile Filters */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
            <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Filters</h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="mb-6">
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

              <div>
                <p className="text-charcoal-700 font-medium mb-3">Price (Coming Soon)</p>
                <input 
                  type="range" 
                  min={500} 
                  max={2000} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  disabled 
                />
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <aside className="w-64 hidden md:block">
          <div className="bg-white border border-beige-200 p-6 rounded-lg shadow-sm sticky top-24">
            <h3 className="font-serif text-xl mb-6 text-charcoal-800">Filters</h3>

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

            <div>
              <p className="text-charcoal-700 font-medium mb-3">Price (Coming Soon)</p>
              <input 
                type="range" 
                min={500} 
                max={2000} 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                disabled 
              />
              <div className="flex justify-between text-sm text-charcoal-500 mt-2">
                <span>₹500</span>
                <span>₹2000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
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
                  <div className="relative h-60 w-full mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-charcoal-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-charcoal-500 mb-2">{item.finish} Finish</p>
                    <p className="text-gold-600 font-medium text-lg mb-4">{item.price}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-grow flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-charcoal-800 text-white hover:bg-charcoal-700 rounded-md transition-colors">
                      <FiShoppingCart /> Add to Cart
                    </button>
                    <button className="p-2 bg-beige-100 text-charcoal-800 hover:bg-beige-200 rounded-md transition-colors">
                      <FiHeart />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-charcoal-700 mb-2">No products found</h3>
              <p className="text-charcoal-500">Try adjusting your filters to find what you are looking for.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}