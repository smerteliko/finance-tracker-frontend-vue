<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4 shadow-sm">
          <h2 class="card-title text-center mb-4">{{ t('registerPage.title') }}</h2>
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label for="firstName" class="form-label">{{
                t('registerPage.firstNameLabel')
              }}</label>
              <div class="input-group">
                <span class="input-group-text"><font-awesome-icon icon="user" /></span>
                <input
                  type="text"
                  class="form-control"
                  id="firstName"
                  v-model="firstName"
                  required
                />
              </div>
            </div>
            <div class="mb-3">
              <label for="lastName" class="form-label">{{ t('registerPage.lastNameLabel') }}</label>
              <div class="input-group">
                <span class="input-group-text"><font-awesome-icon icon="user" /></span>
                <input type="text" class="form-control" id="lastName" v-model="lastName" required />
              </div>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">{{ t('registerPage.emailLabel') }}</label>
              <div class="input-group">
                <span class="input-group-text"><font-awesome-icon icon="envelope" /></span>
                <input type="email" class="form-control" id="email" v-model="email" required />
              </div>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">{{ t('registerPage.passwordLabel') }}</label>
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
              <button type="submit" class="btn btn-primary">{{ t('general.register') }}</button>
            </div>
          </form>
          <div v-if="registerError" class="alert alert-danger mt-3">{{ registerError }}</div>
          <div class="text-center mt-3">
            <router-link to="/login">{{ t('registerPage.alreadyHaveAccount') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const registerError = ref('')

const handleRegister = async () => {
  registerError.value = ''
  try {
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    })
    router.push({ name: 'dashboard' })
  } catch (error: any) {
    registerError.value = t('errors.registrationFailed')
  }
}
</script>

<style scoped>
.card-title {
  font-weight: bold;
}
</style>
