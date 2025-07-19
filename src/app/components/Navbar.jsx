"use client";

import Link from "next/link";
import { Suspense, useRef } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiSearch, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";

export default function Navbar({ onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { cartItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const firstName = user?.name?.split(' ')[0] || 'User';

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Paints", href: "/paints" },
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
              
              
              <motion.div whileHover={{ y: -2 }} >
                <Link href="/wishlist" className=" text-charcoal-600 hover:text-gold-500 transition-colors duration-200 p-2 rounded-lg hover:bg-beige-100; ">
                  <FiHeart size={18} />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/cart" className="relative text-charcoal-700 hover:text-charcoal-900">
            <FiShoppingCart size={22} />
            { cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
              </motion.div>
              
              {/* User Profile / Login */}
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-charcoal-700 hover:text-gold-500 hover:bg-beige-100 transition-colors duration-200"
                  >
                    <FiUser size={18} />
                    <span className="text-sm font-medium">{firstName}</span>
                  </motion.button>
                  
                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-beige-200 rounded-lg shadow-lg z-50"
                    >
                      <div className="p-3 border-b border-beige-200">
                        <p className="text-sm font-medium text-charcoal-800">{user.name}</p>
                        <p className="text-xs text-charcoal-500">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="block px-3 py-2 text-sm text-charcoal-700 hover:bg-beige-50 hover:text-gold-600"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/profile/orders"
                          className="block px-3 py-2 text-sm text-charcoal-700 hover:bg-beige-50 hover:text-gold-600"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Order History
                        </Link>
                        <Link
                          href="/profile/addresses"
                          className="block px-3 py-2 text-sm text-charcoal-700 hover:bg-beige-50 hover:text-gold-600"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Addresses
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <FiLogOut size={14} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.button
                  whileHover={{ y: -2 }}
                  onClick={onLoginClick}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors duration-200 text-sm font-medium"
                >
                  <FiUser size={16} />
                  Login
                </motion.button>
              )}
              
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
          <Link href="/cart" className="relative text-charcoal-700 hover:text-charcoal-900">
            <FiShoppingCart size={22} />
            { cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
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

  {isAuthenticated ? (
    <Link
      href="/profile"
      onClick={() => setIsMenuOpen(false)}
      className="icon-button"
      title="Profile"
    >
      <FiUser size={18} />
    </Link>
  ) : (
    <button
      onClick={() => {
        setIsMenuOpen(false);
        onLoginClick();
      }}
      className="icon-button"
      title="Login"
    >
      <FiUser size={18} />
    </button>
  )}

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