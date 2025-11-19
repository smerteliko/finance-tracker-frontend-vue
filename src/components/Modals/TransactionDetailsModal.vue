<template>
  <div
    class="modal fade"
    id="transactionDetailsModal"
    tabindex="-1"
    aria-labelledby="transactionDetailsModalLabel"
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header" :class="headerClass">
          <h5 class="modal-title" id="transactionDetailsModalLabel">
            {{ t('transactionDetails.title') }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

          <div v-else-if="transaction" class="transaction-details">
            <div class="text-center mb-4">
              <div class="amount-display" :class="transaction.type.toLowerCase()">
                {{ formatAmount(transaction.amount, transaction.type) }}
              </div>
              <span class="badge" :class="typeBadgeClass">
                {{ t(`transactions.${transaction.type.toLowerCase()}`) }}
              </span>
            </div>

            <div class="detail-item">
              <label class="detail-label">{{ t('transactionDetails.account') }}:</label>
              <p class="detail-value">{{ transaction.account?.name }} ({{ transaction.account?.currency }})</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">{{ t('transactionDetails.description') }}:</label>
              <p class="detail-value">
                {{ transaction.description || t('transactionDetails.noDescription') }}
              </p>
            </div>

            <div class="detail-item">
              <label class="detail-label">{{ t('transactionDetails.category') }}:</label>
              <div class="detail-value">
                <span
                  class="category-badge"
                  :style="{
                    backgroundColor: transaction.category?.color,
                    color: getContrastColor(transaction.category?.color || '#ffffff'),
                  }"
                >
                  {{ transaction.category?.name }}
                </span>
              </div>
            </div>

            <div class="detail-item" v-if="transaction.notes">
              <label class="detail-label">{{ t('transactionDetails.notes') }}:</label>
              <p class="detail-value">{{ transaction.notes }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">{{ t('transactionDetails.date') }}:</label>
              <p class="detail-value">{{ formatDetailedDate(transaction.date) }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">{{ t('transactionDetails.transactionId') }}:</label>
              <p class="detail-value text-muted small">{{ transaction.id }}</p>
            </div>

            <div class="detail-actions mt-4 pt-3 border-top">
              <button
                class="btn btn-outline-primary me-2"
                @click="editTransaction"
                :disabled="loading"
              >
                <i class="bi bi-pencil-square me-1"></i>
                {{ t('general.edit') }}
              </button>
              <button class="btn btn-outline-danger" @click="deleteTransaction" :disabled="loading">
                <i class="bi bi-trash me-1"></i>
                {{ t('general.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Modal } from 'bootstrap'
import type { Transaction } from '@/types'
import { useTransactionsStore } from '@/stores/transactionsStore' // Use Store for actions

const { t } = useI18n()
const transactionsStore = useTransactionsStore()

const modalElement = ref<HTMLElement | null>(null)
let bootstrapModal: Modal | null = null

const transaction = ref<Transaction | null>(null)
const loading = ref(false)
const error = ref('')

const headerClass = computed(() => ({
  'bg-success text-white': transaction.value?.type === 'INCOME',
  'bg-danger text-white': transaction.value?.type === 'EXPENSE',
}))

const typeBadgeClass = computed(() => ({
  'bg-success': transaction.value?.type === 'INCOME',
  'bg-danger': transaction.value?.type === 'EXPENSE',
}))


const show = (transactionData: Transaction) => {
  transaction.value = transactionData
  error.value = ''

  nextTick(() => {
    if (bootstrapModal) {
      bootstrapModal.show()
    }
  })
}

const hide = () => {
  if (bootstrapModal) {
    bootstrapModal.hide()
  }
}

const formatAmount = (amount: number, type: string) => {
  const currencyCode = transaction.value?.account?.currency || 'USD';
  const formatted = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
  }).format(Math.abs(amount))

  return type === 'INCOME' ? `+${formatted}` : `-${formatted}`
}

const formatDetailedDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getContrastColor = (hexColor: string | undefined) => {
  if (!hexColor || hexColor.length !== 7) return '#FFFFFF';
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#FFFFFF'
}

const editTransaction = () => {
  hide()
  // CRITICAL: Emit event to parent (DashboardView) to open the TransactionFormModal for editing.
  if (transaction.value) {
    emit('editRequested', transaction.value.id)
  }
}

const deleteTransaction = async () => {
  if (!transaction.value || !confirm(t('transactionDetails.confirmDelete'))) {
    return
  }

  loading.value = true
  const txId = transaction.value.id; // Store ID before clearing
  try {
    await transactionsStore.deleteTransaction(txId, t)

    hide()

    // Emit event to parent to refresh the list
    emit('transactionDeleted', txId)
  } catch (err) {
    console.error('Error deleting transaction:', err)
    error.value = t('errors.deleteTransactionFailed')
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  (e: 'transactionDeleted', id: string): void; // ID is now string
  (e: 'editRequested', id: string): void; // New event for edit
}>()

defineExpose({
  show,
  hide, // <- НОВЫЙ МЕТОД
})

onMounted(() => {
  if (modalElement.value) {
    // Явно указываем параметры, чтобы предотвратить ошибки "reading backdrop"
    bootstrapModal = new Modal(modalElement.value, {
      backdrop: true,
      keyboard: true
    })
  }
})
</script>

<style scoped>
.amount-display {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.amount-display.income {
  color: #10b981;
}

.amount-display.expense {
  color: #ef4444;
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.detail-value {
  margin: 0;
  color: #1f2937;
}

.category-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.detail-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

@media (max-width: 576px) {
  .detail-actions {
    flex-direction: column;
  }

  .amount-display {
    font-size: 1.5rem;
  }
}
</style>
