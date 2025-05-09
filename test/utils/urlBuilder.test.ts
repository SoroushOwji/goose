import { buildUrlWithParams } from "../../utils/urlBuilder";
import { describe, it, expect } from "vitest";

describe("buildUrlWithParams", () => {
  it("should append query parameters to the base URL", () => {
    const baseUrl = "https://example.com";
    const params = { key1: "value1", key2: "value2" };
    const result = buildUrlWithParams(baseUrl, params);
    expect(result).toBe("https://example.com/?key1=value1&key2=value2");
  });

  it("should handle empty parameters", () => {
    const baseUrl = "https://example.com";
    const params = {};
    const result = buildUrlWithParams(baseUrl, params);
    expect(result).toBe("https://example.com/");
  });

  it("should encode special characters in parameters", () => {
    const baseUrl = "https://example.com";
    const params = { "key with space": "value/with/slash" };
    const result = buildUrlWithParams(baseUrl, params);
    expect(result).toBe(
      "https://example.com/?key+with+space=value%2Fwith%2Fslash"
    );
  });
});
