import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTransactionsStore } from '@/stores/transactionsStore';
import axios from "axios";

describe('Transactions Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });


  it('sets an error on failed fetch', async () => {
    const transactionsStore = useTransactionsStore();
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('Network Error'));

    await transactionsStore.fetchAnalytics('2025-09-01', '2025-09-30', vi.fn());

    expect(transactionsStore.analytics).toBeNull();
    expect(transactionsStore.loading).toBe(false);
    expect(transactionsStore.error).not.toBeNull();
  });
});
