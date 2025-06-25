"use client";
import { motion } from "framer-motion";
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
    name: "Royal Blue Paint",
    price: "₹999",
    image: "/paint1.jpg",
  },
  {
    name: "Modern Grey Paint",
    price: "₹1,099",
    image: "/paint2.jpg",
  },
  {
    name: "Antique Copper Handle",
    price: "₹1,499",
    image: "/hardware3.jpg",
  },
  {
    name: "Pastel Pink Paint",
    price: "₹899",
    image: "/paint3.jpg",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-white overflow-hidden ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 ">
        <h2 className="text-3xl font-serif text-charcoal-800 text-center mb-12">
          Featured Products
        </h2>

        {/* Slider Wrapper */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
          >
            {[...products, ...products].map((item, index) => (
              <div
                key={index}
                className="w-64 min-w-[16rem] bg-beige-50 border border-beige-200 p-4 rounded-md shadow-sm"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="rounded-md object-cover h-40 w-full mb-3"
                />
                <h4 className="text-base font-semibold text-charcoal-800">
                  {item.name}
                </h4>
                <p className="text-gold-500 font-medium">{item.price}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
