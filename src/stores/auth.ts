// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  user: object | null | string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || '{}'),
  }),

  actions: {
    async login(credentials: any) {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', credentials)
        this.token = response.data.token
        this.user = {
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          userId: response.data.userId,
        }
        this.isAuthenticated = true
        localStorage.setItem('token', this.token!)
        localStorage.setItem('user', JSON.stringify(this.user)!)
        router.push({ name: 'dashboard' })
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          throw new Error('Invalid credentials')
        } else {
          throw new Error('An error occurred during login.')
        }
      }
    },

    logout() {
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    },
  },
})
