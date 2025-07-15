'use client';

import { FaUsers, FaBox, FaShoppingCart, FaRupeeSign, FaTags, FaFillDrip } from 'react-icons/fa';

const DashboardOverview = ({ overview, thisMonth }) => {
  const cards = [
    {
      label: 'Total Users',
      value: overview.totalUsers,
      icon: <FaUsers className="text-blue-500 text-2xl" />
    },
    {
      label: 'Total Products',
      value: overview.totalProducts,
      icon: <FaBox className="text-green-500 text-2xl" />
    },
    {
      label: 'Total Orders',
      value: overview.totalOrders,
      icon: <FaShoppingCart className="text-purple-500 text-2xl" />
    },
    {
      label: 'Total Revenue',
      value: `₹${overview.totalRevenue.toLocaleString()}`,
      icon: <FaRupeeSign className="text-yellow-500 text-2xl" />
    },
    {
      label: 'Categories',
      value: overview.totalCategories,
      icon: <FaTags className="text-pink-500 text-2xl" />
    },
    {
      label: 'Paints',
      value: overview.totalPaints,
      icon: <FaFillDrip className="text-orange-500 text-2xl" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-xl font-semibold">{card.value}</p>
          </div>
          <div>{card.icon}</div>
        </div>
      ))}

      {/* This month growth metrics */}
      <div className="bg-white rounded-lg shadow-md p-4 col-span-1 sm:col-span-2 lg:col-span-3">
        <div className="flex flex-wrap gap-6 justify-between">
          <div>
            <p className="text-gray-500 text-sm">New Users (30d)</p>
            <p className="text-lg font-medium">
              {thisMonth.newUsers} 
              <span className="text-green-600 text-sm ml-2">+{thisMonth.userGrowth}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">New Orders (30d)</p>
            <p className="text-lg font-medium">
              {thisMonth.newOrders} 
              <span className="text-green-600 text-sm ml-2">+{thisMonth.orderGrowth}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Revenue (30d)</p>
            <p className="text-lg font-medium text-blue-600">
              ₹{thisMonth.revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
