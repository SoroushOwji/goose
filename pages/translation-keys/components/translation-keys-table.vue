<script lang="ts" setup>
import tooltip from "~/atoms/tooltip.vue";
import translation from "~/atoms/translation.vue";
import loading from "~/atoms/loading.vue";
import { formatRelativeTime } from "~/utils/formatRelativeTime";
import type { DirectusTranslation } from "~/types.d";

defineProps<{
  translationKeys: DirectusTranslation[];
  isLoading: boolean;
  error: string | null;
}>();
</script>

<template>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th class="table__header">Key</th>
          <th class="table__header">Translation Value</th>
          <th class="table__header">Last Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="translationKey in translationKeys"
          :key="translationKey.key"
          class="table__row"
        >
          <td class="table__cell">
            {{ translationKey.key }}
          </td>
          <td class="table__cell">
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
          <td class="table__cell">
            {{
              formatRelativeTime(
                translationKey.updatedAt || translationKey.createdAt
              )
            }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="error" class="error">
      <p>
        Something went wrong while fetching the data. Please try again later.
      </p>
      <p>Error: {{ error }}</p>
    </div>
    <loading v-else-if="isLoading" />
    <div v-else-if="!translationKeys.length" class="no-keys">
      No keys found.
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-container {
  position: relative;
  min-height: 400px;

  .table {
    width: 100%;
    border-collapse: collapse;

    &__header {
      background-color: #f4f4f4;
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    &__row:nth-child(even) {
      background-color: #f9f9f9;
    }

    &__cell {
      border: 1px solid #ddd;
      padding: 8px;
    }
  }

  .error {
    color: #e74c3c;
    background-color: #fce4e4;
    padding: 10px;
    border-radius: 4px;
    margin-top: 10px;
  }

  .no-keys {
    text-align: center;
    margin-top: 20px;
    font-style: italic;
  }
}
</style>
