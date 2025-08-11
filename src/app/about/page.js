"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiAward, FiUsers, FiTrendingUp, FiHeart, FiCheck, FiStar } from "react-icons/fi";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutPage() {
  const stats = [
    { number: "15+", label: "Years of Experience", icon: <FiStar size={24} /> },
    { number: "500+", label: "Successful Projects", icon: <FiCheck size={24} /> },
    { number: "10+", label: "Industry Awards", icon: <FiAward size={24} /> },
    { number: "100+", label: "Partner Brands", icon: <FiUsers size={24} /> },
  ];

  const values = [
    {
      title: "Uncompromising Quality",
      description: "We believe in the longevity of our work. Every product and solution is meticulously crafted to meet the highest standards.",
      icon: <FiAward size={32} className="text-gold-600" />,
    },
    {
      title: "Customer-Centric Vision",
      description: "Our mission is to translate your vision into a tangible reality, with a focus on your unique style and requirements.",
      icon: <FiHeart size={32} className="text-red-600" />,
    },
    {
      title: "Innovative Design",
      description: "We are constantly exploring new materials, techniques, and design trends to offer you a fresh, contemporary aesthetic.",
      icon: <FiTrendingUp size={32} className="text-blue-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="relative bg-charcoal-900 text-white pt-24 pb-32 mt-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/70 z-0" />
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero-bg.png"
            alt="Mahavir Studio Background"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-serif leading-tight mb-4"
          >
            The Art of Interior Transformation
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl max-w-3xl mx-auto text-beige-100 font-light"
          >
            At Mahavir Studio, we don`t just sell products; we provide the foundation for spaces that inspire. Our passion for quality hardware and design has been our guiding principle for over a decade.
          </motion.p>
        </div>
      </motion.section>

      {/* Our Mission */}
      <section className="py-24 bg-beige-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/about-us.png"
                alt="Our Mission"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="absolute inset-0 bg-gold-500/20 rounded-2xl" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif text-charcoal-800 mb-6">Our Legacy of Craftsmanship</h2>
            <div className="space-y-6 text-charcoal-700 leading-relaxed text-lg">
              <p>
                Founded on the belief that every detail matters, our journey began over a decade ago. We set out to bridge the gap between quality materials and exceptional design, partnering with leading brands like <strong>Asian Paints, Jaquar, and Cera.</strong>
              </p>
              <p>
                From humble beginnings as a small hardware store, Mahavir Studio has grown into a trusted name for architects, designers, and homeowners seeking premium solutions. Our story is not just about our past; it`s about the future spaces we will help you create.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-serif text-charcoal-800 mb-4"
          >
            Our Guiding Principles
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-lg text-charcoal-600 max-w-2xl mx-auto mb-16"
          >
            These core values define our work ethic and our promise to you.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="text-center p-8 border rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-beige-100 rounded-full mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-charcoal-800 mb-3">{value.title}</h3>
                <p className="text-charcoal-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section
      <section className="py-24 bg-charcoal-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-charcoal-800 rounded-full mb-4 group-hover:bg-gold-500 transition-colors">
                  <div className="text-gold-500 group-hover:text-white transition-colors">{stat.icon}</div>
                </div>
                <h3 className="text-4xl font-bold mb-1">{stat.number}</h3>
                <p className="text-beige-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="py-24 bg-beige-50 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-serif text-charcoal-800 mb-6"
          >
            Let`s Build Something Beautiful
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-xl text-charcoal-600 mb-8 max-w-2xl mx-auto"
          >
            Ready to bring your vision to life? Explore our collections or get in touch for a personal consultation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/products" className="px-8 py-4 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-medium">
              Explore Products
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-charcoal-800 text-charcoal-800 rounded-lg hover:bg-charcoal-800 hover:text-white transition-colors font-medium">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}