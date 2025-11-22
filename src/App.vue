<template>
  <div class="min-h-screen bg-background font-sans" :class="{ dark: isDark }">
    <Navbar />
    <ConverterView />
    <Toaster />
    <!-- <FooterCard /> -->
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch } from "vue";
import Navbar from "./components/Navbar.vue";
import ConverterView from "./view/ConverterView.vue";
// import FooterCard from "./components/FooterCard.vue";
import { Toaster } from "../src/components/ui/sonner";
import "vue-sonner/style.css";

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const setTheme = (newTheme) => {
  isDark.value = newTheme === "dark";
};

onMounted(() => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme");
    if (stored) {
      isDark.value = stored === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  }
});

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

provide("theme", {
  isDark,
  toggleTheme,
  setTheme,
});
</script>
