<template>
  <div class="container container-fluid mt-4">
    <h2 class="text-center">{{ t('dashboardPage.title') }}</h2>

    <div
      v-if="transactionsStore.error"
      class="alert alert-danger alert-dismissible fade show mt-3"
      role="alert"
    >
      {{ transactionsStore.error }}
      <button type="button" class="btn-close" @click="transactionsStore.clearError()"></button>
    </div>

    <div class="row mt-4">
      <div class="col-md-4">
        <BalanceCard />
      </div>
      <div class="col-md-8">
        <ChartSection />
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <TransactionList />
      </div>
    </div>
  </div>

  <TransactionFormModal @transaction-added="refreshData" />
  <CategoryFormModal @category-added="refreshData" />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { useAuthStore } from '@/stores/authStore'
import BalanceCard from '@/components/Dashboard/BalanceCardComp.vue'
import ChartSection from '@/components/Dashboard/ChartSectionComp.vue'
import TransactionList from '@/components/Dashboard/TransactionListComp.vue'
import TransactionFormModal from '@/components/Modals/TransactionFormModalComp.vue'
import CategoryFormModal from '@/components/Modals/CategoryFormModalComp.vue'

const { t } = useI18n()
const transactionsStore = useTransactionsStore()
const authStore = useAuthStore()

const refreshData = () => {
  if (authStore.isAuthenticated) {
    const endDate = new Date().toISOString()
    const startDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days

    Promise.all([
      transactionsStore.fetchAnalytics(startDate, endDate),
      transactionsStore.fetchUserTransactions(startDate, endDate),
      transactionsStore.fetchSummary(startDate, endDate),
    ]).catch((error) => {
      console.error('Error refreshing dashboard data:', error)
    })
  }
}

// Watch for authentication changes
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      refreshData()
    }
  },
)

onMounted(() => {
  if (authStore.isAuthenticated) {
    refreshData()
  }
})
</script>
