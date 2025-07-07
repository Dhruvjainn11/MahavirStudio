"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiUser, FiMessageSquare } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { useToast } from "../components/Toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours."
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <FiPhone size={20} />,
      title: "Call Us",
      details: ["+91 9876543210", "+91 9876543211"],
      color: "text-blue-600"
    },
    {
      icon: <FiMail size={20} />,
      title: "Email Us",
      details: ["info@mahavirstudio.com", "sales@mahavirstudio.com"],
      color: "text-green-600"
    },
    {
      icon: <FiMapPin size={20} />,
      title: "Visit Us",
      details: ["123 Design Street", "Mumbai, Maharashtra 400001"],
      color: "text-red-600"
    },
    {
      icon: <FiClock size={20} />,
      title: "Business Hours",
      details: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sunday: 10:00 AM - 6:00 PM"],
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-charcoal-800 to-charcoal-700 text-white py-20 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-beige-100 max-w-2xl mx-auto">
            Ready to transform your space? We&apos;d love to hear from you. Reach out for quotes, consultations, or just to say hello.
          </p>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-serif text-charcoal-800 mb-6">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-charcoal-400" size={18} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-charcoal-400" size={18} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-charcoal-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3 text-charcoal-400" size={18} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-charcoal-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="quote">Request a Quote</option>
                    <option value="consultation">Design Consultation</option>
                    <option value="support">Customer Support</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-charcoal-700 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3 top-3 text-charcoal-400" size={18} />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full pl-11 pr-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium transition-all ${
                  isSubmitting 
                    ? 'bg-beige-300 text-charcoal-500 cursor-not-allowed'
                    : 'bg-gold-500 hover:bg-gold-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-charcoal-500 border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-serif text-charcoal-800 mb-6">
                Contact Information
              </h2>
              <p className="text-charcoal-600 mb-8">
                Whether you need a quick quote or want to discuss your dream project in detail, we&apos;re here to help. Choose the best way to reach us.
              </p>
            </div>

            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-beige-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-beige-100 ${info.color}`}>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-800 mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-charcoal-600 text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media & Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-beige-200">
              <h3 className="font-semibold text-charcoal-800 mb-4">Connect With Us</h3>
              <div className="flex gap-4 mb-6">
                <motion.a
                  href="https://wa.me/9876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp size={20} />
                </motion.a>
                <motion.a
                  href="https://instagram.com/mahavirstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <FaInstagram size={20} />
                </motion.a>
                <motion.a
                  href="https://facebook.com/mahavirstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook size={20} />
                </motion.a>
              </div>
              
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-medium">
                  Schedule a Consultation
                </button>
                <button className="w-full px-4 py-3 bg-charcoal-800 text-white rounded-lg hover:bg-charcoal-700 transition-colors font-medium">
                  Request a Quote
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-2xl font-serif text-charcoal-800 mb-4">
              Find Our Showroom
            </h2>
            <p className="text-charcoal-600 mb-6">
              Visit our beautiful showroom to see our products in person and get inspired for your next project.
            </p>
          </div>
          
          {/* Placeholder for map - you can integrate Google Maps later */}
          <div className="h-96 bg-beige-100 flex items-center justify-center border-t border-beige-200">
            <div className="text-center">
              <FiMapPin className="mx-auto text-charcoal-400 mb-4" size={48} />
              <p className="text-charcoal-600 font-medium">Interactive Map Coming Soon</p>
              <p className="text-charcoal-500 text-sm mt-2">123 Design Street, Mumbai, Maharashtra 400001</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
