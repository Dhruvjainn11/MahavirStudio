"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowRight, FiShield, FiTruck, FiAward, FiUsers, FiStar, FiPackage, FiHome, FiDroplet, FiTool } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import FeaturedProducts from "@/app/components/FeaturedProducts";
import Link from "next/link";
import HouseModel from "./components/HouseModel";
import TrustedBrands from "./components/TrustedBrands";
import FadeInWhenVisible from "./components/FadeInWhenVisible";
import { useState, useEffect } from "react";

import RecentlyViewed from "./components/RecentlyViewed";

export default function Home() {

   const router = useRouter();

  const goToStudio = (mode) => {
    router.push(`/paint-studio?mode=${mode}`);
  };

  return (
   <>

{/* Hero Section */}
<FadeInWhenVisible>
<section className="relative min-h-screen snap-start flex items-center justify-center bg-beige-50">
  {/* Background Texture */}
  <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 mix-blend-multiply" />

  {/* Content Container */}
  <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 sm:pt-30 md:p-0 h-max">
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      {/* Tagline */}
      <p className="font-serif text-gold-500 tracking-widest mb-4">
        DISCOVER YOUR STYLE
      </p>

      {/* Main Heading */}
      <h1 className="text-5xl md:text-7xl font-serif font-light text-charcoal-800 leading-tight mb-8">
        Designing Delightful <br />
        <span className="font-medium">Spaces</span>
      </h1>

      {/* Subheading */}
      <p className="max-w-2xl mx-auto text-lg text-charcoal-600 mb-12">
        Explore premium hardware, bespoke paints, and exclusive bundles
        tailored to reflect your unique taste.
      </p>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/products')}
        className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 mx-auto transition-colors duration-300"
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
</FadeInWhenVisible>

    
{/* Featured Categories Preview */}
<FadeInWhenVisible>
<section className="py-24 bg-beige-100 snap-start">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="font-serif text-4xl md:text-5xl text-charcoal-800 text-center mb-16">
      Explore Our Collections
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          title: "Artisan Hardware",
          description: "Handcrafted fixtures for distinctive spaces.",
          image: "/assets/categories/hardware.jpg",
          href: "/products?category=hardware",
        },
        {
          title: "Curated Paints",
          description: "Premium finishes in designer palettes.",
          image: "/assets/categories/paints.jpg",
          href: "/paints",
        },
        {
          title: "Room Bundles",
          description: "Complete looks for every aesthetic.",
          image: "/assets/categories/bundles.jpg",
          href: "/bundles",
        },
      ].map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-72 sm:h-80 md:h-96"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover brightness-75 group-hover:brightness-100 transition-all duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black px-6 py-8 flex flex-col justify-end">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white mb-2">
                {item.title}
              </h3>
              <p className="text-beige-100 text-base lg:text-lg">
                {item.description}
              </p>
              <div className="flex items-center gap-2 text-gold-200 text-sm font-medium mt-4">
                Discover
                <FiArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  </div>
</section>
</FadeInWhenVisible>

{/* Featured Products Slider */}
<FadeInWhenVisible>
  <section className="py-24 bg-white snap-start">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="font-serif text-4xl md:text-5xl text-charcoal-800 text-center mb-12">
        Featured Products
      </h2>

      <FeaturedProducts />
    </div>
  </section>
</FadeInWhenVisible>
    
  {/* Recently Viewed */}
  cRecentlyViewed /e

{/* New Arrivals */}
<FadeInWhenVisible>
<section className="py-24 bg-beige-50 snap-start">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="font-serif text-4xl md:text-5xl text-charcoal-800 text-center mb-16">
      New Arrivals
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          title: "Door Handles",
          image: "/door-handles.png",
          href: "/products?category=door-handles",
        },
        {
          title: "Bathroom Accessories",
          image: "/bathroom.jpeg",
          href: "/products?category=bathroom-accessories",
        },
        {
          title: "Curtain Hardware",
          image: "/curtains.jpeg",
          href: "/products?category=curtain-hardware",
        },
      ].map((cat, index) => (
        <motion.a
          key={index}
          href={cat.href}
          whileHover={{ scale: 1.05 }}
          className="block bg-white rounded-lg shadow-lg hover:shadow-2xl overflow-hidden transition-all"
        >
          <div className="relative h-64 sm:h-72 md:h-80 w-full">
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover transition-opacity duration-300"
            />
          </div>
          <div className="py-6 text-center bg-beige-100">
            <h3 className="text-xl sm:text-2xl font-serif text-charcoal-800">
              {cat.title}
            </h3>
          </div>
        </motion.a>
      ))}
    </div>
  </div>
