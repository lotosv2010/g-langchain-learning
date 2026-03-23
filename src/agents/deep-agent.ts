import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createAgent } from "langchain";
import { createDeepAgent, CompiledSubAgent, type DeepAgent, type DeepAgentTypeConfig } from "deepagents";
import { mcpServers } from "../mpc-tool-config";
import { ollamaModel } from "../models";
import { AnyAaaaRecord } from "dns";

async function initDeepAgent() {

  const llm = ollamaModel;

  const client = new MultiServerMCPClient({
    onConnectionError: "throw",
    mcpServers: mcpServers
  });

  // 子代理1：地图助手
  const amapTools = await client.getTools("amap-maps");
  console.log("amapTools", Object.values(amapTools).map((tool) => tool.name));
  const amapAssistant = createAgent({
    model: llm,
    tools: amapTools,
    systemPrompt: "你是一个地图助手，帮助用户查询地图、天气等相关的信息和服务。你可以使用以下工具来完成用户的请求：\n\n" +
      Object.values(amapTools).map((tool) => `- ${tool.name}: ${tool.description}`).join("\n") + "\n\n" +
      "请根据用户的请求选择合适的工具来回答问题，并提供相关的信息和服务。"
  });
  const amapSubagent: CompiledSubAgent = {
    name: "amap-subagent",
    runnable: amapAssistant as any,
    description: "一个地图助手子代理，专门处理与地图、天气等相关的信息和服务。"
  }; 

  // 子代理2：12306助手
  const trainTools = await client.getTools("12306-mcp");
  const trainAssistant = createAgent({
    model: llm,
    tools: trainTools,
    systemPrompt: "你是一个12306助手，帮助用户查询火车票相关的信息和服务。你可以使用以下工具来完成用户的请求：\n\n" +
      Object.values(trainTools).map((tool) => `- ${tool.name}: ${tool.description}`).join("\n") + "\n\n" +
      "请根据用户的请求选择合适的工具来回答问题，并提供相关的信息和服务。"
  });
  const trainSubagent: CompiledSubAgent = {
    name: "train-subagent",
    runnable: trainAssistant as any,
    description: "一个12306助手子代理，专门处理与火车票相关的查询和服务。"
  };

  // 子代理3：图表助手
  const chartTools = await client.getTools("mcp-server-chart");
  const chartAssistant = createAgent({
    model: llm,
    tools: chartTools,
    systemPrompt: "你是一个图表助手，帮助用户创建和分析图表。你可以使用以下工具来完成用户的请求：\n\n" +
      Object.values(chartTools).map((tool) => `- ${tool.name}: ${tool.description}`).join("\n") + "\n\n" +
      "请根据用户的请求选择合适的工具来回答问题，并提供相关的信息和服务。"
  });
  const chartSubagent: CompiledSubAgent = {
    name: "chart-subagent",
    runnable: chartAssistant as any,
    description: "一个图表助手子代理，专门处理与图表相关的查询和服务。"
  };

  const subagents = [amapSubagent, trainSubagent, chartSubagent];

  return createDeepAgent({
    model: llm,
    name: "demo-deep-agent",
    subagents: subagents,
    systemPrompt: "你是一个智能助手，能够使用多个子代理来帮助用户完成各种任务。每个子代理都有不同的功能和专长，你需要根据用户的请求选择合适的子代理来处理问题，并提供相关的信息和服务。"
  });
}
// {"messages": ["给我查询一下明天上海虹桥到北京西站的高铁票，并给出明天北京的天气咋样，给出气温的折线图，同时帮我推荐北京西站3公里范围内的商务酒店"]}
export const deepAgent: Promise<DeepAgent<DeepAgentTypeConfig>> = initDeepAgent();