// src/types/CategoryType.ts (Adding payload interface)
import type { TransactionTypeEnum } from './FiltersType'

export interface Category {
  id: string; // UUID
  name: string;
  color: string;
  type: TransactionTypeEnum;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  type: TransactionTypeEnum;
  color: string;
}

export interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
}
