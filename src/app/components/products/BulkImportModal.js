'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/app/components/Toast';
import { useAdmin } from '@/app/context/adminContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileCsv, FaDownload, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useCategories } from '@/app/hooks/useCategories';

const BulkImportModal = ({ isOpen, onClose, refetch }) => {
  const { getAuthHeaders } = useAdmin();
  const { success, error } = useToast();
  const { data: categoryData } = useCategories({ limit: 100 });
  const fileInputRef = useRef(null);
  
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});

  // Create category name to ID map
  useEffect(() => {
    if (categoryData?.categories) {
      const map = {};
      categoryData.categories.forEach(cat => {
        map[cat.name.toLowerCase()] = cat._id;
      });
      setCategoryMap(map);
    }
  }, [categoryData]);

  const handleCSVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    try {
      const Papa = (await import('papaparse')).default;
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // Map category names to IDs
          const mappedData = results.data
            .filter(row => Object.values(row).some(val => val))
            .map(row => {
              // If category is provided as name, try to map to ID
              if (row.category && !row.categoryId) {
                return {
                  ...row,
                  categoryId: categoryMap[row.category.toLowerCase()] || row.category
                };
              }
              return row;
            });
          
          setCsvData(mappedData);
        },
        error: (err) => {
          console.error('CSV parsing error:', err);
          error('Failed to parse CSV file');
        }
      });
    } catch (err) {
      console.error('CSV upload error:', err);
      error('CSV upload failed');
    } finally {
      setParsing(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Transform data before sending
      const productsToImport = csvData.map(product => ({
        ...product,
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0,
        isActive: product.isActive === 'false' ? false : true,
        // Handle image URL if provided
        images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : []
      }));

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/bulk-import`,
        { products: productsToImport },
        { headers: getAuthHeaders() }
      );
      success(`${productsToImport.length} products imported successfully!`);
      onClose();
      refetch?.();
    } catch (err) {
      console.error('Bulk import error:', err);
      error(err?.response?.data?.error || 'Failed to import products');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const availableCategories = categoryData?.categories?.map(c => c.name).join(' | ') || 'Category1 | Category2';
    
    const headers = [
      'name', 'description', 'price', 'stock', 'category', 
      'categoryId', 'type', 'brand', 'model', 'isActive', 'imageUrl'
    ].join(',');

    const instructions = [
      '# Use either "category" (name) or "categoryId"',
      '# Available categories: ' + availableCategories,
      '# imageUrl should be full URL to product image',
      '# type must be "hardware" or "paint"',
      '# isActive should be "true" or "false"'
    ].join('\n');

    const exampleRow = [
      'Example Product',
      'Product description',
      '99.99',
      '100',
      'Hardware', // category name
      '', // or categoryId
      'hardware',
      'Example Brand',
      'Model X',
      'true',
      'https://example.com/product.jpg'
    ].join(',');

    const csvContent = [instructions, headers, exampleRow].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setCsvData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-4xl p-0 shadow-xl overflow-y-auto max-h-[90vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Bulk Import Products
                </h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Upload CSV File</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 transition-colors hover:border-blue-400 text-center">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleCSVUpload}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm flex items-center gap-2 mx-auto"
                          disabled={parsing}
                        >
                          <FaFileCsv size={16} />
                          {parsing ? 'Processing...' : 'Select CSV File'}
                        </button>
                        <p className="mt-3 text-sm text-gray-500">
                          {csvData.length > 0 
                            ? `${csvData.length} products ready to import`
                            : 'CSV should match our template format'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={downloadTemplate}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm flex items-center gap-2 flex-1"
                      >
                        <FaDownload size={14} />
                        Download Template
                      </button>
                      {csvData.length > 0 && (
                        <button
                          onClick={resetForm}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm flex-1"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Available Categories</h3>
                    <div className="bg-blue-50 p-4 rounded-lg max-h-60 overflow-auto">
                      {categoryData?.categories?.length > 0 ? (
                        <ul className="space-y-2">
                          {categoryData.categories.map(category => (
                            <li key={category._id} className="text-sm">
                              <span className="font-medium">{category.name}</span>
                              <span className="text-xs text-gray-500 ml-2">ID: {category._id}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">Loading categories...</p>
                      )}
                    </div>
                  </div>
                </div>

                {csvData.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">CSV Preview ({csvData.length} products)</h3>
                      <div className="flex items-center text-sm text-blue-600">
                        <FaInfoCircle className="mr-1" />
                        First 10 rows shown
                      </div>
                    </div>
                    <div className="max-h-96 overflow-auto border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {csvData[0] && Object.keys(csvData[0]).map((key) => (
                              <th 
                                key={key} 
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {csvData.slice(0, 10).map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              {Object.entries(row).map(([key, value]) => (
                                <td 
                                  key={key} 
                                  className="px-3 py-2 text-sm text-gray-500 max-w-xs truncate"
                                  title={String(value)}
                                >
                                  {key === 'imageUrl' && value ? (
                                    <a 
                                      href={value} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View Image
                                    </a>
                                  ) : (
                                    String(value)
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  disabled={loading || csvData.length === 0}
                  onClick={handleBulkSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Importing...
                    </span>
                  ) : `Import ${csvData.length} Products`}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkImportModal;