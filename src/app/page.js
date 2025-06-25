"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import FeaturedProducts from "./components/FeaturedProducts";
import Link from "next/link";
import HouseModel from "./components/HouseModel";

export default function Home() {

   const router = useRouter();

  const goToStudio = (mode) => {
    router.push(`/paint-studio?mode=${mode}`);
  };

  return (
    <main className="min-h-screen bg-beige-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 mix-blend-multiply" />
        
        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Tagline */}
            <p className="font-serif text-gold-500 tracking-widest mb-4">
              ELEVATE YOUR SPACE
            </p>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-serif font-light text-charcoal-800 leading-tight mb-8">
              Crafting Timeless <br />
              <span className="font-medium">Interiors</span>
            </h1>
            
            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-lg text-charcoal-600 mb-12">
              Premium hardware, curated paints, and designer bundles to transform your home into a masterpiece.
            </p>
            
            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-charcoal-800 hover:bg-gold-500 text-beige-100 px-8 py-4 rounded-none font-medium flex items-center gap-2 mx-auto transition-colors duration-300"
            >
              Explore Collections
              <FiArrowRight className="mt-0.5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Scrolling Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <div className="h-8 w-5 border-2 border-charcoal-800 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-charcoal-800 mt-1 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Categories Preview */}
      <section className="py-24 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-charcoal-800 text-center mb-16">
            Our Signature Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
  {
      title: "Artisan Hardware",
      description: "Handcrafted fixtures for distinctive spaces.",
      bg: "bg-beige-200",
      href: "/products?category=hardware",
    },
    {
      title: "Curated Paints",
      description: "Premium finishes in designer palettes.",
      bg: "bg-beige-300",
      href: "/paints",
    },
    {
      title: "Room Bundles",
      description: "Complete looks for every aesthetic.",
      bg: "bg-beige-400",
      href: "/bundles",
    },
].map((item, index) => (
   <Link
              key={index}
              href={item.href}
              className="group"
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`${item.bg} h-60 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <h3 className="text-2xl font-serif mb-3 group-hover:underline underline-offset-4">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 font-medium text-sm group-hover:text-gold-500   transition-colors">
                  Discover
                  <FiArrowRight size={16} />
                </div>
              </motion.div>
            </Link>
))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-24 bg-beige-50">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <h2 className="text-3xl font-serif text-charcoal-800 text-center mb-12">
      Shop by Category
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {[
        {
          title: "Door Handles",
          description: "Minimalist or ornate — find your perfect grip.",
          color: "bg-beige-200",
          href: "/products?category=door-handles"
        },
        
        {
          title: "Bathroom Accessories",
          description: "Modern utilities that elevate function and form.",
          color: "bg-beige-100",
          href: "/products?category=bathroom-accessories"
        },
        {
          title: "Lighting",
          description: "Wall, ceiling & accent lights to match your style.",
          color: "bg-beige-300",
          href: "/products?category=lighting"
        },
        {
          title: "Curtain Hardware",
          description: "Functional drapery that looks as good as it works.",
          color: "bg-gold-50",
          href: "/products?category=curtain-hardware"
        },
        {
          title: "Room Bundles",
          description: "One-click kits curated by designers.",
          color: "bg-beige-150",
          href: "/bundles"
        },
      ].map((cat, index) => (
        <motion.a
          key={index}
          href={cat.href}
          whileHover={{ y: -6 }}
          className={`p-6 rounded-xl shadow hover:shadow-md transition ${cat.color} block`}
        >
          <h3 className="text-xl font-serif text-charcoal-800 mb-2">
            {cat.title}
          </h3>
          <p className="text-sm text-charcoal-600">{cat.description}</p>
          <span className="text-gold-500 underline text-sm mt-4 inline-block">
            Explore
          </span>
        </motion.a>
      ))}
    </div>
  </div>
</section>


      {/* Explore Paints & Hardware Side-by-Side */}
     <section className="py-24 bg-beige-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl font-serif text-center text-charcoal-800 mb-16">
          Try Our Interactive Paint Studio
        </h2>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-beige-200 rounded-xl shadow-lg p-8 flex flex-col lg:flex-row items-center gap-10"
        >
          {/* 3D Model or House Image Preview */}
          <div className="w-full lg:w-1/2">
           <HouseModel  />
          </div>

          {/* Action Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-serif mb-4 text-charcoal-800">
              Visualize Your Dream Home
            </h3>
            <p className="text-charcoal-600 mb-6 text-base leading-relaxed">
              Experiment with curated palettes, switch between interior and exterior views, and preview how colors will look in real environments — all in one immersive tool.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button
                onClick={() => goToStudio("interior")}
                className="px-6 py-3 rounded-md bg-charcoal-800 text-white font-medium hover:bg-charcoal-700 transition"
              >
                Interior Mode
              </button>
              <button
                onClick={() => goToStudio("exterior")}
                className="px-6 py-3 rounded-md border border-charcoal-800 text-charcoal-800 hover:bg-beige-200 transition"
              >
                Exterior Mode
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

      {/* Featured Products */}
      <FeaturedProducts />


    </main>
  );
}