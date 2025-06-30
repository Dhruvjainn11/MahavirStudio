"use client";
import Image from "next/image";
import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const products = [
  { name: "Brushed Brass Handle", price: "₹1,299", image: "/hardware1.jpg" },
  { name: "Matte Black Knob", price: "₹799", image: "/hardware2.jpg" },
  { name: "Antique Copper Handle", price: "₹1,499", image: "/hardware3.jpg" },
  { name: "Polished Chrome Lever", price: "₹1,199", image: "/hardware4.png" },
  { name: "Satin Nickel Knob", price: "₹899", image: "/hardware5.png" },
];

export default function FeaturedProducts() {
  const containerRef = useRef(null);

  const scroll = (direction= "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth / 1.3;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-beige-50 overflow-hidden snap-start h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-charcoal-800 text-center mb-10 sm:mb-12">
          Featured Products
        </h2>

        {/* Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-[45%] z-10 bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-50 block sm:left-0"
        >
          <FiChevronLeft size={20} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-[45%] z-10 bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-50 block sm:right-0"
        >
          <FiChevronRight size={20} />
        </button>

        {/* Carousel */}
        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scroll-smooth scrollbar-hide px-1"
        >
          {products.map((item, index) => (
            <div
              key={index}
              className="min-w-[270px] sm:min-w-[300px] md:min-w-[380px] bg-white border border-beige-200 p-4 rounded-xl shadow-sm flex-shrink-0 flex flex-col items-center text-center hover:shadow-md transition"
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
    </section>
  );
}
