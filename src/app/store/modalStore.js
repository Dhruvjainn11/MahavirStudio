// store/modalStore.js
import {create} from 'zustand';

export const useModalStore = create((set) => ({
  activeModals: {},
  modalData: {},
  openModal: (id, data = null) =>
    set((state) => ({
      activeModals: { ...state.activeModals, [id]: true },
      modalData: { ...state.modalData, [id]: data },
    })),
  closeModal: (id) =>
    set((state) => {
      const updatedModals = { ...state.activeModals };
      const updatedData = { ...state.modalData };
      delete updatedModals[id];
      delete updatedData[id];
      return { activeModals: updatedModals, modalData: updatedData };
    }),
}));
