# Vue 2 → Vue 3 AI Converter

An AI-powered tool that automatically converts **Vue 2** single-file components into **Vue 3** syntax.  
By default, the converter outputs **Vue 3 Options API**, and optionally supports:

- **Composition API** (`<script setup>`)
- **TypeScript** (with typed props/emits)
- **Pinia** (Vuex → Pinia migration)

This project uses a Hugging Face model to generate accurate and production-ready Vue 3 code.

---

## 🚀 Features

### ✅ Vue 2 → Vue 3 Options API (default)
Automatically transforms:
- `data()`
- `methods`
- `computed`
- `watch`
- lifecycle hooks (beforeMount → onBeforeMount)
- Vue.use → Vue app plugin initialization

### 🧩 Optional: Composition API
If enabled, output is rewritten using:
- `<script setup>`
- `ref`, `reactive`, `computed`, `watch`
- proper imports from `vue`

### 🟦 Optional: TypeScript
Adds:
- `<script lang="ts">`
- Typed props
- Typed emits
- Typed refs and reactive objects

### 🍍 Optional: Pinia Migration
When enabled:
- Replaces all Vuex usage with `defineStore`
- Converts state/getters/actions to Pinia format

---

## ⚙️ How It Works

The backend:
- Accepts Vue 2 code
- Builds a structured migration prompt
- Sends it to a Hugging Face model
- Streams back the converted Vue 3 code token-by-token (SSE)

The frontend:
- Displays converted output in real time
- Allows toggling between Options API, Composition API, TypeScript, and Pinia

---

## 🛠️ Tech Stack

- **Vue 3** (frontend)
- **Node.js / Express** (backend)
- **Hugging Face Inference API** (model)
- **Vite** for frontend bundling

---

## 📦 API Endpoint

### `POST /api/convert/stream`

#### Body:
```json
{
  "code": "<template>...</template>",
  "options": {
    "compositionApi": false,
    "typescript": false,
    "usePinia": false
  }
}
