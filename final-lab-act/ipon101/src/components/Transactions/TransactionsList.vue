<template>
  <div>
    <h2 class="h3 mb-4">Transactions</h2>

    <transaction-form @saved="load" />

    <div v-if="loading" class="alert alert-info">Loading...</div>

    <div v-else class="table-responsive shadow-sm">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Category</th>
            <th scope="col" class="text-end">Amount</th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transactions" :key="t.id">
            <!-- nicely formatted date -->
            <td>{{ formatDate(t.transactionDate || t.createdAt) }}</td>

            <td>
              <span
                class="badge"
                :class="t.type === 'income' ? 'bg-success' : 'bg-danger'"
              >
                {{ t.type }}
              </span>
            </td>

            <td>{{ categoryName(t.categoryId) }}</td>

            <td
              class="text-end fw-bold"
              :class="t.type === 'income' ? 'text-success' : 'text-danger'"
            >
              {{ t.type === 'income' ? '+' : '-' }} ₱ {{ t.amount }}
            </td>

            <td class="text-center">
              <button
                @click="remove(t.id)"
                class="btn btn-sm btn-outline-danger"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="!transactions.length">
            <td colspan="5" class="text-center text-muted">
              No transactions recorded.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="error" class="alert alert-danger mt-4">
      {{ errorMessage }}
    </div>
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

const errorMessage = computed(() =>
  error.value ? error.value.message || String(error.value) : ""
);

async function load() {
  error.value = null;
  loading.value = true;
  try {
    if (!getToken()) {
      router.push("/login");
      return;
    }
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
  if (!confirm("Are you sure you want to delete this transaction?")) return;
  try {
    await transactionService.remove(id);
    transactions.value = transactions.value.filter((t) => t.id !== id);
  } catch (e) {
    error.value = e;
  }
}

function categoryName(catId) {
  const c = categories.value.find((x) => x.id === catId);
  return c ? c.name : "-";
}

/** Format any date string from backend into something readable */
function formatDate(raw) {
  if (!raw) return "";

  // Try to parse as Date first
  const d = new Date(raw);
  if (!isNaN(d)) {
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Fallback: just show first 10 chars (YYYY-MM-DD)
  return String(raw).slice(0, 10);
}
</script>
