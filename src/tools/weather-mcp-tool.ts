import { MultiServerMCPClient } from "@langchain/mcp-adapters";

export const getWeatherTools = async () => {
  const mcpClient = new MultiServerMCPClient({
    onConnectionError: "throw",
    mcpServers: {
      "caiyun-weather": {
        transport: "stdio",
        command: "uvx",
        args: ["mcp-caiyun-weather"],
        env: {
          CAIYUN_WEATHER_API_TOKEN: process.env.CAIYUN_API_TOKEN!
        }
      }
    }
  });

  const tools = await mcpClient.getTools();
  return Object.values(tools);
}