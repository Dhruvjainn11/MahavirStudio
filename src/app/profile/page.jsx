"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMapPin, FiPackage } from "react-icons/fi";

import { useAuth } from "@/app/context/authContext";
import ProfileTab from "@/app/components/profile/ProfileTab";
import AddressTab from "@/app/components/profile/AddressTab";
import OrdersTab from "@/app/components/profile/OrdersTab";

const tabsList = [
  { key: "profile", icon: <FiUser />, label: "Profile" },
  { key: "address", icon: <FiMapPin />, label: "Addresses" },
  { key: "orders", icon: <FiPackage />, label: "Orders" },
];

const ProfilePage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("profile");

  if (!user) return <p className="text-center py-8">Loading profile...</p>;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-5  py-12">
        <h1 className="text-3xl font-semibold">My Account</h1>
        <p className="text-gray-500">Manage your profile, orders and address</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-6  relative bottom-12">
        {tabsList.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              tab === item.key
                ? "bg-gold-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bottom-15"
      >
        {tab === "profile" && <ProfileTab />}
        {tab === "address" && <AddressTab />}
        {tab === "orders" && <OrdersTab />}
      </motion.div>
    </section>
  );
};

export default ProfilePage;
