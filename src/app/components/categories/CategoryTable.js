"use client";

import { useState } from "react";
import { useCategories } from "@/app/hooks/useCategories";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import CategoryModal from "@/app/components/categories/CategoryModal.jsx";
import { queryClient } from "@/provider/QueryProvider";
import React from "react";
import axios from "axios";
import { useAdmin } from "@/app/context/adminContext";
import { useToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/common/ConfirmModal";

const CategoryTable = () => {
  const { success } = useToast();
  const { getAuthHeaders } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingType, setPendingType] = useState("");
  const [expanded, setExpanded] = useState({});

  const { data, isLoading, refetch } = useCategories({
    page,
    limit: 10,
    search,
    type,
  });

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = () => {
    setSearch(pendingSearch);
    setType(pendingType);
    setPage(1);
  };

  const handleClear = () => {
    setPendingSearch("");
    setPendingType("");
    setSearch("");
    setType("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${selectedCategory._id}`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );
      success(res.data?.message || "Category deleted");
      refetch?.();
    } catch (err) {
      console.error("Delete error:", err);
      console.error(err?.response?.data?.error || "Failed to delete");
    } finally {
      setSelectedCategory(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
              <p className="text-gray-500 mt-1">
                Manage your product categories and subcategories
              </p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md whitespace-nowrap"
            >
              <FaPlus className="text-sm" />
              Add Category
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  id="search"
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  value={pendingType}
                  onChange={(e) => setPendingType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">All Types</option>
                  <option value="hardware">Hardware</option>
                  <option value="paint">Paint</option>
                </select>
              </div>
              
              <div className="flex items-end gap-2">
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition flex-1"
                >
                  Apply
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition flex-1"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.categories?.map((cat, index) => (
                  <React.Fragment key={cat._id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1 + (page - 1) * 10}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleExpand(cat._id)}
                            className="mr-2 text-gray-400 hover:text-gray-600"
                          >
                            {expanded[cat._id] ? (
                              <FaChevronDown size={14} />
                            ) : (
                              <FaChevronRight size={14} />
                            )}
                          </button>
                          <span className="font-medium text-gray-900">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {cat.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            cat.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md hover:shadow-sm transition"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmOpen(true);
                              setSelectedCategory(cat);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md hover:shadow-sm transition"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expanded[cat._id] &&
                      cat.subcategories?.map((sub) => (
                        <tr key={sub._id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                          <td className="px-6 py-3"></td>
                          <td className="px-6 py-3 pl-12 flex items-center gap-1 text-sm text-gray-700">
                            <span className="text-gray-400">↳</span> {sub.name}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-500 capitalize">
                            {sub.type || cat.type}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                sub.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {sub.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex gap-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md hover:shadow-sm transition">
                                <FaEdit size={14} />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-md hover:shadow-sm transition">
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {data?.categories?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you`re looking for.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                  Add New Category
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.pagination?.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">
            <div className="text-sm text-gray-600">
              Showing page {data?.pagination?.currentPage} of{" "}
              {data?.pagination?.totalPages} • Total{" "}
              {data?.pagination?.totalItems} items
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                disabled={page === data?.pagination?.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  page === data?.pagination?.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        initialData={selectedCategory}
        refetch={refetch}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category?"
        description={`This will permanently delete "${selectedCategory?.name}" and all its subcategories.`}
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
};

export default CategoryTable;