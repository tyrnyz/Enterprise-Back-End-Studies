<template>
  <div>
    <h2>Categories</h2>

    <form @submit.prevent="onCreate" style="margin-bottom:8px">
      <input v-model="name" placeholder="New category name" />
      <button type="submit">Add</button>
    </form>

    <div v-if="loading">Loading...</div>

    <ul v-else>
      <li v-for="c in categories" :key="c.id">
        {{ c.name }}
        <button @click="onDelete(c.id)" style="margin-left:8px">Delete</button>
      </li>
    </ul>

    <div v-if="error" style="color:black; margin-top:8px">{{ errorMessage }}</div>
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
  if (!confirm("Delete category?")) return;
  try {
    await categoryService.remove(id);
    categories.value = categories.value.filter(c => c.id !== id);
  } catch (e) {
    error.value = e;
  }
}
</script>