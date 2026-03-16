<template>
  <div>
    <h1>Dashboard</h1>

    <div>
      <div>Total Income: {{ summary.income.toFixed(2) }}</div>
      <div>Total Expense: {{ summary.expense.toFixed(2) }}</div>
      <div>Balance: {{ summary.balance.toFixed(2) }}</div>
    </div>

    <h3>Recent Transactions</h3>
    <ul>
      <li v-for="t in recent" :key="t.id">
        {{ t.transactionDate || t.createdAt }} — {{ t.type }} — {{ t.amount }} — {{ t.description }}
      </li>
    </ul>

    <div v-if="error" style="color:black; margin-top:8px">{{ errorMessage }}</div>

    <div style="margin-top:12px">
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import transactionService from "../services/transactionService";
import { getToken, clearAuth } from "../utils/auth";
import { useRouter } from "vue-router";

const transactions = ref([]);
const error = ref(null);
const router = useRouter();

const errorMessage = computed(() => (error.value ? (error.value.message || String(error.value)) : ""));

async function load() {
  error.value = null;
  try {
    if (!getToken()) { router.push("/login"); return; }
    transactions.value = await transactionService.list();
  } catch (e) {
    error.value = e;
    if (e?.response?.status === 401) {
      clearAuth();
      router.push("/login");
    }
  }
}

onMounted(load);

const summary = computed(() => {
  const income = transactions.value.filter(i => i.type === "income").reduce((s,v)=>s+Number(v.amount||0),0);
  const expense = transactions.value.filter(i => i.type === "expense").reduce((s,v)=>s+Number(v.amount||0),0);
  return { income, expense, balance: income-expense };
});

const recent = computed(() => transactions.value.slice(0,8));

function logout() {
  clearAuth();
  router.push("/login");
}
</script>