<template>
  <div
    class="modal fade"
    id="categoryModal"
    tabindex="-1"
    aria-labelledby="categoryModalLabel"
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="categoryModalLabel">{{ t('categoryForm.title') }}</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCategory">
            <div class="mb-3">
              <label for="name" class="form-label">{{ t('categoryForm.name') }}</label>
              <input type="text" class="form-control" id="name" v-model="form.name" required />
            </div>
            <div class="mb-3">
              <label for="type" class="form-label">{{ t('categoryForm.type') }}</label>
              <select class="form-select" id="type" v-model="form.type" required>
                <option value="INCOME">{{ t('categoryForm.income') }}</option>
                <option value="EXPENSE">{{ t('categoryForm.expense') }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="color" class="form-label">{{ t('categoryForm.color') }}</label>
              <input
                type="color"
                class="form-control form-control-color"
                id="color"
                v-model="form.color"
              />
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
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Modal } from 'bootstrap'
import { useCategoryStore } from '@/stores/categoryStore'

const { t } = useI18n()
const categoryStore = useCategoryStore()
const emit = defineEmits(['categoryAdded'])

const modalElement = ref<HTMLElement | null>(null)
let bootstrapModal: Modal | null = null
const loading = ref(false)

const form = reactive({
  name: '',
  color: '#000000',
  type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
})

const saveCategory = async () => {
  loading.value = true
  try {
    await categoryStore.createCategory(form, t)

    // Reset form
    form.name = ''
    form.color = '#000000'
    form.type = 'EXPENSE'

    // Close modal and emit event
    if (bootstrapModal) {
      bootstrapModal.hide()
    }
    emit('categoryAdded')
  } catch (error) {
    console.error('Failed to save category:', error)
    alert(t('errors.createCategoryFailed'))
  } finally {
    loading.value = false
  }
}

// Reset form when modal is shown
const resetForm = () => {
  form.name = ''
  form.color = '#000000'
  form.type = 'EXPENSE'
}

// defineExpose({
//   show
// })

onMounted(() => {
  if (modalElement.value) {
    bootstrapModal = new Modal(modalElement.value)
    modalElement.value.addEventListener('show.bs.modal', resetForm)
  }
})
</script>
