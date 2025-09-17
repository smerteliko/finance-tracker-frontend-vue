// src/stores/auth.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  actions: {
    async login(credentials: any) {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
        this.token = response.data;
        this.isAuthenticated = true;
        localStorage.setItem('token', this.token!);
        router.push({ name: 'dashboard' });
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          throw new Error('Invalid credentials');
        } else {
          throw new Error('An error occurred during login.');
        }
      }
    },

    logout() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      router.push({ name: 'login' });
    }
  }
});
