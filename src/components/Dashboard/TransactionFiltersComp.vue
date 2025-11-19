<template>
  <div class="card p-3 mb-4 shadow-sm">
    <h6 class="card-title">{{ t('filters.title') }}</h6>
    <form @submit.prevent="applyFilters">
      <div class="row g-3">

        <div class="col-md-3">
          <label for="accountId" class="form-label">{{ t('filters.account') }}</label>
          <select class="form-select" id="accountId" v-model="form.accountId">
            <option :value="undefined">{{ t('filters.allAccounts') }}</option>
            <option v-for="acc in accountStore.accounts" :key="acc.id" :value="acc.id">
              {{ acc.name }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="categoryId" class="form-label">{{ t('filters.category') }}</label>
          <select class="form-select" id="categoryId" v-model="form.categoryId">
            <option :value="undefined">{{ t('filters.allCategories') }}</option>
            <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="col-md-2">
          <label for="type" class="form-label">{{ t('filters.type') }}</label>
          <select class="form-select" id="type" v-model="form.type">
            <option :value="undefined">{{ t('filters.allTypes') }}</option>
            <option :value="TransactionTypeEnum.INCOME">{{ t('transactionForm.income') }}</option>
            <option :value="TransactionTypeEnum.EXPENSE">{{ t('transactionForm.expense') }}</option>
          </select>
        </div>

        <div class="col-md-2">
          <label for="startDate" class="form-label">{{ t('filters.startDate') }}</label>
          <input type="date" class="form-control" id="startDate" v-model="form.startDate" />
        </div>

        <div class="col-md-2">
          <label for="endDate" class="form-label">{{ t('filters.endDate') }}</label>
          <input type="date" class="form-control" id="endDate" v-model="form.endDate" />
        </div>

      </div>
      <div class="row mt-3">
        <div class="col-12 d-flex justify-content-end">
          <button type="button" class="btn btn-info me-2" @click="downloadReport" :disabled="transactionsStore.loading">
            <i class="bi bi-download me-2"></i> {{ t('general.downloadCSV') }}
          </button>
          <button type="button" class="btn btn-outline-secondary me-2" @click="resetFilters">
            {{ t('general.reset') }}
          </button>
          <button type="submit" class="btn btn-primary" :disabled="transactionsStore.loading">
            {{ t('general.apply') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAccountStore } from '@/stores/accountStore';
import { useFilterStore } from '@/stores/filterStore';
import { TransactionTypeEnum, type TransactionFilters } from '@/types';

const { t } = useI18n();
const transactionsStore = useTransactionsStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();
const filterStore = useFilterStore();

const form = reactive<Partial<TransactionFilters>>({
  accountId: filterStore.currentFilters.accountId,
  categoryId: filterStore.currentFilters.categoryId,
  type: filterStore.currentFilters.type,
  startDate: filterStore.currentFilters.startDate ? filterStore.currentFilters.startDate.substring(0, 10) : undefined,
  endDate: filterStore.currentFilters.endDate ? filterStore.currentFilters.endDate.substring(0, 10) : undefined,
});

const applyFilters = () => {
  filterStore.setFilters({
    accountId: form.accountId,
    categoryId: form.categoryId,
    type: form.type,
    startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
    endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
  });

  transactionsStore.fetchTransactions(filterStore.currentFilters, t);
};

const resetFilters = () => {
  filterStore.resetFilters();

  const defaults = filterStore.currentFilters;
  form.accountId = defaults.accountId;
  form.categoryId = defaults.categoryId;
  form.type = defaults.type;
  form.startDate = defaults.startDate;
  form.endDate = defaults.endDate;

  transactionsStore.fetchTransactions(filterStore.currentFilters, t);
};

const downloadReport = () => {
  const filters = filterStore.currentFilters;

  transactionsStore.downloadCsvReport(filters, t);
};

onMounted(() => {
  if (categoryStore.categories.length === 0) {
    categoryStore.fetchCategories(t);
  }
  if (accountStore.accounts.length === 0) {
    accountStore.fetchAccounts(t);
  }

  transactionsStore.fetchTransactions(filterStore.currentFilters, t);
});
</script>
