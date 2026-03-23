# LangChain 生态学习项目

一个完整的 TypeScript + LangChain 生态学习示例，包含 LangChain、LangGraph、Deep Agents 的基本使用，支持 LangSmith 追踪。

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

确保 `.env` 文件包含以下配置：

```env
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=your_api_key
LANGSMITH_PROJECT="deep-agents-demo"
OLLAMA_MODEL=qwen3.5:cloud
```

### 3. 使用 LangGraph CLI 启动

```bash
# 开发模式（自动重新加载）
pnpm run langgraph:watch

# 或直接运行
pnpm run langgraph:dev
```

### 4. 运行应用

```bash
# 使用 ts-node 直接运行
pnpm run dev

# 或编译后运行
pnpm run build
pnpm run start
```

## 项目结构

```
src/
├── agents/
│   ├── chat-agent.ts      # LangChain 基本使用 - 纯对话 Agent
│   ├── weather-agent.ts   # LangGraph 基本使用 - 天气查询 Agent (带工具调用)
│   ├── deep-agent.ts      # Deep Agents 基本使用 - 多子代理协作
│   └── agent.ts           # 基础 MCP 工具集成示例
├── models/
│   ├── index.ts           # 模型导出
│   └── ollama.ts          # Ollama 模型配置
├── tools/
│   └── weather-mcp-tool.ts # 天气工具（MCP 集成）
├── mpc-tool-config.ts     # MCP 服务器配置
└── index.ts               # 统一导出
```

## Agent 示例说明

### 1. Chat Agent - LangChain 基本使用
**文件**: `src/agents/chat-agent.ts`

最基础的 LangChain Agent 实现，展示如何使用 `createAgent` 创建一个纯对话型 AI 助手。

**特点**:
- 使用 LangChain 的 `createAgent` API
- 不包含任何工具，专注于对话交互
- 适合学习 LangChain 的基础用法

**使用场景**: 简单的问答、对话聊天

### 2. Weather Agent - LangGraph 基本使用
**文件**: `src/agents/weather-agent.ts`

使用 LangGraph 构建的状态图 Agent，展示如何实现工具调用的完整流程。

**特点**:
- 使用 LangGraph 的 `StateGraph` 构建工作流
- 实现了 agent → tools → agent 的循环调用逻辑
- 集成了天气查询工具（通过 MCP）
- 支持会话状态持久化（`MemorySaver`）

**使用场景**: 需要工具调用的任务，如天气查询、API 调用等

### 3. Deep Agent - Deep Agents 基本使用
**文件**: `src/agents/deep-agent.ts`

使用 Deep Agents 框架创建的多子代理协作系统，展示复杂任务的分解与协作。

**特点**:
- 使用 Deep Agents 的 `createDeepAgent` API
- 包含多个专业子代理：
  - 地图助手（高德地图 MCP）
  - 12306 助手（火车票查询 MCP）
  - 图表助手（AntV 图表 MCP）
- 主代理智能分发任务到合适的子代理

**使用场景**: 复杂的多步骤任务，需要多个专业能力协作

**示例查询**:
```
给我查询一下明天上海虹桥到北京西站的高铁票，
并给出明天北京的天气咋样，给出气温的折线图，
同时帮我推荐北京西站3公里范围内的商务酒店
```

## 快速使用

### 使用 Chat Agent（LangChain）
```typescript
import { chatAgent } from "./src";

const agent = await chatAgent;
const response = await agent.invoke({
  messages: ["你好，请介绍一下你自己"]
});
```

### 使用 Weather Agent（LangGraph）
```typescript
import { weatherAgent } from "./src";

const agent = await weatherAgent;
const result = await agent.invoke(
  { messages: [{ role: "user", content: "北京今天天气怎么样？" }] },
  { configurable: { thread_id: "weather-chat-1" } }
);
```

### 使用 Deep Agent（Deep Agents）
```typescript
import { deepAgent } from "./src";

const agent = await deepAgent;
const response = await agent.invoke({
  messages: ["帮我查明天上海到北京的高铁，并推荐北京的酒店"]
});
```

## LangSmith 追踪

应用会自动将所有追踪数据发送到 LangSmith，可以在 https://smith.langchain.com 查看。

## 学习路径

建议按以下顺序学习：

1. **Chat Agent** → 了解 LangChain 的基础 API 和概念
2. **Weather Agent** → 学习 LangGraph 的状态图和工具调用
3. **Deep Agent** → 掌握多 Agent 协作和任务分解

## 技术对比

| 特性 | Chat Agent<br/>(LangChain) | Weather Agent<br/>(LangGraph) | Deep Agent<br/>(Deep Agents) |
|------|---------------------------|------------------------------|----------------------------|
| **核心 API** | `createAgent` | `StateGraph` | `createDeepAgent` |
| **工具调用** | ❌ 不支持 | ✅ 支持 | ✅ 支持 |
| **子代理** | ❌ 不支持 | ❌ 不支持 | ✅ 多子代理协作 |
| **状态管理** | 简单 | 状态图 | 自动管理 |
| **复杂度** | ⭐ 低 | ⭐⭐ 中 | ⭐⭐⭐ 高 |
| **适用场景** | 简单对话 | 单一任务+工具 | 复杂多步骤任务 |
| **学习难度** | 容易 | 中等 | 较难 |

## 特性

- ✅ **LangChain 基础**: 纯对话 Agent 实现
- ✅ **LangGraph 工作流**: 状态图、工具调用、条件路由
- ✅ **Deep Agents 框架**: 多子代理协作系统
- ✅ **MCP 集成**: 高德地图、12306、AntV 图表等工具
- ✅ **LangSmith 追踪**: 完整的调试和监控支持
- ✅ **Ollama 本地模型**: 使用本地 LLM，无需 API
- ✅ **TypeScript**: 完整的类型安全支持
