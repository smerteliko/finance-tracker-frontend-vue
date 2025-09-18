// src/stores/transactions.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './authStore.ts'

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
  periodStart: Date
  periodEnd: Date
}

interface TransactionsState {
  transactions: Transaction[]
  analytics: AnalyticsResponse | null
  transactionSummary: string | null
  loading: boolean
  error: string | null
}

const API_URL = 'http://localhost:8080/api'

export const useTransactionsStore = defineStore('transactions', {
  state: (): TransactionsState => ({
    transactions: [],
    transactionSummary: '',
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
          `${import.meta.env.VITE_API_URL}/analytics/`,
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
          `${import.meta.env.VITE_API_URL}/transactions/period?startDate=${startDate}&endDate=${endDate}`,
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
    async createTransaction(transactionData: any, t: any) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const headers = { Authorization: `Bearer ${authStore.token}` }
        const userId = authStore.user?.userId
        if (!userId) throw new Error(t('errors.userNotFound'))

        await axios.post(
          `${import.meta.env.VITE_API_URL}/transactions`,
          { ...transactionData, userId },
          { headers },
        )
        // After successful creation, refresh the dashboard data
        const endDate = new Date().toISOString()
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        await this.fetchAnalytics(startDate, endDate, t)
        await this.fetchUserTransactions(startDate, endDate, t)
      } catch (error: any) {
        this.error = t('errors.createTransactionFailed')
      } finally {
        this.loading = false
      }
    },
    async fetchSummary(startDate: string, endDate: string, t: any) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          throw new Error(t('errors.noAuthToken'))
        }

        const headers = { Authorization: `Bearer ${authStore.token}` }
        const response = await axios.post(
          `${API_URL}/reports/summary`,
          { startDate, endDate },
          { headers },
        )
        this.transactionSummary = response.data
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
