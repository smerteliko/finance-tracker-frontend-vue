<template>
  <div class="card shadow-sm p-4 h-100">
    <h5 class="card-title">{{ t('dashboardPage.expensesTitle') }}</h5>
    <div v-if="transactionsStore.loading" class="text-center mt-3">
      <font-awesome-icon icon="spinner" spin size="2x" />
      <p class="mt-2">{{ t('general.loading') }}</p>
    </div>
    <div v-else-if="transactionsStore.error" class="text-center text-danger mt-3">
      {{ transactionsStore.error }}
    </div>
    <div style="width: 100%; max-width: 500px; margin: 0 auto">
      <canvas ref="expenseChartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactions'
import Chart from 'chart.js/auto'

const { t } = useI18n()
const transactionsStore = useTransactionsStore()
const expenseChartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  if (!expenseChartCanvas.value || !transactionsStore.analytics) return

  const data = transactionsStore.analytics.expensesByCategory
  const labels = Object.keys(data)
  const values = Object.values(data)

  chartInstance = new Chart(expenseChartCanvas.value, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          label: t('dashboardPage.expensesLabel'),
          data: values,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCE'],
        },
      ],
    },
  })
}

onMounted(() => {
  watch(
    () => transactionsStore.analytics,
    (newVal) => {
      if (newVal) {
        renderChart()
      }
    },
    { immediate: true },
  )
})
</script>
