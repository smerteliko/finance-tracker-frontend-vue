<template>
  <div class="card shadow-sm h-100 mb-3" :class="cardClass">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="flex-grow-1">
          <h6 class="card-subtitle mb-2 text-white-50">{{ title }}</h6>
          <h4 class="card-title text-white fw-bold">{{ formattedAmount }}</h4>
        </div>
        <i class="bi fs-1" :class="iconClass"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTransactionsStore } from '@/stores/transactionsStore';

const { t, locale } = useI18n();

const props = defineProps({
  type: {
    type: String, // 'income', 'expense', or 'balance'
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const title = computed(() => {
  return t(`balanceCard.${props.type}`);
});

const cardClass = computed(() => {
  switch (props.type) {
    case 'income':
      return 'bg-success';
    case 'expense':
      return 'bg-danger';
    case 'balance':
      return 'bg-primary';
    default:
      return 'bg-secondary';
  }
});

const iconClass = computed(() => {
  switch (props.type) {
    case 'income':
      return 'bi-arrow-up-right-circle';
    case 'expense':
      return 'bi-arrow-down-left-circle';
    case 'balance':
      return 'bi-wallet2';
    default:
      return '';
  }
});

const formattedAmount = computed(() => {
  const currencyCode = 'USD';
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(props.amount);
});
</script>

<style scoped>
.bg-primary, .bg-success, .bg-danger {
  background-color: var(--bs-primary);
}
.text-white-50 {
  opacity: 0.7;
}
.bi {
  opacity: 0.3; /* Subtle icon */
}
</style>
