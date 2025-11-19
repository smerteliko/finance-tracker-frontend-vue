import api from './APIService'
import type { Transaction, PagedResponse, TransactionFilters, TransactionPayload } from '@/types'

export const TransactionService = {
  /** Fetches a paginated and filtered list of transactions (GET /transactions?params). */
  async getFilteredTransactions(filters: TransactionFilters): Promise<PagedResponse<Transaction>> {
    const response = await api.get<PagedResponse<Transaction>>('/transactions', {
      params: filters,
    })
    return response.data
  },

  /** Creates a new transaction record (POST /transactions). */
  async createTransaction(payload: TransactionPayload): Promise<Transaction> {
    const response = await api.post<Transaction>('/transactions', payload)
    return response.data
  },

  /** Updates an existing transaction record (PUT /transactions/{id}). */
  async updateTransaction(id: string, payload: TransactionPayload): Promise<Transaction> {
    const response = await api.put<Transaction>(`/transactions/${id}`, payload)
    return response.data
  },

  /** Deletes a transaction record (DELETE /transactions/{id}). */
  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`)
  },
  async exportToCsv(filters: {
    accountId: string | undefined;
    endDate: string | undefined;
    startDate: string | undefined
  }): Promise<Blob> {
    const response = await api.post('/reports/csv', filters, {
      responseType: 'blob',
    })
    return response.data
  },
}
