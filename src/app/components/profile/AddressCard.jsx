"use client";

import { MapPin, Pencil, Trash2, Star } from "lucide-react";

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const { name, phone, address: fullAddress, city, state, pincode, isDefault } = address;

  return (
    <div className={`border rounded-lg p-4 shadow-sm bg-white relative hover:shadow-md transition-shadow ${isDefault ? 'border-2 border-gold-500' : ''}`}>
      <div className="absolute right-2 top-2 flex gap-2">
        {isDefault && (
          <span className="text-xs bg-gold-500 text-white px-2 py-1 rounded-full flex items-center">
            <Star size={12} className="mr-1" /> Default
          </span>
        )}
        <button 
          onClick={onEdit} 
          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
          aria-label="Edit address"
        >
          <Pencil size={16} />
        </button>
        <button 
          onClick={onDelete} 
          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
          aria-label="Delete address"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 flex-shrink-0 text-gray-500" size={18} />
        <div className="space-y-1">
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{phone}</p>
          <p className="text-sm text-gray-600">{fullAddress}</p>
          <p className="text-sm text-gray-600">
            {city}, {state} - {pincode}
          </p>
          {!isDefault && (
            <button
              onClick={onSetDefault}
              className="text-xs text-gold-600 hover:text-gold-800 mt-2 hover:underline"
            >
              Set as default
            </button>
          )}
        </div>
      </div>
    </div>
  );
}