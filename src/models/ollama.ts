import { ChatOllama } from "@langchain/ollama";

export const ollamaModel = new ChatOllama({
  model: process.env.OLLAMA_MODEL || "qwen3:0.6b",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature: 0.7,
});