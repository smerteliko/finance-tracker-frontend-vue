<template>
  <div
    class="modal fade"
    id="transactionModal"
    tabindex="-1"
    aria-labelledby="transactionModalLabel"
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="transactionModalLabel">{{ t('transactionForm.title') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveTransaction">
            <div class="mb-3">
              <label for="amount" class="form-label">{{ t('transactionForm.amount') }}</label>
              <input
                type="number"
                step="0.01"
                class="form-control"
                id="amount"
                v-model="form.amount"
                required
              />
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">{{
                  t('transactionForm.description')
                }}</label>
              <input type="text" class="form-control" id="description" v-model="form.description" />
            </div>

            <div class="mb-3">
              <label for="date" class="form-label">{{ t('transactionForm.date') }}</label>
              <input
                type="datetime-local"
                class="form-control"
                id="date"
                v-model="form.date"
                required
              />
            </div>

            <div class="mb-3">
              <label for="type" class="form-label">{{ t('transactionForm.type') }}</label>
              <select
                class="form-select"
                id="type"
                v-model="form.type"
                required
                @change="onTypeChange"
              >
                <option value="INCOME">{{ t('transactionForm.income') }}</option>
                <option value="EXPENSE">{{ t('transactionForm.expense') }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="account" class="form-label">{{ t('transactionForm.account') }}</label>
              <select class="form-select" id="account" v-model="form.accountId" required>
                <option value="" disabled>{{ t('transactionForm.selectAccount') }}</option>
                <option v-for="acc in accountStore.accounts" :key="acc.id" :value="acc.id">
                  {{ acc.name }} ({{ acc.balance }} {{ acc.currency }})
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="category" class="form-label">{{ t('transactionForm.category') }}</label>
              <select class="form-select" id="category" v-model="form.categoryId" required>
                <option value="" disabled>{{ t('transactionForm.selectCategory') }}</option>
                <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="notes" class="form-label">{{ t('transactionForm.notes') }}</label>
              <input type="text" class="form-control" id="notes" v-model="form.notes" />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                {{ t('general.close') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ t('general.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Modal } from 'bootstrap'

import { useAuthStore } from '@/stores/authStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { useAccountStore } from '@/stores/accountStore'

import { type Transaction} from "@/types";

const { t } = useI18n()
const authStore = useAuthStore()
const categoryStore = useCategoryStore()
const transactionsStore = useTransactionsStore()
const accountStore = useAccountStore()
const emit = defineEmits(['transactionAdded'])

const modalElement = ref<HTMLElement | null>(null)
let bootstrapModal: Modal | null = null
const loading = ref(false)

const show = (tx: Transaction | null = null) => {

  if (bootstrapModal) {
    bootstrapModal.show();
  }
};

const form = reactive({
  amount: 0,
  description: '',
  date: new Date().toISOString().slice(0, 16),
  type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
  categoryId: null as string | null,
  accountId: null as string | null,
  notes: '' as string,
})

const filteredCategories = computed(() => {
  return categoryStore.categories.filter((cat) => cat.type === form.type)
})

const onTypeChange = () => {
  // Reset category when type changes
  form.categoryId = null
}

const saveTransaction = async () => {
  if (!form.categoryId) {
    alert(t('errors.selectCategory'))
    return
  }
  if (!form.accountId) {
    alert(t('errors.selectAccount'))
    return
  }

  loading.value = true
  try {
    await transactionsStore.createTransaction(
      {
        ...form,
        date: new Date(form.date).toISOString(),
      },
      t,
    )

    form.amount = 0
    form.description = ''
    form.date = new Date().toISOString().slice(0, 16)
    form.type = 'EXPENSE'
    form.categoryId = null
    form.accountId = null
    form.notes = ''

    if (bootstrapModal) {
      bootstrapModal.hide()
    }
    emit('transactionAdded')
  } catch (error) {
    console.error('Failed to save transaction:', error)
    alert(t('errors.createTransactionFailed'))
  } finally {
    loading.value = false
  }
}

// Reset form when modal is shown
const resetForm = () => {
  form.amount = 0
  form.description = ''
  form.date = new Date().toISOString().slice(0, 16)
  form.type = 'EXPENSE'
  form.categoryId = null
  form.accountId = null
  form.notes = ''
}
defineExpose({
  show,
});

onMounted(() => {
  if (authStore.isAuthenticated) {
    categoryStore.fetchCategories(t)
    accountStore.fetchAccounts(t)
  }
  if (modalElement.value) {
    bootstrapModal = new Modal(modalElement.value)
    modalElement.value.addEventListener('show.bs.modal', resetForm)
  }
})
</script>
