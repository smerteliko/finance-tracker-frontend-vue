// src/stores/category.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface Category {
  id: number
  name: string
  color: string
  type: string
}

interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
}

export const useCategoryStore = defineStore('category', {
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
        const authStore = useAuthStore()
        const headers = { Authorization: `Bearer ${authStore.token}` }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, { headers })
        this.categories = response.data
      } catch (error: any) {
        this.error = t('errors.fetchCategoriesFailed')
      } finally {
        this.loading = false
      }
    },

    async createCategory(categoryData: any, t: any) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const headers = { Authorization: `Bearer ${authStore.token}` }
        await axios.post(`${import.meta.env.VITE_API_URL}/categories`, categoryData, { headers })
        await this.fetchCategories(t) // Refresh categories after adding new one
      } catch (error: any) {
        this.error = t('errors.createCategoryFailed')
      } finally {
        this.loading = false
      }
    },
  },
})
