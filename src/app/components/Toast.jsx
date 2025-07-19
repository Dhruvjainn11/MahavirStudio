"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiAlertTriangle, FiInfo, FiShoppingCart } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';
const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);


// In ToastProvider component
const addToast = useCallback((toast) => {
  const id = uuidv4(); // Generates a unique ID
  
  const newToast = { 
    id, 
    ...toast,
    duration: toast.duration || 4000
  };
  
  setToasts(prev => [...prev, newToast]);
  
  setTimeout(() => {
    removeToast(id);
  }, newToast.duration);
  
  return id;
}, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const cartSuccess = useCallback((productName, options = {}) => {
    return addToast({ 
      type: 'cart', 
      message: `${productName} added to cart!`,
      ...options 
    });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      addToast, 
      removeToast, 
      success, 
      error, 
      warning, 
      info,
      cartSuccess
    }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'cart':
        return 'bg-gold-50 border-gold-500 text-charcoal-800';
      default:
        return 'bg-white border-beige-200 text-charcoal-800';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheck className="text-green-600" size={18} />;
      case 'error':
        return <FiX className="text-red-600" size={18} />;
      case 'warning':
        return <FiAlertTriangle className="text-yellow-600" size={18} />;
      case 'info':
        return <FiInfo className="text-blue-600" size={18} />;
      case 'cart':
        return <FiShoppingCart className="text-gold-600" size={18} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`
        min-w-80 max-w-md p-4 rounded-lg border shadow-lg backdrop-blur-sm
        ${getToastStyles()}
      `}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium text-sm">
            {toast.message}
          </p>
          {toast.description && (
            <p className="text-xs mt-1 opacity-80">
              {toast.description}
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="ml-2 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <FiX size={14} />
        </button>
      </div>
    </motion.div>
  );
}
