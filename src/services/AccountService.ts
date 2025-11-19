import api from './APIService'
import type { Account, AccountPayload } from '@/types'

export const AccountService = {
  /** Fetches all accounts (GET /accounts). */
  async fetchAllAccounts(): Promise<Account[]> {
    const response = await api.get<Account[]>('/accounts')
    return response.data
  },

  /** Creates a new account (POST /accounts). */
  async createAccount(payload: AccountPayload): Promise<Account> {
    const response = await api.post<Account>('/accounts', payload)
    return response.data
  },

  /** Updates an existing account (PUT /accounts/{id}). */
  async updateAccount(id: string, payload: AccountPayload): Promise<Account> {
    const response = await api.put<Account>(`/accounts/${id}`, payload)
    return response.data
  },

  /** Deletes an account (DELETE /accounts/{id}). */
  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`)
  },
}
