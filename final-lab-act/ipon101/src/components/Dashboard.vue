<template>
  <div class="dashboard-page">
    <!-- Header -->
    <header class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
      <div>
        <h1 class="page-title mb-1">Dashboard</h1>
        <p class="page-subtitle mb-0">
          Overview of your income and expenses over time.
        </p>
      </div>

      <div class="d-flex flex-column align-items-end gap-2">
        <span v-if="lastUpdated" class="badge last-updated-badge">
          Updated: {{ lastUpdated }}
        </span>
        <span v-if="savingsRateDisplay !== null" class="badge savings-badge">
          Savings rate: {{ savingsRateDisplay }}%
        </span>
      </div>
    </header>

    <!-- Summary cards -->
    <section class="row g-3 mb-3">
      <div class="col-md-4">
        <div class="card summary-card h-100">
          <div class="card-body">
            <p class="summary-label mb-1">Total Income</p>
            <h3 class="summary-value text-income mb-0">
              ₱{{ totalIncome.toLocaleString() }}
            </h3>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card summary-card h-100">
          <div class="card-body">
            <p class="summary-label mb-1">Total Expenses</p>
            <h3 class="summary-value text-expense mb-0">
              ₱{{ totalExpense.toLocaleString() }}
            </h3>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card summary-card h-100">
          <div class="card-body">
            <p class="summary-label mb-1">Balance</p>
            <h3
              class="summary-value mb-1"
              :class="balance >= 0 ? 'text-balance-positive' : 'text-balance-negative'"
            >
              ₱{{ balance.toLocaleString() }}
            </h3>
            <small class="text-muted" v-if="savingsMessage">
              {{ savingsMessage }}
            </small>
          </div>
        </div>
      </div>
    </section>

    <!-- Range toggle + info -->
    <section class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <div class="small text-muted">
        Expense breakdown based on
        <span class="fw-semibold">{{ rangeLabel.toLowerCase() }}</span>
        range.
      </div>
      <div class="btn-group range-toggle" role="group">
        <button
          type="button"
          class="btn btn-sm"
          :class="range === 'daily' ? 'btn-primary' : 'btn-outline-primary'"
          @click="setRange('daily')"
        >
          Daily
        </button>
        <button
          type="button"
          class="btn btn-sm"
          :class="range === 'weekly' ? 'btn-primary' : 'btn-outline-primary'"
          @click="setRange('weekly')"
        >
          Weekly
        </button>
        <button
          type="button"
          class="btn btn-sm"
          :class="range === 'monthly' ? 'btn-primary' : 'btn-outline-primary'"
          @click="setRange('monthly')"
        >
          Monthly
        </button>
      </div>
    </section>

    <!-- Chart + recent list -->
    <section class="row g-4 align-items-stretch">
      <!-- Left: charts -->
      <div class="col-lg-8">
        <div class="card panel-card h-100">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <div>
                <h5 class="card-title mb-1">Expense Breakdown</h5>
                <small class="text-muted">
                  <template v-if="range === 'daily'">
                    Each slice is a specific expense for the latest spending day.
                  </template>
                  <template v-else-if="range === 'weekly'">
                    Each slice is a specific expense in the last 7 days, labeled by day.
                  </template>
                  <template v-else>
                    Each slice in the main chart is a specific expense for this month,
                    and the mini chart summarizes by category.
                  </template>
                </small>
              </div>
            </div>

            <!-- MAIN CHART -->
            <div
              v-if="loading"
              class="empty-state flex-grow-1 d-flex align-items-center justify-content-center"
            >
              Loading chart…
            </div>

            <div
              v-else-if="!pieHasData"
              class="empty-state flex-grow-1 d-flex align-items-center justify-content-center"
            >
              No expenses yet for this range.
            </div>

            <div
              v-else
              class="d-flex flex-grow-1 align-items-center justify-content-center chart-wrapper"
            >
              <div class="position-relative chart-container">
                <canvas ref="chartCanvas"></canvas>
                <div class="chart-center-text">
                  <div class="label">BALANCE</div>
                  <div
                    class="value"
                    :class="balance >= 0 ? 'text-balance-positive' : 'text-balance-negative'"
                  >
                    ₱{{ balance.toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>

            <!-- MAIN CHART TIP -->
            <div v-if="pieHasData" class="mt-3 small text-muted">
              <span class="fw-semibold">Tip:</span>
              Hover on a slice to see the amount and percentage.
            </div>

            <!-- MONTHLY CATEGORY MINI CHART -->
            <div v-if="range === 'monthly'" class="mt-4">
              <h6 class="mini-title mb-2">
                Monthly Category Overview
              </h6>

              <div v-if="!categoryPieHasData" class="small text-muted">
                No category data yet for this month.
              </div>

              <div
                v-else
                class="mini-chart-wrapper d-flex justify-content-center"
              >
                <div class="mini-chart-container position-relative">
                  <canvas ref="categoryChartCanvas"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: recent transactions -->
      <div class="col-lg-4">
        <div class="card panel-card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-3">Recent Transactions</h5>

            <p
              v-if="recentTransactions.length === 0"
              class="text-muted mb-0 empty-state"
            >
              No transactions yet. Start adding income or expenses!
            </p>

            <ul
              v-else
              class="list-group list-group-flush recent-list flex-grow-1"
            >
              <li
                v-for="t in recentTransactions"
                :key="t.id"
                class="list-group-item d-flex justify-content-between align-items-center recent-item"
              >
                <div class="me-2">
                  <div class="recent-desc">
                    {{ t.description || getCategoryLabel(t) || "Transaction" }}
                  </div>
                  <small class="text-muted">
                    {{ formattedTxDate(t) }}
                  </small>
                </div>
                <span
                  class="fw-bold"
                  :class="(t.type || t.transaction_type) === 'income'
                    ? 'text-income'
                    : 'text-expense'"
                >
                  {{ (t.type || t.transaction_type) === "income" ? "+" : "-" }}
                  ₱{{ Number(t.amount).toLocaleString() }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  computed,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

/* ---------- refs & state ---------- */
const chartCanvas = ref(null);
const categoryChartCanvas = ref(null);

let chartInstance = null;
let categoryChartInstance = null;

const transactions = ref([]);
const categories = ref([]);

const loading = ref(true);
const lastUpdated = ref("");
const error = ref("");

const range = ref("daily"); // "daily" | "weekly" | "monthly"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/* ---------- 1. LOAD TRANSACTIONS & CATEGORIES ---------- */
const fetchTransactions = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("auth_token");

    const res = await axios.get(`${API_BASE}/api/transactions`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    transactions.value = Array.isArray(res.data) ? res.data : [];
    lastUpdated.value = new Date().toLocaleString();
  } catch (e) {
    console.error(e);
    error.value = "Failed to load transactions.";
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    const res = await axios.get(`${API_BASE}/api/categories`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    categories.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error("Failed to load categories", e);
  }
};

const setRange = (r) => {
  range.value = r;
};

/* ---------- 2. DATE HELPERS ---------- */
const getRawDate = (t) =>
  t.transactionDate ||
  t.transaction_date ||
  t.date ||
  t.createdAt ||
  t.created_at ||
  null;

const parseTxDate = (t) => {
  const raw = getRawDate(t);
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d)) return null;
  return d;
};

/* ---------- 3. CATEGORY HELPER ---------- */
const getCategoryLabel = (t) => {
  const catId = t.categoryId || t.category_id || null;

  if (catId != null && categories.value.length) {
    const cat = categories.value.find((c) => c.id === catId);
    if (cat && cat.name) {
      return String(cat.name).trim();
    }
  }

  // fallbacks for any old/legacy data
  if (t.category && String(t.category).trim()) {
    return String(t.category).trim();
  }
  if (t.category_name && String(t.category_name).trim()) {
    return String(t.category_name).trim();
  }
  if (t.categoryName && String(t.categoryName).trim()) {
    return String(t.categoryName).trim();
  }

  return "Uncategorized";
};

/* ---------- 4. RUNNING TOTALS (CARDS) ---------- */
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

const savingsRate = computed(() => {
  if (totalIncome.value <= 0) return null;
  const rate = balance.value / totalIncome.value;
  return rate < 0 ? 0 : rate;
});

const savingsRateDisplay = computed(() => {
  if (savingsRate.value === null) return null;
  return Math.round(savingsRate.value * 100);
});

const savingsMessage = computed(() => {
  if (savingsRate.value === null) return "";
  const r = savingsRate.value;
  if (r >= 0.5) return "Amazing! You're saving more than half of what you earn.";
  if (r >= 0.25) return "Nice! You're saving a healthy part of your income.";
  if (r > 0) return "You’re saving a bit — keep going.";
  if (balance.value === 0) return "You’re breaking even right now.";
  return "You’re spending more than you earn. Time to adjust a bit.";
});

/* ---------- 5. RANGE LABEL ---------- */
const rangeLabel = computed(() => {
  if (range.value === "daily") return "Daily";
  if (range.value === "weekly") return "Weekly";
  return "Monthly";
});

/* ---------- 6. RECENT TRANSACTIONS ---------- */
const recentTransactions = computed(() =>
  [...transactions.value]
    .sort((a, b) => {
      const da = parseTxDate(a) || new Date(0);
      const db = parseTxDate(b) || new Date(0);
      return db - da;
    })
    .slice(0, 10)
);

const formattedTxDate = (t) => {
  const d = parseTxDate(t);
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* ---------- 7. FILTERED EXPENSES FOR CHART ---------- */
/*
  DAILY   → latest spending day
  WEEKLY  → last 7 days (today and 6 days before)
  MONTHLY → current calendar month
*/
const filteredExpensesForChart = computed(() => {
  const all = transactions.value || [];

  const expenses = all.filter(
    (t) => (t.type || t.transaction_type || "expense") !== "income"
  );
  if (!expenses.length) return [];

  const withDates = expenses
    .map((t) => ({ t, d: parseTxDate(t) }))
    .filter((x) => x.d);
  if (!withDates.length) return [];

  const now = new Date();

  if (range.value === "weekly") {
    const sevenDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6
    );

    return withDates
      .filter(({ d }) => d >= sevenDaysAgo && d <= now)
      .map((x) => x.t);
  }

  if (range.value === "monthly") {
    return withDates
      .filter(
        ({ d }) =>
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth()
      )
      .map((x) => x.t);
  }

  // DAILY – latest spending day
  const latestTime = Math.max(...withDates.map((x) => x.d.getTime()));
  const latestDate = new Date(latestTime);

  return withDates
    .filter(({ d }) => d.toDateString() === latestDate.toDateString())
    .map((x) => x.t);
});

/* ---------- 8. MAIN PIE BREAKDOWN ---------- */
const getDescOrCategory = (t) =>
  (t.description && t.description.trim()) ||
  getCategoryLabel(t) ||
  "Other";

const expenseBreakdown = computed(() => {
  const map = new Map();
  const data = filteredExpensesForChart.value;

  if (!data.length) return [];

  if (range.value === "weekly") {
    // WEEKLY → group by day label (Mon, Tue, etc.) but keep per-day details
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    data.forEach((t) => {
      const d = parseTxDate(t);
      if (!d) return;

      const dayLabel = dayNames[d.getDay()]; // "Tue"
      const amount = Number(t.amount) || 0;
      if (!amount) return;

      if (!map.has(dayLabel)) {
        map.set(dayLabel, { amount: 0, details: [] });
      }

      const info = map.get(dayLabel);
      info.amount += amount;

      const desc = getDescOrCategory(t); // e.g. "Bus"
      info.details.push(`${desc} – ₱${amount.toLocaleString()}`);
    });
  } else {
    // DAILY & MONTHLY → keep detailed labels, but still track details
    data.forEach((t) => {
      const label = getDescOrCategory(t);
      const amount = Number(t.amount) || 0;
      if (!amount) return;

      if (!map.has(label)) {
        map.set(label, { amount: 0, details: [] });
      }

      const info = map.get(label);
      info.amount += amount;
      info.details.push(`₱${amount.toLocaleString()}`);
    });
  }

  return Array.from(map.entries()).map(([label, info]) => ({
    label,
    amount: info.amount,
    details: info.details,
  }));
});




const pieHasData = computed(() => expenseBreakdown.value.length > 0);

/* ---------- 9. MONTHLY CATEGORY BREAKDOWN (MINI CHART) ---------- */
const monthlyCategoryBreakdown = computed(() => {
  if (range.value !== "monthly") return [];

  const all = transactions.value || [];
  const now = new Date();

  // 🔹 1) Only current month (income + expense)
  const thisMonth = all.filter((t) => {
    const d = parseTxDate(t);
    if (!d) return false;
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  });

  // 🔹 2) Group by category
  const map = new Map();
  thisMonth.forEach((t) => {
    const categoryLabel = getCategoryLabel(t) || "Uncategorized";
    const amount = Number(t.amount) || 0;
    if (!amount) return;
    map.set(categoryLabel, (map.get(categoryLabel) || 0) + amount);
  });

  return Array.from(map.entries()).map(([label, amount]) => ({
    label,
    amount,
  }));
});


const categoryPieHasData = computed(
  () => monthlyCategoryBreakdown.value.length > 0
);

/* ---------- 10. BUILD MAIN CHART ---------- */
const buildChart = () => {
  const breakdown = expenseBreakdown.value;

  if (!chartCanvas.value || !breakdown.length) {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    return;
  }

  const labels = breakdown.map((b) => b.label);
  const data = breakdown.map((b) => b.amount);
  const detailsList = breakdown.map((b) => b.details || []);
  const total = data.reduce((s, v) => s + v, 0);

  // Colors: weekly uses day-based palette, others use generic palette
  const baseColors = [
    "#22c55e",
    "#4ade80",
    "#0ea5e9",
    "#22d3ee",
    "#eab308",
    "#facc15",
    "#fb923c",
    "#f97316",
  ];

  let backgroundColors;
  if (range.value === "weekly") {
    const weeklyPalette = {
      Mon: "#22c55e",
      Tue: "#0ea5e9",
      Wed: "#f97316",
      Thu: "#a855f7",
      Fri: "#eab308",
      Sat: "#facc15",
      Sun: "#fb7185",
    };
    backgroundColors = labels.map(
      (lbl, i) => weeklyPalette[lbl] || baseColors[i % baseColors.length]
    );
  } else {
    backgroundColors = labels.map(
      (_, i) => baseColors[i % baseColors.length]
    );
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: "#020617",
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            color: "#e5e7eb",
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const idx = ctx.dataIndex;
              const label = labels[idx] || "";
              const value = ctx.parsed || 0;
              const totalVal = total || 1;
              const percent = ((value / totalVal) * 100).toFixed(1);

              const base = `${label}: ₱${Number(value).toLocaleString()} (${percent}%)`;

              // For WEEKLY → append the list of that day's transactions
              if (range.value === "weekly") {
                const extras = detailsList[idx];
                if (extras && extras.length) {
                  // Returning an array = multi-line tooltip
                  return [base, ...extras.map((d) => `• ${d}`)];
                }
              }

              return base;
            },
          },
        },
      },
      animation: {
        duration: 700,
        easing: "easeOutCubic",
      },
    },
  });
};


