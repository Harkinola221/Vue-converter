import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { InferenceClient } from "@huggingface/inference";
import cors from "cors";
// import ollama from "ollama";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const apiKey = process.env.HUGGING_FACE_API_KEY;
const client = new InferenceClient(apiKey);

function buildConversionPrompt(code, options) {
  const {
    compositionApi = false,
    typescript = false,
    usePinia = false,
  } = options;

  let prompt = `Convert the following Vue 2 component to Vue 3 syntax.\n\n`;
  prompt += `---\n${code}\n---\n\n`;
  prompt += `Conversion rules:\n`;

  if (compositionApi) {
    prompt += "- Use Vue 3 Composition API with <script setup> syntax.\n";
  } else {
    prompt += "- Use Vue 3 options API as the default.\n";
  }

  if (typescript) {
    prompt +=
      '- Use TypeScript, add lang="ts" in the <script> tag, and define interfaces for props and emits.\n';
  }

  if (usePinia) {
    prompt +=
      "- Replace any Vuex logic with Pinia syntax (import { defineStore } from 'pinia').\n";
  }

  prompt += `- Keep the <template> and <style> blocks intact.\n`;
  prompt += `- Ensure valid Vue 3 code with no missing imports.\n`;
  prompt += `- Return only the converted code — no explanations, no markdown fences.\n`;

  return prompt;
}

function buildSystemMessage(options) {
  const { compositionApi, typescript, usePinia } = options;

  let msg = `You are an expert Vue.js developer and migration specialist.\n`;
  msg += `Your task: Convert Vue 2 single-file components to clean, production-ready Vue 3 components.\n\n`;
  msg += `Always follow these rules:\n`;
  msg += `- Default to Vue 3 Options API unless Composition API is explicitly requested.\n`;
  msg += `- When Composition API is requested, use <script setup>.\n`;
  msg += `- When TypeScript is requested, use proper typing.\n`;
  msg += `- When Pinia is requested, replace Vuex logic with Pinia.\n`;
  msg += `- Maintain <template> and <style> structure exactly.\n`;
  msg += `- Never return explanations or markdown formatting.\n`;
  msg += `Output only valid Vue SFC code.`;

  return msg;
}

app.post("/api/convert/stream", async (req, res) => {
  try {
    const { code, options = {} } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        error: 'Missing or invalid "code" field in request body',
      });
    }

    const userPrompt = buildConversionPrompt(code, options);
    const systemPrompt = buildSystemMessage(options);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let output = "";

    const stream = await client.chatCompletionStream({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.2,
    });
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || "";
      if (delta) {
        output += delta;
        res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
      }
    }

    res.write(
      `data: ${JSON.stringify({ done: true, full: output.trim() })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error("❌ Conversion error:", error);

    if (res.headersSent) {
      res.write(
        `data: ${JSON.stringify({ error: error.message || "Unknown error" })}\n\n`
      );
      res.end();
      return;
    }

    res.status(500).json({
      success: false,
      error: "Failed to convert code",
      message: error.message || "Unknown error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vue converter API running on port ${PORT}`);
});

export default app;
