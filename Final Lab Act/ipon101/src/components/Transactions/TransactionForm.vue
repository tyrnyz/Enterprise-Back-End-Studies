<template>
  <form @submit.prevent="onSubmit" class="card p-3 mb-4 shadow-sm">
    <div class="row">
      <div class="col-md-3 mb-3">
        <label for="typeSelect" class="form-label fw-bold">Type</label>
        <select id="typeSelect" v-model="type" class="form-select">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div class="col-md-3 mb-3">
        <label for="categorySelect" class="form-label fw-bold">Category</label>
        <select id="categorySelect" v-model.number="categoryId" class="form-select">
          <option :value="null">Uncategorized</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <div class="col-md-3 mb-3">
        <label for="amountInput" class="form-label fw-bold">Amount</label>
        <input id="amountInput" v-model.number="amount" type="number" class="form-control" placeholder="0.00" step="0.01" required min="0" />
      </div>

      <div class="col-md-3 mb-3">
        <label for="dateInput" class="form-label fw-bold">Date</label>
        <input id="dateInput" v-model="transactionDate" type="date" class="form-control" required />
      </div>
    </div>

    <div class="mb-3">
      <label for="descriptionInput" class="form-label fw-bold">Description</label>
      <input id="descriptionInput" v-model="description" class="form-control" placeholder="What was this for?" required />
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">Add Transaction</button>
    </div>

    <div v-if="error" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </form>
</template>

<script setup>
import { ref, onMounted, computed, defineEmits } from "vue"; // Added defineEmits
import categoryService from "../../services/categoryService";
import transactionService from "../../services/transactionService";
import { getToken } from "../../utils/auth";
import { useRouter } from "vue-router";

const emit = defineEmits(["saved"]); // Defined emits

const categories = ref([]);
const type = ref("expense");
const categoryId = ref(null);
const amount = ref(0);
const transactionDate = ref(new Date().toISOString().slice(0,10));
const description = ref("");
const error = ref(null);
const router = useRouter();

const errorMessage = computed(() => (error.value ? (error.value.message || String(error.value)) : ""));

async function loadCategories() {
  try {
    if (!getToken()) { router.push("/login"); return; }
    categories.value = await categoryService.list();
  } catch (e) {
    error.value = e;
    // Removed redundant login redirect on failure, handled by middleware
  }
}

onMounted(loadCategories);

async function onSubmit() {
  error.value = null;
  if (!amount.value || amount.value <= 0) { error.value = { message: "Amount must be greater than zero." }; return; }

  try {
    const payload = {
      description: description.value,
      amount: amount.value,
      categoryId: categoryId.value || null,
      type: type.value,
      transactionDate: transactionDate.value
    };
    await transactionService.create(payload);
    
    // Reset form fields
    amount.value = 0;
    description.value = "";
    categoryId.value = null;

    // Emit saved event
    emit("saved"); 

  } catch (e) {
    error.value = e;
    if (e?.response?.status === 401) router.push("/login");
  }
}
</script>