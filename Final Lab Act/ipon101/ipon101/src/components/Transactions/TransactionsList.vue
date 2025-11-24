<template>
  <div>
    <h2>Transactions</h2>

    <transaction-form @saved="load" />

    <div v-if="loading">Loading...</div>

    <table v-else border="0" cellpadding="4" cellspacing="0">
      <thead>
        <tr>
          <th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in transactions" :key="t.id">
          <td>{{ t.transactionDate || t.createdAt }}</td>
          <td>{{ t.type }}</td>
          <td>{{ categoryName(t.categoryId) }}</td>
          <td>{{ t.amount }}</td>
          <td><button @click="remove(t.id)">Delete</button></td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" style="color:black; margin-top:8px">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import TransactionForm from "./TransactionForm.vue";
import transactionService from "../../services/transactionService";
import categoryService from "../../services/categoryService";
import { getToken } from "../../utils/auth";
import { useRouter } from "vue-router";

const transactions = ref([]);
const categories = ref([]);
const loading = ref(false);
const error = ref(null);
const router = useRouter();

const errorMessage = computed(() => (error.value ? (error.value.message || String(error.value)) : ""));

async function load() {
  error.value = null;
  loading.value = true;
  try {
    if (!getToken()) { router.push("/login"); return; }
    transactions.value = await transactionService.list();
    categories.value = await categoryService.list();
  } catch (e) {
    error.value = e;
    if (e?.response?.status === 401) router.push("/login");
  } finally {
    loading.value = false;
  }
}

onMounted(load);

async function remove(id) {
  if (!confirm("Delete transaction?")) return;
  try {
    await transactionService.remove(id);
    transactions.value = transactions.value.filter(t => t.id !== id);
  } catch (e) {
    error.value = e;
  }
}

function categoryName(catId) {
  const c = categories.value.find(x => x.id === catId);
  return c ? c.name : "-";
}
</script>