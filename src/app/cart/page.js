// app/cart/page.js
'use client'

import { useCart } from '@/app/context/cartContext'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Skeleton Component for individual cart item
const CartItemSkeleton = () => (
    <div className="flex items-center p-4 sm:p-6 animate-pulse">
        <div className="flex-shrink-0 h-24 w-24 rounded-md bg-gray-200"></div>
        <div className="ml-4 flex-1 flex flex-col sm:flex-row justify-between">
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center">
                <div className="flex items-center border border-gray-300 rounded-md">
                    <div className="px-3 py-1 bg-gray-200 w-8 h-8 rounded-l"></div>
                    <div className="px-3 py-1 bg-gray-200 w-8 h-8"></div>
                    <div className="px-3 py-1 bg-gray-200 w-8 h-8 rounded-r"></div>
                </div>
                <div className="ml-4 h-4 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    </div>
)

// Skeleton for the order summary
const OrderSummarySkeleton = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
        <div className="mt-6">
            <div className="w-full h-12 bg-gray-200 rounded-md"></div>
        </div>
    </div>
)


const CartPage = () => {
    const {
        cartItems,
        cartQuantity,
        cartTotal,
        isLoading, // This isLoading is now only for initial fetch
        updateCartItem,
        removeFromCart,
        clearCart
    } = useCart()

    const [removingItems, setRemovingItems] = useState(new Set())
    const [updatingQuantities, setUpdatingQuantities] = useState(new Set()) // New state for quantity updates
    const [isClearingCart, setIsClearingCart] = useState(false) // New state for clearing cart

    const router = useRouter()

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return

        setUpdatingQuantities(prev => new Set([...prev, productId]))
        await updateCartItem(productId, newQuantity)
        setUpdatingQuantities(prev => {
            const newSet = new Set(prev)
            newSet.delete(productId)
            return newSet
        })
    }

    const handleRemoveItem = async (productId) => {
        setRemovingItems(prev => new Set([...prev, productId]))
        await removeFromCart(productId)
        setRemovingItems(prev => {
            const newSet = new Set(prev)
            newSet.delete(productId)
            return newSet
        })
    }

    const handleClearCart = async () => {
        setIsClearingCart(true)
        await clearCart()
        setIsClearingCart(false)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                        <div className="lg:col-span-8">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <ul className="divide-y divide-gray-200">
                                    {[1, 2, 3].map(i => <CartItemSkeleton key={i} />)} {/* Show 3 skeleton items */}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 lg:mt-0 lg:col-span-4">
                            <OrderSummarySkeleton />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        {/* ... (empty cart SVG and text - no changes needed here) ... */}
                        <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-medium text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Looks like you haven`t added anything to your cart yet.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                        <div className="lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white shadow overflow-hidden sm:rounded-lg"
                            >
                                {/* AnimatePresence for item removal animations */}
                                <AnimatePresence>
                                    <ul className="divide-y divide-gray-200">
                                        {cartItems.map((item) => (
                                            <motion.li
                                                key={item.productId._id}
                                                initial={{ opacity: 0, height: 0 }} // Start collapsed
                                                animate={{ opacity: 1, height: 'auto' }} // Expand
                                                exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }} // Collapse on exit
                                                transition={{ duration: 0.3 }}
                                                className="p-4 sm:p-6 overflow-hidden" // Add overflow-hidden
                                            >
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden">
                                                        <Image
                                                            src={item.productId.images[0].url}
                                                            alt={item.productId.name}
                                                            width={96}
                                                            height={96}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>

                                                    <div className="ml-4 flex-1 flex flex-col sm:flex-row justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="text-base font-medium text-gray-900">
                                                                {item.productId.name}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                ₹{item.productId.price.toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <div className="mt-4 sm:mt-0 flex items-center">
                                                            {/* Quantity controls with loading state */}
                                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                                <button
                                                                    onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                                    disabled={updatingQuantities.has(item.productId._id)}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="px-3 py-1 text-gray-900">
                                                                    {updatingQuantities.has(item.productId._id) ? (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
                                                                    ) : (
                                                                        item.quantity
                                                                    )}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                                    disabled={updatingQuantities.has(item.productId._id)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            {/* Remove button with loading state */}
                                                            <button
                                                                onClick={() => handleRemoveItem(item.productId._id)}
                                                                className={`ml-4 text-sm font-medium ${
                                                                    removingItems.has(item.productId._id)
                                                                        ? 'text-gray-400 cursor-not-allowed'
                                                                        : 'text-indigo-600 hover:text-indigo-500'
                                                                }`}
                                                                disabled={removingItems.has(item.productId._id)}
                                                            >
                                                                {removingItems.has(item.productId._id) ? 'Removing...' : 'Remove'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </AnimatePresence>
                            </motion.div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleClearCart}
                                    className={`text-sm font-medium ${
                                        isClearingCart
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-600 hover:text-gray-500'
                                    }`}
                                    disabled={isClearingCart}
                                >
                                    {isClearingCart ? 'Clearing...' : 'Clear cart'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 lg:mt-0 lg:col-span-4">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            ₹{cartTotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-t border-gray-200 pt-4">
                                        <span className="text-gray-600">Total Items</span>
                                        <span className="font-medium text-gray-900">
                                            {cartQuantity}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-t border-gray-200 pt-4">
                                        <span className="text-base font-medium text-gray-900">
                                            Order Total
                                        </span>
                                        <span className="text-base font-medium text-gray-900">
                                            ₹{cartTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            // TODO: Navigate to checkout page
                                            router.push('/checkout')
                                            console.log("Proceeding to checkout");
                                        }}
                                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage