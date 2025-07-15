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
import CategoryModal from "@/app/components/categories/CategoryModal.jsx"; // Adjust path
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

  // Actual filters used in fetch
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  // Controlled input values
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingType, setPendingType] = useState("");

  const [expanded, setExpanded] = useState({});

  const { data, isLoading, refetch } = useCategories({
    page,
    limit: 10,
    search,
    type,
  });

  console.log("🧪 Categories Data:", data);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = () => {
    setSearch(pendingSearch);
    setType(pendingType);
    setPage(1); // Reset to page 1
  };

  const handleClear = () => {
    setPendingSearch("");
    setPendingType("");
    setSearch("");
    setType("");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Manage Categories</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
            placeholder="Search category..."
            className="w-full sm:w-64 px-4 py-2 border rounded-md border-gray-300 outline-none focus:ring focus:ring-blue-500"
          />

          <select
            value={pendingType}
            onChange={(e) => setPendingType(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 border rounded-md border-gray-300 outline-none focus:ring focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="hardware">Hardware</option>
            <option value="paint">Paint</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Clear
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FaPlus />
            Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                #
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
             
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.categories?.map((cat, index) => (
              <React.Fragment key={cat._id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {index + 1 + (page - 1) * 10}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-500">
                    {cat.type}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        cat.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                 
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setConfirmOpen(true);
                          setSelectedCategory(cat);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded border border-red-200"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>

                {expanded[cat._id] &&
                  cat.subcategories?.map((sub) => (
                    <tr key={sub._id} className="bg-gray-50 text-sm">
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3 pl-10 flex items-center gap-1 text-gray-700">
                        <span className="text-gray-400">↳</span> {sub.name}
                      </td>
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            sub.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sub.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200">
                            <FaEdit size={14} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded border border-red-200">
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

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-600">
          Page {data?.pagination?.currentPage} of {data?.pagination?.totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded-md bg-white text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page === data?.pagination?.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded-md bg-white text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        initialData={selectedCategory} // ← new
        refetch={refetch}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category?"
        description={`This will permanently delete "${selectedCategory?.name}"`}
        confirmText="Delete"
      />
    </div>
  );
};

export default CategoryTable;
