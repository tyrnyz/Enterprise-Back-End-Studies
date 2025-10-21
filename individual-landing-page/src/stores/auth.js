import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  getters: { isAuthenticated: (s) => !!s.token },
  actions: {
    setAuth({ token, user }) {
      this.token = token
      this.user = user || null
      localStorage.setItem('token', token)
      user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user')
    },
    clearAuth() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})