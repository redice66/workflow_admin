/**
 * 工作流管理API服务
 *
 * 这个文件封装了与工作流管理相关的所有API调用
 * 目前使用mock数据，后续将替换为真实API调用
 */

import type { Node, Edge } from "reactflow"

// 工作流类型定义
export interface Workflow {
  id: string
  name: string
  description: string
  status: "draft" | "active" | "inactive"
  version: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  updatedAt: string
  settings?: {
    timeout?: number
    retries?: number
    concurrency?: number
  }
}

// 模拟API延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 模拟工作流数据
const mockWorkflows: Workflow[] = [
  {
    id: "workflow-1",
    name: "客户咨询工作流",
    description: "处理客户咨询的自动化工作流",
    status: "active",
    version: "1.0.0",
    nodes: [
      {
        id: "startNode-1",
        type: "startNode",
        position: { x: 100, y: 100 },
        data: { label: "开始" },
      },
      {
        id: "agentNode-1",
        type: "agentNode",
        position: { x: 300, y: 100 },
        data: {
          label: "代理",
          config: {
            title: "常规",
            model: "ot-mini",
            modelType: "CHAT",
            instructions: "处理用户输入",
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "startNode-1",
        target: "agentNode-1",
      },
    ],
    createdAt: "2023-05-01T00:00:00.000Z",
    updatedAt: "2023-05-10T00:00:00.000Z",
    settings: {
      timeout: 30,
      retries: 3,
      concurrency: 10,
    },
  },
  {
    id: "workflow-2",
    name: "订单处理工作流",
    description: "处理用户订单的自动化工作流",
    status: "draft",
    version: "0.5.0",
    nodes: [
      {
        id: "startNode-2",
        type: "startNode",
        position: { x: 100, y: 100 },
        data: { label: "开始" },
      },
    ],
    edges: [],
    createdAt: "2023-06-01T00:00:00.000Z",
    updatedAt: "2023-06-05T00:00:00.000Z",
  },
]

// 内存中的工作流数据（用于模拟）
let workflows = [...mockWorkflows]

/**
 * 获取所有工作流
 *
 * @returns 工作流列表
 *
 * TODO: 替换为真实API调用
 * GET /api/workflows
 */
export async function getAllWorkflows(): Promise<Workflow[]> {
  try {
    // 模拟API延迟
    await delay(600)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/workflows');
    // if (!response.ok) throw new Error('Failed to fetch workflows');
    // return response.json();

    return [...workflows]
  } catch (error) {
    console.error("获取工作流列表失败:", error)
    throw error
  }
}

/**
 * 获取单个工作流
 *
 * @param id 工作流ID
 * @returns 工作流信息
 *
 * TODO: 替换为真实API调用
 * GET /api/workflows/:id
 */
export async function getWorkflow(id: string): Promise<Workflow | null> {
  try {
    // 模拟API延迟
    await delay(400)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${id}`);
    // if (!response.ok) throw new Error('Failed to fetch workflow');
    // return response.json();

    const workflow = workflows.find((w) => w.id === id)
    return workflow || null
  } catch (error) {
    console.error(`获取工作流(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 创建工作流
 *
 * @param workflow 工作流信息（不包含ID、创建时间和更新时间）
 * @returns 创建的工作流（包含ID、创建时间和更新时间）
 *
 * TODO: 替换为真实API调用
 * POST /api/workflows
 */
export async function createWorkflow(workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">): Promise<Workflow> {
  try {
    // 模拟API延迟
    await delay(800)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/workflows', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(workflow)
    // });
    // if (!response.ok) throw new Error('Failed to create workflow');
    // return response.json();

    const now = new Date().toISOString()
    const newWorkflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }

    workflows.push(newWorkflow)
    return newWorkflow
  } catch (error) {
    console.error("创建工作流失败:", error)
    throw error
  }
}

/**
 * 更新工作流
 *
 * @param id 工作流ID
 * @param workflow 要更新的工作流信息
 * @returns 更新后的工作流
 *
 * TODO: 替换为真实API调用
 * PUT /api/workflows/:id
 */
export async function updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
  try {
    // 模拟API延迟
    await delay(700)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(workflow)
    // });
    // if (!response.ok) throw new Error('Failed to update workflow');
    // return response.json();

    const index = workflows.findIndex((w) => w.id === id)
    if (index === -1) {
      throw new Error(`工作流不存在 (ID: ${id})`)
    }

    workflows[index] = {
      ...workflows[index],
      ...workflow,
      updatedAt: new Date().toISOString(),
    }

    return workflows[index]
  } catch (error) {
    console.error(`更新工作流(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 删除工作流
 *
 * @param id 工作流ID
 * @returns 是否删除成功
 *
 * TODO: 替换为真实API调用
 * DELETE /api/workflows/:id
 */
export async function deleteWorkflow(id: string): Promise<boolean> {
  try {
    // 模拟API延迟
    await delay(500)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${id}`, {
    //   method: 'DELETE'
    // });
    // if (!response.ok) throw new Error('Failed to delete workflow');
    // return true;

    const initialLength = workflows.length
    workflows = workflows.filter((w) => w.id !== id)
    return workflows.length < initialLength
  } catch (error) {
    console.error(`删除工作流(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 发布工作流
 *
 * @param id 工作流ID
 * @returns 发布后的工作流
 *
 * TODO: 替换为真实API调用
 * POST /api/workflows/:id/publish
 */
export async function publishWorkflow(id: string): Promise<Workflow> {
  try {
    // 模拟API延迟
    await delay(1000)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${id}/publish`, {
    //   method: 'POST'
    // });
    // if (!response.ok) throw new Error('Failed to publish workflow');
    // return response.json();

    const index = workflows.findIndex((w) => w.id === id)
    if (index === -1) {
      throw new Error(`工作流不存在 (ID: ${id})`)
    }

    workflows[index] = {
      ...workflows[index],
      status: "active",
      updatedAt: new Date().toISOString(),
    }

    return workflows[index]
  } catch (error) {
    console.error(`发布工作流(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 停用工作流
 *
 * @param id 工作流ID
 * @returns 停用后的工作流
 *
 * TODO: 替换为真实API调用
 * POST /api/workflows/:id/deactivate
 */
export async function deactivateWorkflow(id: string): Promise<Workflow> {
  try {
    // 模拟API延迟
    await delay(800)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${id}/deactivate`, {
    //   method: 'POST'
    // });
    // if (!response.ok) throw new Error('Failed to deactivate workflow');
    // return response.json();

    const index = workflows.findIndex((w) => w.id === id)
    if (index === -1) {
      throw new Error(`工作流不存在 (ID: ${id})`)
    }

    workflows[index] = {
      ...workflows[index],
      status: "inactive",
      updatedAt: new Date().toISOString(),
    }

    return workflows[index]
  } catch (error) {
    console.error(`停用工作流(ID: ${id})失败:`, error)
    throw error
  }
}
