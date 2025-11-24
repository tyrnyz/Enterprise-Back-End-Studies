<template>
  <div>
    <h2>Login</h2>

    <form @submit.prevent="onLogin">
      <div>
        <label>Email</label><br />
        <input v-model="email" placeholder="Email" />
      </div>

      <div style="margin-top:8px">
        <label>Password</label><br />
        <input type="password" v-model="password" placeholder="Password" />
      </div>

      <div style="margin-top:12px">
        <button type="submit">Login</button>
      </div>
    </form>

    <p style="margin-top:8px">
      Don't have account?
      <a href="#/register" @click.prevent="go('/register')">Register</a>
    </p>

    <div v-if="error" style="color:black; margin-top:8px">
      {{ error }}
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
const router = useRouter();

function go(path) {
  router.push(path);
}

async function onLogin() {
  error.value = "";
  try {
    const data = await authService.login({ email: email.value, password: password.value });
    const token = data.token ?? data.accessToken ?? null;
    const user = data.user ?? data;
    if (!token) {
      error.value = "No token returned from server";
      return;
    }
    setAuth(token, user);
    router.push("/");
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || "Login failed";
  }
}
</script>