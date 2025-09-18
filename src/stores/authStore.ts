// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

interface User {
  userId: number
  firstName: string
  lastName: string
}

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
  }),

  actions: {
    async login(credentials: any) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials)
        const { token, userId, firstName, lastName } = response.data // Assume backend returns token and user object
        this.token = token
        this.user = {
          userId: userId,
          firstName: firstName,
          lastName: lastName,
        }
        console.log(response.data)
        this.isAuthenticated = true
        localStorage.setItem('token', this.token!)
        localStorage.setItem('user', JSON.stringify(this.user))
        router.push({ name: 'dashboard' })
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          throw new Error('Invalid credentials')
        } else {
          throw new Error('An error occurred during login.')
        }
      }
    },

    async register(userData: any) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData)
        const { token, user } = response.data
        this.token = token
        this.user = user
        this.isAuthenticated = true
        localStorage.setItem('token', this.token!)
        localStorage.setItem('user', JSON.stringify(this.user))
        router.push({ name: 'dashboard' })
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 409) {
            throw new Error('User with this email already exists.')
          }
        }
        throw new Error('An error occurred during registration.')
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push({ name: 'login' })
    },

    initializeFromLocalStorage() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    },
  },
})
