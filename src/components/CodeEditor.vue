<template>
  <Card class="h-full">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
        <Button
          v-if="showCopy && code"
          variant="ghost"
          size="sm"
          @click="copyCode"
          class="h-8 w-8 p-0"
        >
          <Copy class="h-4 w-4" />
          <span class="sr-only">Copy code</span>
        </Button>
      </div>
    </CardHeader>
    <CardContent class="px-2 py-0">
      <div class="relative h-[500px] overflow-hidden rounded-b-lg">
        <textarea
          v-if="!showCopy"
          :value="code"
          @input="emit('update:code', $event.target.value)"
          class="h-full w-full resize-none bg-muted/30 p-4 text-sm font-mono leading-relaxed focus:outline-none whitespace-pre tab-size-[2]"
          :placeholder="placeholder"
        ></textarea>

        <pre
          v-else
          class="h-full overflow-auto p-4 text-sm font-mono leading-relaxed pre-result"
        >
          <code ref="codeBlock" class="language-javascript"></code>
        </pre>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Copy } from "lucide-vue-next";
import Prism from "prismjs";
import "prism-themes/themes/prism-night-owl.css";
import "prismjs/components/prism-javascript";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "vue-sonner";

const props = defineProps({
  title: String,
  code: String,
  placeholder: {
    type: String,
    default: "Code will appear here...",
  },
  showCopy: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:code"]);
const codeBlock = ref(null);

watch(
  () => props.code,
  (newCode) => {
    if (codeBlock.value) {
      codeBlock.value.textContent = newCode || props.placeholder;
      Prism.highlightAllUnder(codeBlock.value.parentElement);
    }
  },
  { immediate: true }
);

const copyCode = async () => {
  if (props.code) {
    try {
      await navigator.clipboard.writeText(props.code);
      toast.success("Code copied!");
    } catch (err) {
      console.error("Failed to copy code:", err);
      toast.error("Failed to copy!");
    }
  }
};
</script>
<style>
.pre-result {
  white-space: pre-wrap;
  word-break: normal;
  overflow-x: auto;
  height: 100%;
}
pre[class*="language-"],
code[class*="language-"] {
  background: #011627 !important;
  color: #d6deeb !important;
  text-shadow: none !important;
}

pre[class*="language-"] {
  border-radius: 0.5rem;
  padding: 1rem !important;
  overflow-x: auto;
}
</style>
