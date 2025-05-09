<script lang="ts" setup>
import { computed } from "vue";

const { dateRange } = defineProps<{
  searchQuery: string;
  dateRange: {
    start: string;
    end: string;
  };
  pageSize: number;
  resetFilters: () => void;
}>();

defineEmits(["update:searchQuery", "update:dateRange", "update:pageSize"]);

const isDateRangeIncomplete = computed(
  () =>
    (dateRange.start && !dateRange.end) || (!dateRange.start && dateRange.end)
);
</script>

<template>
  <div class="search-filters">
    <label for="search" class="search-filters__label">Search:</label>
    <input
      id="search"
      class="search-filters__input"
      type="text"
      :value="searchQuery"
      placeholder="Search by key"
      @input="
        $emit('update:searchQuery', ($event.target as HTMLInputElement).value)
      "
    />

    <label for="start-date" class="search-filters__label">Start Date:</label>
    <input
      id="start-date"
      class="search-filters__input"
      type="date"
      :value="dateRange.start"
      @change="
        $emit('update:dateRange', {
          ...dateRange,
          start: ($event.target as HTMLInputElement).value,
        })
      "
    />

    <label for="end-date" class="search-filters__label">End Date:</label>
    <input
      id="end-date"
      class="search-filters__input"
      type="date"
      :value="dateRange.end"
      :disabled="!dateRange.start"
      @change="
        $emit('update:dateRange', {
          ...dateRange,
          end: ($event.target as HTMLInputElement).value,
        })
      "
    />

    <p v-if="isDateRangeIncomplete" class="search-filters__validation">
      Both start and end dates must be filled for the date range filter to work.
    </p>

    <label for="page-size" class="search-filters__label">Page Size:</label>
    <select
      id="page-size"
      class="search-filters__input search-filters__select"
      :value="pageSize"
      @change="
        $emit(
          'update:pageSize',
          Number(($event.target as HTMLSelectElement).value)
        )
      "
    >
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="30">30</option>
      <option value="50">50</option>
    </select>

    <button class="search-filters__reset-button" @click="resetFilters">
      Reset Filters
    </button>
  </div>
</template>

<style scoped lang="scss">
.search-filters {
  display: flex;
  position: relative;
  gap: 10px;
  margin-bottom: 2rem;
  align-items: center;
  padding: 10px;

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

  &__validation {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: -5px;
    position: absolute;
    top: 3.5rem;
  }
}
</style>
