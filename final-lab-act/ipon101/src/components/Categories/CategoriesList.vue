<template>
  <div>
    <h2 class="h3 mb-4">Categories</h2>

    <form @submit.prevent="onCreate" class="input-group mb-4 shadow-sm">
      <input v-model="name" type="text" class="form-control" placeholder="New category name (e.g., Food, Tuition)" required />
      <button type="submit" class="btn btn-primary">Add</button>
    </form>

    <div v-if="loading" class="alert alert-info">Loading...</div>

    <div v-else class="card shadow-sm">
      <ul class="list-group list-group-flush">
        <li v-for="c in categories" :key="c.id" class="list-group-item d-flex justify-content-between align-items-center">
          {{ c.name }}
          <button @click="onDelete(c.id)" class="btn btn-sm btn-outline-danger">Delete</button>
        </li>
        <li v-if="!categories.length" class="list-group-item text-center text-muted">
          No categories found. Add one above!
        </li>
      </ul>
    </div>

    <div v-if="error" class="alert alert-danger mt-4">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import categoryService from "../../services/categoryService";
import { getToken } from "../../utils/auth";
import { useRouter } from "vue-router";

const categories = ref([]);
const name = ref("");
const loading = ref(false);
const error = ref(null);
const router = useRouter();

const errorMessage = computed(() => (error.value ? (error.value.message || String(error.value)) : ""));

async function load() {
  error.value = null;
  loading.value = true;
  try {
    if (!getToken()) { router.push("/login"); return; }
    categories.value = await categoryService.list();
  } catch (e) {
    error.value = e;
    if (e?.response?.status === 401) router.push("/login");
  } finally {
    loading.value = false;
  }
}

onMounted(load);

async function onCreate() {
  if (!name.value.trim()) return;
  try {
    const created = await categoryService.create({ name: name.value.trim() });
    categories.value.unshift(created);
    name.value = "";
  } catch (e) {
    error.value = e;
    if (e?.response?.status === 401) router.push("/login");
  }
}

async function onDelete(id) {
  if (!confirm("Are you sure you want to delete this category?")) return;
  try {
    await categoryService.remove(id);
    categories.value = categories.value.filter(c => c.id !== id);
  } catch (e) {
    error.value = e;
  }
}
</script>