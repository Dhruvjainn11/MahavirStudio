"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";

export default function AddressFormModal({ isOpen, onClose, editAddress, onSave }) {
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
    isDefault: false
  });
  
  useEffect(() => {
    if (editAddress) {
      console.log(editAddress)
      setForm({
        fullname: editAddress.fullname || editAddress.name || "",
        phone: editAddress.phone || "",
        address: editAddress.address || "",
        city: editAddress.city || "",
        state: editAddress.state || "",
        pincode: editAddress.pincode || "",
        type: editAddress.type || "Home",
        isDefault: editAddress.isDefault || false
      });
    } else {
      // Reset form when adding new address
      setForm({
        fullname: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        type: "Home",
        isDefault: false
      });
    }
  }, [editAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/30" 
        onClick={onClose}
      />
      
      <div className="flex items-center justify-center min-h-screen">
        <div 
          className="relative bg-white rounded-lg mx-auto p-6 max-w-md w-full shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-bold mb-4">
            {editAddress ? "Edit Address" : "Add New Address"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Home', 'Office', 'Other'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={form.type === type}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {[
              { name: "fullname", label: "Full Name", type: "text" },
              { name: "phone", label: "Phone Number", type: "tel" },
              { name: "address", label: "Full Address", type: "text" },
              { name: "city", label: "City", type: "text" },
              { name: "state", label: "State", type: "text" },
              { name: "pincode", label: "Pincode", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}

            <div className="flex items-center">
              <input
                id="isDefault"
                name="isDefault"
                type="checkbox"
                checked={form.isDefault}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                Set as default address
              </label>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}