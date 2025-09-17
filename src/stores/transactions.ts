// src/stores/transactions.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

// Define data structures for type safety
interface Transaction {
  id: number
  amount: number
  type: string
  description: string
  date: string
  categoryName: string
  categoryColor: string
}

interface AnalyticsResponse {
  totalIncome: number
  totalExpense: number
  balance: number
  expensesByCategory: Record<string, number>
  incomeByCategory: Record<string, number>
  transactionCount: number
}

interface TransactionsState {
  transactions: Transaction[]
  analytics: AnalyticsResponse | null
  loading: boolean
  error: string | null
}

const API_URL = 'http://localhost:8080/api'

export const useTransactionsStore = defineStore('transactions', {
  state: (): TransactionsState => ({
    transactions: [],
    analytics: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAnalytics(startDate: string, endDate: string, t: any) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          throw new Error(t('errors.noAuthToken'))
        }
        const headers = { Authorization: `Bearer ${authStore.token}` }
        const response = await axios.post(
          `${API_URL}/analytics/`,
          { startDate, endDate },
          { headers },
        )
        this.analytics = response.data
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          this.error = t('errors.apiError', { status: error.response.status })
        } else {
          this.error = t('errors.fetchFailed')
        }
      } finally {
        this.loading = false
      }
    },

    async fetchUserTransactions(startDate: string, endDate: string, t: any) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          throw new Error(t('errors.noAuthToken'))
        }

        const headers = { Authorization: `Bearer ${authStore.token}` }
        const response = await axios.get(
          `${API_URL}/transactions/period?startDate=${startDate}&endDate=${endDate}`,
          { headers },
        )
        this.transactions = response.data
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          this.error = t('errors.apiError', { status: error.response.status })
        } else {
          this.error = t('errors.fetchFailed')
        }
      } finally {
        this.loading = false
      }
    },
  },
})
