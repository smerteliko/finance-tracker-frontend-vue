<template>
  <div class="col-6 mb-4">
    <div class="row mb-4">
      <div class="card shadow-sm h-100">
        <div class="card-header">
          <h5 class="mb-0">{{ t('charts.expensesTitle') }}</h5>
        </div>
        <div class="card-body" v-if="!transactionsStore.loading && hasExpenseData">
          <PieChartComp :chartData="expenseChartData" :title="t('charts.expensesTitle')" style="height: 300px;" />
        </div>
        <div class="card-body text-center text-muted" v-else-if="!transactionsStore.loading">
          {{ t('charts.noExpenseData') }}
        </div>
      </div>
    </div>

    <div class="row">
      <div class="card shadow-sm h-100">
        <div class="card-header">
          <h5 class="mb-0">{{ t('charts.incomeTitle') }}</h5>
        </div>
        <div class="card-body" v-if="!transactionsStore.loading && hasIncomeData">
          <PieChartComp :chartData="incomeChartData" :title="t('charts.incomeTitle')" style="height: 300px;" />
        </div>
        <div class="card-body text-center text-muted" v-else-if="!transactionsStore.loading">
          {{ t('charts.noIncomeData') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTransactionsStore } from '@/stores/transactionsStore';
 import PieChartComp from '../Charts/PieChartComp.vue';

const { t } = useI18n();
const transactionsStore = useTransactionsStore();

const hasExpenseData = computed(() => {
  return transactionsStore.analytics?.expensesByCategory?.length > 0;
});

const hasIncomeData = computed(() => {
  return transactionsStore.analytics?.incomeByCategory?.length > 0;
});

const expenseChartData = computed(() => {
  const breakdown = transactionsStore.analytics?.expensesByCategory || [];

  return {
    labels: breakdown.map((item: any) => item.categoryName),
    datasets: [{
      backgroundColor: breakdown.map((item: any) => item.color || '#FF6384'),
      data: breakdown.map((item: any) => item.totalAmount),
    }],
  };
});

const incomeChartData = computed(() => {
  const breakdown = transactionsStore.analytics?.incomeByCategory || [];

  return {
    labels: breakdown.map((item: any) => item.categoryName),
    datasets: [{
      backgroundColor: breakdown.map((item: any) => item.color || '#36A2EB'),
      data: breakdown.map((item: any) => item.totalAmount),
    }],
  };
});
</script>
