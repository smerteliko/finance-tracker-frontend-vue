<template>
  <div
    class="modal fade"
    id="transactionModal"
    tabindex="-1"
    aria-labelledby="transactionModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
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
              <select class="form-select" id="type" v-model="form.type" required>
                <option value="INCOME">{{ t('transactionForm.income') }}</option>
                <option value="EXPENSE">{{ t('transactionForm.expense') }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="category" class="form-label">{{ t('transactionForm.category') }}</label>
              <select class="form-select" id="category" v-model="form.categoryId" required>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                {{ t('general.close') }}
              </button>
              <button type="submit" class="btn btn-primary">{{ t('general.save') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore.ts'
import { useCategoryStore } from '@/stores/categoryStore.ts'
import { useTransactionsStore } from '@/stores/transactionsStore.ts'
import { Modal } from 'bootstrap'

const { t } = useI18n()
const authStore = useAuthStore()
const categoryStore = useCategoryStore()
const transactionStore = useTransactionsStore()
const emit = defineEmits(['transactionAdded'])

const modalElement = ref<HTMLElement | null>(null)
let bootstrapModal: Modal | null = null

const form = reactive({
  amount: 0,
  description: '',
  date: '',
  type: 'EXPENSE',
  userId: authStore.user?.userId,
  categoryId: null,
})

const categories = ref(categoryStore.categories)

const saveTransaction = async () => {
  try {
    await transactionStore.createTransaction(
      {
        ...form,
        date: new Date(form.date).toISOString(), // Ensure date is in ISO format
      },
      t,
    )

    // Close modal and emit event to parent component
    if (bootstrapModal) {
      bootstrapModal.hide()
    }
    emit('transactionAdded')
  } catch (error) {
    console.error('Failed to save transaction:', error)
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    categoryStore.fetchCategories(t)
  }
  if (modalElement.value) {
    bootstrapModal = new Modal(modalElement.value)
  }
})
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