</section>
</FadeInWhenVisible>




{/* Explore Paint Studio and Hardware */}
<section className="py-24 bg-white snap-start">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-beige-100 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center text-center"
        >
          <FiDroplet size={48} className="text-gold-500 mb-4" />
          <h3 className="text-2xl font-serif text-charcoal-800 mb-4">
            Interactive Paint Studio
          </h3>
          <p className="text-charcoal-600 mb-6">
            Experience our palette customization and see how our colors can bring your spaces to life.
          </p>
          <button
            onClick={() => goToStudio("interior")}
            className="px-5 py-3 rounded-md bg-charcoal-800 text-white font-medium hover:bg-charcoal-700 transition"
          >
            Visit Paint Studio
          </button>
        </motion.div>
      </div>
      <div className="flex justify-center">
        <Image
          src="/models/Home.jpg"
          alt="Paint Studio Preview"
          width={480}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  </div>
</section>



      
     

{/* Why Choose Us */}
<section className="py-24 bg-beige-100 snap-start">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="font-serif text-4xl md:text-5xl text-charcoal-800 mb-16">
      Why Choose Us
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="flex flex-col items-center justify-center bg-white py-8 px-6 rounded-lg shadow-lg">
        <FiShield size={48} className="text-gold-500 mb-4" />
        <h3 className="text-xl font-serif text-charcoal-800 mb-2">Quality Assurance</h3>
        <p className="text-charcoal-600">
          Every product is meticulously tested for perfect performance.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center bg-white py-8 px-6 rounded-lg shadow-lg">
        <FiTruck size={48} className="text-gold-500 mb-4" />
        <h3 className="text-xl font-serif text-charcoal-800 mb-2">Fast Delivery</h3>
        <p className="text-charcoal-600">
          Get your products delivered quickly and safely to your doorstep.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center bg-white py-8 px-6 rounded-lg shadow-lg">
        <FiAward size={48} className="text-gold-500 mb-4" />
        <h3 className="text-xl font-serif text-charcoal-800 mb-2">Award-Winning Design</h3>
        <p className="text-charcoal-600">
          Recognized globally for our innovative and stylish designs.
        </p>
      </div>
    </div>
  </div>
</section>

{/* Customer Testimonials */}
<section className="py-24 bg-white snap-start">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="font-serif text-4xl md:text-5xl text-charcoal-800 mb-16">
      Customer Testimonials
    </h2>
    <div className="relative bg-beige-50 py-16 px-8 rounded-lg shadow-lg">
      <FaQuoteLeft size={32} className="text-gold-500 mb-4 absolute left-8 top-8" />
      <p className="text-charcoal-600 text-lg leading-relaxed mb-4">
        &quot;Absolutely transformed my living space with minimal effort. The products
        are top-notch and the service unparalleled!&quot;
      </p>
      <p className="text-gold-500 font-medium">- Happy Customer</p>
    </div>
  </div>
</section>

 {/* Trusted brands  */}
<section className="py-24 bg-beige-100 snap-start">
  <TrustedBrands />
</section>

{/* Final Call to Action */}
<section className="py-24 bg-charcoal-800 snap-start">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="font-serif text-4xl md:text-5xl text-white mb-8">
      Ready to Transform Your Space?
    </h2>
    <p className="text-beige-200 text-lg mb-12">
      Discover our complete range of premium hardware, paints, and bundles.
      Start your design journey today.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/products')}
        className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-colors duration-300"
      >
        <FiHome className="text-xl" />
        Shop Products
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/bundles')}
        className="bg-transparent border-2 border-gold-500 hover:bg-gold-500 text-gold-500 hover:text-white px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-colors duration-300"
      >
        <FiPackage className="text-xl" />
        View Bundles
      </motion.button>
    </div>
  </div>
</section>

    </>
  );
}
