'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchInput({ value, onSearch, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    </div>
  );
}
