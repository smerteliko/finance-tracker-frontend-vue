<template>
  <div class="card p-4 h-100 shadow-sm d-flex flex-column justify-content-between">
    <div>
      <h5 class="card-title text-muted">{{ t('dashboardPage.balanceTitle') }}</h5>
      <div class="text-center">
        <h1 class="display-4 fw-bold text-primary">${{ transactionsStore.balance.toFixed(2) }}</h1>
      </div>
    </div>
    <div v-if="transactionsStore.analytics" class="card-body">
      <div class="row mt-4">
        <div class="col-6 text-center text-success">
          <small class="text-uppercase fw-bold">{{ t('dashboardPage.totalIncome') }}</small>
          <h5 class="fw-bold mt-1">$ {{ transactionsStore.totalIncome.toFixed(2) }}</h5>
        </div>
        <div class="col-6 text-center text-danger">
          <small class="text-uppercase fw-bold">{{ t('dashboardPage.totalExpenses') }}</small>
          <h5 class="fw-bold mt-1">$ {{ transactionsStore.totalExpense.toFixed(2) }}</h5>
        </div>
      </div>
      <div class="row mt-4">
        <div v-if="transactionsStore.transactionSummary" class="mt-3">
          <div class="d-flex justify-content-between">
            <small class="fw-bold" v-html="formattedSummary"></small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { computed } from 'vue'

const { t } = useI18n()
const transactionsStore = useTransactionsStore()

const formattedSummary = computed(() => {
  if (transactionsStore.transactionSummary) {
    return transactionsStore.transactionSummary.replace(/\n/g, '<br>')
  }
  return ''
})
</script>
