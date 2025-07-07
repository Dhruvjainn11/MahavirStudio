"use client";

import React from "react";
import { useCart } from "../context/cartContext";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../components/Toast";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiShield, 
  FiTruck, 
  FiCreditCard, 
  FiLock, 
  FiChevronLeft, 
  FiCheck, 
  FiEdit3,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiClock,
  FiPackage,
  FiShoppingBag
} from "react-icons/fi";

// Step Indicator Component
function StepIndicator({ step, currentStep, icon, label, isCompleted }) {
  const isActive = currentStep === step;
  const isPast = currentStep > step;
  
  return (
    <div className="flex flex-col items-center min-w-0">
      <div className={`
        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all
        ${isActive ? 'bg-gold-500 border-gold-500 text-white' : 
          isPast || isCompleted ? 'bg-gold-500 border-gold-500 text-white' : 
          'bg-white border-beige-300 text-charcoal-400'}
      `}>
        {isPast || isCompleted ? <FiCheck size={16} /> : React.cloneElement(icon, { size: 16 })}
      </div>
      <span className={`mt-1 md:mt-2 text-xs font-medium text-center ${
        isActive ? 'text-gold-600' : 
        isPast || isCompleted ? 'text-gold-600' : 
        'text-charcoal-500'
      }`}>
        {label}
      </span>
    </div>
  );
}

