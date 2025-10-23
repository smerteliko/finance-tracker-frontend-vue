<template>
  <div class="pagination">
    <button
      :disabled="currentPage === 0"
      @click="changePage(currentPage - 1)"
      class="pagination-btn"
    >
      ← Previous
    </button>

    <span class="pagination-info"> Page {{ currentPage + 1 }} of {{ totalPages }} </span>

    <button
      :disabled="currentPage >= totalPages - 1"
      @click="changePage(currentPage + 1)"
      class="pagination-btn"
    >
      Next →
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
}

interface Emits {
  (e: 'pageChange', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const changePage = (page: number) => {
  emit('pageChange', page)
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}
</style>
