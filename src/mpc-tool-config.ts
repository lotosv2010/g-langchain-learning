export const mcpServers: any = {
  "amap-maps": {
    command: "npx",
    args: ["-y", "@amap/amap-maps-mcp-server"],
    env: {
      AMAP_MAPS_API_KEY: process.env.AMAP_MAPS_API_KEY || "",
    },
  },
  "12306-mcp": {
    command: "npx",
    args: ["-y", "12306-mcp"],
  },
  "mcp-server-chart": {
    command: "npx",
    args: ["-y", "@antv/mcp-server-chart"],
  },
};
