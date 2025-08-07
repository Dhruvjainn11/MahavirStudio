'use client'

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useToast } from '@/app/components/Toast'
import { useAuth } from '@/app/context/authContext'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        cartItems: action.payload.items || [],
        cartQuantity: action.payload.totalItems || 0,
        cartTotal: (action.payload.items || []).reduce(
          (total, item) => total + (item?.productId?.price * item?.quantity || 0),
          0
        ),
        isLoading: false,
        error: null
      }
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        cartQuantity: 0,
        cartTotal: 0,
        isLoading: false,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    default:
      return state
  }
}

// Create axios instance with base config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: [],
    cartQuantity: 0,
    cartTotal: 0,
    isLoading: false,
    error: null
  })
  
  const { success, error: showError } = useToast()
  const { token, refreshToken } = useAuth()

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }, [token])

  // Memoize handleApiError to prevent unnecessary re-creations
  const handleApiError = useCallback((err, defaultMessage) => {
    const message = err.response?.data?.message || err.message || defaultMessage
    showError(message)
    dispatch({ type: 'SET_ERROR', payload: message })
    return message
  }, [showError]) // It depends on showError from useToast

  // Fetch cart with retry logic
  const fetchCart = useCallback(async () => {
    // dispatch({ type: 'SET_LOADING' }) // This dispatch is commented out, maybe for a reason?
    try {
      const { data } = await api.get(`/api/cart`, getAuthHeaders())
      dispatch({ type: 'SET_CART', payload: data })
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          // Attempt to refresh token and retry
          await refreshToken()
          const { data } = await api.get(`/api/cart`, getAuthHeaders())
          dispatch({ type: 'SET_CART', payload: data })
          return
        } catch (refreshErr) {
          handleApiError(refreshErr, 'Session expired. Please login again.')
          return
        }
      }
      handleApiError(err, 'Failed to fetch cart items')
    }
  }, [refreshToken, getAuthHeaders, handleApiError])

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post(
        '/api/cart', 
        { productId, quantity },
        getAuthHeaders()
      )
      await fetchCart()
      success('Item added to cart')
    } catch (err) {
      handleApiError(err, 'Failed to add item to cart')
    }
  }

  const updateCartItem = async (productId, quantity) => {
    try {
      await api.put(
        `/api/cart/${productId}`,
        { quantity },
        getAuthHeaders()
      )
      await fetchCart()
      success('Quantity updated')
    } catch (err) {
      handleApiError(err, 'Failed to update quantity')
    }
  }

  const removeFromCart = async (productId) => {
    try {
      await api.delete(
        `/api/cart/${productId}`,
        getAuthHeaders()
      )
      await fetchCart()
      success('Item removed from cart')
    } catch (err) {
      handleApiError(err, 'Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      await api.delete(
        `/api/cart`,
        getAuthHeaders()
      )
      await fetchCart()
      success('Cart cleared')
    } catch (err) {
      handleApiError(err, 'Failed to clear cart')
    }
  }

  // Fetch cart on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchCart()
    } else {
      dispatch({ type: 'CLEAR_CART' })
    }
  }, [token, fetchCart])

  return (
    <CartContext.Provider
      value={{
        ...state,
        cart: state.cartItems,
        cartItems: state.cartItems,
        cartQuantity: state.cartQuantity,
        cartTotal: state.cartTotal,
        isLoading: state.isLoading,
        error: state.error,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}