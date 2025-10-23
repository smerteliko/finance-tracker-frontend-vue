<template>
  <div class="filters">
    <div class="filter-group">
      <label class="filter-label">{{ t('filters.dateRange') }}:</label>
      <select v-model="dateRange" @change="onDateRangeChange" class="filter-select">
        <option value="month">{{ t('filters.thisMonth') }}</option>
        <option value="last-month">{{ t('filters.lastMonth') }}</option>
        <option value="quarter">{{ t('filters.thisQuarter') }}</option>
        <option value="year">{{ t('filters.thisYear') }}</option>
        <option value="custom">{{ t('filters.custom') }}</option>
      </select>
    </div>

    <div v-if="dateRange === 'custom'" class="filter-group">
      <label class="filter-label">{{ t('filters.from') }}:</label>
      <input type="date" v-model="customStartDate" class="filter-input" />
      <label class="filter-label">{{ t('filters.to') }}:</label>
      <input type="date" v-model="customEndDate" class="filter-input" />
    </div>

    <div class="filter-group">
      <label class="filter-label">{{ t('filters.type') }}:</label>
      <select v-model="selectedType" @change="onFilterChange" class="filter-select">
        <option value="">{{ t('filters.allTypes') }}</option>
        <option value="INCOME">{{ t('filters.income') }}</option>
        <option value="EXPENSE">{{ t('filters.expense') }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">{{ t('filters.category') }}:</label>
      <select v-model="selectedCategory" @change="onFilterChange" class="filter-select">
        <option value="">{{ t('filters.allCategories') }}</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <button @click="resetFilters" class="reset-btn">{{ t('filters.reset') }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Category, TransactionFilter } from '@/types'
import { categoryService } from '@/services/CategoryService'

interface Emits {
  (e: 'filterChange', filter: TransactionFilter): void
}

const { t } = useI18n()
const emit = defineEmits<Emits>()

const dateRange = ref('month')
const selectedType = ref('')
const selectedCategory = ref('')
const customStartDate = ref('')
const customEndDate = ref('')
const categories = ref<Category[]>([])

const getDateRange = () => {
  const now = new Date()
  let startDate: Date
  let endDate: Date

  switch (dateRange.value) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
      break
    case 'last-month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
      break
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3)
      startDate = new Date(now.getFullYear(), quarter * 3, 1)
      endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59)
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
      break
    case 'custom':
      if (customStartDate.value && customEndDate.value) {
        startDate = new Date(customStartDate.value)
        endDate = new Date(customEndDate.value)
        endDate.setHours(23, 59, 59)
      } else {
        return { startDate: null, endDate: null }
      }
      break
    default:
      return { startDate: null, endDate: null }
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  }
}

const onDateRangeChange = () => {
  if (dateRange.value !== 'custom') {
    onFilterChange()
  }
}

const onFilterChange = () => {
  const dateRangeValues = getDateRange()

  const filter: TransactionFilter = {
    startDate: dateRangeValues.startDate || undefined,
    endDate: dateRangeValues.endDate || undefined,
    type: (selectedType.value as 'INCOME' | 'EXPENSE') || undefined,
    categoryId: selectedCategory.value ? parseInt(selectedCategory.value) : undefined,
    page: 0,
    size: 10,
  }

  emit('filterChange', filter)
}

const resetFilters = () => {
  dateRange.value = 'month'
  selectedType.value = ''
  selectedCategory.value = ''
  customStartDate.value = ''
  customEndDate.value = ''
  onFilterChange()
}

watch([customStartDate, customEndDate], () => {
  if (dateRange.value === 'custom') {
    onFilterChange()
  }
})

onMounted(async () => {
  try {
    categories.value = await categoryService.getAllCategories()
    onFilterChange()
  } catch (error) {
    console.error('Error loading categories:', error)
  }
})
</script>

<style scoped>
.filters {
  display: flex;
  gap: 1.5rem;
  align-items: end;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-select,
.filter-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.2s;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #3b82f6;
  ring: 2px solid #3b82f6;
}

.reset-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  align-self: end;
}

.reset-btn:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    min-width: auto;
  }
}
</style>
