import { createAgent } from "langchain";
import { ollamaModel } from "../models";

/**
 * 创建一个简单的聊天 Agent
 * 使用基本的 LangChain，专注于对话交互
 */
async function initChatAgent() {
  const model = ollamaModel;

  console.log("Initializing Chat Agent...");

  // 使用基本的 LangChain 创建聊天 Agent
  return createAgent({
    model,
    tools: [], // 不使用任何工具
    systemPrompt: `你是一个友好、专业的AI助手。你的目标是：
- 以清晰、简洁的方式回答用户的问题
- 提供有帮助的信息和建议
- 保持对话的自然和流畅
- 当不确定时，诚实地表达你的局限性

请始终保持礼貌、专业，并根据用户的需求调整你的回答风格。`,
  });
}

export const chatAgent = initChatAgent();
