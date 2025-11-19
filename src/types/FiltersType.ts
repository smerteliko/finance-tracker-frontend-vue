export enum TransactionTypeEnum {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum AccountTypeEnum {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
}

export interface TransactionFilters {
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'date' | 'amount';
  sortOrder: 'asc' | 'desc';

  accountId?: string; // UUID
  categoryId?: string; // UUID
  type?: TransactionTypeEnum;
  startDate?: string; // ISO 8601 date string
  endDate?: string; // ISO 8601 date string
}

export interface FilterState {
  currentFilters: TransactionFilters;
}
