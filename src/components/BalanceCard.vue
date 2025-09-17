<template>
  <div class="card shadow-sm p-4 h-100">
    <h5 class="card-title">{{ t('dashboardPage.balanceTitle') }}</h5>
    <div v-if="transactionsStore.loading" class="text-center mt-3">
      <font-awesome-icon icon="spinner" spin size="2x" />
      <p class="mt-2">{{ t('general.loading') }}</p>
    </div>
    <div v-else-if="transactionsStore.error" class="text-center text-danger mt-3">
      {{ transactionsStore.error }}
    </div>
    <div v-else class="text-center mt-3">
      <h1 class="display-4 text-primary">${{ transactionsStore.analytics?.balance.toFixed(2) ?? '0.00' }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useTransactionsStore } from '@/stores/transactions';

const { t } = useI18n();
const transactionsStore = useTransactionsStore();
</script>
