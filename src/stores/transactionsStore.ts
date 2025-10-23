// src/stores/transactions.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './authStore.ts'
import type { TransactionsState } from '@/types'

export const useTransactionsStore = defineStore('transactions', {
  state: (): TransactionsState => ({
    transactions: [],
    transactionSummary: '',
    analytics: null,
    loading: false,
    error: null,
  }),
  getters: {
    recentTransactions: (state) => state.transactions.slice(0, 5),
    totalIncome: (state) => state.analytics?.totalIncome || 0,
    totalExpense: (state) => state.analytics?.totalExpense || 0,
    balance: (state) => state.analytics?.balance || 0,
  },
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
          `${import.meta.env.VITE_API_URL}/reports/summary`,
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
    handleError(error: any, t: any, customMessageKey?: string) {
      if (error.response?.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
      } else if (customMessageKey) {
        this.error = t(customMessageKey)
      } else {
        this.error = t('errors.fetchFailed')
      }
    },

    clearError() {
      this.error = null
    },
  },
})
