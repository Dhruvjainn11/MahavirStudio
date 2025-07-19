"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, initializeAuth, logoutUser ,getToken } from "../../../lib/auth";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

// Add this to your auth context to debug


  useEffect(() => {
    initializeAuth();
   
    const storedUser = localStorage.getItem("mahavir_user");
    if (storedUser) {
      try {
        const userParsed = JSON.parse(storedUser);
        console.log(userParsed);
         if (!userParsed.addresses) {
        userParsed.addresses = [];
      }
        setUser(userParsed);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("mahavir_user");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("mahavir_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("mahavir_user");
    }
  }, [user]);

const login = async (email, password) => {
  setIsLoading(true);
  try {
    const result = await loginUser({ email, password });
    

    if (!result?.token) {
      throw new Error(result?.error || "Login failed");
    }

    // Store token and user data
    localStorage.setItem("token", result.token);
    localStorage.setItem("mahavir_user", JSON.stringify(result.user));
    
    // Verify the addresses exist
    if (!result.user?.addresses) {
      console.warn("No addresses in login response");
      result.user.addresses = [];
    }

    setUser(result.user);
    router.push('/profile');
   
    return { success: true, user: result.user };

  } catch (err) {
    console.error("Login error:", err);
    // Clear invalid credentials
    localStorage.removeItem("token");
    localStorage.removeItem("mahavir_user");
    
    return { 
      success: false, 
      error: err.message || "Login failed" 
    };
  } finally {
    setIsLoading(false);
  }
};

// Helper function (should be defined in same context)
const fetchUserWithAddresses = async (userId, token) => {
  const response = await fetch(`${API}/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include' // If using cookies
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error:', errorData);
    throw new Error(errorData.message || "Failed to fetch user data");
  }

  return await response.json();
};

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const result = await registerUser(userData);
      if (result.token) {
        setUser(result.user);
        router.push('/profile');
        return { success: true, user: result.user };
      }
      return { success: false, error: result.error || "Signup failed" };
    } catch (err) {
      if (err.details) {
        return { success: false, error: err.details.map(d => d.msg).join(', ') };
      }
      return { success: false, error: err.error || "Signup error" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    router.push('/');
  };

 // lib/auth.js

const API = process.env.NEXT_PUBLIC_API_URL; // fallback

// ========== Profile ==========
const updateProfile = async (updates) => {
    const token = getToken();
    if (!token) return { success: false, error: 'No token found' };

    let userId;
    try {
      const userData = JSON.parse(localStorage.getItem('mahavir_user'));
      console.log(userData);
      
      userId = userData._id;
    } catch (err) {
      return { success: false, error: 'Failed to retrieve user ID' };
    }

    try {
      const res = await fetch(`${API}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('mahavir_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }

      return { success: false, error: data.error || 'Update failed' };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

// ========== Addresses ==========

 const addAddress = async (data) => {
  const token = getToken();
  if (!token) return { success: false, error: 'No token found' };
    if (!user || !user._id) return { success: false, error: 'User not loaded yet' }; // 👈 Add this

  
  try {
    const res = await fetch(`${API}/api/users/${user._id}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await res.json();
    
    if (res.ok) {
      // Update the user state with the updated user data
      setUser(responseData.user);
      return { success: true, user: responseData.user };
    }
    
    return { success: false, error: responseData.error || 'Failed to add address' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

 const updateAddress = async (addressId, data) => {
  const token = getToken();
  if (!token) return { success: false, error: 'No token found' };
  
  try {
    const res = await fetch(`${API}/api/users/${user._id}/addresses/${addressId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      
    });
    console.log(data);
    
    const responseData = await res.json();
    
    if (res.ok) {
      // Update the user state with the updated user data
      setUser(responseData.user);
      return { success: true, user: responseData.user };
    }
    
    return { success: false, error: responseData.error || 'Failed to update address' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const deleteAddress = async (addressId) => {
  const token = getToken();
  if (!token) return { success: false, error: 'No token found' };
  
  if (!user?._id) return { success: false, error: 'User not loaded' };

  try {
    const res = await fetch(`${API}/api/users/${user._id}/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      return { 
        success: false, 
        error: responseData.error || 'Failed to delete address',
        details: responseData.message
      };
    }

    // Update the user state with the updated user data
    setUser(responseData.user);
    return { 
      success: true, 
      user: responseData.user,
      message: responseData.message || 'Address deleted successfully'
    };
    
  } catch (err) {
    console.error('Delete address error:', err);
    return { 
      success: false, 
      error: err.message || 'Network error while deleting address' 
    };
  }
};

 const setDefaultAddress = async (addressId) => {
  const token = getToken();
  if (!token) return { success: false, error: 'No token found' };
  
  try {
    const res = await fetch(`${API}/api/users/${user._id}/addresses/${addressId}/default`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const responseData = await res.json();
    
    if (res.ok) {
      // Update the user state with the updated user data
      setUser(responseData.user);
      return { success: true, user: responseData.user };
    }
    
    return { success: false, error: responseData.error || 'Failed to set default address' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const fetchUserOrders = async (userId, page = 1, limit = 10, status) => {
  const token = getToken();
  if (!token) return { success: false, error: 'No token found' };

  try {
    let url = `${API}/api/orders/user/${userId}?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await res.json();
    console.log(responseData);

    if (res.ok) {
      return { 
        success: true, 
        orders: responseData.orders, 
        pagination: responseData.pagination 
      };
    }

    return { success: false, error: responseData.error || 'Failed to fetch orders' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const cancelOrder = async (orderId) => {
  const token = getToken();
  if (!token) return { success: false, error: 'No token found' };

  try {
    const res = await fetch(`${API}/api/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const responseData = await res.json();

    if (res.ok) {
      return { success: true, order: responseData.order };
    }

    return { success: false, error: responseData.error || 'Failed to cancel order' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      fetchUserOrders,
      cancelOrder
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
