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
    <div v-else class="row">
      <div class="col-12 col-md-6 col-lg-6 mb-3">
        <h6 class="text-center mt-3">{{ t('dashboardPage.expensesTitle') }}</h6>
        <div class="chart-container">
          <canvas ref="expenseChartCanvas"></canvas>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-6 mb-3">
        <h6 class="text-center mt-3">{{ t('dashboardPage.incomeTitle') }}</h6>
        <div class="chart-container">
          <canvas ref="incomesChartCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactionsStore.ts'
import Chart from 'chart.js/auto'

const { t } = useI18n()
const transactionsStore = useTransactionsStore()
const expenseChartCanvas = ref<HTMLCanvasElement | null>(null)
const incomesChartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstanceExpenses: Chart | null = null
let chartInstanceIncome: Chart | null = null

const renderChartExpenses = () => {
  if (chartInstanceExpenses) {
    chartInstanceExpenses.destroy()
  }
  if (!expenseChartCanvas.value || !transactionsStore.analytics) return

  const expensesByCategory = transactionsStore.analytics.expensesByCategory
  const expensesLabels = Object.keys(expensesByCategory)
  const expensesValues = Object.values(expensesByCategory)

  chartInstanceExpenses = new Chart(expenseChartCanvas.value, {
    type: 'pie',
    data: {
      labels: expensesLabels,
      datasets: [
        {
          label: t('dashboardPage.expensesLabel'),
          data: expensesValues,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCE'],
        },
      ],
    },
  })
}

const renderChartIncomes = () => {
  if (chartInstanceIncome) {
    chartInstanceIncome.destroy()
  }
  if (!incomesChartCanvas.value || !transactionsStore.analytics) return

  const incomeByCategory = transactionsStore.analytics.incomeByCategory
  const incomeLabels = Object.keys(incomeByCategory)
  const incomeValues = Object.values(incomeByCategory)

  chartInstanceIncome = new Chart(incomesChartCanvas.value, {
    type: 'pie',
    data: {
      labels: incomeLabels,
      datasets: [
        {
          label: t('dashboardPage.incomeLabel'),
          data: incomeValues,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCE'],
        },
      ],
    },
  })
}

watch(
  () => transactionsStore.analytics,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        renderChartExpenses()
        renderChartIncomes()
      })
    }
  },
  { deep: true, immediate: false },
)

onMounted(() => {
  if (transactionsStore.analytics) {
    renderChartExpenses()
    renderChartIncomes()
  }
})
</script>

<style scoped>
.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 300px;
  width: 100%;
  max-width: 400px;
  margin: auto;
}
@media (max-width: 991.98px) {
  .chart-container {
    height: 250px;
  }
}
</style>
