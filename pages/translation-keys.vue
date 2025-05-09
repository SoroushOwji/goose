<script lang="ts" setup>
import { useTranslationKeys } from "~/composables/useTranslationKeys";
import { formatRelativeTime } from "~/utils/formatRelativeTime";
import { debounce } from "~/utils/debounce";
import { ref } from "vue";
import tooltip from "~/components/tooltip.vue";
import translation from "~/components/translation.vue";
import SearchFilters from "~/components/search-filters.vue";

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

fetchKeys();
</script>

<template>
  <div class="translation-keys">
    <h1 class="translation-keys__title">Translation Keys</h1>
    <search-filters
      :searchQuery="searchQuery"
      :dateRange="dateRange"
      :pageSize="pageSize"
      @update:searchQuery="
        (value) => {
          searchQuery = value;
          handleSearch();
        }
      "
      @update:dateRange="
        (value) => {
          dateRange = value;
          handleSearch();
        }
      "
      @update:pageSize="
        (value) => {
          pageSize = value;
          handleSearch();
        }
      "
      :resetFilters="resetFilters"
    />
    <div class="translation-keys__table-container">
      <table class="translation-keys__table">
        <thead>
          <tr>
            <th class="translation-keys__table-header">Key</th>
            <th class="translation-keys__table-header">Translation Value</th>
            <th class="translation-keys__table-header">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="translationKey in translationKeys"
            :key="translationKey.key"
            class="translation-keys__table-row"
          >
            <td class="translation-keys__table-cell">
              {{ translationKey.key }}
            </td>
            <td class="translation-keys__table-cell">
              <tooltip>
                <template #title>
                  <translation :translation="translationKey.translations[0]" />
                </template>
                <template #tooltip>
                  <div
                    v-for="translation in translationKey.translations"
                    :key="translation.id"
                  >
                    <translation :translation="translation" />
                  </div>
                </template>
              </tooltip>
            </td>
            <td class="translation-keys__table-cell">
              {{
                formatRelativeTime(
                  translationKey.updatedAt || translationKey.createdAt
                )
              }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="error" class="translation-keys__error">
        <p>
          Something went wrong while fetching the data. Please try again later.
        </p>
        <p>Error: {{ error }}</p>
      </div>
      <loading v-else-if="isLoading" />
      <div
        v-else-if="!translationKeys.length"
        class="translation-keys__no-keys"
      >
        No keys found.
      </div>
    </div>

    <div class="translation-keys__pagination">
      <button
        class="translation-keys__pagination-button"
        @click="handlePageDecrement"
        :disabled="currentPage === 1 || isLoading"
        :aria-label="'Previous Page'"
      >
        <span v-if="isLoading && currentPage === 1">...</span>
        <span v-else><</span>
      </button>
      <span class="translation-keys__pagination-info"
        >Page {{ currentPage }}</span
      >
      <button
        class="translation-keys__pagination-button"
        @click="handlePageIncrement"
        :disabled="isLoading"
        :aria-label="'Next Page'"
      >
        <span v-if="isLoading && currentPage > 1">...</span>
        <span v-else>></span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.translation-keys {
  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  &__search-container {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
    padding: 10px;
  }

  &__label {
    font-weight: bold;
  }

  &__input {
    padding: 5px;
    height: 2rem;
    min-width: 5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  &__select {
    min-width: 6rem;
  }

  &__reset-button {
    padding: 5px 10px;
    background-color: #e74c3c;
    height: 2rem;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #c0392b;
    }
  }

  &__table-container {
    position: relative;
    min-height: 400px;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
  }

  &__table-header {
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  &__table-row {
    &:nth-child(even) {
      background-color: #f9f9f9;
    }
  }

  &__table-cell {
    border: 1px solid #ddd;
    padding: 8px;
  }

  &__error {
    color: #e74c3c;
    background-color: #fce4e4;
    padding: 10px;
    border-radius: 4px;
    margin-top: 10px;
  }

  &__no-keys {
    text-align: center;
    margin-top: 20px;
    font-style: italic;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 10px;
  }

  &__pagination-button {
    border: none;
    width: 2rem;
    height: 2rem;
    color: #3498db;
    background-color: transparent;

    cursor: pointer;
    border-radius: 4px;

    &:disabled {
      background-color: #ccc;
      color: white;
      cursor: not-allowed;
    }
    &:hover:not(:disabled) {
      background-color: #3498db;
      color: white;
    }
  }

  &__pagination-info {
    font-weight: bold;
  }
}
</style>
