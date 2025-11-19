<template>
  <div class="card shadow-sm p-3 mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">{{ t('transactionList.title') }}</h5>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
          <tr>
            <th scope="col">{{ t('transactionList.date') }}</th>
            <th scope="col">{{ t('transactionList.description') }}</th>
            <th scope="col">{{ t('transactionList.account') }}</th>
            <th scope="col">{{ t('transactionList.category') }}</th>
            <th scope="col" class="text-end">{{ t('transactionList.amount') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="transactionsStore.loading">
            <td colspan="6" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="transactionsStore.transactions.length === 0">
            <td colspan="6" class="text-center py-4 text-muted">
              {{ t('transactionList.noTransactions') }}
            </td>
          </tr>
          <tr v-for="tx in transactionsStore.transactions" :key="tx.id">
            <td>{{ formatDate(tx.date) }}</td>
            <td><a href="#" @click.prevent="openDetailsModal(tx)">
              {{ tx.description }}
            </a></td>

            <td>{{ tx.account?.name }}</td>

            <td>
                <span
                  class="badge me-1"
                  :style="{ backgroundColor: tx.category?.color || '#cccccc' }"
                >{{ tx.category?.name }}</span
                >
            </td>

            <td :class="amountClass(tx.type)" class="text-end fw-bold">
              {{ formatCurrency(tx.amount, tx.account?.currency) }}
            </td>

          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card-footer d-flex justify-content-center pt-3">
      <PaginationComp
        v-if="transactionsStore.transactions.length > 0 && transactionsStore.paginationMetadata"
        :current-page="transactionsStore.paginationMetadata.page"
        :total-pages="transactionsStore.paginationMetadata.totalPages"
        :total-items="transactionsStore.paginationMetadata.totalItems"
        :items-per-page="transactionsStore.paginationMetadata.limit"
        @page-changed="handlePageChange"
        @limit-changed="handleLimitChange"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useFilterStore } from '@/stores/filterStore';
import {  TransactionTypeEnum, type Transaction } from '@/types';
import PaginationComp from './PaginationComp.vue';

const { t, locale } = useI18n();
const transactionsStore = useTransactionsStore();
const filterStore = useFilterStore();

const emit = defineEmits(['open-edit-modal', 'open-details-modal']); // New emit for details


const openDetailsModal = (tx: Transaction) => {
  emit('open-details-modal', tx);
};

const formatDate = (isoString: string) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

const amountClass = (type: string) => {
  return {
    'text-success': type === TransactionTypeEnum.INCOME,
    'text-danger': type === TransactionTypeEnum.EXPENSE,
  };
};

const confirmDelete = (id: string) => {
  if (confirm(t('transactionList.confirmDelete'))) {
    deleteTransaction(id);
  }
}

const deleteTransaction = async (id: string) => {
  try {
    await transactionsStore.deleteTransaction(id, t);
    transactionsStore.fetchTransactions(filterStore.currentFilters, t);

  } catch (error) {
    console.error('Delete failed:', error);
  }
};

const handlePageChange = (page: number) => {
  if (page !== filterStore.currentFilters.page) {
    filterStore.setPagination(page); // 1. Update page in store
    transactionsStore.fetchTransactions(filterStore.currentFilters, t);
  }
};

const handleLimitChange = (limit: number) => {
  filterStore.setPagination(1, limit);
  transactionsStore.fetchTransactions(filterStore.currentFilters, t);
};
</script>
