// store/categoryStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCategoryStore = create(
  devtools(
    (set) => ({
      searchQuery: '',
      filterValue: 'all',
      sortBy: 'name', // Add sorting capability
      sortOrder: 'asc',
      
      setSearchQuery: (query) => set(
        { searchQuery: query.trim() },
        false,
        'setSearchQuery'
      ),

      setFilterValue: (value) => set(
        { filterValue: value },
        false,
        'setFilterValue'
      ),

      setSortBy: (field) => set(
        (state) => ({
          sortBy: field,
          sortOrder: state.sortBy === field ? 
            (state.sortOrder === 'asc' ? 'desc' : 'asc') : 
            'asc'
        }),
        false,
        'setSortBy'
      ),

      resetFilters: () => set(
        {
          searchQuery: '',
          filterValue: 'all',
          sortBy: 'name',
          sortOrder: 'asc'
        },
        false,
        'resetFilters'
      ),
    }),
    { name: 'CategoryStore' }
  )
);
