import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


const useOrderStore = create(
  devtools(
    (set) => ({
      // UI State
      showModal: false,
      selectedOrder: null,
      searchTerm: '',
      statusFilter: '',
      paymentStatusFilter: '',
      currentPage: 1,
      totalPages: 1, // ✅ Add this
      
      // Actions
      setShowModal: (show) => set({ showModal: show }),
      setSelectedOrder: (order) => set({ selectedOrder: order }),
      setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
      setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }),
      setPaymentStatusFilter: (status) => set({ paymentStatusFilter: status, currentPage: 1 }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setTotalPages: (val) => set({ totalPages: val }), // ✅ Add this
      resetFilters: () => set({
        searchTerm: '',
        statusFilter: '',
        paymentStatusFilter: '',
        currentPage: 1
      })
    }),
    { name: 'order-store' }
  )
);

export default useOrderStore;