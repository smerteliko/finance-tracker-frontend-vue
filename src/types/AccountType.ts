// src/types/AccountType.ts (Adding payload interface)
import type { AccountTypeEnum } from './FiltersType'

export interface Account {
  id: string; // UUID
  name: string;
  type: AccountTypeEnum;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountPayload {
  name: string;
  type: AccountTypeEnum;
  initialBalance: number;
  currency?: string;
}

export interface AccountState {
  accounts: Account[]
  loading: boolean
  error: string | null
}
