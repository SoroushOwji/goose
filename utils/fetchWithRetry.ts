type FetchWithRetryOptions = {
  retries?: number;
  retryDelay?: number;
  fetchOptions?: RequestInit;
};

async function fetchWithRetry<T>(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<T> {
  const { retries = 3, retryDelay = 1000, fetchOptions } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { data } = await response.json();
      return data as T;
    } catch (error) {
      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (attempt + 1))
        );
        console.warn(`Retrying... Attempt ${attempt + 1} of ${retries}`);
      } else {
        throw error;
      }
    }
  }

  // This line should never be reached
  throw new Error("Unexpected error in fetchWithRetry");
}

export default fetchWithRetry;
