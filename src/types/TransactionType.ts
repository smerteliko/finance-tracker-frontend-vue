// src/types/TransactionType.ts (Adding payload interface)
import type { Category } from './CategoryType'
import type { Account } from './AccountType'
import type { TransactionTypeEnum } from './FiltersType'

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionTypeEnum;
  date: string; // Transaction date
  createdAt: string;
  updatedAt: string;

  accountId: string;
  notes: string | null;

  category: Category;
  account: Account;
}

export interface TransactionPayload {
  amount: number;
  description: string;
  date: string;
  type: TransactionTypeEnum;
  categoryId: string;
  accountId: string;
  notes: string | null;
}

export interface AnalyticsResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  periodStart: string;
  periodEnd: string;
  incomeByCategory: any[];
  expensesByCategory: any[];
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface TransactionsState {
  transactions: Transaction[]
  transactionSummary: string
  analytics: AnalyticsResponse | null
  paginationMetadata: PaginationMetadata | null;
  loading: boolean
  error: null
}
