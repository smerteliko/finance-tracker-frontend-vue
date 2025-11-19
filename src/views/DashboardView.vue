<template>
  <div class="dashboard-view container-fluid py-4">
    <div class="row mb-4">
      <BalanceCardComp class="col-md-4" type="income" :amount="transactionsStore.totalIncome" />
      <BalanceCardComp class="col-md-4" type="expense" :amount="transactionsStore.totalExpense" />
      <BalanceCardComp class="col-md-4" type="balance" :amount="transactionsStore.balance" />
    </div>



    <TransactionFiltersComp />

    <TransactionListComp
      @open-details-modal="openTransactionDetailsModal"
      @open-edit-modal="openTransactionModal"
      @transaction-deleted="handleTransactionDeleted"
    />

    <TransactionFormModalComp
      ref="transactionFormModalRef"
      :initial-transaction="transactionToEdit"
      @transaction-saved="handleTransactionSaved"
    />
    <TransactionDetailsModal
      ref="transactionDetailsModalRef"
      :initial-transaction="transactionToEdit"
      @transaction-saved="handleTransactionSaved"
    />
    <div class="row">
    <div class="col-6">
      <div class="col-12">
        <div class="card shadow-sm p-3 bg-light">
          <h6 class="text-muted">{{ t('dashboard.summaryReport') }}</h6>
          <pre class="mb-0 small text-dark">{{ transactionsStore.transactionSummary || t('dashboard.summaryLoading') }}</pre>
        </div>
      </div>
    </div>
    <ChartSectionComp />
    </div>


  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Modal } from 'bootstrap';

import BalanceCardComp from '@/components/Dashboard/BalanceCardComp.vue';
import TransactionFiltersComp from '@/components/Dashboard/TransactionFiltersComp.vue';
import TransactionListComp from '@/components/Dashboard/TransactionListComp.vue';
import ChartSectionComp from '@/components/Dashboard/ChartSectionComp.vue';
import TransactionFormModalComp from '@/components/Modals/TransactionFormModalComp.vue';

import { useAuthStore } from '@/stores/authStore';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useFilterStore } from '@/stores/filterStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAccountStore } from '@/stores/accountStore';
import { type Transaction} from "@/types";

const { t } = useI18n();
const authStore = useAuthStore();
const transactionsStore = useTransactionsStore();
const filterStore = useFilterStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();

import TransactionDetailsModal from '@/components/Modals/TransactionDetailsModal.vue'; // NEW IMPORT


const fetchDashboardData = async () => {
  const filters = filterStore.currentFilters;
  const tInstance = t;

  const defaultPeriod = {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString()
  };

  const analyticsDates = {
    startDate: filters.startDate || defaultPeriod.startDate,
    endDate: filters.endDate || defaultPeriod.endDate,
  };

  await transactionsStore.fetchTransactions(filters, tInstance);

  await transactionsStore.fetchAnalyticsAndSummary(analyticsDates, tInstance);
};

const transactionFormModalRef = ref<InstanceType<typeof TransactionFormModalComp> | null>(null);
const transactionDetailsModalRef = ref<InstanceType<typeof TransactionDetailsModal> | null>(null); // NEW REF

const transactionToEdit = ref<Transaction | null>(null);

const openTransactionModal = (tx: Transaction | null = null) => {
  transactionToEdit.value = tx;

  // 1. Скрываем модальное окно деталей, используя экспонированный метод hide()
  if (transactionDetailsModalRef.value) {
    // ВАЖНО: Вызываем метод, экспонированный из TransactionDetailsModal.vue
    transactionDetailsModalRef.value.hide();
  }

  // 2. Открываем модальное окно формы (для редактирования)
  if (transactionFormModalRef.value) {
    transactionFormModalRef.value.show(tx);
  }
};

const openTransactionDetailsModal = (tx: Transaction) => {
  if (transactionDetailsModalRef.value) {
    // Открываем модальное окно деталей
    transactionDetailsModalRef.value.show(tx);
  }
};

const handleTransactionSaved = async  () => {
  transactionToEdit.value = null;
  await fetchDashboardData();
};

const handleTransactionDeleted = async (id: string) => {
  await fetchDashboardData();
};

const handleTransactionAdded = () => {
  transactionsStore.fetchTransactions(filterStore.currentFilters, t);
};


onMounted(() => {
  if (authStore.isAuthenticated) {
    categoryStore.fetchCategories(t);
    accountStore.fetchAccounts(t);

    // Initial fetch of transactions and analytics is triggered here.
    // NOTE: Filters component calls fetchTransactions on its mount,
    // but we ensure analytics loads for the cards.
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    transactionsStore.fetchAnalyticsAndSummary(startDate, endDate, t);
  }
});
</script>
