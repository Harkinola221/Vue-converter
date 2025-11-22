<template>
  <Card class="h-fit">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Settings class="h-4 w-4" />
        Conversion Options
      </CardTitle>
      <CardDescription>
        Configure how your Vue 2 component should be converted to Vue 3
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Zap class="h-4 w-4 text-muted-foreground" />
            <div>
              <Label class="text-sm font-medium">Composition API</Label>
              <p class="text-xs text-muted-foreground">
                Convert to Vue 3 Composition API
              </p>
            </div>
          </div>
          <Switch v-model="options.compositionApi" />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <FileCode class="h-4 w-4 text-muted-foreground" />
            <div>
              <Label class="text-sm font-medium">TypeScript Support</Label>
              <p class="text-xs text-muted-foreground">
                Add TypeScript type definitions
              </p>
            </div>
          </div>
          <Switch v-model="options.typescript" />
        </div>
      </div>

      <Button
        class="w-full flex items-center"
        size="lg"
        :disabled="isLoading"
        @click.prevent="convertCode"
      >
        <div class="flex items-center justify-center">
          <Loader2 v-if="isLoading" class="w-9 h-4 mr-2 animate-spin" />
          <span v-else> Convert to Vue 3 </span>
        </div>
      </Button>
    </CardContent>
  </Card>
</template>

<script setup>
import { reactive, ref } from "vue";
import {
  Settings,
  Zap,
  Database,
  FileCode,
  Palette,
  Smartphone,
  Layers,
  Loader2,
} from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const emit = defineEmits(["convert"]);
const isLoading = ref(false);

const options = reactive({
  compositionApi: false,
  usePinia: false,
  typescript: false,
  darkMode: false,
  responsive: false,
  shadcnVue: false,
});

const convertCode = () => {
  isLoading.value = true;
  const selected = Object.keys(options).filter((key) => options[key]);
  emit("convert", selected, isLoading);
};
</script>
