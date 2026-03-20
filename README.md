# Deep Agents + LangGraph 示例

最简单的 TypeScript + Deep Agents 示例，使用 LangGraph CLI 启动并支持 LangSmith 追踪。

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
├── graph.ts      # LangGraph 定义（主要入口）
├── agent.ts      # Deep Agent 示例
└── app.ts        # 完整的 LangGraph 应用示例
```

## LangSmith 追踪

应用会自动将所有追踪数据发送到 LangSmith，可以在 https://smith.langchain.com 查看。

## 特性

- ✅ 使用 Deep Agents 框架
- ✅ 基于 LangGraph 构建工作流
- ✅ 支持 LangSmith 追踪
- ✅ 使用 Ollama 本地模型
- ✅ TypeScript 类型安全
