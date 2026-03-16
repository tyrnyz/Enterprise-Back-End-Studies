<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow-lg p-4">
        <h2 class="card-title text-center mb-4">Login</h2>

        <form @submit.prevent="onLogin">
          <div class="mb-3">
            <input v-model="email" type="email" class="form-control" placeholder="Email" required />
          </div>
          <div class="mb-3">
            <input v-model="password" type="password" class="form-control" placeholder="Password" required />
          </div>
          <div class="d-grid">
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>

        <p v-if="error" class="alert alert-danger mt-3">{{ error }}</p>

        <div class="text-center mt-3">
          <span>Don't have an account?</span>
          <router-link to="/register" class="ms-1">Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../../services/authService";
import { setAuth } from "../../utils/auth";

const email = ref("tyrone@gmail.com"); // Pre-fill for convenience
const password = ref("password");
const error = ref("");
const loading = ref(false);
const router = useRouter();

async function onLogin() {
  error.value = "";
  loading.value = true;
  try {
    const data = await authService.login({ email: email.value, password: password.value });
    if (data.token) {
      // Use user data returned from backend
      const user = data.user || { id: data.id, email: data.email, fullName: data.fullName }; 
      setAuth(data.token, user);
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