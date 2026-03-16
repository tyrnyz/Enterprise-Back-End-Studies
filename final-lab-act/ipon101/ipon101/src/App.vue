<template>
  <div>
    <nav style="margin-bottom:12px">
      <a href="#/" @click.prevent="go('/')">Dashboard</a> |
      <a href="#/transactions" @click.prevent="go('/transactions')">Transactions</a> |
      <a href="#/categories" @click.prevent="go('/categories')">Categories</a> |
      <span v-if="user">Hi, {{ user.fullName }}</span>
      <button v-if="user" @click="logout" style="margin-left:8px">Logout</button>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);

onMounted(() => {
  try {
    user.value = JSON.parse(localStorage.getItem("auth_user") || "null");
  } catch {
    user.value = null;
  }
});

function go(path) {
  router.push(path);
}

function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  user.value = null;
  router.push("/login");
}
</script>