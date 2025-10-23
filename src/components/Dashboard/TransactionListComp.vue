<template>
  <div class="transaction-section">
    <div class="section-header">
      <h2>
        {{ t('transactions.title') }}
        <span class="date-range" v-if="currentFilter.startDate">
          ({{ formatDateRange(currentFilter.startDate, currentFilter.endDate) }})
        </span>
      </h2>

      <div class="header-actions">
        <button @click="exportToCsv" class="export-btn" :disabled="loading">
          📥 {{ t('transactions.exportCsv') }}
        </button>
      </div>
    </div>

    <TransactionFilters @filter-change="onFilterChange" />

    <div class="transactions-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        {{ t('general.loading') }}
      </div>

      <div v-else-if="transactions.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>{{ t('transactions.noTransactions') }}</h3>
        <p>{{ t('transactions.adjustFilters') }}</p>
      </div>

      <div v-else>
        <div class="transactions-list">
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="transaction-item"
            @click="showTransactionDetails(transaction)"
          >
            <div class="transaction-main">
              <div class="transaction-info">
                <span class="description">{{
                  transaction.description || t('transactions.noDescription')
                }}</span>
                <span class="category" :style="{ color: transaction.categoryColor }">
                  {{ transaction.categoryName }}
                </span>
              </div>
              <div class="transaction-amount" :class="transaction.type.toLowerCase()">
                {{ formatAmount(transaction.amount, transaction.type) }}
              </div>
            </div>
            <div class="transaction-meta">
              <span class="transaction-date">
                {{ formatDate(transaction.date) }}
              </span>
              <span class="transaction-type" :class="transaction.type.toLowerCase()">
                {{ t(`transactions.${transaction.type.toLowerCase()}`) }}
              </span>
            </div>
          </div>
        </div>

        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="onPageChange"
        />

        <div class="pagination-info">
          {{ t('transactions.showing', { count: transactions.length, total: totalElements }) }}
        </div>
      </div>
    </div>
    <TransactionDetailsModal ref="detailsModal" @transaction-deleted="handleTransactionDeleted" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Transaction, TransactionFilter, PagedResponse } from '@/types'
import { transactionService } from '@/services/TransactionService'
import TransactionFilters from './TransactionFiltersComp.vue'
import Pagination from './PaginationComp.vue'
import TransactionDetailsModal from '@/components/Modals/TransactionDetailsModal.vue'

const { t } = useI18n()

const transactions = ref<Transaction[]>([])
const loading = ref(false)
const currentPage = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)
const currentFilter = ref<TransactionFilter>({
  page: 0,
  size: 10,
})

const loadTransactions = async (filter: TransactionFilter) => {
  loading.value = true
  try {
    const response: PagedResponse<Transaction> =
      await transactionService.getFilteredTransactions(filter)

    transactions.value = response.content
    currentPage.value = response.currentPage
    totalPages.value = response.totalPages
    totalElements.value = response.totalElements
    currentFilter.value = filter
  } catch (error) {
    console.error('Error loading transactions:', error)
    alert(t('errors.loadTransactionsFailed'))
  } finally {
    loading.value = false
  }
}

const onFilterChange = (filter: TransactionFilter) => {
  loadTransactions(filter)
}

const onPageChange = (page: number) => {
  const filter = { ...currentFilter.value, page }
  loadTransactions(filter)
}

const detailsModal = ref<InstanceType<typeof TransactionDetailsModal> | null>(null)

const showTransactionDetails = (transaction: Transaction) => {
  if (detailsModal.value) {
    detailsModal.value.show(transaction)
  }
}

const handleTransactionDeleted = (transactionId: number) => {
  // Remove the deleted transaction from the list
  transactions.value = transactions.value.filter((t) => t.id !== transactionId)
  totalElements.value -= 1

  // Reload transactions if the current page becomes empty
  if (transactions.value.length === 0 && currentPage.value > 0) {
    onPageChange(currentPage.value - 1)
  }
}

const exportToCsv = async () => {
  try {
    const blob = await transactionService.exportToCsv(currentFilter.value)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url

    const dateRange = currentFilter.value.startDate
      ? formatDateRange(currentFilter.value.startDate, currentFilter.value.endDate)
      : 'all'

    a.download = `transactions-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error exporting CSV:', error)
    alert(t('errors.exportFailed'))
  }
}

const formatAmount = (amount: number, type: string) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount))

  return type === 'INCOME' ? `+${formatted}` : `-${formatted}`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDateRange = (startDate: string, endDate?: string) => {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  } else {
    return `${start.toLocaleDateString(undefined, { month: 'short' })} - ${end.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
  }
}

onMounted(() => {
  loadTransactions(currentFilter.value)
})
</script>

<style scoped>
.transaction-section {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-range {
  font-size: 1rem;
  color: #6b7280;
  font-weight: normal;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.export-btn {
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-btn:hover:not(:disabled) {
  background: #059669;
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.transactions-container {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.transactions-list {
  max-height: 600px;
  overflow-y: auto;
}

.transaction-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
  cursor: pointer;
}

.transaction-item:hover {
  background: #f9fafb;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-main {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.description {
  font-weight: 500;
  color: #1f2937;
  font-size: 1rem;
}

.category {
  font-size: 0.875rem;
  font-weight: 500;
}

.transaction-amount {
  font-weight: 600;
  font-size: 1.125rem;
  margin-left: 1rem;
}

.transaction-amount.income {
  color: #10b981;
}

.transaction-amount.expense {
  color: #ef4444;
}

.transaction-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.transaction-type {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.transaction-type.income {
  background: #dcfce7;
  color: #166534;
}

.transaction-type.expense {
  background: #fee2e2;
  color: #991b1b;
}

.loading {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 1.25rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

.pagination-info {
  text-align: center;
  padding: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
}

@media (max-width: 768px) {
  .transaction-section {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .transaction-main {
    flex-direction: column;
    gap: 0.5rem;
  }

  .transaction-amount {
    margin-left: 0;
    align-self: flex-end;
  }
}
</style>
