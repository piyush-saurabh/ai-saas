// Global state control for opening and closing modal from anywhere

import { create } from "zustand";

// Interface for our modal
interface useProModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useProModal = create<useProModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true}),
    onClose: () => set({ isOpen: false}),
}));

