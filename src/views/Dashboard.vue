<template>
  <div class="container container-fluid mt-4">
    <h2 class="text-center">{{ t('dashboardPage.title') }}</h2>
    <div class="d-flex justify-content-end mb-3">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#transactionModal"
      >
        <font-awesome-icon icon="plus" /> {{ t('dashboardPage.addTransaction') }}
      </button>
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import BalanceCard from '@/components/BalanceCard.vue'
import ChartSection from '@/components/ChartSection.vue'
import TransactionList from '@/components/TransactionList.vue'
import TransactionFormModal from '@/components/TransactionFormModal.vue'

const { t } = useI18n()
const transactionsStore = useTransactionsStore()
const authStore = useAuthStore()

const refreshData = () => {
  if (authStore.isAuthenticated) {
    const endDate = new Date().toISOString()
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    transactionsStore.fetchAnalytics(startDate, endDate, t)
    transactionsStore.fetchUserTransactions(startDate, endDate, t)
  }
}

onMounted(() => {
  refreshData()
})
</script>
