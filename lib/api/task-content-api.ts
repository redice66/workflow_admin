// TODO: 事项内容管理相关API接口定义和实现

export interface TaskFieldConfig {
  id: string
  taskId: number
  fieldId: string
  fieldName: string
  displayName: string
  displayDescription: string
  componentType: string
  editable: boolean
  required: boolean
  applications: string[]
  defaultValue: any
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface TaskWorkflowConfig {
  id: string
  taskId: number
  statusMappings: Record<string, string>
  transitions: Record<string, string[]>
  createdAt: string
  updatedAt: string
}

export interface TaskPermissionsConfig {
  id: string
  taskId: number
  permissions: any[] // TODO: 定义具体的权限结构
  createdAt: string
  updatedAt: string
}

export interface TaskNotificationsConfig {
  id: string
  taskId: number
  notifications: any[] // TODO: 定义具体的通知结构
  createdAt: string
  updatedAt: string
}

// TODO: 保存事项字段配置
export async function saveTaskFields(
  taskId: number,
  fields: Omit<TaskFieldConfig, "id" | "taskId" | "createdAt" | "updatedAt">[],
): Promise<{ success: boolean; message: string; data?: TaskFieldConfig[] }> {
  // TODO: 实现API调用
  // return await fetch(`/api/tasks/${taskId}/fields`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ fields })
  // }).then(res => res.json())

  throw new Error("API接口待实现")
}

// TODO: 获取事项字段配置
export async function getTaskFields(
  taskId: number,
): Promise<{ success: boolean; message: string; data?: TaskFieldConfig[] }> {
  // TODO: 实现API调用
  // return await fetch(`/api/tasks/${taskId}/fields`).then(res => res.json())

  throw new Error("API接口待实现")
}

// TODO: 保存事项工作流配置
export async function saveTaskWorkflow(
  taskId: number,
  workflow: Omit<TaskWorkflowConfig, "id" | "taskId" | "createdAt" | "updatedAt">,
): Promise<{ success: boolean; message: string; data?: TaskWorkflowConfig }> {
  // TODO: 实现API调用
  // return await fetch(`/api/tasks/${taskId}/workflow`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(workflow)
  // }).then(res => res.json())

  throw new Error("API接口待实现")
}

// TODO: 获取事项工作流配置
export async function getTaskWorkflow(
  taskId: number,
): Promise<{ success: boolean; message: string; data?: TaskWorkflowConfig }> {
  // TODO: 实现API调用
  // return await fetch(`/api/tasks/${taskId}/workflow`).then(res => res.json())

  throw new Error("API接口待实现")
}

// TODO: 保存事项权限配置
export async function saveTaskPermissions(
  taskId: number,
  permissions: Omit<TaskPermissionsConfig, "id" | "taskId" | "createdAt" | "updatedAt">,
): Promise<{ success: boolean; message: string; data?: TaskPermissionsConfig }> {
  // TODO: 实现API调用
  // return await fetch(`/api/tasks/${taskId}/permissions`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(permissions)
  // }).then(res => res.json())

  throw new Error("API接口待实现")
}

// TODO: 获取事项权限配置
export async function getTaskPermissions(
  taskId: number,
): Promise<{ success: boolean; message: string; data?: TaskPermissionsConfig }> {
  // TODO: 实现API调用
  // return await fetch(`/api/tasks/${taskId}/permissions`).then(res => res.json())

  throw new Error("API接口待实现")
}

// TODO: 保存事项通知配置
export async function saveTaskNotifications(
  taskId: number,
  notifications: Omit<TaskNotificationsConfig, "id" | "taskId" | "createdAt" | "updatedAt">,
): Promise<{ success: boolean; message: string; data?: TaskNotificationsConfig }> {
  // TODO: 实现API调用
  // return await fetch(`/api/tasks/${taskId}/notifications`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(notifications)
  // }).then(res => res.json())

  throw new Error("API接口待实现")
}

// TODO: 获取事项通知配置
export async function getTaskNotifications(
  taskId: number,
): Promise<{ success: boolean; message: string; data?: TaskNotificationsConfig }> {
  // TODO: 实现API调用
  // return await fetch(`/api/tasks/${taskId}/notifications`).then(res => res.json())

  throw new Error("API接口待实现")
}
