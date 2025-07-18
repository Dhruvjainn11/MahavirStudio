'use client';

import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiTag, FiDroplet } from 'react-icons/fi';

const DashboardOverview = ({ overview, thisMonth }) => {
  const cards = [
    {
      label: 'Total Users',
      value: overview.totalUsers,
      icon: <FiUsers className="text-blue-500 text-xl" />,
      trend: thisMonth.userGrowth >= 0 ? 'up' : 'down',
      trendValue: Math.abs(thisMonth.userGrowth)
    },
    {
      label: 'Total Products',
      value: overview.totalProducts,
      icon: <FiPackage className="text-green-500 text-xl" />,
      trend: 'neutral'
    },
    {
      label: 'Total Orders',
      value: overview.totalOrders,
      icon: <FiShoppingCart className="text-purple-500 text-xl" />,
      trend: thisMonth.orderGrowth >= 0 ? 'up' : 'down',
      trendValue: Math.abs(thisMonth.orderGrowth)
    },
    {
      label: 'Total Revenue',
      value: `₹${overview.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign className="text-yellow-500 text-xl" />,
      trend: thisMonth.revenueGrowth >= 0 ? 'up' : 'down',
      trendValue: Math.abs(thisMonth.revenueGrowth)
    },
    {
      label: 'Categories',
      value: overview.totalCategories,
      icon: <FiTag className="text-pink-500 text-xl" />,
      trend: 'neutral'
    },
    {
      label: 'Paints',
      value: overview.totalPaints,
      icon: <FiDroplet className="text-orange-500 text-xl" />,
      trend: 'neutral'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
              <p className="text-xl font-semibold mt-1">{card.value}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              {card.icon}
            </div>
          </div>
          
          {card.trend !== 'neutral' && (
            <div className="mt-3 flex items-center text-xs">
              <span className={`inline-flex items-center ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {card.trend === 'up' ? (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {card.trendValue}%
              </span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardOverview;