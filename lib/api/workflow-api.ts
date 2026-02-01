/**
 * 工作流管理API服务
 *
 * 这个文件封装了与工作流管理相关的所有API调用
 * 目前使用模拟数据，后续将替换为真实API调用
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
  createdBy?: string
  permissions?: WorkflowPermissions
  settings?: {
    timeout?: number
    retries?: number
    concurrency?: number
  }
}

// 工作流版本类型定义
export interface WorkflowVersion {
  id: string
  workflowId: string
  version: string
  description: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  createdBy: string
}

// 工作流权限类型定义
export interface WorkflowPermissions {
  viewRoles: string[]
  editRoles: string[]
  executeRoles: string[]
  adminRoles: string[]
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
        position: { x: 150, y: 200 },
        data: { label: "开始" },
      },
      {
        id: "agentNode-1",
        type: "agentNode",
        position: { x: 450, y: 200 },
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
    createdBy: "admin",
    permissions: {
      viewRoles: ["admin", "manager", "user"],
      editRoles: ["admin", "manager"],
      executeRoles: ["admin", "manager", "user"],
      adminRoles: ["admin"],
    },
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
        position: { x: 100, y: 200 },
        data: { label: "开始" },
      },
      {
        id: "validateOrder",
        type: "serviceTask",
        position: { x: 350, y: 150 },
        data: { label: "验证订单" },
      },
      {
        id: "checkInventory",
        type: "serviceTask",
        position: { x: 350, y: 250 },
        data: { label: "检查库存" },
      },
      {
        id: "paymentGateway",
        type: "exclusiveGateway",
        position: { x: 600, y: 200 },
        data: { label: "支付网关" },
      },
      {
        id: "processPayment",
        type: "serviceTask",
        position: { x: 850, y: 150 },
        data: { label: "处理支付" },
      },
      {
        id: "sendEmail",
        type: "emailTask",
        position: { x: 850, y: 250 },
        data: { label: "发送邮件" },
      },
      {
        id: "endNode-2",
        type: "endNode",
        position: { x: 1100, y: 200 },
        data: { label: "完成" },
      },
    ],
    edges: [
      {
        id: "edge-2-1",
        source: "startNode-2",
        target: "validateOrder",
        type: "smoothstep",
      },
      {
        id: "edge-2-2",
        source: "startNode-2",
        target: "checkInventory",
        type: "smoothstep",
      },
      {
        id: "edge-2-3",
        source: "validateOrder",
        target: "paymentGateway",
        type: "smoothstep",
      },
      {
        id: "edge-2-4",
        source: "checkInventory",
        target: "paymentGateway",
        type: "smoothstep",
      },
      {
        id: "edge-2-5",
        source: "paymentGateway",
        target: "processPayment",
        type: "smoothstep",
      },
      {
        id: "edge-2-6",
        source: "paymentGateway",
        target: "sendEmail",
        type: "smoothstep",
      },
      {
        id: "edge-2-7",
        source: "processPayment",
        target: "endNode-2",
        type: "smoothstep",
      },
      {
        id: "edge-2-8",
        source: "sendEmail",
        target: "endNode-2",
        type: "smoothstep",
      },
    ],
    createdAt: "2023-06-01T00:00:00.000Z",
    updatedAt: "2023-06-05T00:00:00.000Z",
    createdBy: "manager",
    permissions: {
      viewRoles: ["admin", "manager"],
      editRoles: ["admin", "manager"],
      executeRoles: ["admin", "manager"],
      adminRoles: ["admin"],
    },
  },
]

// 模拟工作流版本数据
const mockWorkflowVersions: WorkflowVersion[] = [
  {
    id: "version-1",
    workflowId: "workflow-1",
    version: "1.0.0",
    description: "初始版本",
    nodes: [
      {
        id: "startNode-1",
        type: "startNode",
        position: { x: 150, y: 200 },
        data: { label: "开始" },
      },
      {
        id: "agentNode-1",
        type: "agentNode",
        position: { x: 450, y: 200 },
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
    createdBy: "admin",
  },
  {
    id: "version-2",
    workflowId: "workflow-1",
    version: "0.9.0",
    description: "添加条件分支",
    nodes: [
      {
        id: "startNode-1",
        type: "startNode",
        position: { x: 150, y: 200 },
        data: { label: "开始" },
      },
      {
        id: "agentNode-1",
        type: "agentNode",
        position: { x: 450, y: 200 },
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
      {
        id: "conditionNode-1",
        type: "conditionNode",
        position: { x: 500, y: 100 },
        data: {
          label: "条件分支",
          conditions: [
            { type: "IF", condition: "text 包含 关键词" },
            { type: "ELSE", condition: "" },
          ],
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "startNode-1",
        target: "agentNode-1",
      },
      {
        id: "edge-2",
        source: "agentNode-1",
        target: "conditionNode-1",
      },
    ],
    createdAt: "2023-04-15T00:00:00.000Z",
    createdBy: "admin",
  },
]

// 内存中的工作流数据（用于模拟）
let workflows = [...mockWorkflows]
let workflowVersions = [...mockWorkflowVersions]

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

    // 创建初始版本
    const initialVersion: WorkflowVersion = {
      id: `version-${Date.now()}`,
      workflowId: newWorkflow.id,
      version: newWorkflow.version,
      description: "初始版本",
      nodes: newWorkflow.nodes,
      edges: newWorkflow.edges,
      createdAt: now,
      createdBy: newWorkflow.createdBy || "admin",
    }

    workflowVersions.push(initialVersion)

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

    const updatedWorkflow = {
      ...workflows[index],
      ...workflow,
      updatedAt: new Date().toISOString(),
    }

    workflows[index] = updatedWorkflow

    // 如果节点或边发生变化，创建新版本
    if (workflow.nodes || workflow.edges) {
      const newVersion: WorkflowVersion = {
        id: `version-${Date.now()}`,
        workflowId: id,
        version: workflow.version || updatedWorkflow.version,
        description: "更新版本",
        nodes: updatedWorkflow.nodes,
        edges: updatedWorkflow.edges,
        createdAt: new Date().toISOString(),
        createdBy: workflow.createdBy || "admin",
      }

      workflowVersions.push(newVersion)
    }

    return updatedWorkflow
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

    // 删除相关版本
    workflowVersions = workflowVersions.filter((v) => v.workflowId !== id)

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

/**
 * 获取工作流版本列表
 *
 * @param workflowId 工作流ID
 * @returns 版本列表
 *
 * TODO: 替换为真实API调用
 * GET /api/workflows/:id/versions
 */
export async function getWorkflowVersions(workflowId: string): Promise<WorkflowVersion[]> {
  try {
    // 模拟API延迟
    await delay(600)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${workflowId}/versions`);
    // if (!response.ok) throw new Error('Failed to fetch workflow versions');
    // return response.json();

    return workflowVersions.filter((v) => v.workflowId === workflowId)
  } catch (error) {
    console.error(`获取工作流版本列表失败:`, error)
    throw error
  }
}

/**
 * 获取工作流特定版本
 *
 * @param workflowId 工作流ID
 * @param versionId 版本ID
 * @returns 版本信息
 *
 * TODO: 替换为真实API调用
 * GET /api/workflows/:id/versions/:versionId
 */
export async function getWorkflowVersion(workflowId: string, versionId: string): Promise<WorkflowVersion | null> {
  try {
    // 模拟API延迟
    await delay(400)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${workflowId}/versions/${versionId}`);
    // if (!response.ok) throw new Error('Failed to fetch workflow version');
    // return response.json();

    return workflowVersions.find((v) => v.workflowId === workflowId && v.id === versionId) || null
  } catch (error) {
    console.error(`获取工作流版本失败:`, error)
    throw error
  }
}

/**
 * 恢复到特定版本
 *
 * @param workflowId 工作流ID
 * @param versionId 版本ID
 * @returns 更新后的工作流
 *
 * TODO: 替换为真实API调用
 * POST /api/workflows/:id/versions/:versionId/restore
 */
export async function restoreWorkflowVersion(workflowId: string, versionId: string): Promise<Workflow> {
  try {
    // 模拟API延迟
    await delay(800)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${workflowId}/versions/${versionId}/restore`, {
    //   method: 'POST'
    // });
    // if (!response.ok) throw new Error('Failed to restore workflow version');
    // return response.json();

    const version = workflowVersions.find((v) => v.workflowId === workflowId && v.id === versionId)
    if (!version) {
      throw new Error(`工作流版本不存在`)
    }

    const workflowIndex = workflows.findIndex((w) => w.id === workflowId)
    if (workflowIndex === -1) {
      throw new Error(`工作流不存在 (ID: ${workflowId})`)
    }

    // 更新工作流
    const updatedWorkflow = {
      ...workflows[workflowIndex],
      nodes: version.nodes,
      edges: version.edges,
      version: version.version,
      updatedAt: new Date().toISOString(),
    }

    workflows[workflowIndex] = updatedWorkflow
    return updatedWorkflow
  } catch (error) {
    console.error(`恢复工作流版本失败:`, error)
    throw error
  }
}

/**
 * 比较两个工作流版本
 *
 * @param workflowId 工作流ID
 * @param versionId1 版本1 ID
 * @param versionId2 版本2 ID
 * @returns 比较结果
 *
 * TODO: 替换为真实API调用
 * GET /api/workflows/:id/versions/compare?v1=:versionId1&v2=:versionId2
 */
export async function compareWorkflowVersions(
  workflowId: string,
  versionId1: string,
  versionId2: string,
): Promise<{
  nodesAdded: Node[]
  nodesRemoved: Node[]
  nodesModified: { before: Node; after: Node }[]
  edgesAdded: Edge[]
  edgesRemoved: Edge[]
}> {
  try {
    // 模拟API延迟
    await delay(700)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${workflowId}/versions/compare?v1=${versionId1}&v2=${versionId2}`);
    // if (!response.ok) throw new Error('Failed to compare workflow versions');
    // return response.json();

    const version1 = workflowVersions.find((v) => v.workflowId === workflowId && v.id === versionId1)
    const version2 = workflowVersions.find((v) => v.workflowId === workflowId && v.id === versionId2)

    if (!version1 || !version2) {
      throw new Error(`工作流版本不存在`)
    }

    // 简单比较节点和边的差异
    const nodesAdded = version2.nodes.filter((n2) => !version1.nodes.some((n1) => n1.id === n2.id))
    const nodesRemoved = version1.nodes.filter((n1) => !version2.nodes.some((n2) => n2.id === n1.id))

    const nodesModified = version1.nodes
      .filter((n1) => version2.nodes.some((n2) => n2.id === n1.id))
      .map((n1) => {
        const n2 = version2.nodes.find((n) => n.id === n1.id)!
        if (JSON.stringify(n1) !== JSON.stringify(n2)) {
          return { before: n1, after: n2 }
        }
        return null
      })
      .filter(Boolean) as { before: Node; after: Node }[]

    const edgesAdded = version2.edges.filter((e2) => !version1.edges.some((e1) => e1.id === e2.id))
    const edgesRemoved = version1.edges.filter((e1) => !version2.edges.some((e2) => e2.id === e1.id))

    return {
      nodesAdded,
      nodesRemoved,
      nodesModified,
      edgesAdded,
      edgesRemoved,
    }
  } catch (error) {
    console.error(`比较工作流版本失败:`, error)
    throw error
  }
}

/**
 * 导出工作流
 *
 * @param id 工作流ID
 * @returns 工作流JSON字符串
 *
 * TODO: 替换为真实API调用
 * GET /api/workflows/:id/export
 */
export async function exportWorkflow(id: string): Promise<string> {
  try {
    // 模拟API延迟
    await delay(500)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${id}/export`);
    // if (!response.ok) throw new Error('Failed to export workflow');
    // return response.text();

    const workflow = workflows.find((w) => w.id === id)
    if (!workflow) {
      throw new Error(`工作流不存在 (ID: ${id})`)
    }

    return JSON.stringify(workflow, null, 2)
  } catch (error) {
    console.error(`导出工作流失败:`, error)
    throw error
  }
}

/**
 * 导入工作流
 *
 * @param workflowJson 工作流JSON字符串
 * @returns 导入的工作流
 *
 * TODO: 替换为真实API调用
 * POST /api/workflows/import
 */
export async function importWorkflow(workflowJson: string): Promise<Workflow> {
  try {
    // 模拟API延迟
    await delay(800)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/import`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: workflowJson
    // });
    // if (!response.ok) throw new Error('Failed to import workflow');
    // return response.json();

    let workflow: Workflow
    try {
      workflow = JSON.parse(workflowJson)
    } catch (e) {
      throw new Error("无效的工作流JSON格式")
    }

    // 生成新ID和时间戳
    const now = new Date().toISOString()
    const newWorkflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      status: "draft" as const,
    }

    workflows.push(newWorkflow)

    // 创建初始版本
    const initialVersion: WorkflowVersion = {
      id: `version-${Date.now()}`,
      workflowId: newWorkflow.id,
      version: newWorkflow.version,
      description: "导入版本",
      nodes: newWorkflow.nodes,
      edges: newWorkflow.edges,
      createdAt: now,
      createdBy: newWorkflow.createdBy || "admin",
    }

    workflowVersions.push(initialVersion)

    return newWorkflow
  } catch (error) {
    console.error(`导入工作流失败:`, error)
    throw error
  }
}

/**
 * 更新工作流权限
 *
 * @param id 工作流ID
 * @param permissions 权限设置
 * @returns 更新后的工作流
 *
 * TODO: 替换为真实API调用
 * PUT /api/workflows/:id/permissions
 */
export async function updateWorkflowPermissions(id: string, permissions: WorkflowPermissions): Promise<Workflow> {
  try {
    // 模拟API延迟
    await delay(600)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/workflows/${id}/permissions`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(permissions)
    // });
    // if (!response.ok) throw new Error('Failed to update workflow permissions');
    // return response.json();

    const index = workflows.findIndex((w) => w.id === id)
    if (index === -1) {
      throw new Error(`工作流不存在 (ID: ${id})`)
    }

    workflows[index] = {
      ...workflows[index],
      permissions,
      updatedAt: new Date().toISOString(),
    }

    return workflows[index]
  } catch (error) {
    console.error(`更新工作流权限失败:`, error)
    throw error
  }
}

// ============================================================================
// 任务工作流相关API
// ============================================================================

// 任务工作流相关类型定义
export interface TaskWorkflowState {
  id: string
  name: string
  type: "start" | "progress" | "end" | "pause"
  color: string
  description?: string
  isDefault?: boolean
  order: number
}

export interface TaskWorkflowTransition {
  id: string
  fromStateId: string
  toStateId: string
  name: string
  description?: string
  condition?: string
  requiredRole?: string
}

export interface TaskWorkflowData {
  taskId: number
  taskName: string
  states: TaskWorkflowState[]
  transitions: TaskWorkflowTransition[]
  matrixConfig: any
  createdAt: string
  updatedAt: string
}

export interface SaveTaskWorkflowResponse {
  success: boolean
  data: {
    workflowId: string
    version: number
    status: string
  } & TaskWorkflowData
  message: string
}

/**
 * 保存任务工作流配置
 * 
 * @param workflowData 工作流配置数据
 * @returns 保存结果
 *
 * TODO: 替换为真实API调用
 * POST /api/tasks/:taskId/workflow
 */
export async function saveTaskWorkflow(workflowData: TaskWorkflowData): Promise<SaveTaskWorkflowResponse> {
  try {
    // 模拟API延迟
    await delay(1500)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/tasks/${workflowData.taskId}/workflow`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(workflowData),
    // })
    // 
    // if (!response.ok) {
    //   throw new Error('保存工作流配置失败')
    // }
    // 
    // return response.json()

    // Mock响应数据
    const mockResponse: SaveTaskWorkflowResponse = {
      success: true,
      data: {
        workflowId: `workflow_${Date.now()}`,
        version: 1,
        status: "active",
        ...workflowData
      },
      message: "工作流配置保存成功"
    }

    console.log("Mock API - 保存任务工作流:", workflowData)
    console.log("Mock API - 响应数据:", mockResponse)

    return mockResponse
  } catch (error) {
    console.error("保存任务工作流失败:", error)
    throw error
  }
}
