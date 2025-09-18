import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/authStore';
import axios from "axios";

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with no token', () => {
    const authStore = useAuthStore();
    expect(authStore.token).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('sets token and user on successful login', async () => {
    const authStore = useAuthStore();
    const mockResponse = {
      data: {
        token: 'test-token',
        user: { userId: 3, firstName: 'John', lastName: 'Doe' },
      },
    };

    // Mock the axios post call
    vi.spyOn(axios, 'post').mockResolvedValue(mockResponse);

    const credentials = { email: 'john.doe1@email.com', password: 'password123' };
    await authStore.login(credentials);

    expect(authStore.token).toBe('test-token');
    expect(authStore.isAuthenticated).toBe(true);
  });

  it('clears token and user on logout', () => {
    const authStore = useAuthStore();
    authStore.token = 'some-token';
    authStore.isAuthenticated = true;
    authStore.user = { id: 3, firstName: 'John', lastName: 'Doe', email: 'john.doe1@email.com' };

    authStore.logout();

    expect(authStore.token).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