/* ---------- 11. BUILD MONTHLY CATEGORY MINI CHART ---------- */
const buildCategoryChart = () => {
  if (range.value !== "monthly") {
    if (categoryChartInstance) {
      categoryChartInstance.destroy();
      categoryChartInstance = null;
    }
    return;
  }

  const breakdown = monthlyCategoryBreakdown.value;

  if (!categoryChartCanvas.value || !breakdown.length) {
    if (categoryChartInstance) {
      categoryChartInstance.destroy();
      categoryChartInstance = null;
    }
    return;
  }

  const labels = breakdown.map((b) => b.label);
  const data = breakdown.map((b) => b.amount);
  const total = data.reduce((s, v) => s + v, 0);

  const baseColors = [
    "#22c55e",
    "#4ade80",
    "#0ea5e9",
    "#22d3ee",
    "#eab308",
    "#facc15",
    "#fb923c",
    "#f97316",
  ];
  const backgroundColors = labels.map(
    (_, i) => baseColors[i % baseColors.length]
  );

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  categoryChartInstance = new Chart(categoryChartCanvas.value, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: "#020617",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            color: "#e5e7eb",
            font: {
              size: 10,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const label = ctx.label || "";
              const value = ctx.parsed || 0;
              const totalVal = total || 1;
              const percent = ((value / totalVal) * 100).toFixed(1);
              return `${label}: ₱${Number(value).toLocaleString()} (${percent}%)`;
            },
          },
        },
      },
      animation: {
        duration: 500,
        easing: "easeOutCubic",
      },
    },
  });
};

