<script lang="ts" setup>
import { useTranslationKeys } from "./composables/useTranslationKeys";
import SearchFilters from "./components/search-filters.vue";
import TranslationKeysTable from "./components/translation-keys-table.vue";
import Pagination from "./components/pagination.vue";

const {
  translationKeys,
  isLoading,
  error,
  searchQuery,
  dateRange,
  currentPage,
  pageSize,
  totalCount,
  handleSearchQueryChange,
  handleDateRangeChange,
  handlePageSizeChange,
  handlePageIncrement,
  handlePageDecrement,
  resetFilters,
} = useTranslationKeys();
</script>

<template>
  <div class="translation-keys">
    <h1 class="translation-keys__title">Translation Keys {{ totalCount }}</h1>
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
      :totalCount="totalCount"
      :pageSize="pageSize"
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
