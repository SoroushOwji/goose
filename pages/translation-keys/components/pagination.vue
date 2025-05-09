<script lang="ts" setup>
import { computed } from "vue";

const { totalCount, pageSize, currentPage } = defineProps<{
  currentPage: number;
  isLoading: boolean;
  totalCount: number;
  pageSize: number;
}>();

const lastPage = computed(() => Math.ceil(totalCount / pageSize));

const emit = defineEmits(["increment", "decrement"]);
</script>

<template>
  <div class="pagination">
    <button
      class="pagination__button"
      @click="emit('decrement')"
      :disabled="currentPage === 1 || isLoading"
      :aria-label="'Previous Page'"
    >
      <span v-if="isLoading && currentPage === 1">...</span>
      <span v-else><</span>
    </button>
    <span class="pagination__info"
      >Page {{ currentPage }} / {{ lastPage }}</span
    >
    <button
      class="pagination__button"
      @click="emit('increment')"
      :disabled="currentPage === lastPage || isLoading"
      :aria-label="'Next Page'"
    >
      <span v-if="isLoading && currentPage > 1">...</span>
      <span v-else>></span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;

  &__button {
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

  &__info {
    font-weight: bold;
  }
}
</style>
