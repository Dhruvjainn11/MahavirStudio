"use client";

import { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave } from "react-icons/fi";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/components/Toast";

const ProfileTab = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user?._id) {
        throw new Error("User ID not found");
      }

      const updates = {};
      if (formData.name !== user.name) updates.name = formData.name;
      if (formData.email !== user.email) updates.email = formData.email;
      if (formData.phone !== user.phone) updates.phone = formData.phone;

      if (Object.keys(updates).length === 0) {
        toast.info("No changes were made");
        setIsEditing(false);
        return;
      }

      const result = await updateProfile(updates);

      if (result.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Update failed");
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
    </div>
  );

   return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Profile Information</h2>
        {!isEditing ? (
          <button
            onClick={handleEditToggle}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <FiEdit2 className="text-sm sm:text-base" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleEditToggle}
              className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FiSave className="text-sm sm:text-base" />
              <span>{isSubmitting ? "Saving..." : "Save"}</span>
            </button>
          </div>
        )}
      </div>

      <form className="space-y-4 sm:space-y-6">
        {/* Name Field */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <FiUser className="text-gray-500 text-sm sm:text-base" />
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
          </div>
          {isEditing ? (
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          ) : (
            <p className="px-3 py-2 sm:px-4 sm:py-2 text-gray-900 bg-white rounded-md border border-transparent text-sm sm:text-base">
              {formData.name || <span className="text-gray-400">Not provided</span>}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <FiMail className="text-gray-500 text-sm sm:text-base" />
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
          </div>
          {isEditing ? (
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          ) : (
            <p className="px-3 py-2 sm:px-4 sm:py-2 text-gray-900 bg-white rounded-md border border-transparent text-sm sm:text-base">
              {formData.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <FiPhone className="text-gray-500 text-sm sm:text-base" />
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
          </div>
          {isEditing ? (
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter phone number"
            />
          ) : (
            <p className="px-3 py-2 sm:px-4 sm:py-2 text-gray-900 bg-white rounded-md border border-transparent text-sm sm:text-base">
              {formData.phone || <span className="text-gray-400">Not provided</span>}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;