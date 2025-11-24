<template>
  <div>
    <h2>Login</h2>

    <form @submit.prevent="onLogin">
      <input v-model="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">Login</button>
    </form>

    <p v-if="error" style="color:red">{{ error }}</p>

    <!-- ADD THIS -->
    <div style="margin-top:12px;">
      <span>Don't have an account?</span>
      <router-link to="/register" style="margin-left:6px;">Register</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../../services/authService";
import { setAuth } from "../../utils/auth";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

async function onLogin() {
  error.value = "";
  loading.value = true;
  try {
    const data = await authService.login({ email: email.value, password: password.value });
    if (data.token && (data.user || data.user === undefined)) {
      setAuth(data.token, data.user ?? { id: data.id, email: data.email, fullName: data.fullName });
      router.push("/");
      return;
    }
    error.value = "Login failed: no token returned";
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>