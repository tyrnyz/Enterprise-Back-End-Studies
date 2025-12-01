<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1">Dashboard</h2>
        <p class="text-muted mb-0">
          Overview of your income and expenses over time
        </p>
      </div>
      <span
        v-if="lastUpdated"
        class="badge bg-light text-secondary border"
        style="font-size: 0.8rem"
      >
        Updated: {{ lastUpdated }}
      </span>
    </div>

    <!-- Summary cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <p class="text-muted mb-1">Total Income</p>
            <h3 class="text-success fw-bold mb-0">
              ₱{{ totalIncome.toLocaleString() }}
            </h3>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <p class="text-muted mb-1">Total Expenses</p>
            <h3 class="text-danger fw-bold mb-0">
              ₱{{ totalExpense.toLocaleString() }}
            </h3>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <p class="text-muted mb-1">Balance</p>
            <h3
              class="fw-bold mb-0"
              :class="balance >= 0 ? 'text-primary' : 'text-danger'"
            >
              ₱{{ balance.toLocaleString() }}
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart + recent list -->
    <div class="row g-4">
      <!-- Animated chart -->
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div
              class="d-flex justify-content-between align-items-center flex-wrap mb-3"
            >
              <div>
                <h5 class="card-title mb-0">
                  Income vs Expenses ({{ rangeLabel }})
                </h5>
                <small class="text-muted">
                  Switch the filter to see daily, weekly, or monthly trends.
                </small>
              </div>

              <!-- Range toggle -->
              <div class="btn-group mt-2 mt-sm-0" role="group">
                <button
                  type="button"
                  class="btn btn-sm"
                  :class="
                    range === 'daily'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  "
                  @click="setRange('daily')"
                >
                  Daily
                </button>
                <button
                  type="button"
                  class="btn btn-sm"
                  :class="
                    range === 'weekly'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  "
                  @click="setRange('weekly')"
                >
                  Weekly
                </button>
                <button
                  type="button"
                  class="btn btn-sm"
                  :class="
                    range === 'monthly'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  "
                  @click="setRange('monthly')"
                >
                  Monthly
                </button>
              </div>
            </div>

            <div v-if="loading" class="text-center py-5 text-muted">
              Loading chart…
            </div>

            <div
              v-else-if="!groupedSeries.length"
              class="text-center py-5 text-muted"
            >
              No data yet for the selected range.
            </div>

            <div v-else class="position-relative" style="height: 320px">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent transactions -->
      <div class="col-lg-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <h5 class="card-title mb-3">Recent Transactions</h5>
            <p v-if="recentTransactions.length === 0" class="text-muted mb-0">
              No transactions yet. Start adding income or expenses!
            </p>
            <ul v-else class="list-group list-group-flush">
              <li
                v-for="t in recentTransactions"
                :key="t.id"
                class="list-group-item d-flex justify-content-between align-items-center px-0"
              >
                <div>
                  <div class="fw-semibold">
                    {{ t.description || t.category || "Transaction" }}
                  </div>
                  <small class="text-muted">
                    {{ formattedTxDate(t) }}
                  </small>
                </div>
                <span
                  class="fw-bold"
                  :class="(t.type || t.transaction_type) === 'income'
                    ? 'text-success'
                    : 'text-danger'"
                >
                  {{ (t.type || t.transaction_type) === "income" ? "+" : "-" }}₱{{
                    Number(t.amount).toLocaleString()
                  }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

const chartCanvas = ref(null);
let chartInstance = null;

const transactions = ref([]);
const loading = ref(true);
const lastUpdated = ref("");
const error = ref("");

// "daily" | "weekly" | "monthly"
const range = ref("daily");

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const fetchTransactions = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("auth_token");
    const res = await axios.get(`${API_BASE}/api/transactions`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    transactions.value = Array.isArray(res.data) ? res.data : [];
    lastUpdated.value = new Date().toLocaleString();
    buildChart();
  } catch (e) {
    console.error(e);
    error.value = "Failed to load transactions.";
  } finally {
    loading.value = false;
  }
};

const setRange = (r) => {
  range.value = r;
};

