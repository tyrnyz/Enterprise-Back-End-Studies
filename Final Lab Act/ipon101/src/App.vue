<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg app-navbar mb-4 shadow-sm">
      <div class="container app-navbar-inner">
        <a class="navbar-brand d-flex align-items-center gap-2" href="#/" @click.prevent="go('/')">
          <div class="brand-mark d-flex align-items-center justify-content-center">
            ₱
          </div>
          <div class="d-flex flex-column">
            <span class="brand-title">Ipon101 Tracker</span>
            <small class="brand-subtitle">Student Expense Tracker</small>
          </div>
        </a>

        <div class="collapse navbar-collapse show justify-content-end">
          <template v-if="showNavLinks">
            <ul class="navbar-nav me-3 mb-2 mb-lg-0 d-flex align-items-center gap-2">
              <li class="nav-item">
                <a
                  class="nav-link app-nav-link"
                  href="#/"
                  @click.prevent="go('/')"
                >
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link app-nav-link"
                  href="#/transactions"
                  @click.prevent="go('/transactions')"
                >
                  Transactions
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link app-nav-link"
                  href="#/categories"
                  @click.prevent="go('/categories')"
                >
                  Categories
                </a>
              </li>
            </ul>

            <div class="d-flex align-items-center gap-3">
              <span v-if="user" class="navbar-text user-label small">
                Hi, <span class="fw-semibold">{{ user.fullName }}</span>
              </span>
              <button
                v-if="user"
                class="btn btn-sm btn-outline-light logout-btn rounded-pill px-3"
                @click="logout"
              >
                Logout
              </button>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <main class="app-main">
      <div class="container app-main-inner">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router"; // Added useRoute
import { clearAuth } from "./utils/auth";

const router = useRouter();
const route = useRoute(); // Reactive route object
const user = ref(null);

// Computed property to hide navigation on login/register pages
const showNavLinks = computed(() => {
  return route.path !== "/login" && route.path !== "/register";
});

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
  clearAuth();
  user.value = null;
  router.push("/login");
}
</script>

<style scoped>
/*
  The general dark theme is handled by src/assets/global.css.
  This block only keeps the specific navbar, brand, and layout styles.
*/

/* App shell */
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* NAVBAR - Overriding global.css slightly for this component's look */

.app-navbar {
  background: #0f172a; /* dark slate base */
  border-bottom: 1px solid rgba(15, 23, 42, 0.18);
}

.app-navbar-inner {
  max-width: 1120px;
}

/* Brand */

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #16a34a;
  color: #ecfdf5;
  font-weight: 700;
  font-size: 1rem;
}

.brand-title {
  color: #f9fafb;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.02em;
}

.brand-subtitle {
  color: rgba(148, 163, 184, 0.9);
  font-size: 0.75rem;
}

/* Nav links */

.app-nav-link {
  position: relative;
  font-size: 0.9rem;
  color: rgba(226, 232, 240, 0.9) !important;
  padding-bottom: 0.1rem;
}

.app-nav-link:hover {
  color: #ffffff !important;
}

.app-nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -0.15rem;
  width: 0;
  height: 2px;
  border-radius: 999px;
  background-color: #22c55e;
  transition: width 0.18s ease-out;
}

.app-nav-link:hover::after {
  width: 100%;
}

/* User / Logout */

.user-label {
  color: rgba(226, 232, 240, 0.9);
}

.logout-btn {
  border-color: rgba(226, 232, 240, 0.5);
  color: #e5e7eb;
}

.logout-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

/* MAIN CONTENT */

.app-main {
  flex: 1;
  padding-bottom: 2rem;
}

.app-main-inner {
  max-width: 1120px;
  margin: 0 auto;
}
</style>