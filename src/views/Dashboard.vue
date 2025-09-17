<template>
  <div class="container-fluid mt-4">
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BalanceCard from '@/components/BalanceCard.vue';
import ChartSection from '@/components/ChartSection.vue';
import TransactionList from '@/components/TransactionList.vue';

const { t } = useI18n();
</script>

<style scoped>
/* Scoped styles can be added here */
</style>
