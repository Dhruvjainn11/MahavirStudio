"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/authContext";
import { useToast } from "../components/Toast";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiEdit, 
  FiCheck, 
  FiX, 
  FiPlus,
  FiTrash2,
  FiStar,
  FiHeart,
  FiSettings,
  FiShoppingBag,
  FiClock,
  FiTruck,
  FiEye,
  FiHome,
  FiBriefcase,
  FiGift
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

// Profile field component with enhanced styling
function ProfileField({ label, value, isEditable, onChange, type = "text", icon, error }) {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-charcoal-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400">
            {icon}
          </div>
        )}
        {isEditable ? (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              icon ? 'pl-10' : 'pl-4'
            } ${
              error ? 'border-red-500 focus:border-red-500' : 'border-beige-300 focus:border-gold-500'
            } focus:outline-none focus:ring-2 focus:ring-gold-500/20`}
          />
        ) : (
          <div className={`w-full px-4 py-3 bg-gray-50 rounded-lg text-charcoal-800 ${
            icon ? 'pl-10' : 'pl-4'
          }`}>
            {value || "Not provided"}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Address card component
function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home': return <FiHome className="text-blue-500" />;
      case 'Office': return <FiBriefcase className="text-green-500" />;
      case 'Other': return <FiMapPin className="text-gray-500" />;
      default: return <FiMapPin className="text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-lg border-2 transition-all ${
        address.isDefault 
          ? 'border-gold-500 bg-gold-50' 
          : 'border-beige-200 bg-white hover:border-beige-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {getAddressIcon(address.type)}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-charcoal-800">{address.type}</h4>
              {address.isDefault && (
                <span className="text-xs bg-gold-100 text-gold-800 px-2 py-1 rounded-full">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-charcoal-800 font-medium">{address.fullName}</p>
            <p className="text-sm text-charcoal-600">{address.phone}</p>
            <p className="text-sm text-charcoal-600 mt-1">
              {address.address}
            </p>
            <p className="text-sm text-charcoal-600">
              {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(address)}
            className="p-2 text-charcoal-400 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition-colors"
            title="Edit address"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="p-2 text-charcoal-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete address"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      {!address.isDefault && (
        <button
          onClick={() => onSetDefault(address.id)}
          className="mt-3 text-sm text-gold-600 hover:text-gold-700 font-medium"
        >
          Set as default
        </button>
      )}
    </motion.div>
  );
}

// Order item component
function OrderItem({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'Processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Shipped': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <FiCheck size={16} />;
      case 'Processing': return <FiClock size={16} />;
      case 'Shipped': return <FiTruck size={16} />;
      default: return <FiShoppingBag size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-beige-200 p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-charcoal-800">Order #{order.id}</h3>
          <p className="text-sm text-charcoal-600">
            Placed on {new Date(order.date).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          {order.status}
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-beige-50 rounded-lg">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-charcoal-800">{item.name}</h4>
              <p className="text-sm text-charcoal-600">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-charcoal-800">{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-beige-200 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-charcoal-600">Total Amount</p>
            <p className="text-lg font-semibold text-charcoal-800">₹{order.total.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-beige-300 text-charcoal-600 rounded-lg hover:bg-beige-50 transition-colors">
              <FiEye size={16} className="inline mr-2" />
              View Details
            </button>
            {order.status === 'Delivered' && (
              <button className="px-4 py-2 text-sm bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors">
                Reorder
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Address form modal
function AddressFormModal({ isOpen, onClose, address, onSave }) {
  const [formData, setFormData] = useState({
    type: 'Home',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        type: 'Home',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      });
    }
    setErrors({});
  }, [address, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      success(address ? 'Address updated successfully!' : 'Address added successfully!');
      onClose();
    } catch (err) {
      error('Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-beige-200">
          <h2 className="text-xl font-semibold text-charcoal-800">
            {address ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-beige-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Address Type
            </label>
            <div className="flex gap-2">
              {['Home', 'Office', 'Other'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === type
                      ? 'bg-gold-500 text-white'
                      : 'bg-beige-100 text-charcoal-600 hover:bg-beige-200'
                  }`}
                >
                  {type === 'Home' && <FiHome className="inline mr-1" size={14} />}
                  {type === 'Office' && <FiBriefcase className="inline mr-1" size={14} />}
                  {type === 'Other' && <FiMapPin className="inline mr-1" size={14} />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          <ProfileField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={(value) => setFormData(prev => ({ ...prev, fullName: value }))}
            isEditable={true}
            icon={<FiUser size={16} />}
            error={errors.fullName}
          />

          <ProfileField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
            isEditable={true}
            icon={<FiPhone size={16} />}
            error={errors.phone}
          />

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Complete Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.address ? 'border-red-500' : 'border-beige-300 focus:border-gold-500'
              } focus:outline-none focus:ring-2 focus:ring-gold-500/20`}
              placeholder="Enter complete address"
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ProfileField
              label="City"
              name="city"
              value={formData.city}
              onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
              isEditable={true}
              error={errors.city}
            />

            <ProfileField
              label="State"
              name="state"
              value={formData.state}
              onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
              isEditable={true}
              error={errors.state}
            />
          </div>

          <ProfileField
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={(value) => setFormData(prev => ({ ...prev, pincode: value }))}
            isEditable={true}
            error={errors.pincode}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-beige-300 text-charcoal-600 rounded-lg hover:bg-beige-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  {address ? 'Update' : 'Add'} Address
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress, updatePreferences } = useAuth();
  const { success, error } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [profileErrors, setProfileErrors] = useState({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (user) {
      setEditedProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50">
        <div className="text-center">
          <FiUser className="mx-auto text-6xl text-charcoal-400 mb-4" />
          <h2 className="text-2xl font-semibold text-charcoal-800 mb-2">Please sign in</h2>
          <p className="text-charcoal-600 mb-6">You need to be signed in to view your profile.</p>
          <Link href="/" className="btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser size={18} /> },
    { id: 'addresses', label: 'Addresses', icon: <FiMapPin size={18} /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings size={18} /> }
  ];

  const handleProfileEdit = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateProfile = () => {
    const errors = {};
    if (!editedProfile.name?.trim()) errors.name = 'Name is required';
    if (!editedProfile.email?.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(editedProfile.email)) errors.email = 'Email is invalid';
    if (editedProfile.phone && !/^[6-9]\d{9}$/.test(editedProfile.phone)) errors.phone = 'Invalid phone number';
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSave = async () => {
    if (!validateProfile()) return;
    
    try {
      const result = await updateProfile(editedProfile);
      if (result.success) {
        success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        error(result.error);
      }
    } catch (err) {
      error('Failed to update profile. Please try again.');
    }
  };

  const handleAddressAction = async (action, addressData, addressId) => {
    try {
      let result;
      switch (action) {
        case 'add':
          result = await addAddress(addressData);
          break;
        case 'update':
          result = await updateAddress(addressId, addressData);
          break;
        case 'delete':
          result = await deleteAddress(addressId);
          break;
        case 'setDefault':
          result = await setDefaultAddress(addressId);
          break;
      }
      
      if (result.success) {
        success(`Address ${action === 'add' ? 'added' : action === 'update' ? 'updated' : action === 'delete' ? 'deleted' : 'set as default'} successfully!`);
      } else {
        error(result.error);
      }
    } catch (err) {
      error(`Failed to ${action} address. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-beige-200 p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-charcoal-800">Welcome, {user.name}!</h1>
              <p className="text-charcoal-600">{user.email}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-beige-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gold-50 text-gold-700 border border-gold-200'
                        : 'text-charcoal-600 hover:bg-beige-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg shadow-sm border border-beige-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-charcoal-800">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-charcoal-600 border border-beige-300 rounded-lg hover:bg-beige-50 transition-colors"
                      >
                        <FiEdit size={16} />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleProfileSave}
                          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                        >
                          <FiCheck size={16} />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedProfile({
                              name: user.name || '',
                              email: user.email || '',
                              phone: user.phone || ''
                            });
                            setProfileErrors({});
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-charcoal-600 border border-beige-300 rounded-lg hover:bg-beige-50 transition-colors"
                        >
                          <FiX size={16} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                      label="Full Name"
                      value={isEditing ? editedProfile.name : user.name}
                      isEditable={isEditing}
                      onChange={(value) => handleProfileEdit('name', value)}
                      icon={<FiUser size={16} />}
                      error={profileErrors.name}
                    />

                    <ProfileField
                      label="Email Address"
                      value={isEditing ? editedProfile.email : user.email}
                      isEditable={isEditing}
                      onChange={(value) => handleProfileEdit('email', value)}
                      type="email"
                      icon={<FiMail size={16} />}
                      error={profileErrors.email}
                    />

                    <ProfileField
                      label="Phone Number"
                      value={isEditing ? editedProfile.phone : user.phone}
                      isEditable={isEditing}
                      onChange={(value) => handleProfileEdit('phone', value)}
                      icon={<FiPhone size={16} />}
                      error={profileErrors.phone}
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-charcoal-700">
                        Member Since
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-charcoal-800 pl-10">
                        <FiStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={16} />
                        January 2024
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-charcoal-800">Saved Addresses</h2>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                    >
                      <FiPlus size={16} />
                      Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {user.addresses?.map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          onEdit={(addr) => {
                            setEditingAddress(addr);
                            setIsAddressModalOpen(true);
                          }}
                          onDelete={(id) => handleAddressAction('delete', null, id)}
                          onSetDefault={(id) => handleAddressAction('setDefault', null, id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {(!user.addresses || user.addresses.length === 0) && (
                    <div className="text-center py-12">
                      <FiMapPin className="mx-auto text-4xl text-charcoal-400 mb-4" />
                      <h3 className="text-lg font-medium text-charcoal-800 mb-2">No addresses saved</h3>
                      <p className="text-charcoal-600 mb-4">Add your first address to make checkout faster.</p>
                      <button
                        onClick={() => setIsAddressModalOpen(true)}
                        className="btn-primary"
                      >
                        Add Address
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-charcoal-800">Order History</h2>

                  <div className="space-y-6">
                    {user.orders?.map((order) => (
                      <OrderItem key={order.id} order={order} />
                    ))}
                  </div>

                  {(!user.orders || user.orders.length === 0) && (
                    <div className="text-center py-12">
                      <FiShoppingBag className="mx-auto text-4xl text-charcoal-400 mb-4" />
                      <h3 className="text-lg font-medium text-charcoal-800 mb-2">No orders yet</h3>
                      <p className="text-charcoal-600 mb-4">Start shopping to see your orders here.</p>
                      <Link href="/products" className="btn-primary">
                        Browse Products
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg shadow-sm border border-beige-200 p-6"
                >
                  <h2 className="text-xl font-semibold text-charcoal-800 mb-6">Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-charcoal-800 mb-4">Notification Settings</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'newsletter', label: 'Newsletter', description: 'Receive product updates and design tips' },
                          { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified about order status changes' },
                          { key: 'promotions', label: 'Promotions', description: 'Receive exclusive offers and discounts' }
                        ].map((pref) => (
                          <div key={pref.key} className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-charcoal-800">{pref.label}</h4>
                              <p className="text-sm text-charcoal-600">{pref.description}</p>
                            </div>
                            <button
                              onClick={() => updatePreferences({ [pref.key]: !user.preferences?.[pref.key] })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                user.preferences?.[pref.key] ? 'bg-gold-500' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  user.preferences?.[pref.key] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
        onSave={async (addressData) => {
          if (editingAddress) {
            await handleAddressAction('update', addressData, editingAddress.id);
          } else {
            await handleAddressAction('add', addressData);
          }
          setEditingAddress(null);
        }}
      />
    </div>
  );
}
