import { create } from 'zustand';

export const useViewStore = create((set) => ({
    elements: {},
    registerElement: (id, ref, type, content = '') => set((state) => ({
        elements: {
            ...state.elements,
            [id]: { ref, type, content }
        }
    })),
    unregisterElement: (id) => set((state) => {
        const newElements = { ...state.elements };
        delete newElements[id];
        return { elements: newElements };
    })
}));
