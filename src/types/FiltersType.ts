export interface TransactionFilter {
  page: number
  size: number
  startDate?: string
  endDate?: string
  type?: 'INCOME' | 'EXPENSE'
  categoryId?: number
}

export interface DateRange {
  startDate: string
  endDate: string
}
