<template>
  <div class="container container-fluid mt-4">
    <h2 class="text-center">{{ t('dashboardPage.title') }}</h2>
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
  <CategoryFormModal @transaction-added="refreshData" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactionsStore.ts'
import { useAuthStore } from '@/stores/authStore.ts'
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
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    transactionsStore.fetchAnalytics(startDate, endDate, t)
    transactionsStore.fetchUserTransactions(startDate, endDate, t)
    transactionsStore.fetchSummary(startDate, endDate, t)
  }
}

onMounted(() => {
  refreshData()
})
</script>
