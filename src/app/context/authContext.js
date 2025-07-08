"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: "john.doe@example.com",
    password: "password123",
    name: "John Doe",
    phone: "9876543210",
    addresses: [
      {
        id: 1,
        type: "Home",
        fullName: "John Doe",
        phone: "9876543210",
        address: "123 Main Street, Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        isDefault: true
      },
      {
        id: 2,
        type: "Office",
        fullName: "John Doe",
        phone: "9876543210",
        address: "456 Business Park, Floor 8",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400002",
        isDefault: false
      }
    ],
    orders: [
      {
        id: "ORD001",
        date: "2024-01-15",
        status: "Delivered",
        total: 15750,
        items: [
          {
            name: "Premium Door Handle Set",
            price: "₹2,500",
            quantity: 2,
            image: "/hardware1.jpg"
          },
          {
            name: "Asian Paints Royale",
            price: "₹5,250",
            quantity: 2,
            image: "/paint1.jpg"
          }
        ],
        shippingAddress: {
          fullName: "John Doe",
          address: "123 Main Street, Apartment 4B",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001"
        }
      },
      {
        id: "ORD002",
        date: "2024-01-02",
        status: "Processing",
        total: 8990,
        items: [
          {
            name: "Bathroom Accessories Set",
            price: "₹3,500",
            quantity: 1,
            image: "/hardware2.jpg"
          },
          {
            name: "Wall Paint Bundle",
            price: "₹5,490",
            quantity: 1,
            image: "/paint2.jpg"
          }
        ],
        shippingAddress: {
          fullName: "John Doe",
          address: "456 Business Park, Floor 8",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400002"
        }
      }
    ],
    wishlist: [],
    preferences: {
      newsletter: true,
      orderUpdates: true,
      promotions: false
    }
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("mahavir_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("mahavir_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("mahavir_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("mahavir_user");
    }
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsLoading(false);
      return { success: true, user: userWithoutPassword };
    } else {
      setIsLoading(false);
      return { success: false, error: "Invalid email or password" };
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: "User with this email already exists" };
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phone: userData.phone || "",
      addresses: [],
      orders: [],
      wishlist: [],
      preferences: {
        newsletter: true,
        orderUpdates: true,
        promotions: false
      }
    };
    
    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsLoading(false);
    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: "Not authenticated" };
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setIsLoading(false);
    
    return { success: true, user: updatedUser };
  };

  const addAddress = async (addressData) => {
    if (!user) return { success: false, error: "Not authenticated" };
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAddress = {
      id: Date.now(),
      ...addressData,
      isDefault: user.addresses.length === 0 // First address is default
    };
    
    const updatedUser = {
      ...user,
      addresses: [...user.addresses, newAddress]
    };
    
    setUser(updatedUser);
    setIsLoading(false);
    
    return { success: true, address: newAddress };
  };

  const updateAddress = async (addressId, updates) => {
    if (!user) return { success: false, error: "Not authenticated" };
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedAddresses = user.addresses.map(addr =>
      addr.id === addressId ? { ...addr, ...updates } : addr
    );
    
    const updatedUser = {
      ...user,
      addresses: updatedAddresses
    };
    
    setUser(updatedUser);
    setIsLoading(false);
    
    return { success: true };
  };

  const deleteAddress = async (addressId) => {
    if (!user) return { success: false, error: "Not authenticated" };
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
    
    // If deleted address was default, make first remaining address default
    if (updatedAddresses.length > 0) {
      const deletedAddress = user.addresses.find(addr => addr.id === addressId);
      if (deletedAddress?.isDefault) {
        updatedAddresses[0].isDefault = true;
      }
    }
    
    const updatedUser = {
      ...user,
      addresses: updatedAddresses
    };
    
    setUser(updatedUser);
    setIsLoading(false);
    
    return { success: true };
  };

  const setDefaultAddress = async (addressId) => {
    if (!user) return { success: false, error: "Not authenticated" };
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedAddresses = user.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    
    const updatedUser = {
      ...user,
      addresses: updatedAddresses
    };
    
    setUser(updatedUser);
    setIsLoading(false);
    
    return { success: true };
  };

  const updatePreferences = async (preferences) => {
    if (!user) return { success: false, error: "Not authenticated" };
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences }
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
