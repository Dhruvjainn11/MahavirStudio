import { create } from 'zustand';

export const useProductStore = create((set) => ({
  searchQuery: '',
  typeFilter: '',
  categoryFilter: '',
  currentPage: 1,

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setTypeFilter: (type) => set({ typeFilter: type, currentPage: 1 }),
  setCategoryFilter: (id) => set({ categoryFilter: id, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
