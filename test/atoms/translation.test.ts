import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Translation from "~/atoms/translation.vue";

describe("Translation.vue", () => {
  it("renders the correct flag and value for a given language", () => {
    const translation = {
      languages_code: "en-GB",
      value: "Hello",
    };
    const wrapper = mount(Translation, {
      props: { translation },
    });

    expect(wrapper.text()).toContain("🇬🇧");
    expect(wrapper.text()).toContain("Hello");
  });

  it("renders nothing if the language code is not in the map", () => {
    const translation = {
      languages_code: "unknown",
      value: "Hello",
    };
    const wrapper = mount(Translation, {
      props: { translation },
    });

    expect(wrapper.text()).toContain("Hello");
    expect(wrapper.text()).not.toContain("🇬🇧");
  });
});
