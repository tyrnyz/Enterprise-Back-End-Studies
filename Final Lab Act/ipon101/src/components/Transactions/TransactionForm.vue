<template>
  <form @submit.prevent="onSubmit" class="card p-3 mb-4 shadow-sm">
    <div class="row">
      <!-- Type -->
      <div class="col-md-3 mb-3">
        <label for="typeSelect" class="form-label fw-bold">Type</label>
        <select id="typeSelect" v-model="type" class="form-select">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <!-- Category -->
      <div class="col-md-3 mb-3">
        <label for="categorySelect" class="form-label fw-bold">Category</label>
        <select
          id="categorySelect"
          v-model.number="categoryId"
          class="form-select"
        >
          <option :value="null">Uncategorized</option>
          <option
            v-for="c in categories"
            :key="c.id"
            :value="c.id"
          >
            {{ c.name }}
          </option>
        </select>
      </div>

      <!-- Amount -->
      <div class="col-md-3 mb-3">
        <label for="amountInput" class="form-label fw-bold">Amount</label>
        <input
          id="amountInput"
          v-model.number="amount"
          type="number"
          class="form-control"
          placeholder="0.00"
          step="0.01"
          required
          min="0"
        />
      </div>

      <!-- Date (with custom calendar button) -->
      <div class="col-md-3 mb-3">
        <label for="dateInput" class="form-label fw-bold">Date</label>
        <div class="input-group">
          <input
            id="dateInput"
            ref="dateInput"
            v-model="transactionDate"
            type="date"
            class="form-control"
            required
          />
          <button
            type="button"
            class="btn btn-outline-secondary calendar-btn"
            @click="openDatePicker"
          >
            📅
          </button>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="mb-3">
      <label for="descriptionInput" class="form-label fw-bold">Description</label>
      <input
        id="descriptionInput"
        v-model="description"
        class="form-control"
        placeholder="What was this for?"
        required
      />
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">
        Add Transaction
      </button>
    </div>

    <div v-if="error" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, computed, defineEmits } from "vue";
import categoryService from "../../services/categoryService";
import transactionService from "../../services/transactionService";
import { getToken } from "../../utils/auth";
import { useRouter } from "vue-router";

const emit = defineEmits(["saved"]);

const categories = ref([]);
const type = ref("expense");
const categoryId = ref(null);
const amount = ref(0);

// default to today in YYYY-MM-DD format for <input type="date">
const transactionDate = ref(new Date().toISOString().slice(0, 10));

const description = ref("");
const error = ref(null);
const router = useRouter();

// ref for the date input (to open picker programmatically)
const dateInput = ref(null);

const errorMessage = computed(() =>
  error.value ? error.value.message || String(error.value) : ""
);

async function loadCategories() {
  try {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    categories.value = await categoryService.list();
  } catch (e) {
    error.value = e;
  }
}

onMounted(loadCategories);

// Called when the 📅 button is clicked
const openDatePicker = () => {
  if (!dateInput.value) return;

  // Chrome / Opera support showPicker()
  if (typeof dateInput.value.showPicker === "function") {
    dateInput.value.showPicker();
  } else {
    // Fallback: focus, so user can type / use native UI
    dateInput.value.focus();
  }
};

async function onSubmit() {
  error.value = null;

  if (!amount.value || amount.value <= 0) {
    error.value = { message: "Amount must be greater than zero." };
    return;
  }

  try {
    const payload = {
      description: description.value,
      amount: amount.value,
      categoryId: categoryId.value || null,
      type: type.value,
      transactionDate: transactionDate.value, // "YYYY-MM-DD"
    };

    await transactionService.create(payload);

    // Reset form fields (keep date the same)
    amount.value = 0;
    description.value = "";
    categoryId.value = null;

    emit("saved");
  } catch (e) {
    error.value = e;
    if (e?.response?.status === 401) router.push("/login");
  }
}
</script>

<style scoped>
/* Make the calendar button match the dark theme a bit better */
.calendar-btn {
  border-color: #1f2937;
  background-color: #020617;
  color: #e5e7eb;
}

.calendar-btn:hover {
  background-color: #111827;
  color: #f9fafb;
}

/* Keep normal form-control look */
input[type="date"].form-control {
  color-scheme: dark;
}
</style>
