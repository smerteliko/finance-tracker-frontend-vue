export interface Transaction {
  id: number
  uuid: string
  amount: number
  description: string
  type: 'INCOME' | 'EXPENSE'
  date: string
  createdAt: string
  updatedAt: string
  userId: number
  categoryId: number
  categoryName: string
  categoryColor: string
}

export interface AnalyticsResponse {
  totalIncome: number
  totalExpense: number
  balance: number
  expensesByCategory: Record<string, number>
  incomeByCategory: Record<string, number>
  transactionCount: number
  periodStart: Date
  periodEnd: Date
}

export interface TransactionsState {
  transactions: Transaction[]
  analytics: AnalyticsResponse | null
  transactionSummary: string | null
  loading: boolean
  error: string | null
}
