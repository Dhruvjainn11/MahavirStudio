'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminContext = createContext();

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload.admin,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        error: null
      };
    case 'VERIFY_TOKEN':
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload.admin,
        loading: false
      };
    case 'VERIFY_TOKEN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  admin: null,
  token: null,
  loading: true,
  error: null
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const router = useRouter();

  // Check for existing token on mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            dispatch({
              type: 'VERIFY_TOKEN',
              payload: { admin: data.user }
            });
          } else {
            localStorage.removeItem('adminToken');
            dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
          }
        } else {
          dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
        }
      } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('adminToken');
        dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
      }
    };

    checkToken();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            admin: data.user,
            token: data.token
          }
        });
        router.push('/admin/dashboard');
        return { success: true };
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: data.error || 'Login failed'
        });
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Network error. Please try again.'
      });
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    dispatch({ type: 'LOGOUT' });
    router.push('/admin/login');
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value = {
    ...state,
    login,
    logout,
    getAuthHeaders
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
