import "dotenv/config";
import { ChatOllama } from "@langchain/ollama";
import { createDeepAgent } from "deepagents";

/**
 * Deep Agent 示例
 * 使用 Deep Agents 框架创建智能代理
 */

// 初始化 ChatOllama 模型
const model = new ChatOllama({
  model: process.env.OLLAMA_MODEL || "qwen3.5:cloud",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature: 0.7,
});

// 创建 Deep Agent
export const agent: ReturnType<typeof createDeepAgent> = createDeepAgent({
  model,
  name: "demo-agent",
  tools: [], // 可以添加工具
});
