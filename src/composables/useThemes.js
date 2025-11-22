"use client";

import { ref, computed, watch, onMounted } from "vue";

const isDark = ref(false);

export function useTheme() {
  onMounted(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) {
        isDark.value = stored === "dark";
      } else {
        isDark.value = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
      }
    }
  });

  const theme = computed(() => (isDark.value ? "dark" : "light"));

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const setTheme = (newTheme) => {
    isDark.value = newTheme === "dark";
  };

  watch(
    isDark,
    (newValue) => {
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        if (newValue) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        localStorage.setItem("theme", newValue ? "dark" : "light");
      }
    },
    { immediate: true }
  );

  return {
    isDark,
    theme,
    toggleTheme,
    setTheme,
  };
}
