import { defineStore } from 'pinia'
import { AccountService } from '@/services/AccountService'
import type { AccountState, Account, AccountPayload } from '@/types'

export const useAccountStore = defineStore('accounts', {
  state: (): AccountState => ({
    accounts: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAccounts(t: any) {
      this.loading = true
      this.error = null
      try {
        this.accounts = await AccountService.fetchAllAccounts()
      } catch (error: any) {
        this.error = t('errors.fetchAccountsFailed')
        console.error('Failed to fetch accounts:', error)
      } finally {
        this.loading = false
      }
    },

    async createAccount(payload: AccountPayload, t: any) {
      try {
        const newAccount = await AccountService.createAccount(payload)
        this.accounts.push(newAccount)
      } catch (error: any) {
        this.error = t('errors.createAccountFailed')
        throw error
      }
    },

    async deleteAccount(id: string, t: any) {
      try {
        await AccountService.deleteAccount(id)
        this.accounts = this.accounts.filter(a => a.id !== id)
      } catch (error: any) {
        this.error = t('errors.deleteAccountFailed')
        throw error
      }
    },

    async updateAccount(id: string, payload: AccountPayload, t: any) {
      try {
        const updatedAccount = await AccountService.updateAccount(id, payload);
        const index = this.accounts.findIndex(a => a.id === id);
        if (index !== -1) {
          this.accounts[index] = updatedAccount;
        }
      } catch (error: any) {
        this.error = t('errors.updateAccountFailed');
        throw error;
      }
    }
  },
})
