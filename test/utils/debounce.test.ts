import { debounce } from "../../utils/debounce";
import { vi, describe, it, expect } from "vitest";

vi.useFakeTimers();

describe("debounce", () => {
  it("should delay the execution of the function", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should reset the timer if called again within the wait period", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();
    vi.advanceTimersByTime(300);
    debouncedFn();
    vi.advanceTimersByTime(300);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
