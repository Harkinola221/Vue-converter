<template>
  <main class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mt-5 tracking-tight text-foreground mb-4">
        Vue 2 to Vue 3 Converter
      </h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Transform your Vue 2 components into modern Vue 3 code with Composition
        API, TypeScript support, and best practices automatically applied.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <CodeEditor
        title="Vue 2 Component (Input)"
        v-model:code="inputCode"
        placeholder="Paste your Vue 2 component code here..."
      />

      <CodeEditor
        title="Vue 3 Component (Output)"
        v-model:code="outputCode"
        placeholder="Converted Vue 3 code will appear here..."
        :show-copy="!!outputCode"
      />

      <OptionPanel @convert="handleConvert" />
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import CodeEditor from "../components/CodeEditor.vue";
import OptionPanel from "../components/OptionsPanel.vue";
import { toast } from "vue-sonner";

const inputCode = ref("");
const outputCode = ref("Converted Vue 3 code will appear here...");
const selectedOptions = ref({});

const handleConvert = async (options, loading) => {
  // Set loading to true at the start
  loading.value = true;

  if (!inputCode.value.trim()) {
    loading.value = false;
    toast.error("Please enter Vue 2 code to convert.");
    return;
  }

  selectedOptions.value = options.reduce((acc, opt) => {
    acc[opt] = true;
    return acc;
  }, {});

  outputCode.value = "";
  try {
    const res = await fetch(
      "https://vue-converter.onrender.com/api/convert/stream",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: inputCode.value,
          options: selectedOptions.value,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend returned an error:", errorText);
      outputCode.value = `// ❌ Server error (${res.status}): ${errorText}`;
      loading.value = false;
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullOutput = "";
    let streamComplete = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      const lines = chunk
        .split("\n")
        .filter((line) => line.trim().startsWith("data: "));

      for (const line of lines) {
        try {
          const data = JSON.parse(line.replace(/^data:\s*/, ""));

          if (data.token) {
            fullOutput += data.token;
            outputCode.value = fullOutput;
          }

          if (data.error) {
            outputCode.value = `// ❌ ${data.error}`;
            streamComplete = true;
            break;
          }

          if (data.done) {
            outputCode.value = data.full?.trim() || fullOutput.trim();
            streamComplete = true;
            break;
          }
        } catch (err) {
          console.error("Stream parse error:", err, line);
          // Don't set loading to false here - continue processing other lines
        }
      }

      // Break out of outer loop if stream is complete
      if (streamComplete) break;
    }

    // Only set loading to false after all streaming is complete
    loading.value = false;
  } catch (err) {
    console.error("Network or server error:", err);
    outputCode.value =
      "// ❌ Could not reach the server. Check if it's running on port 3000.";
    loading.value = false;
  }
};
</script>
