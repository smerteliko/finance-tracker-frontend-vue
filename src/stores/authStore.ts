// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

interface User {
  userId: number;
  firstName: string;
  lastName: string;
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
    user: JSON.parse(localStorage.getItem('user') || '{}'),
  }),

  actions: {
    async login(credentials: any) {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', credentials)
        const { token, user } = response.data; // Assume backend returns token and user object
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('token', this.token!);
        localStorage.setItem('user', JSON.stringify(this.user));
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
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push({ name: 'login' });
    },

    initializeFromLocalStorage() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
      }
    }
  },
})
