import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import {
  StateGraph,
  START,
  END,
  MemorySaver,
  StateSchema,
  GraphNode,
  ConditionalEdgeRouter,
} from "@langchain/langgraph";
import { z } from "zod";
import { getWeatherTools } from "../tools";
import { ollamaModel } from "../models";

const SYSTEM_PROMPT = `你是一个天气助手。使用可用的工具查询实时天气数据，并用中文给出清晰友好的回答。
包含关键信息：温度、天气状况、湿度、风力等。如果用户没有指定城市，请询问他们想查哪个城市。
常用城市经纬度：北京(116.41,39.90) 上海(121.47,31.23) 广州(113.26,23.13) 深圳(114.06,22.54) 杭州(120.16,30.27) 成都(104.07,30.57) 武汉(114.31,30.59) 南京(118.80,32.06) 西安(108.94,34.34) 重庆(106.55,29.56)`;

const AgentState = new StateSchema({
  messages: z.array(z.any()).default([]),
});

async function initAgent() {
  const tools = await getWeatherTools();

  const llm = ollamaModel.bindTools(tools);

  console.log("Available tools:", tools.map((t) => t.name));

  const agent: GraphNode<typeof AgentState> = async (state) => {
    const messages = state.messages;

    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(SYSTEM_PROMPT),
      new MessagesPlaceholder("messages"),
    ]);

    const response = await prompt.pipe(llm).invoke({ messages });

    return {
      messages: [...messages, response],
    };
  };

  const toolsByName = Object.fromEntries(tools.map((t) => [t.name, t]));

  const toolsNode: GraphNode<typeof AgentState> = async (state) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      const toolResults: any[] = [];

      for (const toolCall of lastMessage.tool_calls) {
        const tool = toolsByName[toolCall.name];
        
        if (!tool) continue;

        const result = await tool.invoke(toolCall.args);
        toolResults.push({
          role: "tool",
          content: result,
          tool_call_id: toolCall.id,
          name: toolCall.name,
        });
      }

      return {
        messages: [...messages, ...toolResults],
      };
    }

    return { messages };
  };

  const shouldContinue: ConditionalEdgeRouter<typeof AgentState, Record<string, any>, "tools"> = (
    state,
  ) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    }

    return END;
  };

  const graph = new StateGraph(AgentState)
    .addNode("agent", agent)
    .addNode("tools", toolsNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue, ["tools", END])
    .addEdge("tools", "agent");

  const checkpointer = new MemorySaver();
  return graph.compile({ checkpointer });
}

export const weatherAgent = initAgent();