/* ---------- 12. LIFECYCLE & WATCHERS ---------- */
onMounted(async () => {
  await Promise.all([fetchTransactions(), fetchCategories()]);
  buildChart();
  buildCategoryChart();
});

watch([range, expenseBreakdown], async () => {
  await nextTick();
  buildChart();
});

watch([range, monthlyCategoryBreakdown], async () => {
  await nextTick();
  buildCategoryChart();
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
  if (categoryChartInstance) categoryChartInstance.destroy();
});
</script>

<style scoped>
.dashboard-page {
  padding-top: 0.5rem;
  padding-bottom: 2rem;
}

/* Header */
.page-title {
  font-weight: 700;
  font-size: 1.9rem;
  letter-spacing: 0.02em;
  color: #f9fafc;
}

.page-subtitle {
  color: #9ca3af;
  font-size: 0.95rem;
}

.last-updated-badge {
  background-color: #020617;
  color: #9ca3af;
  border: 1px solid #1f2937;
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
  border-radius: 999px;
}

.savings-badge {
  background-color: rgba(250, 204, 21, 0.08);
  color: #facc15;
  border: 1px solid rgba(250, 204, 21, 0.5);
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
  border-radius: 999px;
}

/* Summary cards */
.summary-card {
  border-radius: 18px;
  border: 1px solid #111827;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.6);
  background: radial-gradient(
    circle at top left,
    #020617 0,
    #020617 45%,
    #020617 100%
  );
}

