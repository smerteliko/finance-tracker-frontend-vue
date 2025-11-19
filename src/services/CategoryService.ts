import api from './APIService'
import type { Category, CategoryPayload } from '@/types'

export const CategoryService = {
  /** Fetches all categories (GET /categories). */
  async fetchAllCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },

  /** Creates a new category (POST /categories). */
  async createCategory(payload: CategoryPayload): Promise<Category> {
    const response = await api.post<Category>('/categories', payload)
    return response.data
  },

  /** Updates an existing category (PUT /categories/{id}). */
  async updateCategory(id: string, payload: CategoryPayload): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, payload)
    return response.data
  },

  /** Deletes a category (DELETE /categories/{id}). */
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}
