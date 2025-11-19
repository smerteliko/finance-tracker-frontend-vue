// src/types/APIType.ts

export interface PagedResponse<T> {
  items: T[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
}
