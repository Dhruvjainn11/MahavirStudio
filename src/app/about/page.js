"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiAward, FiUsers, FiTrendingUp, FiHeart, FiCheck, FiStar } from "react-icons/fi";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

export default function AboutPage() {
  const stats = [
    { number: "500+", label: "Happy Customers", icon: <FiHeart size={24} /> },
    { number: "1000+", label: "Projects Completed", icon: <FiTrendingUp size={24} /> },
    { number: "50+", label: "Premium Brands", icon: <FiAward size={24} /> },
    { number: "15+", label: "Years Experience", icon: <FiStar size={24} /> }
  ];

  const values = [
    {
      title: "Quality First",
      description: "We source only the finest materials and work with trusted manufacturers to ensure every product meets our high standards.",
      icon: <FiAward className="text-gold-600" size={32} />
    },
    {
      title: "Customer-Centric",
      description: "Your vision is our mission. We listen, understand, and deliver solutions that exceed expectations.",
      icon: <FiUsers className="text-blue-600" size={32} />
    },
    {
      title: "Innovation",
      description: "We stay ahead of design trends and embrace new technologies to bring you cutting-edge solutions.",
      icon: <FiTrendingUp className="text-green-600" size={32} />
    },
    {
      title: "Sustainability",
      description: "We're committed to eco-friendly practices and sustainable products that protect our planet.",
      icon: <FiHeart className="text-red-600" size={32} />
    }
  ];

  const team = [
    {
      name: "Rajesh Mahavir",
      role: "Founder & CEO",
      bio: "With 20+ years in interior design, Rajesh founded Mahavir Studio with a vision to make beautiful spaces accessible to everyone.",
      image: "/team/rajesh.jpg", // Placeholder
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Priya Sharma",
      role: "Head of Design",
      bio: "Priya brings creativity and innovation to every project, ensuring our products reflect the latest design trends.",
      image: "/team/priya.jpg", // Placeholder
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Amit Kumar",
      role: "Customer Success",
      bio: "Amit ensures every customer has an exceptional experience from consultation to installation.",
      image: "/team/amit.jpg", // Placeholder
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-charcoal-800 to-charcoal-700 text-white py-20 mt-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-serif mb-6"
              >
                Crafting Dreams Into Reality
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-beige-100 mb-8 leading-relaxed"
              >
                Since 2008, Mahavir Studio has been transforming spaces with premium hardware, curated paints, and designer solutions. We believe every space tells a story, and we're here to help you tell yours.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
              >
                <button className="px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-medium">
                  Our Story
                </button>
                <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-charcoal-800 transition-colors font-medium">
                  Meet the Team
                </button>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent z-10" />
                {/* Placeholder for hero image */}
                <div className="w-full h-full bg-beige-200 flex items-center justify-center">
                  <p className="text-charcoal-600 font-medium">Showroom Image</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-beige-100 rounded-full mb-4 group-hover:bg-gold-100 transition-colors">
                  <div className="text-charcoal-700 group-hover:text-gold-600 transition-colors">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-charcoal-800 mb-2">{stat.number}</h3>
                <p className="text-charcoal-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-3xl font-serif text-charcoal-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-charcoal-600 leading-relaxed">
                <p>
                  Founded in 2008 by Rajesh Mahavir, our journey began with a simple belief: beautiful spaces should be accessible to everyone. What started as a small hardware shop has evolved into a premier destination for premium interior solutions.
                </p>
                <p>
                  Over the years, we've partnered with renowned brands like Asian Paints, Cera, and Jaquar to bring you the finest selection of hardware, paints, and accessories. Our commitment to quality and customer satisfaction has made us a trusted name in the industry.
                </p>
                <p>
                  Today, we're proud to have transformed over 1000 spaces and built lasting relationships with our customers. Our story continues with every project we complete and every dream we help bring to life.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="h-48 bg-beige-200 rounded-xl flex items-center justify-center">
                  <p className="text-charcoal-600 text-sm">Journey Image 1</p>
                </div>
                <div className="h-32 bg-gold-100 rounded-xl flex items-center justify-center">
                  <p className="text-charcoal-600 text-sm">Journey Image 2</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 bg-beige-100 rounded-xl flex items-center justify-center">
                  <p className="text-charcoal-600 text-sm">Journey Image 3</p>
                </div>
                <div className="h-48 bg-beige-200 rounded-xl flex items-center justify-center">
                  <p className="text-charcoal-600 text-sm">Journey Image 4</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-serif text-charcoal-800 mb-6">Our Values</h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              These core principles guide everything we do and define who we are as a company.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-beige-100 rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-charcoal-800 mb-3">{value.title}</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-serif text-charcoal-800 mb-6">Meet Our Team</h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              The passionate people behind Mahavir Studio who make your design dreams come true.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-beige-200 hover:shadow-lg transition-shadow text-center group"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full bg-beige-200 rounded-full flex items-center justify-center">
                    <FiUsers className="text-charcoal-400" size={32} />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-charcoal-800 mb-1">{member.name}</h3>
                <p className="text-gold-600 font-medium mb-3">{member.role}</p>
                <p className="text-charcoal-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                
                <div className="flex justify-center gap-3">
                  <a href={member.social.linkedin} className="p-2 text-charcoal-400 hover:text-blue-600 transition-colors">
                    <FaLinkedin size={18} />
                  </a>
                  <a href={member.social.twitter} className="p-2 text-charcoal-400 hover:text-blue-400 transition-colors">
                    <FaTwitter size={18} />
                  </a>
                  <a href={member.social.instagram} className="p-2 text-charcoal-400 hover:text-pink-600 transition-colors">
                    <FaInstagram size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="py-16 bg-gradient-to-r from-gold-500 to-gold-600 text-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-serif mb-6">Ready to Transform Your Space?</h2>
          <p className="text-xl text-gold-100 mb-8">
            Join hundreds of satisfied customers who've trusted us with their dream projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gold-600 rounded-lg hover:bg-beige-100 transition-colors font-medium">
              Start Your Project
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gold-600 transition-colors font-medium">
              Schedule Consultation
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
