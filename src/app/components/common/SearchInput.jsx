'use client';

import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SearchInput({ defaultValue = '', onSearch, placeholder = 'Search...', debounceMs = 300 }) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
      setIsTyping(false);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(inputValue.trim());
    }, 500); // ⏱️ 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(true);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsTyping(false);
    onSearch('');
  };

  // Debounce function implementation
  function debounce(func, wait) {
    let timeout;
    const debounced = (...args) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
    debounced.cancel = () => {
      clearTimeout(timeout);
    };
    return debounced;
  }
  return (
    <div className="relative w-full ">
      <MagnifyingGlassIcon 
        className={`absolute left-3 top-5 transform -translate-y-1/2 h-5 w-5 transition-colors ${isTyping ? 'text-blue-500' : 'text-gray-400'}`} 
      />
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          title="Clear search"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
      {isTyping && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-xs">
          Searching...
        </div>
      )}
    </div>
  );
}
