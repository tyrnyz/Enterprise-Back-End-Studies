<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
      <div class="container">
        <a class="navbar-brand" href="#/" @click.prevent="go('/')">Ipon101 Tracker</a>

        <div class="collapse navbar-collapse show">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#/transactions" @click.prevent="go('/transactions')">Transactions</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#/categories" @click.prevent="go('/categories')">Categories</a>
            </li>
          </ul>

          <span v-if="user" class="navbar-text text-white me-3">
            Hi, {{ user.fullName }}
          </span>
          <button v-if="user" class="btn btn-outline-light" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
    <main class="container">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { clearAuth } from "./utils/auth"; // Import clearAuth

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
  clearAuth(); // Use the imported utility function
  user.value = null;
  router.push("/login");
}
</script>