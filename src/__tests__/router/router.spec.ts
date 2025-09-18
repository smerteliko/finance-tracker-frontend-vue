import { createRouter, createWebHistory } from 'vue-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '@/stores/authStore';
import router from '../../router/index.ts' ;
const routes = router.getRoutes()
describe('Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createTestingPinia({
      createSpy: vi.fn,
    });
  });

  // it('redirects to login if not authenticated and accessing a protected route', async () => {
  //   const authStore = useAuthStore();
  //   authStore.isAuthenticated = false;
  //   const router = createRouter({
  //     history: createWebHistory(),
  //     routes,
  //   });
  //
  //   await router.push({ name: 'dashboard' });
  //   await router.isReady();
  //   expect(router.currentRoute.value.name).toBe('login');
  // });

  it('allows access to a protected route if authenticated', async () => {
    const authStore = useAuthStore();
    authStore.isAuthenticated = true;

    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    await router.push({ name: 'dashboard' });
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('dashboard');
  });
});
