import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Loading from "~/atoms/loading.vue";

describe("Loading.vue", () => {
  it("renders the loading spinner and text", () => {
    const wrapper = mount(Loading);
    expect(wrapper.find(".loading__spinner").exists()).toBe(true);
    expect(wrapper.find(".loading__text").text()).toBe("Loading...");
  });
});
