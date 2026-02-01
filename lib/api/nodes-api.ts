/**
 * 节点标签API服务
 *
 * 这个文件封装了与节点标签相关的所有API调用
 * 目前使用mock数据，后续将替换为真实API调用
 */

import type { NodeTemplate, NodeType } from "@/lib/node-store"

// 模拟API延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 模拟节点模板数据
const mockNodeTemplates: NodeTemplate[] = [
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
  {
    id: "user-task-template",
    type: "userTask",
    name: "表单节点",
    description: "用户填写表单的节点",
    icon: "file-text",
    properties: {
      label: "表单节点",
      config: {
        form: "defaultForm",
        assignee: "未分配",
      },
    },
  },
  {
    id: "service-task-template",
    type: "serviceTask",
    name: "任务节点",
    description: "执行任务的节点",
    icon: "user",
    properties: {
      label: "任务节点",
      config: {
        assignee: "未分配",
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
        script: "// 在此处编写脚本",
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

// 内存中的节点模板数据（用于模拟）
let nodeTemplates = [...mockNodeTemplates]

/**
 * 获取所有节点模板
 *
 * @returns 节点模板列表
 *
 * TODO: 替换为真实API调用
 * GET /api/nodes
 */
export async function getAllNodeTemplates(): Promise<NodeTemplate[]> {
  try {
    // 模拟API延迟
    await delay(500)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/nodes');
    // if (!response.ok) throw new Error('Failed to fetch node templates');
    // return response.json();

    return [...nodeTemplates]
  } catch (error) {
    console.error("获取节点模板列表失败:", error)
    throw error
  }
}

/**
 * 获取单个节点模板
 *
 * @param id 节点模板ID
 * @returns 节点模板信息
 *
 * TODO: 替换为真实API调用
 * GET /api/nodes/:id
 */
export async function getNodeTemplate(id: string): Promise<NodeTemplate | null> {
  try {
    // 模拟API延迟
    await delay(300)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/nodes/${id}`);
    // if (!response.ok) throw new Error('Failed to fetch node template');
    // return response.json();

    const template = nodeTemplates.find((t) => t.id === id)
    return template || null
  } catch (error) {
    console.error(`获取节点模板(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 创建节点模板
 *
 * @param template 节点模板信息（不包含ID）
 * @returns 创建的节点模板（包含ID）
 *
 * TODO: 替换为真实API调用
 * POST /api/nodes
 */
export async function createNodeTemplate(template: Omit<NodeTemplate, "id">): Promise<NodeTemplate> {
  try {
    // 模拟API延迟
    await delay(700)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/nodes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(template)
    // });
    // if (!response.ok) throw new Error('Failed to create node template');
    // return response.json();

    const newTemplate = {
      ...template,
      id: `node-${Date.now()}`,
    }

    nodeTemplates.push(newTemplate)
    return newTemplate
  } catch (error) {
    console.error("创建节点模板失败:", error)
    throw error
  }
}

/**
 * 更新节点模板
 *
 * @param id 节点模板ID
 * @param template 要更新的节点模板信息
 * @returns 更新后的节点模板
 *
 * TODO: 替换为真实API调用
 * PUT /api/nodes/:id
 */
export async function updateNodeTemplate(id: string, template: Partial<NodeTemplate>): Promise<NodeTemplate> {
  try {
    // 模拟API延迟
    await delay(600)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/nodes/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(template)
    // });
    // if (!response.ok) throw new Error('Failed to update node template');
    // return response.json();

    const index = nodeTemplates.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error(`节点模板不存在 (ID: ${id})`)
    }

    nodeTemplates[index] = { ...nodeTemplates[index], ...template }
    return nodeTemplates[index]
  } catch (error) {
    console.error(`更新节点模板(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 删除节点模板
 *
 * @param id 节点模板ID
 * @returns 是否删除成功
 *
 * TODO: 替换为真实API调用
 * DELETE /api/nodes/:id
 */
export async function deleteNodeTemplate(id: string): Promise<boolean> {
  try {
    // 模拟API延迟
    await delay(500)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/nodes/${id}`, {
    //   method: 'DELETE'
    // });
    // if (!response.ok) throw new Error('Failed to delete node template');
    // return true;

    const initialLength = nodeTemplates.length
    nodeTemplates = nodeTemplates.filter((t) => t.id !== id)
    return nodeTemplates.length < initialLength
  } catch (error) {
    console.error(`删除节点模板(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 获取特定类型的节点模板
 *
 * @param type 节点类型
 * @returns 指定类型的节点模板列表
 *
 * TODO: 替换为真实API调用
 * GET /api/nodes/type/:type
 */
export async function getNodeTemplatesByType(type: NodeType): Promise<NodeTemplate[]> {
  try {
    // 模拟API延迟
    await delay(400)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/nodes/type/${type}`);
    // if (!response.ok) throw new Error('Failed to fetch node templates by type');
    // return response.json();

    return nodeTemplates.filter((t) => t.type === type)
  } catch (error) {
    console.error(`获取节点模板(类型: ${type})失败:`, error)
    throw error
  }
}
