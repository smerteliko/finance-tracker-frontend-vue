export interface Category {
  id: number
  uuid: string
  name: string
  color: string
  type: 'INCOME' | 'EXPENSE'
  createdAt: string
  updatedAt: string
}

export interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
}
