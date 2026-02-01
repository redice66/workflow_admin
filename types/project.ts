// 项目模板状态枚举
export enum ProjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

// 项目模板接口
export interface Project {
  id: number
  name: string // 项目名称
  displayName: string // C端展示名称
  description: string // 项目释义
  displayDescription: string // C端提示语
  status: ProjectStatus // 状态（启用/停用）
  createdBy: string // 创建人
  createdAt: string // 创建时间
  updatedBy: string // 更新人
  updatedAt: string // 更新时间
}

// 项目API响应接口
export interface ProjectResponse {
  success: boolean
  message: string
  data?: Project[]
  total?: number
}

// 项目字段配置接口
export interface ProjectField {
  id: string
  projectId: number
  fieldId: string
  fieldName: string
  displayName: string
  componentType: string
  required: boolean
  editable: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// 项目阶段接口
export interface ProjectStage {
  id: string
  projectId: number
  name: string
  displayName: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// 项目内容库接口
export interface ProjectContent {
  id: string
  projectId: number
  stageId: string
  title: string
  content: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// 项目角色接口
export interface ProjectRole {
  id: string
  projectId: number
  roleId: string
  roleName: string
  displayName: string
  identity: string
  definition: string
  createdAt: string
  updatedAt: string
}

// 项目角色权限接口
export interface ProjectRolePermission {
  id: string
  projectRoleId: string
  permissionType: 'page' | 'field' | 'task' | 'visibility'
  resourceId: string
  allowed: boolean
  createdAt: string
  updatedAt: string
}

// 项目设置接口
export interface ProjectSettings {
  id: string
  projectId: number
  fieldVisibilitySettings: Record<string, boolean>
  fieldEditabilitySettings: Record<string, boolean>
  createdAt: string
  updatedAt: string
}

// 项目动态接口
export interface ProjectActivity {
  id: string
  projectId: number
  activityType: string
  description: string
  userId: string
  userName: string
  createdAt: string
} 