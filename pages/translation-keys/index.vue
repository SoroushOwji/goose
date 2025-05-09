<script lang="ts" setup>
import { useTranslationKeys } from "~/composables/useTranslationKeys";
import { debounce } from "~/utils/debounce";
import { ref } from "vue";
import SearchFilters from "./components/search-filters.vue";
import TranslationKeysTable from "./components/translation-keys-table.vue";
import Pagination from "./components/pagination.vue";

const { translationKeys, isLoading, fetchTranslationKeys, error } =
  useTranslationKeys();
const searchQuery = ref("");
const dateRange = ref({ start: "", end: "" });
const currentPage = ref(1);
const pageSize = ref(10);

const fetchKeys = () => {
  const filters: Record<string, any> = {};
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

const resetFilters = () => {
  searchQuery.value = "";
  dateRange.value = { start: "", end: "" };
  pageSize.value = 10;
  currentPage.value = 1;
  fetchKeys();
};

const handleDateRangeChange = (newDateRange: {
  start: string;
  end: string;
}) => {
  dateRange.value = newDateRange;
  if (newDateRange.start && newDateRange.end) {
    fetchKeys();
  }
};

const handleSearchQueryChange = (newSearchQuery: string) => {
  searchQuery.value = newSearchQuery;
  handleSearch();
};

const handlePageSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize;
  fetchKeys();
};

fetchKeys();
</script>

<template>
  <div class="translation-keys">
    <h1 class="translation-keys__title">Translation Keys</h1>
    <search-filters
      :searchQuery="searchQuery"
      :dateRange="dateRange"
      :pageSize="pageSize"
      @update:searchQuery="handleSearchQueryChange"
      @update:dateRange="handleDateRangeChange"
      @update:pageSize="handlePageSizeChange"
      :resetFilters="resetFilters"
    />
    <translation-keys-table
      :translationKeys="translationKeys"
      :error="error"
      :isLoading="isLoading"
    />
    <pagination
      :currentPage="currentPage"
      :isLoading="isLoading"
      @increment="handlePageIncrement"
      @decrement="handlePageDecrement"
    />
  </div>
</template>

<style scoped lang="scss">
.translation-keys {
  margin: 2rem 5rem;

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
}
</style>
