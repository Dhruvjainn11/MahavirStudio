'use client';

import { useEffect, useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaUser, FaUserCheck, FaUserSlash, FaTimes } from 'react-icons/fa';
import { MdOutlineShoppingCart } from 'react-icons/md';
import {useUsers} from '@/app/hooks/useUsers';

export default function UserViewModal({ userId, open, onClose }) {
  const { getUserById } = useUsers({});
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !open) return;

    setLoading(true);
    getUserById(userId)
      .then(data => setUserData(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">User Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : !userData ? (
            <div className="text-center py-10 text-red-500">Failed to load user data</div>
          ) : (
            <div className="space-y-6">
              {/* User Info Section */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-700">
                    {userData.name?.[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-semibold text-gray-800">{userData.name}</h3>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-gray-400" />
                      <span>{userData.email}</span>
                    </div>
                    
                    {userData.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhoneAlt className="text-gray-400" />
                        <span>{userData.phone}</span>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        userData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {userData.isActive ? <FaUserCheck /> : <FaUserSlash />}
                        {userData.isActive ? 'Active Account' : 'Inactive Account'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {userData.statistics?.totalOrders ?? 0}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{userData.statistics?.totalSpent?.toFixed(2) ?? '0.00'}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{userData.statistics?.averageOrderValue?.toFixed(2) ?? '0.00'}
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MdOutlineShoppingCart className="text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                </div>
                
                {userData.recentOrders?.length > 0 ? (
                  <div className="space-y-3">
                    {userData.recentOrders.map(order => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium text-gray-800">
                              Order #{order._id.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                              order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.paymentStatus}
                            </span>
                            <span className="font-medium text-gray-800">
                              ₹{order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                    <p className="text-gray-500">No recent orders found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}