// Input Field Component
function InputField({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon, 
  isTextarea = false 
}) {
  const inputClasses = `
    w-full px-4 py-3 border rounded-lg transition-colors
    ${error ? 'border-red-500 focus:border-red-500' : 'border-beige-300 focus:border-gold-500'}
    focus:outline-none focus:ring-2 focus:ring-gold-500/20
    ${icon ? 'pl-12' : 'pl-4'}
  `;
  
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
        {isTextarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className={inputClasses}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClasses}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Payment Option Component
function PaymentOption({ id, name, value, checked, onChange, icon, label, description }) {
  return (
    <label
      htmlFor={id}
      className={`
        relative p-4 border-2 rounded-lg cursor-pointer transition-all
        ${checked ? 'border-gold-500 bg-gold-50' : 'border-beige-200 hover:border-beige-300'}
      `}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className="flex flex-col items-center text-center">
        <div className={`text-2xl mb-2 ${
          checked ? 'text-gold-600' : 'text-charcoal-400'
        }`}>
          {icon}
        </div>
        <h4 className={`font-medium text-sm ${
          checked ? 'text-gold-800' : 'text-charcoal-800'
        }`}>
          {label}
        </h4>
        <p className={`text-xs mt-1 ${
          checked ? 'text-gold-600' : 'text-charcoal-500'
        }`}>
          {description}
        </p>
      </div>
      {checked && (
        <div className="absolute top-2 right-2">
          <FiCheck className="text-gold-600" size={16} />
        </div>
      )}
    </label>
  );
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { success, error } = useToast();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [billingForm, setBillingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    alternatePhone: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  
  const [errors, setErrors] = useState({});
  
  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => {
        const price = parseInt(item.price.replace(/[₹,]/g, ""));
        return acc + (item.quantity * price);
      },
      0
    );
    
    const shipping = subtotal > 15000 ? 0 : 499;
    const tax = Math.round(subtotal * 0.18);
    const discount = subtotal > 100000 ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal + shipping + tax - discount;
    
    return { subtotal, shipping, tax, discount, total };
  }, [cartItems]);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format card number
    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      if (formattedValue.length > 19) return;
    }
    
    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(?=\d)/g, "$1/");
      if (formattedValue.length > 5) return;
    }
    
    // Format CVV
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 3) return;
    }
    
    setCardForm(prev => ({ ...prev, [name]: formattedValue }));
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!billingForm.firstName.trim()) newErrors.firstName = "First name is required";
      if (!billingForm.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!billingForm.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(billingForm.email)) newErrors.email = "Email is invalid";
      if (!billingForm.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^[6-9]\d{9}$/.test(billingForm.phone)) newErrors.phone = "Invalid phone number";
      if (!billingForm.address.trim()) newErrors.address = "Address is required";
      if (!billingForm.city.trim()) newErrors.city = "City is required";
      if (!billingForm.state.trim()) newErrors.state = "State is required";
      if (!billingForm.pincode.trim()) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(billingForm.pincode)) newErrors.pincode = "Invalid pincode";
    }
    
    if (step === 2 && paymentMethod === "card") {
      if (!cardForm.cardNumber.replace(/\s/g, "")) newErrors.cardNumber = "Card number is required";
      else if (cardForm.cardNumber.replace(/\s/g, "").length !== 16) newErrors.cardNumber = "Invalid card number";
      if (!cardForm.expiryDate) newErrors.expiryDate = "Expiry date is required";
      if (!cardForm.cvv) newErrors.cvv = "CVV is required";
      if (!cardForm.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Order Placed ✅", { billingForm, paymentMethod, cardForm, cartItems, total: calculations.total });
      
      success("Order placed successfully! You will receive a confirmation email shortly.");
      clearCart();
      router.push("/order-confirmation");
    } catch (err) {
      error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-beige-50 rounded-lg p-8">
          <FiShoppingBag className="mx-auto text-charcoal-400 text-4xl mb-4" />
          <h2 className="text-2xl font-serif text-charcoal-800 mb-2">Your cart is empty</h2>
          <p className="text-charcoal-600 mb-6">Add some items to your cart before checkout.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
          >
            <FiChevronLeft size={18} />
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center text-gold-600 hover:text-gold-700 transition-colors mb-2 md:mb-4 text-sm md:text-base"
        >
          <FiChevronLeft className="mr-1" size={16} />
          Back to Cart
        </Link>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-charcoal-800">
          Secure Checkout
        </h1>
        <p className="text-charcoal-600 mt-1 md:mt-2 text-sm md:text-base">Complete your order with our secure payment system</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-6 md:mb-10">
        <div className="flex items-center justify-center overflow-x-auto px-4">
          <div className="flex items-center space-x-4 md:space-x-8">
            <StepIndicator
              step={1}
              currentStep={currentStep}
              icon={<FiUser />}
              label="Billing Details"
              isCompleted={currentStep > 1}
            />
            <div className={`h-0.5 w-16 ${currentStep > 1 ? 'bg-gold-500' : 'bg-beige-300'}`} />
            <StepIndicator
              step={2}
              currentStep={currentStep}
              icon={<FiCreditCard />}
              label="Payment"
              isCompleted={currentStep > 2}
            />
            <div className={`h-0.5 w-16 ${currentStep > 2 ? 'bg-gold-500' : 'bg-beige-300'}`} />
            <StepIndicator
              step={3}
              currentStep={currentStep}
              icon={<FiCheck />}
              label="Confirmation"
              isCompleted={false}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Left Side - Forms */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white p-4 md:p-6 rounded-lg border border-beige-200 shadow-sm"
              >
                <h2 className="text-lg md:text-xl font-semibold text-charcoal-800 mb-4 md:mb-6 flex items-center gap-2">
                  <FiMapPin className="text-gold-600" />
                  Billing Details
                </h2>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      name="firstName"
                      value={billingForm.firstName}
                      onChange={handleBillingChange}
                      error={errors.firstName}
                      icon={<FiUser />}
                    />
                    <InputField
                      label="Last Name"
                      name="lastName"
                      value={billingForm.lastName}
                      onChange={handleBillingChange}
                      error={errors.lastName}
                      icon={<FiUser />}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={billingForm.email}
                      onChange={handleBillingChange}
                      error={errors.email}
                      icon={<FiMail />}
                    />
                    <InputField
                      label="Phone Number"
                      name="phone"
                      value={billingForm.phone}
                      onChange={handleBillingChange}
                      error={errors.phone}
                      icon={<FiPhone />}
                    />
                  </div>
                  
                  <InputField
                    label="Complete Address"
                    name="address"
                    value={billingForm.address}
                    onChange={handleBillingChange}
                    error={errors.address}
                    icon={<FiMapPin />}
                    isTextarea
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      label="City"
                      name="city"
                      value={billingForm.city}
                      onChange={handleBillingChange}
                      error={errors.city}
                    />
                    <InputField
                      label="State"
                      name="state"
                      value={billingForm.state}
                      onChange={handleBillingChange}
                      error={errors.state}
                    />
                    <InputField
                      label="Pincode"
                      name="pincode"
                      value={billingForm.pincode}
                      onChange={handleBillingChange}
                      error={errors.pincode}
                    />
                  </div>
                  
                  <InputField
                    label="Alternate Phone (Optional)"
                    name="alternatePhone"
                    value={billingForm.alternatePhone}
                    onChange={handleBillingChange}
                    icon={<FiPhone />}
                  />
                </form>
                
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 md:mt-8">
                  <Link
                    href="/cart"
                    className="px-4 py-2 md:px-6 md:py-3 border border-beige-300 text-charcoal-600 rounded-lg hover:bg-beige-50 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <FiChevronLeft size={16} />
                    Back to Cart
                  </Link>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 md:px-8 md:py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    Continue to Payment
                    <FiCreditCard size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white p-4 md:p-6 rounded-lg border border-beige-200 shadow-sm"
              >
                <h2 className="text-lg md:text-xl font-semibold text-charcoal-800 mb-4 md:mb-6 flex items-center gap-2">
                  <FiLock className="text-gold-600" />
                  Payment Method
                </h2>
                
                {/* Payment Method Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                  <PaymentOption
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    icon={<FiCreditCard />}
                    label="Card Payment"
                    description="Visa, Mastercard, Rupay"
                  />
                  <PaymentOption
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    icon={<FiShield />}
                    label="UPI Payment"
                    description="Google Pay, PhonePe, Paytm"
                  />
                  <PaymentOption
                    id="netbanking"
                    name="paymentMethod"
                    value="netbanking"
                    checked={paymentMethod === "netbanking"}
                    onChange={() => setPaymentMethod("netbanking")}
                    icon={<FiLock />}
                    label="Net Banking"
                    description="All major banks"
                  />
                </div>

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <InputField
                      label="Card Number"
                      name="cardNumber"
                      value={cardForm.cardNumber}
                      onChange={handleCardChange}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      icon={<FiCreditCard />}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField
                        label="Expiry Date"
                        name="expiryDate"
                        value={cardForm.expiryDate}
                        onChange={handleCardChange}
                        error={errors.expiryDate}
                        placeholder="MM/YY"
                      />
                      <InputField
                        label="CVV"
                        name="cvv"
                        value={cardForm.cvv}
                        onChange={handleCardChange}
                        error={errors.cvv}
                        placeholder="123"
                      />
                      <div></div>
                    </div>
                    
                    <InputField
                      label="Cardholder Name"
                      name="cardholderName"
                      value={cardForm.cardholderName}
                      onChange={handleCardChange}
                      error={errors.cardholderName}
                      placeholder="Name as on card"
                    />
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="text-center py-8">
                    <FiShield className="mx-auto text-4xl text-gold-600 mb-4" />
                    <h3 className="text-lg font-medium text-charcoal-800 mb-2">UPI Payment</h3>
                    <p className="text-charcoal-600">You will be redirected to your UPI app to complete the payment.</p>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="text-center py-8">
                    <FiLock className="mx-auto text-4xl text-gold-600 mb-4" />
                    <h3 className="text-lg font-medium text-charcoal-800 mb-2">Net Banking</h3>
                    <p className="text-charcoal-600">You will be redirected to your bank's website to complete the payment.</p>
                  </div>
                )}
                
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 border border-beige-300 text-charcoal-600 rounded-lg hover:bg-beige-50 transition-colors flex items-center gap-2"
                  >
                    <FiChevronLeft size={16} />
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiLock size={16} />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side - Order Summary */}
        <div className="lg:col-span-1 order-first lg:order-last">
          <div className="bg-white p-4 md:p-6 rounded-lg border border-beige-200 shadow-sm lg:sticky lg:top-8">
            <h3 className="text-base md:text-lg font-semibold text-charcoal-800 mb-3 md:mb-4 flex items-center gap-2">
              <FiPackage className="text-gold-600" />
              Order Summary
            </h3>
            
            {/* Items List */}
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              {cartItems.map((item, index) => {
                const itemPrice = parseInt(item.price.replace(/[₹,]/g, ""));
                const itemTotal = itemPrice * item.quantity;
                return (
                  <div key={index} className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-medium text-charcoal-800 truncate">{item.name}</h4>
                      <p className="text-xs text-charcoal-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gold-600 whitespace-nowrap">
                      ₹{itemTotal.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Pricing Breakdown */}
            <div className="space-y-1 md:space-y-2 py-3 md:py-4 border-t border-beige-200">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-charcoal-600">Subtotal</span>
                <span>₹{calculations.subtotal.toLocaleString()}</span>
              </div>
              
              {calculations.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount (5%)</span>
                  <span>-₹{calculations.discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-600">Shipping</span>
                <span className={calculations.shipping === 0 ? "text-green-600" : "text-charcoal-800"}>
                  {calculations.shipping === 0 ? "FREE" : `₹${calculations.shipping.toLocaleString()}`}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-600">GST (18%)</span>
                <span>₹{calculations.tax.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-4 border-t border-beige-200">
              <span className="text-lg font-semibold text-charcoal-800">Total</span>
              <span className="text-xl font-semibold text-gold-600">
                ₹{calculations.total.toLocaleString()}
              </span>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-green-600">
                <FiShield size={14} />
                <span>SSL Secured Payment</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <FiTruck size={14} />
                <span>Free installation included</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gold-600">
                <FiClock size={14} />
                <span>Delivery in 7-14 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
