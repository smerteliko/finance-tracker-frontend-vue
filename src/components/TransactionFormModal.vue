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
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const emit = defineEmits(['transactionAdded'])

const form = reactive({
  amount: 0,
  description: '',
  date: '',
  type: 'EXPENSE',
  userId: authStore.user?.userId, // Assuming user ID is stored in auth store
  categoryId: null,
})

const categories = ref([])

const fetchCategories = async () => {
  try {
    const headers = { Authorization: `Bearer ${authStore.token}` }
    const response = await axios.get('http://localhost:8080/api/categories', { headers })
    categories.value = response.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const saveTransaction = async () => {
  try {
    const headers = { Authorization: `Bearer ${authStore.token}` }
    const response = await axios.post(
      'http://localhost:8080/api/transactions',
      {
        ...form,
        date: new Date(form.date).toISOString(), // Ensure date is in ISO format
      },
      { headers },
    )

    // Close modal and emit event to parent component
    const modal = document.getElementById('transactionModal')
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none'
      document.body.classList.remove('modal-open')
    }

    emit('transactionAdded')
  } catch (error) {
    console.error('Failed to save transaction:', error)
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
