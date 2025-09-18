<template>
  <div
    class="modal fade"
    id="categoryModal"
    tabindex="-1"
    aria-labelledby="categoryModalLabel"
    aria-hidden="true"
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
              <button type="submit" class="btn btn-primary">{{ t('general.save') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '@/stores/categoryStore.ts'
import { onMounted } from 'vue'
import { Modal } from 'bootstrap'
const modalElement = ref<HTMLElement | null>(null)
let bootstrapModal: Modal | null = null

const { t } = useI18n()
const categoryStore = useCategoryStore()
const emit = defineEmits(['categoryAdded'])

const form = reactive({
  name: '',
  color: '#000000',
  type: 'EXPENSE',
})

const saveCategory = async () => {
  try {
    await categoryStore.createCategory(form, t)

    // Close modal and emit event to parent
    if (bootstrapModal) {
      bootstrapModal.hide()
    }
    emit('categoryAdded')
  } catch (error) {
    console.error('Failed to save category:', error)
  }
}

onMounted(() => {
  if (modalElement.value) {
    bootstrapModal = new Modal(modalElement.value)
  }
})
</script>
