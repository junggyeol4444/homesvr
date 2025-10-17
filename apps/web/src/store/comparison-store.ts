'use client';

import { create } from 'zustand';

export type ComparisonItem = {
  id: string;
  name: string;
  brand: string;
  score?: number;
};

type State = {
  items: ComparisonItem[];
  add: (item: ComparisonItem) => void;
  remove: (id: string) => void;
  reset: () => void;
};

export const useComparisonStore = create<State>((set) => ({
  items: [],
  add: (item) =>
    set((state) => ({
      items: state.items.some((existing) => existing.id === item.id)
        ? state.items
        : [...state.items, item].slice(-3)
    })),
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  reset: () => set({ items: [] })
}));
