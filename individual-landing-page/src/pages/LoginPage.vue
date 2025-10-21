<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Welcome Back</h2>
      <p>Sign in to continue</p>

      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" placeholder="Enter your username" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter your password" required />
        </div>

        <button :disabled="loading" type="submit">
          <span v-if="loading">Logging in…</span>
          <span v-else>Login</span>
        </button>

        <p v-if="error" style="color: #ffb4b4; margin-top: .75rem; text-align: center;">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { http } from "@/api/http";

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function onSubmit() {
  error.value = "";
  loading.value = true;

  try {
    const { data } = await http.post("/auth/login", {
      username: username.value,
      password: password.value,
    });

    // adapt to the shape your backend returns
    const user = {
      id: data.id,
      username: data.username,
      email: data.email,
      name: [data.firstName, data.lastName].filter(Boolean).join(" "),
    };

    // set token and user in your auth store
    auth.setAuth({ token: data.token, user });

    // navigate to the redirect target or dashboard
    const redirect = route.query.redirect || "/dashboard";
    router.push(redirect);
  } catch (e) {
    // show helpful error text
    const serverMsg = e?.response?.data?.message || e?.response?.data || e?.message || "Login failed";
    error.value = typeof serverMsg === "string" ? serverMsg : "Invalid credentials or server error.";
    // also helpful to log full error in console
    // eslint-disable-next-line no-console
    console.error("Login error:", e);
  } finally {
    loading.value = false;
  }
}
</script>

<style>
/* IMPORTANT: no `scoped` so this global wrapper applies */
.login-wrapper {
  position: fixed;
  inset: 0;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 1rem;
  box-sizing: border-box;
  background: linear-gradient(135deg, #4f46e5, #6366f1, #a78bfa);
  z-index: 0;
}

.login-card {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}

@media (max-width: 420px) {
  .login-card { padding: 1.25rem; border-radius: 12px; }
}

h2 { margin: 0 0 0.25rem; font-size: 1.6rem; }
p { margin: 0 0 1.25rem; color: rgba(255,255,255,0.9); }
.form-group { margin-bottom: 0.9rem; text-align: left; }
.form-group label { display:block; margin-bottom: 0.25rem; color: rgba(255,255,255,0.9); }
.form-group input { width: 100%; padding: .6rem; border-radius: 8px; border: none; outline: none; }
button { width: 100%; padding: .7rem; border-radius: 8px; border: none; background: #6366f1; color: #fff; font-weight: 600; cursor: pointer; }
button[disabled] { opacity: 0.7; cursor: not-allowed; }
button:hover:not([disabled]) { background: #4f46e5; }
</style>