import { ref } from "vue";

type DirectusTranslation = {
  key: string;
  variables: null | string[];
  translations: number[];
};

export function useTranslationKeys() {
  const translationKeys = ref<DirectusTranslation[]>([]);
  const isLoading = ref(false);
  const error = ref<null | string>(null);

  const fetchTranslationKeys = async (filter = {}, page = 1, limit = 10) => {
    isLoading.value = true;

    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      }).toString();

      const response = await fetch(
        `https://directus.altura.io/items/translationKeys?${query}&filter=${JSON.stringify(
          filter
        )}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      translationKeys.value = data.data;
      let string = "";
      const allKeys = translationKeys.value
        .map((translationKey) => `"${translationKey.key}"`)
        .join(", ");
      const translationKeysTranslation = await fetch(
        `https://directus.altura.io/items/translationKeys_translations?filter={"translationKeys_key": {"_in":[${allKeys}]}}`
      );
      console.log({ translationKeysTranslation });
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      isLoading.value = false;
    }
  };

  // async function fetchTranslationKeyTranslation() {
  //   try {
  //     const response = await fetch(
  //       `https://directus.altura.io/items/translationKeys_translations?`
  //     );
  //     const data = await response.json();
  //     console.log({ data });
  //     // console.log({ response });
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     // isLoading.value = false;
  //   }
  // }

  // fetchTranslationKeyTranslation();

  return { translationKeys, isLoading, error, fetchTranslationKeys };
}
