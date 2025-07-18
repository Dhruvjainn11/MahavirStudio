"use client";

import { useState, useEffect } from "react";

export default function AddressFormModal({ isOpen, onClose, editAddress, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (editAddress) {
      setForm({
        name: editAddress.name || "",
        phone: editAddress.phone || "",
        address: editAddress.address || "",
        city: editAddress.city || "",
        state: editAddress.state || "",
        pincode: editAddress.pincode || "",
      });
    }
  }, [editAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
          <h2 className="text-lg font-bold mb-4">
            {editAddress ? "Edit Address" : "Add New Address"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { name: "name", label: "Full Name", type: "text" },
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