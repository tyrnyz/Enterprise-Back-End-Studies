<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow-lg p-4">
        <h2 class="card-title text-center mb-4">Register</h2>
        <form @submit.prevent="onRegister">
          <div class="mb-3">
            <input v-model="fullName" class="form-control" placeholder="Full name" required />
          </div>
          <div class="mb-3">
            <input v-model="email" type="email" class="form-control" placeholder="Email" required />
          </div>
          <div class="mb-3">
            <input v-model="password" type="password" class="form-control" placeholder="Password" required />
          </div>
          <div class="d-grid">
            <button type="submit" :disabled="loading" class="btn btn-success">
              {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        </form>
        <p v-if="error" class="alert alert-danger mt-3">{{ error }}</p>
      </div>
    </div>
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