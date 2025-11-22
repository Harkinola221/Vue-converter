<template>
  <nav
    class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <Code2 class="h-4 w-4" />
          </div>
          <div>
            <h1 class="text-lg font-semibold text-foreground">Vue Converter</h1>
            <p class="text-xs text-muted-foreground">
              Transform Vue 2 to Vue 3 with AI
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles class="h-4 w-4" />
            <span>AI Powered</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            @click="theme?.toggleTheme"
            class="h-8 w-8 p-0"
          >
            <Sun v-if="theme?.isDark.value" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { inject } from "vue";
import { Code2, Sparkles, Sun, Moon } from "lucide-vue-next";
import { Button } from "../components/ui/button";

const theme = inject("theme");
</script>
