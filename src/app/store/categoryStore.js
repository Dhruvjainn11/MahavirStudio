// store/categoryStore.js
import {create} from 'zustand';

export const useCategoryStore = create((set) => ({
  searchQuery: '',
  filterValue: 'all',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterValue: (value) => set({ filterValue: value }),
}));
