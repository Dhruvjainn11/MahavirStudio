"use client";

import Link from "next/link";
import { Suspense, useRef } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Paint Studio", href: "/paint-studio" },
    { name: "Bundles", href: "/bundles" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full fixed top-0 z-50 bg-beige-50 backdrop-blur-sm border-b border-beige-200">
      <nav className="px-4 lg:px-8 py-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="flex items-center"
          >
            <Link href="/" className="text-2xl font-medium text-charcoal-800 tracking-wider">
              MAHAVIR STUDIO
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <motion.div whileHover={{ y: -2 }}>
                     <Suspense fallback={<div>Loading...</div>}>
                    <Link href={link.href} className="nav-link">
                      {link.name}
                    </Link>
                     </Suspense>
                  </motion.div>
                </li>
              ))}
            </ul>

            {/* Icons */}
            <div className="flex items-center gap-5 ml-4">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="icon-button"
              >
                <FiSearch size={18} />
              </motion.button>
              
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/wishlist" className="icon-button">
                  <FiHeart size={18} />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/cart" className="icon-button">
                  <FiShoppingCart size={18} />
                </Link>
              </motion.div>
              
              <motion.a 
                whileHover={{ scale: 1.1 }}
                href="https://wa.me/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-button"
              >
                <FaWhatsapp size={16} />
              </motion.a>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center gap-4">
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-charcoal-600"
            >
              <FiSearch size={18} />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-charcoal-600 focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3"
          >
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 text-sm border border-beige-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </motion.div>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-beige-100/95 backdrop-blur-sm overflow-hidden"
        >
          <ul className="px-4 py-3 flex flex-col gap-3">
            {navLinks.map((link) => (
              <motion.li 
                key={link.name}
                whileHover={{ x: 5 }}
              >
                <Link 
                  href={link.href} 
                  className="block py-2 text-charcoal-700 hover:text-gold-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.li>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <Link 
                href="/wishlist" 
                className="icon-button" 
                onClick={() => setIsMenuOpen(false)}
              >
                <FiHeart size={18} />
              </Link>
              <Link 
                href="/cart" 
                className="icon-button" 
                onClick={() => setIsMenuOpen(false)}
              >
                <FiShoppingCart size={18} />
              </Link>
              <a 
                href="https://wa.me/yournumber" 
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-button"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </ul>
        </motion.div>
      )}
    </header>
  );
}