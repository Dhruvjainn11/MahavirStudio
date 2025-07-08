"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import { useAuth } from "../context/authContext";
import { useToast } from "./Toast";

function InputField({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon,
  disabled = false
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border rounded-lg transition-colors
            ${error ? 'border-red-500 focus:border-red-500' : 'border-beige-300 focus:border-gold-500'}
            focus:outline-none focus:ring-2 focus:ring-gold-500/20
            ${icon ? 'pl-12' : 'pl-4'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, signup, isLoading } = useAuth();
  const { success, error } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    
    if (!loginForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!loginForm.password.trim()) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    
    if (!signupForm.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!signupForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupForm.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (signupForm.phone && !/^[6-9]\d{9}$/.test(signupForm.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    
    if (!signupForm.password.trim()) {
      newErrors.password = "Password is required";
    } else if (signupForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!signupForm.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.success) {
        success(`Welcome back, ${result.user.name}!`);
        onClose();
        resetForms();
      } else {
        error(result.error);
      }
    } catch (err) {
      error("Login failed. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    try {
      const result = await signup({
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
        password: signupForm.password
      });
      
      if (result.success) {
        success(`Welcome to Mahavir Studio, ${result.user.name}!`);
        onClose();
        resetForms();
      } else {
        error(result.error);
      }
    } catch (err) {
      error("Signup failed. Please try again.");
    }
  };

  const resetForms = () => {
    setLoginForm({ email: "", password: "" });
    setSignupForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-beige-200">
          <h2 className="text-2xl font-serif text-charcoal-800">
            {mode === "login" ? "Welcome Back" : "Join Mahavir Studio"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-beige-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Mode Toggle */}
          <div className="flex bg-beige-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-white text-charcoal-800 shadow-sm"
                  : "text-charcoal-600 hover:text-charcoal-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode("signup")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-white text-charcoal-800 shadow-sm"
                  : "text-charcoal-600 hover:text-charcoal-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  error={errors.email}
                  placeholder="Enter your email"
                  icon={<FiMail size={16} />}
                  disabled={isLoading}
                />

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400">
                      <FiLock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      className={`
                        w-full px-4 py-3 border rounded-lg transition-colors pl-12 pr-12
                        ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-beige-300 focus:border-gold-500'}
                        focus:outline-none focus:ring-2 focus:ring-gold-500/20
                        ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-300 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className="text-center text-sm text-charcoal-600">
                  Demo credentials: john.doe@example.com / password123
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <InputField
                  label="Full Name"
                  name="name"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                  error={errors.name}
                  placeholder="Enter your full name"
                  icon={<FiUser size={16} />}
                  disabled={isLoading}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  error={errors.email}
                  placeholder="Enter your email"
                  icon={<FiMail size={16} />}
                  disabled={isLoading}
                />

                <InputField
                  label="Phone Number (Optional)"
                  name="phone"
                  value={signupForm.phone}
                  onChange={handleSignupChange}
                  error={errors.phone}
                  placeholder="Enter your phone number"
                  icon={<FiPhone size={16} />}
                  disabled={isLoading}
                />

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400">
                      <FiLock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      placeholder="Create a password"
                      disabled={isLoading}
                      className={`
                        w-full px-4 py-3 border rounded-lg transition-colors pl-12 pr-12
                        ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-beige-300 focus:border-gold-500'}
                        focus:outline-none focus:ring-2 focus:ring-gold-500/20
                        ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400">
                      <FiLock size={16} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                      className={`
                        w-full px-4 py-3 border rounded-lg transition-colors pl-12 pr-12
                        ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-beige-300 focus:border-gold-500'}
                        focus:outline-none focus:ring-2 focus:ring-gold-500/20
                        ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-300 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
