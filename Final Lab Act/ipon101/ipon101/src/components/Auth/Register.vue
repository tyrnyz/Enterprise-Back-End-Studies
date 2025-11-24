<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="onRegister">
      <input v-model="fullName" placeholder="Full name" required />
      <input v-model="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">Create account</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../../services/authService";
import { setAuth } from "../../utils/auth";

const fullName = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

async function onRegister() {
  error.value = "";
  loading.value = true;
  try {
    const data = await authService.register({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    });

    // If server returned token+user, store them
    if (data.token && data.user) {
      setAuth(data.token, data.user);
      router.push("/");
      return;
    }

    // fallback: try to login and set token
    const loginRes = await authService.login({ email: email.value, password: password.value });
    if (loginRes.token && loginRes.user) {
      setAuth(loginRes.token, loginRes.user);
      router.push("/");
      return;
    }

    router.push("/login");
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
}
</script>