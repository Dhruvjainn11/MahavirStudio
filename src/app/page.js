"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import FeaturedProducts from "@/app/components/FeaturedProducts";
import Link from "next/link";
import HouseModel from "./components/HouseModel";
import TrustedBrands from "./components/TrustedBrands";
import FadeInWhenVisible from "./components/FadeInWhenVisible";

export default function Home() {

   const router = useRouter();

  const goToStudio = (mode) => {
    router.push(`/paint-studio?mode=${mode}`);
  };

  return (
   <>

      {/* Hero Section */}
        <FadeInWhenVisible>
      <section className="relative h-screen snap-start flex items-center justify-center bg-beige-50">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 mix-blend-multiply" />
        
        {/* Content Container */}
      
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10  sm:pt-30 md:p-0  h-max"> 
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} 
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
        {/* <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <div className="h-8 w-5 border-2 border-charcoal-800 rounded-full flex justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-charcoal-800 mt-1 rounded-full"
            />
          </div>
        </motion.div> */}
      </section>
       </FadeInWhenVisible>

    
      {/* Featured Categories Preview */}
<FadeInWhenVisible>
  <section className="py-24 bg-beige-100 snap-start">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="font-serif text-3xl md:text-4xl text-charcoal-800 text-center mb-16">
        Our Signature Collections
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative h-64 sm:h-72 md:h-80 lg:h-96"
            >
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                className="brightness-75 group-hover:brightness-90 transition-all duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-beige-50 mb-2 group-hover:underline underline-offset-4">
                    {item.title}
                  </h3>
                  <p className="text-beige-100 text-sm sm:text-base max-w-md">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gold-500 text-sm font-medium mt-4">
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


      {/* Shop by Category */}
      <FadeInWhenVisible>
  <section className="py-24 bg-beige-50 snap-start">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-serif text-charcoal-800 text-center mb-12">
        Shop by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            whileHover={{ scale: 1.03 }}
            className="block bg-white rounded-2xl shadow hover:shadow-md overflow-hidden transition-all"
          >
            <div className="relative h-60 sm:h-72 md:h-80 w-full">
              <Image
                src={cat.image}
                alt={cat.title}
                layout="fill"
                objectFit="cover"
                className="transition-opacity"
              />
            </div>
            <div className="py-4 text-center bg-beige-100">
              <h3 className="text-lg sm:text-xl font-serif text-charcoal-800">
                {cat.title}
              </h3>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
</FadeInWhenVisible>




      {/* Explore Paints & Hardware Side-by-Side */}
   <section className="py-16 sm:py-20 lg:py-24 bg-beige-100 snap-start">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center text-charcoal-800 mb-10 sm:mb-12 md:mb-16">
      Try Our Interactive Paint Studio
    </h2>

    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-beige-200 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-10"
    >
      {/* 3D Model or House Image Preview */}
      <div className="w-full lg:w-1/2 max-w-md sm:max-w-none">
        <Image
          src="/models/Home.jpg"
          alt="House Model Preview"
          width={380}
          height={200}  
          className="rounded-2xl shadow-md mx-auto"
          />
      </div>

      {/* Text & Buttons */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif mb-4 text-charcoal-800">
          Visualize Your Dream Home
        </h3>
        <p className="text-charcoal-600 mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
          Experiment with curated palettes, switch between interior and exterior views,
          and preview how colors will look in real environments — all in one immersive tool.
        </p>
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
          <button
            onClick={() => goToStudio("interior")}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-md bg-charcoal-800 text-white font-medium hover:bg-charcoal-700 transition"
          >
            Interior Mode
          </button>
          <button
            onClick={() => goToStudio("exterior")}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-md border border-charcoal-800 text-charcoal-800 hover:bg-beige-300 transition"
          >
            Exterior Mode
          </button>
        </div>
      </div>
    </motion.div>
  </div>
</section>



      {/* Featured Products */}
      <FadeInWhenVisible>
      <section className=" bg-beige-100 h-screen snap-start" >

      <FeaturedProducts />
      </section>
      </FadeInWhenVisible>

      {/* Trusted brands  */}
   
<section className=" bg-beige-100 snap-start" >
      <TrustedBrands />
      </section>
      

        


    </>
  );
}