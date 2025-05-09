import { ref } from "vue";
import type { DirectusTranslation } from "~/types.d";

export function useTranslationKeys() {
  const translationKeys = ref<DirectusTranslation[]>([]);
  const isLoading = ref(false);
  const error = ref<null | string>(null);

  async function fetchTranslationKeys<T>(
    filter: Record<string, any> = {},
    page: number = 1,
    limit: number = 10
  ) {
    isLoading.value = true;

    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      }).toString();

      const url = new URL("https://directus.altura.io/items/translationKeys");
      url.searchParams.append("sort", "-createdAt");
      url.searchParams.append("fields", "*,translations.*");
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("filter", JSON.stringify(filter));

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const { data } = await response.json();
      translationKeys.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      isLoading.value = false;
    }
  }

  return { translationKeys, isLoading, error, fetchTranslationKeys };
}
