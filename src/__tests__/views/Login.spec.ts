import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from "@pinia/testing";
import { useAuthStore } from '@/stores/authStore.ts';
import Login from '../../views/LoginView.vue';
import { createI18n } from "vue-i18n";

// Mock translations to avoid loading real files
const messages = {
  en: {
    loginPage: {
      title: "Welcome Back!",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      noAccount: "Don't have an account? Register here."
    },
    general: {
      login: "Log In"
    },
    errors: {
      invalidCredentials: "Invalid email or password."
    }
  },
};

const i18n = createI18n({
  locale: "en",
  legacy: false, // Must be set to false for Composition API
  globalInjection: true,
  messages,
});

describe('Login.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          i18n,
        ],
        stubs: ['router-link', 'font-awesome-icon'],
      },
    });

    expect(wrapper.find('h2').text()).toBe('Welcome Back!');
    expect(wrapper.find('button[type="submit"]').text()).toBe('Log In');
  });

  it('calls login action on form submission', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          i18n,
        ],
        stubs: ['router-link', 'font-awesome-icon'],
      },
    });

    const authStore = useAuthStore();
    const loginSpy = vi.spyOn(authStore, 'login');

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