.summary-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.summary-value {
  font-weight: 700;
  font-size: 1.6rem;
}

/* Text colors */
.text-income {
  color: #22c55e;
}

.text-expense {
  color: #fb7185;
}

.text-balance-positive {
  color: #4ade80;
}

.text-balance-negative {
  color: #fb7185;
}

/* Shared panel card style (chart + recent box) */
.panel-card {
  border-radius: 20px;
  border: 1px solid #111827;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7);
  background: radial-gradient(
    circle at top left,
    #020617 0,
    #020617 40%,
    #020617 100%
  );
}

/* Range buttons */
.range-toggle .btn {
  min-width: 70px;
  border-radius: 999px !important;
}

.range-toggle .btn-outline-primary {
  background-color: transparent;
  border-color: #1f2937;
  color: #e5e7eb;
}

.range-toggle .btn-primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-color: #16a34a;
  color: #022c22;
}

/* Muted text */
.small.text-muted,
.text-muted {
  color: #9ca3af !important;
}

/* Empty */
.empty-state {
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
}

/* Recent list */
.recent-list {
  margin-top: -0.25rem;
}

.recent-item {
  border: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #111827;
  background: transparent;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-desc {
  font-weight: 500;
  color: #e5e7eb;
}

/* Main doughnut chart wrapper */
.chart-wrapper {
  width: 100%;
}

.chart-container {
  position: relative;
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  height: 360px;
}

.chart-center-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.chart-center-text .label {
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.chart-center-text .value {
  font-weight: 700;
  font-size: 1.6rem;
}

/* Main chart canvas */
canvas {
  transition: transform 0.18s ease-out, box-shadow 0.18s ease-out;
  border-radius: 14px;
}

canvas:hover {
  transform: scale(1.01);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.9);
}

/* Monthly mini chart */
.mini-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #9ca3af;
}

.mini-chart-wrapper {
  width: 100%;
}

.mini-chart-container {
  width: 260px;
  height: 200px;
}
</style>
