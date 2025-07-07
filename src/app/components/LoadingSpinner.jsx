"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ text = "Loading...", size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-beige-300 border-t-gold-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p 
          className="text-charcoal-600 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-beige-300 border-t-gold-500 rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.h2
          className="text-xl font-serif text-charcoal-800 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Mahavir Studio
        </motion.h2>
        <motion.p
          className="text-charcoal-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Crafting your perfect space...
        </motion.p>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-beige-200 p-5 rounded-xl bg-white shadow-sm animate-pulse">
      <div className="h-60 bg-beige-200 rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-beige-200 rounded w-3/4"></div>
        <div className="h-3 bg-beige-200 rounded w-1/2"></div>
        <div className="h-4 bg-beige-200 rounded w-1/4"></div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="flex-1 h-10 bg-beige-200 rounded"></div>
        <div className="w-10 h-10 bg-beige-200 rounded"></div>
      </div>
    </div>
  );
}
