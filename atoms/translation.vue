<script lang="ts" setup>
import type { TranslationValue } from "~/types.d";

const languageToFlagMap: Record<string, string> = {
  "en-GB": "🇬🇧",
  "fr-FR": "🇫🇷",
  "nl-NL": "🇳🇱",
  "de-DE": "🇩🇪",
};

defineProps<{
  translation: TranslationValue;
}>();
</script>

<template>
  <div>
    {{ languageToFlagMap[translation.languages_code] }}
    {{ translation.value }}
  </div>
</template>
