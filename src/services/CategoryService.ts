import api from './APIService.ts'
import type { Category } from '@/types'

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const response = await api.get('/categories')
    return response.data
  },

  async getCategoriesByType(type: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
    const response = await api.get(`/categories/type/${type}`)
    return response.data
  },
}
