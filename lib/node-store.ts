"use client"

import { create } from "zustand"

// 节点类型定义
export type NodeType =
  // 基础类型
  | "startNode"
  | "endNode"
  // 任务类型
  | "userTask"
  | "serviceTask"
  | "scriptTask"
  | "httpRequest"
  | "emailTask"
  // 网关类型
  | "exclusiveGateway"
  | "parallelGateway"
  | "inclusiveGateway"
  // 事件类型
  | "timerEvent"
  | "messageEvent"
  | "signalEvent"
  // 数据类型
  | "dataObject"
  | "dataStore"
  // AI 相关类型
  | "agentNode"
  | "conditionNode"
  | "llmNode"
  | "replyNode"

// 节点模板定义
export interface NodeTemplate {
  id: string
  type: NodeType
  name: string
  description: string
  icon: string
  properties: Record<string, any>
}

// 节点状态存储
interface NodeState {
  nodes: any[]
  edges: any[]
  nodeTemplates: NodeTemplate[]
  setNodes: (nodes: any[]) => void
  setEdges: (edges: any[]) => void
  addNodeTemplate: (template: NodeTemplate) => void
  updateNodeTemplate: (id: string, template: Partial<NodeTemplate>) => void
  deleteNodeTemplate: (id: string) => void
  // TODO: 添加从后端API获取节点模板的方法
  fetchNodeTemplates: () => Promise<void>
}

// 初始节点模板
const initialNodeTemplates: NodeTemplate[] = [
  // 基础类型
  {
    id: "start-template",
    type: "startNode",
    name: "开始节点",
    description: "工作流的起始点",
    icon: "play",
    properties: {
      label: "开始",
    },
  },
  {
    id: "end-template",
    type: "endNode",
    name: "结束节点",
    description: "工作流的结束点",
    icon: "square",
    properties: {
      label: "结束",
    },
  },

  // 任务类型
  {
    id: "user-task-template",
    type: "userTask",
    name: "用户任务",
    description: "需要人工处理的任务",
    icon: "user",
    properties: {
      label: "用户任务",
      config: {
        assignee: "未分配",
        dueDate: "",
        priority: "中",
        description: "请处理此任务",
      },
    },
  },
  {
    id: "service-task-template",
    type: "serviceTask",
    name: "服务任务",
    description: "调用外部服务的任务",
    icon: "activity",
    properties: {
      label: "服务任务",
      config: {
        service: "defaultService",
        method: "execute",
        parameters: "{}",
        asyncTask: false,
        timeout: 30000,
      },
    },
  },
  {
    id: "script-task-template",
    type: "scriptTask",
    name: "脚本任务",
    description: "执行脚本的任务",
    icon: "code",
    properties: {
      label: "脚本任务",
      config: {
        language: "javascript",
        script: "// 在此处编写脚本\nconsole.log('Hello World');",
      },
    },
  },
  {
    id: "http-request-template",
    type: "httpRequest",
    name: "HTTP请求",
    description: "发送HTTP请求",
    icon: "globe",
    properties: {
      label: "HTTP请求",
      config: {
        method: "GET",
        url: "https://api.example.com",
        headers: "{}",
        body: "",
      },
    },
  },
  {
    id: "email-task-template",
    type: "emailTask",
    name: "邮件任务",
    description: "发送电子邮件",
    icon: "mail",
    properties: {
      label: "邮件任务",
      config: {
        to: "",
        subject: "",
        content: "",
      },
    },
  },

  // 网关类型
  {
    id: "exclusive-gateway-template",
    type: "exclusiveGateway",
    name: "条件网关",
    description: "根据条件选择一条路径",
    icon: "git-branch",
    properties: {
      label: "条件网关",
      conditions: [
        { type: "IF", condition: "条件1" },
        { type: "ELSE", condition: "" },
      ],
    },
  },
  {
    id: "parallel-gateway-template",
    type: "parallelGateway",
    name: "并行网关",
    description: "同时执行多条路径",
    icon: "git-branch",
    properties: {
      label: "并行网关",
      branches: 2,
    },
  },

  // 事件类型
  {
    id: "timer-event-template",
    type: "timerEvent",
    name: "定时器",
    description: "在指定时间触发的事件",
    icon: "clock",
    properties: {
      label: "定时器",
      config: {
        timerType: "date",
        timerValue: "",
      },
    },
  },
  {
    id: "message-event-template",
    type: "messageEvent",
    name: "消息事件",
    description: "接收消息时触发的事件",
    icon: "message-square",
    properties: {
      label: "消息事件",
      config: {
        messageName: "",
        correlationKey: "",
      },
    },
  },
]

// 创建状态存储
export const useNodeStore = create<NodeState>((set) => ({
  nodes: [],
  edges: [],
  nodeTemplates: initialNodeTemplates,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNodeTemplate: (template) => {
    // TODO: 调用后端API添加节点模板
    set((state) => ({
      nodeTemplates: [...state.nodeTemplates, template],
    }))
  },
  updateNodeTemplate: (id, template) => {
    // TODO: 调用后端API更新节点模板
    set((state) => ({
      nodeTemplates: state.nodeTemplates.map((t) => (t.id === id ? { ...t, ...template } : t)),
    }))
  },
  deleteNodeTemplate: (id) => {
    // TODO: 调用后端API删除节点模板
    set((state) => ({
      nodeTemplates: state.nodeTemplates.filter((t) => t.id !== id),
    }))
  },
  fetchNodeTemplates: async () => {
    // TODO: 实现从后端API获取节点模板的方法
    try {
      // const response = await fetch('/api/node-templates');
      // if (!response.ok) throw new Error('Failed to fetch node templates');
      // const templates = await response.json();
      // set({ nodeTemplates: templates });
      console.log("应该从API获取节点模板")
    } catch (error) {
      console.error("获取节点模板失败:", error)
    }
  },
}))
