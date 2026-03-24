import { createDeepAgent, type DeepAgent, type DeepAgentTypeConfig } from "deepagents";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ollamaModel } from "../models";

async function initAgent() {
  // 初始化 ChatOllama 模型
  const model = ollamaModel;     

  // console.log("Initializing MultiServerMCPClient with servers:", mcpServers);

  const client = new MultiServerMCPClient({
    onConnectionError: "throw",
    mcpServers: {
      "calculator-weather": {
        url: "http://localhost:3000/mcp"
      }
    },
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

// 测试本地MCP服务器的Agent，MCP 服务源码地址：https://github.com/lotosv2010/g-mcp-server
export const localMcpAgent: Promise<DeepAgent<DeepAgentTypeConfig>> = initAgent();
