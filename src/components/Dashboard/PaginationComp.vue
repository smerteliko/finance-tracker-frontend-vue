<template>
  <nav aria-label="Transaction pagination" v-if="totalPages > 1">
    <ul class="pagination pagination-sm justify-content-center mb-0">

      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
          {{ t('pagination.previous') }}
        </a>
      </li>

      <li
        class="page-item"
        v-for="pageNumber in displayedPages"
        :key="pageNumber"
        :class="{ active: pageNumber === currentPage, disabled: pageNumber === '...' }"
      >
        <span v-if="pageNumber === '...'" class="page-link text-muted">...</span>
        <a v-else class="page-link" href="#" @click.prevent="changePage(pageNumber)">
          {{ pageNumber }}
        </a>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
          {{ t('pagination.next') }}
        </a>
      </li>
    </ul>
  </nav>

  <div class="d-flex align-items-center ms-3">
    <span class="text-muted me-2">{{ t('pagination.perPage') }}:</span>
    <select class="form-select form-select-sm" :value="itemsPerPage" @change="changeLimit($event)">
      <option v-for="limit in availableLimits" :key="limit" :value="limit">{{ limit }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true },
});

const emit = defineEmits(['pageChanged', 'limitChanged']);

const availableLimits = [10, 20, 50];

const displayedPages = computed(() => {
  const pages = [];
  const maxDisplayed = 5;
  const start = Math.max(1, props.currentPage - Math.floor(maxDisplayed / 2));
  const end = Math.min(props.totalPages, start + maxDisplayed - 1);

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push('...');
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < props.totalPages) {
    if (end < props.totalPages - 1) {
      pages.push('...');
    }
    // Only push the last page if it's not already displayed
    if (pages[pages.length - 1] !== props.totalPages) {
      pages.push(props.totalPages);
    }
  }

  return pages.filter((p, index, self) => {
    return p !== '...' || (index > 0 && self[index - 1] !== '...');
  });
});

const changePage = (page: number | string) => {
  if (typeof page === 'string') return;
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChanged', page);
  }
};

const changeLimit = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newLimit = parseInt(target.value);
  emit('limitChanged', newLimit);
};
</script>

<style scoped>
nav {
  display: flex;
}
.form-select-sm {
  width: 70px;
}
.page-link {
  min-width: 30px;
  text-align: center;
}
</style>
