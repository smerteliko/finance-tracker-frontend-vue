<template>
  <div
    class="offcanvas-lg offcanvas-start bg-dark"
    :class="{ expanded: isSidebarExpanded }"
    id="sidebar"
  >
    <div class="d-flex flex-column h-100">
      <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
        <router-link class="text-decoration-none text-white" to="/">
          <font-awesome-icon icon="dollar-sign" size="xl" />
          <span class="ms-2 fw-bold">{{ t('general.appName') }}</span>
        </router-link>
        <button
          class="btn btn-outline-light d-lg-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="user-info p-3 text-white border-bottom">
        <p class="mb-0 fw-bold">{{ t('general.welcome') }}, {{ authStore.user?.firstName }}</p>
      </div>

      <ul class="nav flex-column flex-grow-1">
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/">
            <font-awesome-icon icon="chart-line" />
            <span class="ms-2">{{ t('general.dashboard') }}</span>
          </router-link>
        </li>
        <li class="nav-item">
          <button class="nav-link text-white" @click="openTransactionModal">
            <font-awesome-icon icon="plus" />
            <span class="ms-2">{{ t('dashboardPage.addTransaction') }}</span>
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link text-white"
            data-bs-toggle="modal"
            data-bs-target="#categoryModal"
          >
            <font-awesome-icon icon="tags" />
            <span v-if="isSidebarExpanded" class="ms-2">{{ t('dashboardPage.addCategory') }}</span>
          </button>
        </li>
      </ul>

      <div class="mt-auto p-3 border-top">
        <div class="mb-3 d-flex justify-content-center">
          <button class="btn btn-sm btn-outline-light me-2" @click="changeLocale('en')">EN</button>
          <button class="btn btn-sm btn-outline-light me-2" @click="changeLocale('ru')">RU</button>
          <button class="btn btn-sm btn-outline-light" @click="changeLocale('fr')">FR</button>
        </div>
        <button class="btn btn-danger w-100" @click="authStore.logout">
          <font-awesome-icon icon="sign-out-alt" />
          <span class="ms-2">{{ t('general.logout') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore.ts'
import { Modal } from 'bootstrap'
import { ref } from 'vue'

const { t, locale } = useI18n()
const authStore = useAuthStore()

const changeLocale = (newLocale: string) => {
  locale.value = newLocale
}

const isSidebarExpanded = ref(window.innerWidth >= 992)

const openTransactionModal = () => {
  const modalElement = document.getElementById('transactionModal')
  if (modalElement) {
    const modal = new Modal(modalElement)
    modal.show()
  }
}
</script>

<style scoped>
.offcanvas-lg {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 250px;
  z-index: 1050;
}
@media (min-width: 992px) {
  .offcanvas-lg {
    position: sticky;
    top: 0;
    height: 100vh;
    border-right: 1px solid #dee2e6;
  }
}
</style>
