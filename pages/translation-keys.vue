<script lang="ts" setup>
import { useTranslationKeys } from "~/composables/useTranslationKeys";
import { formatRelativeTime } from "~/utils/formatRelativeTime";
import { debounce } from "~/utils/debounce";
import { ref } from "vue";

const { translationKeys, isLoading, fetchTranslationKeys } =
  useTranslationKeys();
const searchQuery = ref("");

const dateRange = ref({ start: "", end: "" });
const currentPage = ref(1);
const pageSize = ref(20);
const tooltipContent = ref(""); // Tooltip content
const isTooltipVisible = ref(false); // Tooltip visibility

const fetchKeys = () => {
  const filters: any = {};
  if (searchQuery.value) {
    filters.key = { _contains: searchQuery.value };
  }
  if (dateRange.value.start && dateRange.value.end) {
    filters.updatedAt = {
      _between: [dateRange.value.start, dateRange.value.end],
    };
  }
  fetchTranslationKeys(filters, currentPage.value, pageSize.value);
};

const handleSearch = debounce(() => {
  currentPage.value = 1;
  fetchKeys();
}, 300);

// function to handle a debounce on date range input and also reset the page to 1

// Function to show tooltip
// const showTooltip = (translations: any[]) => {
//   tooltipContent.value = translations.map((t) => t.value).join(", "); // Combine translations
//   isTooltipVisible.value = true;
// };

// Function to hide tooltip
// const hideTooltip = () => {
//   isTooltipVisible.value = false;
// };

const handlePageIncrement = () => {
  currentPage.value++;
  fetchKeys();
};
const handlePageDecrement = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchKeys();
  }
};

fetchKeys();
</script>

<template>
  <div>
    <h1>Translation Keys</h1>
    <div class="search-container">
      <label for="search">Search:</label>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by key"
        @input="handleSearch"
      />
      <input type="date" v-model="dateRange.start" @change="handleSearch" />
      <input type="date" v-model="dateRange.end" @change="handleSearch" />
      <select v-model="pageSize" @change="handleSearch">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="50">50</option>
      </select>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Translation Value</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in translationKeys" :key="key.id">
            <td>{{ key.key }}</td>
            <td>{{ key.translations[0]?.value }}</td>
            <td>{{ formatRelativeTime(key.updatedAt || key.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="isLoading" class="loading">Loading...</div>
      <div v-else-if="!translationKeys.length">No keys found.</div>
    </div>

    <div class="pagination">
      <button @click="handlePageDecrement" :disabled="currentPage === 1">
        <
      </button>
      <span>Page {{ currentPage }}</span>
      <button @click="handlePageIncrement">></button>
    </div>

    <!-- Tooltip -->
    <div v-if="isTooltipVisible" class="tooltip">
      {{ tooltipContent }}
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}
.tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
}
.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
  padding: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
}

.table-container {
  position: relative;
  min-height: 400px;
}
</style>
