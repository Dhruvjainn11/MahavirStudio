'use client';

import { useUsers } from '@/app/hooks/useUsers';
import { useState } from 'react';
import {
  FaSearch, FaUserShield, FaUser, FaEye,
  FaEdit, FaBan, FaUserCheck, FaUserSlash
} from 'react-icons/fa';
import AdminLayout from '@/app/components/admin/AdminLayout';
import ProtectedRoute from '@/app/components/admin/ProtectedRoute';
import UserViewModal from '@/app/components/users/UserViewModal'; // 👈 import modal

export default function UserPage() {
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); // 👈 new
  const [isViewOpen, setIsViewOpen] = useState(false); // 👈 new

  const { users, loading, error } = useUsers({ search });

  const handleView = (userId) => {
    setSelectedUserId(userId);
    setIsViewOpen(true);
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">No users found matching your search.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 text-sm font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isAdmin ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              <FaUserShield className="mr-1" /> Admin
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              <FaUser className="mr-1 mt-1" /> User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isActive ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <FaUserCheck className="mr-2 mt-1" /> Active
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              <FaUserSlash className="mr-1 mt-1" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-10 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View"
                              onClick={() => handleView(user._id)} // 👈 view action
                            >
                              <FaEye />
                            </button>
                           
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 👇 Modal Integration */}
        <UserViewModal
          userId={selectedUserId}
          open={isViewOpen}
          onClose={() => setIsViewOpen(false)}
        />
      </AdminLayout>
    </ProtectedRoute>
  );
}
