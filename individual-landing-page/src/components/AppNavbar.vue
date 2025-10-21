<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">Vue Login Lab</RouterLink>
      <div class="collapse navbar-collapse show">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
          <li class="nav-item" v-if="isAuthenticated"><RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink></li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li v-if="!isAuthenticated" class="nav-item"><RouterLink class="nav-link" to="/login">Login</RouterLink></li>
          <li v-else class="nav-item"><button class="btn btn-outline-light btn-sm" @click="logout">Logout</button></li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore(); const { isAuthenticated } = storeToRefs(auth); const router = useRouter();
function logout(){ auth.clearAuth(); router.push('/'); }
</script>