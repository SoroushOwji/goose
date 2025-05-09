import { formatRelativeTime } from "../../utils/formatRelativeTime";
import { describe, it, expect } from "vitest";

describe("formatRelativeTime", () => {
  it("should return 'N/A' for null or invalid date", () => {
    expect(formatRelativeTime(null)).toBe("N/A");
    expect(formatRelativeTime("invalid-date")).toBe("N/A");
  });

  it("should return seconds ago for differences less than a minute", () => {
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000).toISOString();
    expect(formatRelativeTime(tenSecondsAgo)).toBe("10 seconds ago");
  });

  it("should return minutes ago for differences less than an hour", () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(
      now.getTime() - 5 * 60 * 1000
    ).toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");
  });

  it("should return hours ago for differences less than a day", () => {
    const now = new Date();
    const threeHoursAgo = new Date(
      now.getTime() - 3 * 60 * 60 * 1000
    ).toISOString();
    expect(formatRelativeTime(threeHoursAgo)).toBe("3 hours ago");
  });

  it("should return days ago for differences of a day or more", () => {
    const now = new Date();
    const twoDaysAgo = new Date(
      now.getTime() - 2 * 24 * 60 * 60 * 1000
    ).toISOString();
    expect(formatRelativeTime(twoDaysAgo)).toBe("2 days ago");
  });
});
