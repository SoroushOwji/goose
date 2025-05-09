import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "~/utils/debounce";
import { buildUrlWithParams } from "~/utils/urlBuilder";
import type { DirectusTranslation } from "~/types.d";
import fetchWithRetry from "~/utils/fetchWithRetry";

export function useTranslationKeys() {
  const route = useRoute();
  const router = useRouter();
  const debouncedSearch = debounce(fetchKeys, 300);

  const translationKeys = ref<DirectusTranslation[]>([]);
  const totalCount = ref(0);
  const isLoading = ref(false);
  const error = ref<null | string>(null);

  const initialSearchQuery = route.query.searchQuery || "";
  const initialStartDate = route.query.startDate || "";
  const initialEndDate = route.query.endDate || "";
  const initialPage = route.query.page || 1;
  const initialPageSize = route.query.pageSize || 10;

  const searchQuery = ref(String(initialSearchQuery));
  const dateRange = ref({
    start: String(initialStartDate),
    end: String(initialEndDate),
  });
  const currentPage = ref(Number(initialPage));
  const pageSize = ref(Number(initialPageSize));

  async function fetchTranslationKeys(
    filter: Record<string, any> = {},
    page: number = 1,
    limit: number = 10
  ) {
    isLoading.value = true;

    try {
      const url = buildUrlWithParams(
        "https://directus.altura.io/items/translationKeys",
        {
          sort: "-createdAt",
          fields: "*,translations.*",
          page: page.toString(),
          limit: limit.toString(),
          filter: JSON.stringify(filter),
        }
      );

      const countUrl = buildUrlWithParams(
        "https://directus.altura.io/items/translationKeys",
        {
          filter: JSON.stringify(filter),
          "aggregate[count]": "*",
        }
      );

      const [response, countResponse] = await Promise.all([
        fetchWithRetry<DirectusTranslation[]>(url),
        fetchWithRetry<{ count: string }[]>(countUrl),
      ]);

      translationKeys.value = response;
      totalCount.value = Number(countResponse[0].count);
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      isLoading.value = false;
    }
  }

  function fetchKeys() {
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
  }

  function updateQueryParams() {
    router.push({
      query: {
        searchQuery: searchQuery.value || undefined,
        startDate: dateRange.value.start || undefined,
        endDate: dateRange.value.end || undefined,
        page:
          currentPage.value !== 1 ? currentPage.value.toString() : undefined,
        pageSize: pageSize.value !== 10 ? pageSize.value.toString() : undefined,
      },
    });
  }

  watch([searchQuery, dateRange, currentPage, pageSize], updateQueryParams);

  function handlePageIncrement() {
    const totalPages = Math.ceil(totalCount.value / pageSize.value);
    if (currentPage.value < totalPages) {
      currentPage.value++;
      fetchKeys();
    }
  }

  function handlePageDecrement() {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchKeys();
    }
  }

  function resetFilters() {
    searchQuery.value = "";
    dateRange.value = { start: "", end: "" };
    pageSize.value = 10;
    currentPage.value = 1;
    fetchKeys();
  }

  function handleDateRangeChange(newDateRange: { start: string; end: string }) {
    dateRange.value = newDateRange;
    if (newDateRange.start && newDateRange.end) {
      if (currentPage.value !== 1) currentPage.value = 1;
      fetchKeys();
    }
  }

  function handleSearchQueryChange(newSearchQuery: string) {
    searchQuery.value = newSearchQuery;
    if (currentPage.value !== 1) currentPage.value = 1;

    debouncedSearch();
  }

  function handlePageSizeChange(newPageSize: number) {
    pageSize.value = newPageSize;
    fetchKeys();
  }

  fetchKeys();

  return {
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
  };
}
