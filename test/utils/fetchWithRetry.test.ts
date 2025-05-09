import fetchWithRetry from "../../utils/fetchWithRetry";
import { vi, describe, it, expect, beforeEach } from "vitest";

global.fetch = vi.fn();

describe("fetchWithRetry", () => {
  beforeEach(() => {
    (fetch as vi.Mock).mockClear();
  });

  it("should fetch successfully on the first attempt", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: "success" }),
    });

    const result = await fetchWithRetry("https://example.com");
    expect(result).toBe("success");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should retry on failure and eventually succeed", async () => {
    (fetch as vi.Mock)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      });

    const result = await fetchWithRetry("https://example.com", { retries: 2 });
    expect(result).toBe("success");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("should throw an error after exhausting retries", async () => {
    (fetch as vi.Mock).mockRejectedValue(new Error("Network error"));

    await expect(
      fetchWithRetry("https://example.com", { retries: 2 })
    ).rejects.toThrow("Network error");
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
