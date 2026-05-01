import { useComparisonStore } from '@/store/comparison.store';
import { MAX_COMPARISON_PRODUCTS } from '@/utils/constants';

export const useComparison = () => {
  const comparisonMode = useComparisonStore((state) => state.comparisonMode);
  const selectedProducts = useComparisonStore((state) => state.selectedProducts);
  const showComparison = useComparisonStore((state) => state.showComparison);
  const toggleComparisonMode = useComparisonStore((state) => state.toggleComparisonMode);
  const addToComparison = useComparisonStore((state) => state.addToComparison);
  const removeFromComparison = useComparisonStore((state) => state.removeFromComparison);
  const clearComparison = useComparisonStore((state) => state.clearComparison);
  const toggleShowComparison = useComparisonStore((state) => state.toggleShowComparison);

  return {
    comparisonMode,
    selectedProducts,
    showComparison,
    canAddMore: selectedProducts.length < MAX_COMPARISON_PRODUCTS,
    toggleComparisonMode,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleShowComparison,
  };
};
