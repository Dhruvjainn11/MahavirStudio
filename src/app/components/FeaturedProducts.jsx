"use client";
import Image from "next/image";
import React from "react";

// Product List
const products = [
  { name: "Brushed Brass Handle", price: "₹1,299", image: "/hardware1.jpg" },
  { name: "Matte Black Knob", price: "₹799", image: "/hardware2.jpg" },
  { name: "Antique Copper Handle", price: "₹1,499", image: "/hardware3.jpg" },
  { name: "Polished Chrome Lever", price: "₹1,199", image: "/hardware4.png" },
  { name: "Satin Nickel Knob", price: "₹899", image: "/hardware5.png" },
];

export default function FeaturedProducts() {
  const scrollingProducts = [...products, ...products]; // For seamless loop

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-beige-50 overflow-hidden snap-start h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-charcoal-800 text-center mb-10 sm:mb-12">
          Featured Products
        </h2>

        <div className="overflow-hidden relative w-full">
          <div className="flex gap-4 sm:gap-6 md:gap-8 animate-scroll whitespace-nowrap">
            {scrollingProducts.map((item, index) => (
              <div
                key={index}
                className="min-w-[260px] sm:min-w-[300px] md:min-w-[340px] bg-white border border-beige-200 p-4 rounded-xl shadow-sm flex-shrink-0 flex flex-col items-center text-center hover:shadow-md transition"
              >
                <div className="w-full h-40 sm:h-44 md:h-48 relative mb-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-charcoal-800">
                  {item.name}
                </h4>
                <p className="text-gold-500 font-medium text-sm sm:text-base">
                  {item.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
