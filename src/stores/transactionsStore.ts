import { defineStore } from 'pinia'
import { TransactionService } from '@/services/TransactionService'
import { AnalyticsService } from '@/services/AnalyticsService'
import type { TransactionsState, TransactionFilters,TransactionPayload } from '@/types'
import {useAuthStore} from "@/stores/authStore.ts";

const getDefaultAnalyticsPeriod = () => {
  // Default to the last 30 days if no filter range is set.
  const endDate = new Date().toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const startDate = thirtyDaysAgo.toISOString();
  return { startDate, endDate };
};

export const useTransactionsStore = defineStore('transactions', {
  state: (): TransactionsState => ({
    transactions: [],
    transactionSummary: '',
    analytics: null,
    paginationMetadata: null,
    loading: false,
    error: null,
  }),
  getters: {
    // Safely access analytics data for Balance Cards
    totalIncome: (state) => state.analytics?.totalIncome || 0,
    totalExpense: (state) => state.analytics?.totalExpense || 0,
    balance: (state) => state.analytics?.balance || 0,
  },

  actions: {
    async fetchAnalytics(startDate: string, endDate: string, t: any) {
      this.loading = true
      this.error = null
      try {
        const validStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const validEndDate = endDate || new Date().toISOString();
        this.analytics = await AnalyticsService.fetchAnalytics(validStartDate, validEndDate);

      } catch (error: any) {
        // Assuming fetchAnalyticsFailed i18n key exists
        this.handleError(error, t, 'errors.fetchAnalyticsFailed');
      } finally {
        this.loading = false
      }
    },


    async fetchSummary(startDate: string, endDate: string, t: any) {
      this.loading = true
      this.error = null
      try {
        this.transactionSummary = await AnalyticsService.fetchSummary(startDate, endDate);
      } catch (error: any) {
        this.handleError(error, t, 'errors.fetchSummaryFailed');
      } finally {
        this.loading = false;
      }
    },
    async fetchAnalyticsAndSummary(filters: TransactionFilters, t: any) {
      this.loading = true
      this.error = null
      try {
        const dates = (filters.startDate && filters.endDate) ? filters : getDefaultAnalyticsPeriod();
        const [analyticsResponse, summaryText] = await Promise.all([
          AnalyticsService.fetchAnalytics(dates.startDate, dates.endDate),
          AnalyticsService.fetchSummary(dates.startDate, dates.endDate),
        ]);

        this.analytics = analyticsResponse;
        this.transactionSummary = summaryText;

      } catch (error: any) {
        this.handleError(error, t, 'errors.fetchAnalyticsFailed');
      } finally {
        this.loading = false;
      }
    },


    async fetchTransactions(filters: TransactionFilters, t: any) {
      this.loading = true
      this.error = null
      try {
        const pagedResponse = await TransactionService.getFilteredTransactions(filters);
        this.transactions = pagedResponse.items;
        this.paginationMetadata = {
          page: pagedResponse.page,
          limit: pagedResponse.limit,
          totalItems: pagedResponse.totalItems,
          totalPages: pagedResponse.totalPages,
        };
      } catch (error: any) {
        this.handleError(error, t);
      } finally {
        this.loading = false;
      }
    },


    /** Creates a new transaction (POST /transactions). */
    async createTransaction(transactionData: any, t: any) {
      this.loading = true
      this.error = null
      try {
        const payload: TransactionPayload = {
          amount: transactionData.amount,
          description: transactionData.description,
          date: new Date(transactionData.date).toISOString(),
          type: transactionData.type,
          categoryId: transactionData.categoryId,
          accountId: transactionData.accountId,
          notes: transactionData.notes || null,
        };

        const newTransaction = await TransactionService.createTransaction(payload);

        // Trigger data refresh after success
        await this.triggerDashboardRefresh(t);

      } catch (error: any) {
        this.handleError(error, t, 'errors.createTransactionFailed');
        throw error;
      } finally {
        this.loading = false
      }
    },

    /** Updates an existing transaction (PUT /transactions/{id}). */
    async updateTransaction(id: string, transactionData: any, t: any) {
      try {
        const payload: TransactionPayload = {
          amount: transactionData.amount,
          description: transactionData.description,
          date: new Date(transactionData.date).toISOString(),
          type: transactionData.type,
          categoryId: transactionData.categoryId,
          accountId: transactionData.accountId,
          notes: transactionData.notes || null,
        };
        const updatedTransaction = await TransactionService.updateTransaction(id, payload);

        const index = this.transactions.findIndex(tx => tx.id === id);
        if (index !== -1) {
          this.transactions[index] = updatedTransaction;
        }
        await this.triggerDashboardRefresh(t);
      } catch (error: any) {
        this.handleError(error, t, 'errors.updateTransactionFailed');
        throw error;
      }
    },

    /** Deletes a transaction (DELETE /transactions/{id}). */
    async deleteTransaction(id: string, t: any) {
      try {
        await TransactionService.deleteTransaction(id);
        this.transactions = this.transactions.filter(tx => tx.id !== id);
        await this.triggerDashboardRefresh(t);
      } catch (error: any) {
        this.handleError(error, t, 'errors.deleteTransactionFailed');
        throw error;
      }
    },

    async triggerDashboardRefresh(t: any) {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      await this.fetchAnalytics(startDate, endDate, t);
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

    async downloadCsvReport(filters: TransactionFilters, t: any) {
      this.loading = true;
      this.error = null;
      try {
        const dates = (filters.startDate && filters.endDate) ? filters : getDefaultAnalyticsPeriod();
        const payload = {
          startDate: dates.startDate,
          endDate: dates.endDate,
          accountId: filters.accountId || undefined,
        }

        const blob = await TransactionService.exportToCsv(payload);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'finance_report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

      } catch (error: any) {
        this.handleError(error, t, 'errors.downloadFailed');
      } finally {
        this.loading = false;
      }
    },
  },
})
