import { defineStore } from 'pinia'
import { CategoryService } from '@/services/CategoryService'
import type { CategoryState, Category, CategoryPayload } from '@/types'

export const useCategoryStore = defineStore('categories', {
  state: (): CategoryState => ({
    categories: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategories(t: any) {
      this.loading = true
      this.error = null
      try {
        this.categories = await CategoryService.fetchAllCategories()
      } catch (error: any) {
        this.error = t('errors.fetchCategoriesFailed')
        console.error('Failed to fetch categories:', error)
      } finally {
        this.loading = false
      }
    },

    async createCategory(payload: CategoryPayload, t: any) {
      try {
        const newCategory = await CategoryService.createCategory(payload)
        this.categories.push(newCategory)
      } catch (error: any) {
        this.error = t('errors.createCategoryFailed')
        throw error
      }
    },

    async deleteCategory(id: string, t: any) {
      try {
        await CategoryService.deleteCategory(id)
        this.categories = this.categories.filter(c => c.id !== id)
      } catch (error: any) {
        this.error = t('errors.deleteCategoryFailed')
        throw error
      }
    },

    async updateCategory(id: string, payload: CategoryPayload, t: any) {
      try {
        const updatedCategory = await CategoryService.updateCategory(id, payload);
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
      } catch (error: any) {
        this.error = t('errors.updateCategoryFailed');
        throw error;
      }
    }
  },
})
