import api from './APIService.ts'
import type { Transaction, TransactionFilter, PagedResponse } from '@/types'

export const transactionService = {
  async getFilteredTransactions(filter: TransactionFilter): Promise<PagedResponse<Transaction>> {
    const response = await api.post('/transactions/filter', filter)
    return response.data
  },

  async exportToCsv(filter: TransactionFilter): Promise<Blob> {
    const response = await api.post('/reports/csv', filter, {
      responseType: 'blob',
    })
    return response.data
  },

  async getAllTransactions(): Promise<Transaction[]> {
    const response = await api.get('/transactions')
    return response.data
  },

  async createTransaction(
    transaction: Omit<
      Transaction,
      'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'userId' | 'categoryName' | 'categoryColor'
    >,
  ): Promise<Transaction> {
    const response = await api.post('/transactions', transaction)
    return response.data
  },

  async updateTransaction(id: number, transaction: any): Promise<Transaction> {
    const response = await api.put(`/transactions/${id}`, transaction)
    return response.data
  },

  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`)
  },

  async getTransactionsByPeriod(startDate: string, endDate: string): Promise<Transaction[]> {
    const response = await api.get(`/transactions/period?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  },
}
