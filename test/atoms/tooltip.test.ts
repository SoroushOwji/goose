import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Tooltip from "~/atoms/tooltip.vue";

describe("Tooltip.vue", () => {
  it("renders the title slot content", () => {
    const wrapper = mount(Tooltip, {
      slots: {
        title: "<span>Hover me</span>",
      },
    });

    expect(wrapper.html()).toContain("Hover me");
  });

  it("renders the tooltip slot content", async () => {
    const wrapper = mount(Tooltip, {
      slots: {
        title: "<span>Hover me</span>",
        tooltip: "<span>Tooltip content</span>",
      },
    });

    expect(wrapper.find(".tooltip__content").exists()).toBe(true);
    expect(wrapper.find(".tooltip__content").text()).toBe("Tooltip content");
  });
});
