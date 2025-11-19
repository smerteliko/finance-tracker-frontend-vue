import { defineStore } from 'pinia'
import type { FilterState, TransactionFilters } from '@/types'

const getDefaultFilters = (): TransactionFilters => ({
  page: 1,
  limit: 10,
  sortBy: 'date',
  sortOrder: 'desc',
})

export const useFilterStore = defineStore('filters', {
  state: (): FilterState => ({
    currentFilters: getDefaultFilters(),
  }),

  actions: {
    setFilters(newFilters: Partial<TransactionFilters>) {
      // Check if non-pagination filters changed to reset the page
      const shouldResetPage = Object.keys(newFilters).some(key =>
        key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder'
      );

      this.currentFilters = {
        ...this.currentFilters,
        ...newFilters,
        ...(shouldResetPage && { page: 1 }),
      };
    },

    /** Updates only the pagination parameters. */
    setPagination(page: number, limit?: number) {
      this.currentFilters.page = page;
      if (limit !== undefined) {
        this.currentFilters.limit = limit;
      }
    },

    /** Resets all filters to their default state. */
    resetFilters() {
      this.currentFilters = getDefaultFilters();
    }
  },
});
