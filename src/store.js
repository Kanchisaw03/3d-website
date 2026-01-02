import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useStore = create(subscribeWithSelector((set, get) => ({
    // USER PRESENCE
    scrollSpeed: 0,
    scrollDirection: 0,
    hoveredObject: null,

    // BEHAVIOR PROFILE
    // 0: Observer (Passive), 1: Builder (Active), 2: Decision-Maker (Committed)
    userProfile: 0,

    // SCENE STATE
    // 0: Symmetry, 1: Tension, 2: Complexity
    phase: 0,

    // RITUAL STATE
    commitmentProgress: 0, // 0 to 1
    isCommitted: false,

    // ACTIONS
    setScrollData: (speed, direction) => {
        // Determine Phase based on scroll activity / depth happens elsewhere
        // Here we just update raw data
        set({ scrollSpeed: speed, scrollDirection: direction });
    },

    setPhase: (phase) => set({ phase }),

    setHover: (objectName) => set({ hoveredObject: objectName }),

    setCommitment: (progress) => {
        set({ commitmentProgress: progress });
        if (progress >= 1 && !get().isCommitted) {
            set({ isCommitted: true });
        }
    }
})));
