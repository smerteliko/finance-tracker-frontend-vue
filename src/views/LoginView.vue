<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4 shadow-sm">
          <h2 class="card-title text-center mb-4">{{ t('loginPage.title') }}</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">{{ t('loginPage.emailLabel') }}</label>
              <div class="input-group">
                <span class="input-group-text"><font-awesome-icon icon="envelope" /></span>
                <input type="email" class="form-control" id="email" v-model="email" required />
              </div>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">{{ t('loginPage.passwordLabel') }}</label>
              <div class="input-group">
                <span class="input-group-text"><font-awesome-icon icon="lock" /></span>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                />
              </div>
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary">{{ t('general.login') }}</button>
            </div>
          </form>
          <div class="text-center mt-3">
            <router-link to="/register">{{ t('loginPage.noAccount') }}</router-link>
          </div>
          <div v-if="loginError" class="alert alert-danger mt-3">
            {{ t('errors.invalidCredentials') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore.ts'

const { t } = useI18n()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loginError = ref(false)

const handleLogin = async () => {
  loginError.value = false
  try {
    await authStore.login({ email: email.value, password: password.value })
  } catch (error) {
    console.error(error)
    loginError.value = true
  }
}
</script>
