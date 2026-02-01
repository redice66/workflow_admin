import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const API_BASE_URL = 'http://localhost:8080/api'

const rolesKeys = {
  all: ["roles"] as const,
  details: () => [...rolesKeys.all, "detail"] as const,
  detail: (id: string) => [...rolesKeys.details(), id] as const,
}

export type Role = {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export type CreateRoleDto = {
  name: string
  description: string
  permissions: string[]
}

export type UpdateRoleDto = Partial<CreateRoleDto>

// API 请求类型定义
interface PageRoleInfoReqDTO {
  currentPage: number
  pageSize: number
  roleName?: string
}

interface RoleInfoReqDTO {
  id?: number
  roleName: string
  description: string
  displayName: string
  displayDescription: string
}

interface BaseResult<T> {
  code: string
  message: string
  result?: T
}

interface PageResult<T> {
  currentPage: number
  pageSize: number
  totalCount: number
  data: T[]
  endPage: number
  nextPage: number
  prevPage: number
}

// 通用请求函数
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()

  // 检查API返回的业务状态码
  if (data.code !== '200' && data.code !== 200) {
    throw new Error(data.message || 'API请求失败')
  }

  return data
}

// 获取角色列表
async function fetchRoles(): Promise<Role[]> {
  try {
    const requestData: PageRoleInfoReqDTO = {
      currentPage: 1,
      pageSize: 1000, // 获取所有角色
    }

    const response = await apiRequest<BaseResult<PageResult<any>>>('/role/pageQuery', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    return response.result?.data.map((item: any) => ({
      id: item.id.toString(),
      name: item.roleName || item.name,
      description: item.description || '',
      permissions: [], // API可能不返回权限信息，需要单独获取
      createdAt: item.gmtCreated || new Date().toISOString(),
      updatedAt: item.gmtModified || new Date().toISOString(),
    })) || []
  } catch (error) {
    console.error('获取角色列表失败:', error)
    throw error
  }
}

// 创建角色
async function createRole(roleData: CreateRoleDto): Promise<Role> {
  try {
    const requestData: RoleInfoReqDTO = {
      roleName: roleData.name,
      description: roleData.description,
      displayName: roleData.name,
      displayDescription: roleData.description,
    }

    const response = await apiRequest<BaseResult<void>>('/role/saveRole', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    // 返回创建的角色（API不返回创建结果，构造一个）
    return {
      id: Date.now().toString(),
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('创建角色失败:', error)
    throw error
  }
}

// 更新角色
async function updateRole(id: string, roleData: UpdateRoleDto): Promise<Role> {
  try {
    const requestData: RoleInfoReqDTO = {
      id: parseInt(id),
      roleName: roleData.name || '',
      description: roleData.description || '',
      displayName: roleData.name || '',
      displayDescription: roleData.description || '',
    }

    const response = await apiRequest<BaseResult<void>>('/role/updateRole', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    // 返回更新后的角色（API不返回更新结果，构造一个）
    return {
      id,
      name: roleData.name || '',
      description: roleData.description || '',
      permissions: roleData.permissions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('更新角色失败:', error)
    throw error
  }
}

// 删除角色
async function deleteRole(id: string): Promise<void> {
  try {
    const response = await apiRequest<BaseResult<boolean>>(`/role/${id}`, {
      method: 'DELETE',
    })

    if (!response.result) {
      throw new Error(response.message || '删除角色失败')
    }
  } catch (error) {
    console.error('删除角色失败:', error)
    throw error
  }
}

// 获取启用的角色
export async function fetchEnabledRoles(): Promise<Role[]> {
  const roles = await fetchRoles()
  // 假设所有角色都是启用的，如果API有状态字段，可以在这里过滤
  return roles
}

// React Query Hooks
export const useRoles = () => {
  return useQuery({
    queryKey: rolesKeys.all,
    queryFn: fetchRoles,
  })
}

export const useRole = (id: string) => {
  return useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: async () => {
      const roles = await fetchRoles()
      return roles.find(r => r.id === id) || null
    },
    enabled: !!id,
  })
}

export const useCreateRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all })
    },
  })
}

export const useUpdateRole = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (role: UpdateRoleDto) => updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all })
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(id) })
    },
  })
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all })
    },
  })
}
