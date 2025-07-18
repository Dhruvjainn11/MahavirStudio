"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/components/Toast";
import AddressCard from "./AddressCard.jsx";
import AddressFormModal from "./AddressFormModal.jsx";

export default function AddressTab() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState(null);

  const handleDeleteAddress = (index) => {
    const updatedAddresses = [...user.addresses];
    updatedAddresses.splice(index, 1);
    setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
    toast.success("Address removed");
  };

  const handleEditClick = (index) => {
    setEditAddressIndex(index);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditAddressIndex(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-md transition-colors text-sm w-full sm:w-auto"
        >
          <FiPlus size={16} />
          Add Address
        </button>
      </div>

      {user.addresses?.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">No saved addresses yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {user.addresses?.map((address, index) => (
            <AddressCard
              key={index}
              address={address}
              onEdit={() => handleEditClick(index)}
              onDelete={() => handleDeleteAddress(index)}
            />
          ))}
        </div>
      )}
{console.log('AddressFormModal:', AddressFormModal)}
      <AddressFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editAddress={editAddressIndex !== null ? user.addresses[editAddressIndex] : null}
        onSave={(newAddress) => {
          const updatedAddresses = [...user.addresses];
          if (editAddressIndex !== null) {
            updatedAddresses[editAddressIndex] = newAddress;
            toast.success("Address updated");
          } else {
            updatedAddresses.push(newAddress);
            toast.success("Address added");
          }
          setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
          setModalOpen(false);
        }}
      />
    </div>
  );
}