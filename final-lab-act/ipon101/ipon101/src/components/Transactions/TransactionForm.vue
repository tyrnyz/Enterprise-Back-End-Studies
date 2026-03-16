<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>Type</label><br />
      <select v-model="type">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>

    <div style="margin-top:8px">
      <label>Category</label><br />
      <select v-model.number="categoryId">
        <option :value="null">Uncategorized</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <div style="margin-top:8px">
      <label>Amount</label><br />
      <input v-model.number="amount" type="number" />
    </div>

    <div style="margin-top:8px">
      <label>Date</label><br />
      <input v-model="transactionDate" type="date" />
    </div>

    <div style="margin-top:8px">
      <label>Description</label><br />
      <input v-model="description" />
    </div>

    <div style="margin-top:12px">
      <button type="submit">Add</button>
    </div>

    <div v-if="error" style="color:black; margin-top:8px">{{ errorMessage }}</div>
  </form>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import categoryService from "../../services/categoryService";
import transactionService from "../../services/transactionService";
import { getToken } from "../../utils/auth";
import { useRouter } from "vue-router";

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
    if (e?.response?.status === 401) router.push("/login");
  }
}

onMounted(loadCategories);

async function onSubmit() {
  error.value = null;
  try {
    const payload = {
      description: description.value,
      amount: amount.value,
      categoryId: categoryId.value || null,
      type: type.value,
      transactionDate: transactionDate.value
    };
    await transactionService.create(payload);
    amount.value = 0;
    description.value = "";
    categoryId.value = null;
    // emit saved event if parent wants
    try { emit("saved"); } catch {}
  } catch (e) {
    error.value = e;
    if (e?.response?.status === 401) router.push("/login");
  }
}
</script>