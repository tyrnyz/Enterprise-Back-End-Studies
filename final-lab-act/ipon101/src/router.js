// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/Auth/Login.vue";
import Register from "./components/Auth/Register.vue";
import Dashboard from "./components/Dashboard.vue";
import TransactionsList from "./components/Transactions/TransactionsList.vue";
import CategoriesList from "./components/Categories/CategoriesList.vue"; // <- corrected path

const routes = [
  { path: "/", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/transactions", component: TransactionsList, meta: { requiresAuth: true } },
  { path: "/categories", component: CategoriesList, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  { path: "/register", component: Register }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("auth_token");
  const isAuthed = !!token;
  if (to.meta.requiresAuth && !isAuthed) return next("/login");
  if ((to.path === "/login" || to.path === "/register") && isAuthed) return next("/");
  next();
});

export default router;