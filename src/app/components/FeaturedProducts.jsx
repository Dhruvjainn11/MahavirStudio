"use client";
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const products = [
  {
    name: "Brushed Brass Handle",
    price: "₹1,299",
    image: "/hardware1.jpg",
  },
  {
    name: "Matte Black Knob",
    price: "₹799",
    image: "/hardware2.jpg",
  },
  {
    name: "Antique Copper Handle",
    price: "₹1,499",
    image: "/hardware3.jpg",
  },
  {
    name: "Polished Chrome Lever",
    price: "₹1,199",
    image: "/hardware4.png",
  },
  {
    name: "Satin Nickel Knob",
    price: "₹899",
    image: "/hardware5.png",
  },
];

export default function FeaturedProducts() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 3,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 640px)": {
        slides: { perView: 1.1, spacing: 10 },
      },
      "(min-width: 641px) and (max-width: 1024px)": {
        slides: { perView: 2, spacing: 12 },
      },
    },
    created(slider) {
      setInterval(() => {
        slider.next();
      }, 4000); // smoother timing
    },
  });

  return (
    <section className="py-24 bg-beige-50 overflow-hidden h-screen snap-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif text-charcoal-800 text-center mb-12">
          Featured Products
        </h2>

        <div ref={sliderRef} className="keen-slider">
          {products.map((item, index) => (
            <div
              key={index}
              className="keen-slider__slide bg-white border border-beige-200 p-4 rounded-xl shadow-sm flex flex-col items-center text-center transition hover:shadow-md"
            >
              <div className="w-full h-48 relative mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <h4 className="text-base font-semibold text-charcoal-800">
                {item.name}
              </h4>
              <p className="text-gold-500 font-medium">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
