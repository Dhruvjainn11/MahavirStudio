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



  useEffect(() => {
    initializeAuth();
   
    const storedUser = localStorage.getItem("mahavir_user");
    if (storedUser) {
      try {
        const userParsed = JSON.parse(storedUser);
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
      console.log(result);
      
      if (result.token) {
        setUser(result.user);
     
        
        router.push('/profile');
        return { success: true, user: result.user };
      }
      return { success: false, error: result.error || "Login failed" };
    } catch (err) {
      if (err.details) {
        return { success: false, error: err.details.map(d => d.msg).join(', ') };
      }
      return { success: false, error: err.error || "Login error" };
    } finally {
      setIsLoading(false);
    }
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
  
  try {
    const res = await fetch(`${API}/api/users/${user._id}/addresses/${addressId}`, {
      method: "DELETE",
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
    
    return { success: false, error: responseData.error || 'Failed to delete address' };
  } catch (err) {
    return { success: false, error: err.message };
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

// ========== Preferences ==========

 const updatePreferences = async (preferences) => {
  const token = getToken();
  if (!token) return { success: false, error: 'No token found' };
  
  try {
    const res = await fetch(`${API}/api/users/${user._id}/preferences`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });
    
    const responseData = await res.json();
    
    if (res.ok) {
      // Update the user state with the updated user data
      setUser(responseData.user);
      return { success: true, user: responseData.user };
    }
    
    return { success: false, error: responseData.error || 'Failed to update preferences' };
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
      updatePreferences
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
