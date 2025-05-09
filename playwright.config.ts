import { defineConfig } from "playwright";

export default defineConfig({
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
});
