import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { createI18n } from 'vue-i18n';
import App from '../App.vue';

// Mock translation files
const messages = {
  en: {
    general: {
      appName: 'Finance Tracker',
    },
  },
};

const i18n = createI18n({
  locale: 'en',
  legacy: false,
  globalInjection: true,
  messages,
});

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          i18n, // Add the i18n instance here
        ],
        stubs: {
          RouterView: true,
          Sidebar: true,
          TransactionFormModal: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
