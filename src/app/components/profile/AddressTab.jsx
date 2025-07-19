"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/components/Toast";
import AddressCard from "./AddressCard.jsx";
import AddressFormModal from "./AddressFormModal.jsx";

export default function AddressTab() {
  const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDeleteAddress = async (addressId) => {
    setIsDeleting(true);
    try {
      const result = await deleteAddress(addressId);
      if (result.success) {
        toast.success("Address removed");
      } else {
        toast.error(result.error || "Failed to delete address");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (addressId) => {
    setEditAddressId(addressId);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditAddressId(null);
    setModalOpen(true);
  };

  const handleSaveAddress = async (addressData) => {
    setIsSaving(true);
    try {
      let result;
      if (editAddressId) {
        result = await updateAddress(editAddressId, addressData);
      } else {
        result = await addAddress(addressData);
      }

      if (result.success) {
        toast.success(`Address ${editAddressId ? 'updated' : 'added'} successfully`);
        setModalOpen(false);
      } else {
        toast.error(result.error || `Failed to ${editAddressId ? 'update' : 'add'} address`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
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

      {user?.addresses?.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">No saved addresses yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {user?.addresses?.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={() => handleEditClick(address._id)}
              onDelete={() => handleDeleteAddress(address._id)}
              onSetDefault={() => setDefaultAddress(address._id)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editAddress={
          editAddressId && user?.addresses
            ? user.addresses.find(addr => addr._id.toString() === editAddressId.toString())
            : null
        }
        onSave={handleSaveAddress}
        isSaving={isSaving}
      />
    </div>
  );
}