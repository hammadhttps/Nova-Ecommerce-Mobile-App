import { useComparisonStore } from '@/store/comparison.store';

export const useComparison = () => {
  const {
    comparisonMode,
    selectedProducts,
    showComparison,
    toggleComparisonMode,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleShowComparison,
  } = useComparisonStore();

  return {
    comparisonMode,
    selectedProducts,
    showComparison,
    canAddMore: selectedProducts.length < 3,
    toggleComparisonMode,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleShowComparison,
  };
};
