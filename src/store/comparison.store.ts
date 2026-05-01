import { create } from 'zustand';
import { Product } from '@/types';
import { MAX_COMPARISON_PRODUCTS } from '@/utils/constants';

interface ComparisonState {
  comparisonMode: boolean;
  selectedProducts: Product[];
  showComparison: boolean;

  toggleComparisonMode: () => void;
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: number) => void;
  clearComparison: () => void;
  toggleShowComparison: () => void;
}

export const useComparisonStore = create<ComparisonState>((set) => ({
  comparisonMode: false,
  selectedProducts: [],
  showComparison: false,

  toggleComparisonMode: () =>
    set((state) => ({
      comparisonMode: !state.comparisonMode,
      selectedProducts: [],
    })),

  addToComparison: (product: Product) =>
    set((state) => {
      if (state.selectedProducts.length >= MAX_COMPARISON_PRODUCTS) {
        return state;
      }
      if (state.selectedProducts.find((p) => p.id === product.id)) {
        return state;
      }
      return { selectedProducts: [...state.selectedProducts, product] };
    }),

  removeFromComparison: (productId: number) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.filter((p) => p.id !== productId),
    })),

  clearComparison: () => set({ selectedProducts: [] }),

  toggleShowComparison: () =>
    set((state) => ({ showComparison: !state.showComparison })),
}));
