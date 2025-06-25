"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-beige-100 border-t border-beige-300 "
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="font-serif text-xl text-charcoal-800 hover:text-gold-500 transition-colors">
              MAHAVIR STUDIO
            </Link>
            <p className="text-charcoal-600 text-sm leading-relaxed">
              Premium hardware, paints, and designer bundles for timeless interiors.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                { icon: <FiInstagram size={18} />, label: "Instagram", href: "#" },
                { icon: <FiFacebook size={18} />, label: "Facebook", href: "#" },
                { icon: <FiTwitter size={18} />, label: "Twitter", href: "#" },
                { icon: <FiLinkedin size={18} />, label: "LinkedIn", href: "#" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  aria-label={social.label}
                  className="text-charcoal-500 hover:text-gold-500 transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-charcoal-800 mb-4">Explore</h4>
            <ul className="space-y-3">
              {['Home', 'Products', 'Rooms', 'Bundles'].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <Link 
                    href={`/${item.toLowerCase()}`} 
                    className="text-sm text-charcoal-600 hover:text-gold-500 transition-colors"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium text-charcoal-800 mb-4">Support</h4>
            <ul className="space-y-3">
              {['About', 'Contact', 'FAQ', 'Shipping'].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <Link 
                    href={`/${item.toLowerCase()}`} 
                    className="text-sm text-charcoal-600 hover:text-gold-500 transition-colors"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-charcoal-800 mb-4">Contact</h4>
            <address className="not-italic text-sm text-charcoal-600 space-y-3">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 flex-shrink-0" />
                <span>123 Design Street, Ahmedabad, Gujarat 380001</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone />
                <Link href="tel:+919876543210" className="hover:text-gold-500 transition-colors">
                  +91 98765 43210
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <FiMail />
                <Link href="mailto:hello@mahavirstudio.com" className="hover:text-gold-500 transition-colors">
                  hello@mahavirstudio.com
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <FaWhatsapp className="text-green-600" />
                <Link 
                  href="https://wa.me/919876543210" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-500 transition-colors"
                >
                  Chat on WhatsApp
                </Link>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-beige-300 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-charcoal-500">
            &copy; {currentYear} Mahavir Studio. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-charcoal-500 hover:text-gold-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-charcoal-500 hover:text-gold-500 transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-xs text-charcoal-500 mt-4 md:mt-0">
            Crafted with <span className="text-red-500">❤</span> in Ahmedabad
          </p>
        </div>
      </div>
    </motion.footer>
  );
}