import { createDeepAgent, type DeepAgent, type DeepAgentTypeConfig } from "deepagents";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ollamaModel } from "./models";
import { mcpServers } from "./mpc-tool-config";

async function initAgent() {
  // 初始化 ChatOllama 模型
  const model = ollamaModel;     

  console.log("Initializing MultiServerMCPClient with servers:", mcpServers);

  const client = new MultiServerMCPClient({
    onConnectionError: "throw",
    mcpServers: mcpServers,
  });

  const tools = await client.getTools();

  console.log("Available tools:", Object.values(tools).map((tool) => tool.name));

  // 创建 Deep Agent
  return createDeepAgent({
    model,
    name: "demo-agent",
    tools: Object.values(tools), // 可以添加工具
  });
};

export const agent: Promise<DeepAgent<DeepAgentTypeConfig>> = initAgent();
