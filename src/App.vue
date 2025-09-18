<template>
  <div v-if="authStore.isAuthenticated" class="d-flex flex-grow-1">
    <Sidebar />
    <div class="main-layout d-flex flex-column flex-grow-1">
      <nav class="navbar navbar-dark bg-dark d-lg-none">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar"
            aria-controls="sidebar"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <router-link class="navbar-brand" to="/">{{ t('general.appName') }}</router-link>
        </div>
      </nav>
      <main class="container-fluid py-4 flex-grow-1">
        <router-view></router-view>
      </main>
    </div>
    <TransactionFormModal />
    <CategoryFormModal />
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
const { t } = useI18n()
import Sidebar from '@/components/Dashboard/SidebarComp.vue'
import TransactionFormModal from '@/components/Modals/TransactionFormModalComp.vue'
import CategoryFormModal from '@/components/Modals/CategoryFormModalComp.vue'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeFromLocalStorage()
})
</script>

<style>
/* Global styles */
body {
  margin: 0;
  padding: 0;
}
/*.main-layout {
  padding-left: 250px;
}*/
@media (max-width: 991.98px) {
  .main-layout {
    padding-left: 0;
  }
}
</style>
