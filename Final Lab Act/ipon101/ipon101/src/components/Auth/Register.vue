<template>
  <div>
    <h2>Register</h2>

    <form @submit.prevent="onRegister">
      <div>
        <label>Full name</label><br />
        <input v-model="fullName" placeholder="Full name" />
      </div>

      <div style="margin-top:8px">
        <label>Email</label><br />
        <input v-model="email" placeholder="Email" />
      </div>

      <div style="margin-top:8px">
        <label>Password</label><br />
        <input type="password" v-model="password" placeholder="Password" />
      </div>

      <div style="margin-top:12px">
        <button type="submit">Create account</button>
      </div>
    </form>

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

const fullName = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

async function onRegister() {
  error.value = "";
  try {
    const data = await authService.register({ fullName: fullName.value, email: email.value, password: password.value });

    // If server returns token+user
    if (data.token) {
      setAuth(data.token, data.user);
      router.push("/");
      return;
    }

    // Otherwise try to login after registration
    const loginRes = await authService.login({ email: email.value, password: password.value });
    const token = loginRes.token ?? loginRes.accessToken;
    const user = loginRes.user ?? loginRes;
    if (token) {
      setAuth(token, user);
      router.push("/");
      return;
    }

    router.push("/login");
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || "Registration failed";
  }
}
</script>