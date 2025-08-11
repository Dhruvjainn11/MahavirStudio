"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { useToast } from "../components/Toast";

const contactInfo = [
  {
    icon: <FiPhone size={20} />,
    title: "Phone",
    details: ["+91 94267 59062"],
  },
  {
    icon: <FiMail size={20} />,
    title: "Email",
    details: ["mahavirstudioinfo@gmail.com"],
  },
  {
    icon: <FiMapPin size={20} />,
    title: "Address",
    details: ["Ramkrishna Paramhans Marg", "Opp. Seonnagar Methodist Church", "Ahmedabad, Gujarat 380008"],
  },
  {
    icon: <FiClock size={20} />,
    title: "Working Hours",
    details: ["Monday - Saturday: 8:30 AM - 9:00 PM", "Sunday: 8:30 AM - 1:30 PM"],
  },
];

export default function ContactPage() {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Message received!", {
        description: "We'll get back to you shortly.",
      });
      e.target.reset();
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 font-sans text-charcoal-800">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-charcoal-800 to-charcoal-900 text-white pt-32 pb-20 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            Contact Mahavir Studio
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Reach out for inquiries, consultations, or to visit our showroom
          </p>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information - Simplified */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-serif mb-8 text-charcoal-800 border-b pb-2 border-gold-300">
              Our Information
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-5"
                >
                  <div className="p-3 bg-gold-100 text-gold-600 rounded-lg flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-charcoal-800 mb-1">{info.title}</h3>
                    <div className="text-charcoal-600 space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-beige-200"
          >
            <h2 className="text-3xl font-serif text-charcoal-800 mb-6 border-b pb-2 border-gold-300">
              Send us a Message
            </h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="John Doe" 
                  className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200" 
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder="john@example.com" 
                    className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200" 
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-charcoal-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="+91 9876543210" 
                    className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-charcoal-700 mb-2">Subject *</label>
                <select 
                  id="subject" 
                  name="subject" 
                  required 
                  className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                >
                  <option value="">Select a subject</option>
                  <option value="quote">Request a Quote</option>
                  <option value="consultation">Design Consultation</option>
                  <option value="support">Customer Support</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-charcoal-700 mb-2">Message *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  required 
                  rows={5} 
                  placeholder="Tell us about your project or inquiry..." 
                  className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200 resize-none" 
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all ${
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
        </div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-20"
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-beige-200">
          <div className="h-96 w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.766724945012!2d72.61581762491095!3d22.995604079192724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e860ba425427b%3A0x4f4cf2f6d274f8fa!2sMahavir%20Hardware!5e0!3m2!1sen!2sin!4v1754651471140!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="p-6 border-t border-beige-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-medium text-charcoal-800">Mahavir Studio</h4>
                <p className="text-sm text-charcoal-600">Ramkrishna Paramhans Marg, Ahmedabad</p>
              </div>
              <a 
                href="https://maps.google.com?q=Mahavir+Hardware,+Ramkrishna+Paramhans+Marg,+opp.+Seonnagar+Methodist+Church,+Ahmedabad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2 justify-center"
              >
                <FiMapPin size={16} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}