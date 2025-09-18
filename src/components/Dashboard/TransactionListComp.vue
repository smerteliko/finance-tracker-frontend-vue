<template>
  <div class="card shadow-sm p-4 mt-4">
    <h5 class="card-title">{{ t('dashboardPage.transactionsTitle') }}</h5>
    <div v-if="transactionsStore.loading" class="text-center mt-3">
      <font-awesome-icon icon="spinner" spin size="2x" />
      <p class="mt-2">{{ t('general.loading') }}</p>
    </div>
    <div v-else-if="transactionsStore.error" class="text-center text-danger mt-3">
      {{ transactionsStore.error }}
    </div>
    <div v-else class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>{{ t('transactionsTable.date') }}</th>
            <th>{{ t('transactionsTable.description') }}</th>
            <th>{{ t('transactionsTable.category') }}</th>
            <th class="text-end">{{ t('transactionsTable.amount') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactionsStore.transactions" :key="transaction.id">
            <td>{{ new Date(transaction.date).toLocaleDateString() }}</td>
            <td>{{ transaction.description }}</td>
            <td>
              <span class="badge" :style="{ backgroundColor: transaction.categoryColor }">
                {{ transaction.categoryName }}
              </span>
            </td>
            <td
              class="text-end"
              :class="{
                'text-success': transaction.type === 'INCOME',
                'text-danger': transaction.type === 'EXPENSE',
              }"
            >
              ${{ transaction.amount.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="transactionsStore.transactions.length === 0" class="text-center text-muted mt-3">
        {{ t('transactionsTable.noTransactions') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactionsStore.ts'

const { t } = useI18n()
const transactionsStore = useTransactionsStore()

const loadTransactions = () => {
  const endDate = new Date().toISOString()
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  transactionsStore.fetchUserTransactions(startDate, endDate, t)
}
</script>

<style scoped>
.badge {
  color: white;
  min-width: 80px;
}
</style>
