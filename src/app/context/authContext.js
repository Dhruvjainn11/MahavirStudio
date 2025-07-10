"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, initializeAuth, logoutUser } from "../../../lib/auth";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: "Not authenticated" };
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setIsLoading(false);
    return { success: true, user: updatedUser };
  };

  const addAddress = async (addressData) => {
    if (!user) return { success: false, error: "Not authenticated" };
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAddress = {
      id: Date.now(),
      ...addressData,
      isDefault: user.addresses ? user.addresses.length === 0 : true
    };
    const updatedUser = {
      ...user,
      addresses: [...(user.addresses || []), newAddress]
    };
    setUser(updatedUser);
    setIsLoading(false);
    return { success: true, address: newAddress };
  };

  const updateAddress = async (addressId, updates) => {
    if (!user) return { success: false, error: "Not authenticated" };
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedAddresses = (user.addresses || []).map(addr =>
      addr.id === addressId ? { ...addr, ...updates } : addr
    );
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    setIsLoading(false);
    return { success: true };
  };

  const deleteAddress = async (addressId) => {
    if (!user) return { success: false, error: "Not authenticated" };
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedAddresses = (user.addresses || []).filter(addr => addr.id !== addressId);
    if (updatedAddresses.length > 0) {
      const deletedAddress = user.addresses.find(addr => addr.id === addressId);
      if (deletedAddress?.isDefault) {
        updatedAddresses[0].isDefault = true;
      }
    }
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    setIsLoading(false);
    return { success: true };
  };

  const setDefaultAddress = async (addressId) => {
    if (!user) return { success: false, error: "Not authenticated" };
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedAddresses = (user.addresses || []).map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    setIsLoading(false);
    return { success: true };
  };

  const updatePreferences = async (preferences) => {
    if (!user) return { success: false, error: "Not authenticated" };
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedUser = {
      ...user,
      preferences: { ...(user.preferences || {}), ...preferences }
    };
    setUser(updatedUser);
    setIsLoading(false);
    return { success: true };
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