// 🔹 Helper: get a Date from transaction (or null)
const getRawDate = (t) =>
  t.date ||
  t.created_at ||
  t.createdAt ||
  t.transaction_date ||
  t.transactionDate ||
  null;

const parseTxDate = (t) => {
  const raw = getRawDate(t);
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d)) return null;
  return d;
};

// For the recent list
const formattedTxDate = (t) => {
  const d = parseTxDate(t);
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// --- GROUPED DATA FOR CHART ---
const groupedSeries = computed(() => {
  if (!transactions.value.length) return [];

  // DAILY → each transaction is one point
  if (range.value === "daily") {
    return transactions.value.map((t, idx) => {
      const amount = Number(t.amount) || 0;
      const type = t.type || t.transaction_type || "expense";

      const d = parseTxDate(t);
      const dateLabel = d
        ? d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        : `Txn ${idx + 1}`;

      const desc = t.description || t.category;
      const label = desc ? `${dateLabel} · ${desc}` : dateLabel;

      return {
        label,
        income: type === "income" ? amount : 0,
        expense: type === "income" ? 0 : amount,
      };
    });
  }

  // WEEKLY / MONTHLY → aggregate by period
  const map = new Map();

  transactions.value.forEach((t, idx) => {
    const amount = Number(t.amount) || 0;
    const type = t.type || t.transaction_type || "expense";
    let d = parseTxDate(t);

    // if no date, generate a fake one so weekly/monthly still show something
    if (!d) {
      d = new Date();
      d.setDate(d.getDate() - (transactions.value.length - idx));
    }

    let key, label;

    if (range.value === "weekly") {
      const year = d.getFullYear();
      const firstJan = new Date(year, 0, 1);
      const days = Math.floor((d - firstJan) / 86400000);
      const week = Math.floor(days / 7) + 1;
      key = `${year}-W${week.toString().padStart(2, "0")}`;
      label = `Week ${week}, ${year}`;
    } else {
      // monthly
      key = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      label = d.toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      });
    }

    if (!map.has(key)) {
      map.set(key, { label, income: 0, expense: 0 });
    }

    const entry = map.get(key);
    if (type === "income") entry.income += amount;
    else entry.expense += amount;
  });

  const sorted = Array.from(map.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([, v]) => v);

  return sorted;
});

// totals & balance
const totalIncome = computed(() =>
  transactions.value
    .filter((t) => (t.type || t.transaction_type) === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
);

const totalExpense = computed(() =>
  transactions.value
    .filter((t) => (t.type || t.transaction_type) !== "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
);

const balance = computed(() => totalIncome.value - totalExpense.value);

const recentTransactions = computed(() =>
  [...transactions.value]
    .sort((a, b) => {
      const da = parseTxDate(a) || new Date(0);
      const db = parseTxDate(b) || new Date(0);
      return db - da;
    })
    .slice(0, 5)
);

const rangeLabel = computed(() => {
  if (range.value === "daily") return "Daily";
  if (range.value === "weekly") return "Weekly";
  return "Monthly";
});

// --- CHART BUILDING ---
const buildChart = () => {
  const data = groupedSeries.value;
  if (!chartCanvas.value || !data.length) {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    return;
  }

  const labels = data.map((d) => d.label);
  const incomeData = data.map((d) => d.income);
  const expenseData = data.map((d) => d.expense);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "rgba(25, 135, 84, 1)", // bootstrap green
          backgroundColor: "rgba(25, 135, 84, 0.18)",
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: "rgba(220, 53, 69, 1)", // bootstrap red
          backgroundColor: "rgba(220, 53, 69, 0.18)",
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
        easing: "easeOutCubic",
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              ` ₱${Number(ctx.parsed.y || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `₱${Number(value).toLocaleString()}`,
          },
        },
      },
    },
  });
};

onMounted(() => {
  fetchTransactions();
});

// rebuild chart when range or data changes
watch([range, groupedSeries], () => {
  buildChart();
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
});
</script>

<style scoped>
.card {
  border-radius: 18px;
}

canvas {
  transition: transform 0.2s ease-out;
}

canvas:hover {
  transform: scale(1.01);
}
</style>
