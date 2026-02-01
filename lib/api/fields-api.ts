/**
 * 字段管理API服务
 *
 * 这个文件封装了与字段管理相关的所有API调用
 */

import type { Field, FieldType, FieldStatus } from "@/lib/fields-store"

const API_BASE_URL = 'http://localhost:8080/api'

// 模拟延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API 请求类型定义
interface PageFieldInfoReqDTO {
  currentPage: number
  pageSize: number
  fieldName?: string
}

interface FieldInfoReqDTO {
  id?: number
  fieldName: string
  description: string
  displayName: string
  displayDescription: string
  fieldType: string
  referenceFieldId?: number
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

// 字段类型映射
function mapFieldType(apiType: string): FieldType {
  const typeMap: { [key: string]: FieldType } = {
    'singleLineText': 'singleLineText',
    'multiLineText': 'multiLineText',
    'dropdown': 'dropdown',
    'multiSelect': 'multiSelect',
    'dateTime': 'dateTime',
    'number': 'number',
    'email': 'email',
    'phone': 'phone',
    'url': 'url',
    'file': 'file',
    'image': 'image',
    'checkbox': 'checkbox',
    'radio': 'radio',
  }
  return typeMap[apiType] || 'singleLineText'
}

// 模拟当前用户
const currentUser = "Admin User"

// 模拟字段数据
let mockFields: Field[] = [
  {
    id: "1",
    name: "title",
    displayName: "标题",
    hint: "请输入标题",
    type: "singleLineText",
    createdBy: currentUser,
    updatedBy: currentUser,
    createdAt: new Date(2023, 0, 15),
    updatedAt: new Date(2023, 0, 15),
    status: "active",
  },
  {
    id: "2",
    name: "description",
    displayName: "描述",
    hint: "请输入详细描述",
    type: "multiLineText",
    createdBy: currentUser,
    updatedBy: currentUser,
    createdAt: new Date(2023, 0, 16),
    updatedAt: new Date(2023, 0, 16),
    status: "active",
  },
  {
    id: "3",
    name: "category",
    displayName: "分类",
    hint: "请选择分类",
    type: "dropdown",
    options: [
      { id: "opt-1", label: "类别一", value: "category1" },
      { id: "opt-2", label: "类别二", value: "category2" },
      { id: "opt-3", label: "类别三", value: "category3" },
    ],
    createdBy: currentUser,
    updatedBy: currentUser,
    createdAt: new Date(2023, 0, 17),
    updatedAt: new Date(2023, 0, 17),
    status: "active",
  },
  {
    id: "4",
    name: "tags",
    displayName: "标签",
    hint: "请选择标签",
    type: "multiSelect",
    options: [
      { id: "tag-1", label: "标签一", value: "tag1" },
      { id: "tag-2", label: "标签二", value: "tag2" },
      { id: "tag-3", label: "标签三", value: "tag3" },
    ],
    createdBy: currentUser,
    updatedBy: currentUser,
    createdAt: new Date(2023, 0, 18),
    updatedAt: new Date(2023, 0, 18),
    status: "active",
  },
  {
    id: "5",
    name: "dueDate",
    displayName: "截止日期",
    hint: "请选择截止日期",
    type: "dateTime",
    createdBy: currentUser,
    updatedBy: currentUser,
    createdAt: new Date(2023, 0, 19),
    updatedAt: new Date(2023, 0, 19),
    status: "inactive",
  },
  // 添加更多模拟数据以测试分页
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 6}`,
    name: `field-${i + 6}`,
    displayName: `字段 ${i + 6}`,
    hint: `这是字段 ${i + 6} 的提示`,
    type: (["singleLineText", "multiLineText", "dropdown", "dateTime", "number"] as FieldType[])[i % 5],
    createdBy: i % 2 === 0 ? currentUser : "Editor User",
    updatedBy: i % 2 === 0 ? currentUser : "Editor User",
    createdAt: new Date(2023, 1, i + 1),
    updatedAt: new Date(2023, 1, i + 1),
    status: i % 3 === 0 ? "inactive" as FieldStatus : "active" as FieldStatus,
  })),
]

// 分页结果接口
export interface PaginatedResult<T> {
  total: number
  pageNum: number
  pageSize: number
  list: T[]
}

/**
 * 获取所有字段
 *
 * @returns 字段列表
 */
export async function getAllFields(): Promise<Field[]> {
  try {
    const requestData: PageFieldInfoReqDTO = {
      currentPage: 1,
      pageSize: 1000, // 获取所有字段
    }

    const response = await apiRequest<BaseResult<PageResult<any>>>('/field/pageQuery', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    return response.result?.data.map((item: any) => ({
      id: item.id.toString(),
      name: item.fieldName || item.name,
      displayName: item.displayName || item.fieldName,
      hint: item.displayDescription || '',
      type: mapFieldType(item.fieldType || 'singleLineText'),
      options: item.options || [],
      createdBy: item.creator || currentUser,
      updatedBy: item.modifier || currentUser,
      createdAt: item.gmtCreated ? new Date(item.gmtCreated) : new Date(),
      updatedAt: item.gmtModified ? new Date(item.gmtModified) : new Date(),
      status: item.isDeleted === 'N' ? 'active' as FieldStatus : 'inactive' as FieldStatus,
    })) || []
  } catch (error) {
    console.error("获取字段列表失败:", error)
    throw error
  }
}

/**
 * 分页获取字段
 *
 * @param pageNum 页码
 * @param pageSize 每页大小
 * @param filter 过滤条件
 * @returns 分页结果
 */
export async function getFieldsByPage(
  pageNum = 1,
  pageSize = 10,
  filter?: {
    name?: string
    type?: string
    status?: string
    createdBy?: string
  },
): Promise<PaginatedResult<Field>> {
  try {
    const requestData: PageFieldInfoReqDTO = {
      currentPage: pageNum,
      pageSize,
      fieldName: filter?.name || undefined,
    }

    const response = await apiRequest<BaseResult<PageResult<any>>>('/field/pageQuery', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    let fields: Field[] = response.result?.data.map((item: any) => ({
      id: item.id.toString(),
      name: item.fieldName || item.name,
      displayName: item.displayName || item.fieldName,
      hint: item.displayDescription || '',
      type: mapFieldType(item.fieldType || 'singleLineText'),
      options: item.options || [],
      createdBy: item.creator || currentUser,
      updatedBy: item.modifier || currentUser,
      createdAt: item.gmtCreated ? new Date(item.gmtCreated) : new Date(),
      updatedAt: item.gmtModified ? new Date(item.gmtModified) : new Date(),
      status: item.isDeleted === 'N' ? 'active' as FieldStatus : 'inactive' as FieldStatus,
    })) || []

    // 客户端过滤（API可能不支持所有过滤条件）
    if (filter) {
      if (filter.type && filter.type !== "all") {
        fields = fields.filter((field) => field.type === filter.type)
      }

      if (filter.status && filter.status !== "all") {
        fields = fields.filter((field) => field.status === filter.status)
      }

      if (filter.createdBy) {
        const searchTerm = filter.createdBy.toLowerCase()
        fields = fields.filter((field) => field.createdBy.toLowerCase().includes(searchTerm))
      }
    }

    return {
      total: response.result?.totalCount || 0,
      pageNum,
      pageSize,
      list: fields,
    }
  } catch (error) {
    console.error("分页获取字段列表失败:", error)
    throw error
  }
}

/**
 * 获取单个字段
 *
 * @param id 字段ID
 * @returns 字段信息
 */
export async function getField(id: string): Promise<Field | null> {
  try {
    const fields = await getAllFields()
    return fields.find((f) => f.id === id) || null
  } catch (error) {
    console.error(`获取字段(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 创建字段
 *
 * @param field 字段信息（不包含ID）
 * @returns 创建的字段（包含ID）
 */
export async function createField(field: Omit<Field, "id" | "createdAt" | "updatedAt">): Promise<Field> {
  try {
    const requestData: FieldInfoReqDTO = {
      fieldName: field.name,
      displayName: field.displayName,
      description: field.hint || '',
      displayDescription: field.hint || '',
      fieldType: field.type,
    }

    const response = await apiRequest<BaseResult<void>>('/field/saveField', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    // API不返回创建的字段，构造一个
    const now = new Date()
    const newField: Field = {
      ...field,
      id: `field-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }

    return newField
  } catch (error) {
    console.error("创建字段失败:", error)
    throw error
  }
}

/**
 * 更新字段
 *
 * @param id 字段ID
 * @param field 要更新的字段信息
 * @returns 更新后的字段
 */
export async function updateField(id: string, field: Partial<Field>): Promise<Field> {
  try {
    const requestData: FieldInfoReqDTO = {
      id: parseInt(id),
      fieldName: field.name || '',
      displayName: field.displayName || '',
      description: field.hint || '',
      displayDescription: field.hint || '',
      fieldType: field.type || 'singleLineText',
    }

    const response = await apiRequest<BaseResult<void>>('/field/updateField', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    // API不返回更新的字段，构造一个
    const updatedField: Field = {
      id,
      name: field.name || '',
      displayName: field.displayName || '',
      hint: field.hint || '',
      type: field.type || 'singleLineText',
      options: field.options || [],
      createdBy: field.createdBy || currentUser,
      updatedBy: currentUser,
      createdAt: field.createdAt || new Date(),
      updatedAt: new Date(),
      status: field.status || 'active',
    }

    return updatedField
  } catch (error) {
    console.error(`更新字段(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 删除字段
 *
 * @param id 字段ID
 * @returns 是否删除成功
 */
export async function deleteField(id: string): Promise<boolean> {
  try {
    const response = await apiRequest<BaseResult<boolean>>(`/field/${id}`, {
      method: 'DELETE',
    })

    return response.result === true
  } catch (error) {
    console.error(`删除字段(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 更新字段状态
 *
 * @param id 字段ID
 * @param status 新状态
 * @returns 更新后的字段
 *
 * TODO: 替换为真实API调用
 * PATCH /api/fields/:id/status
 */
export async function updateFieldStatus(id: string, status: FieldStatus): Promise<Field> {
  try {
    // 模拟API延迟
    await delay(400)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/fields/${id}/status`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status })
    // });
    // if (!response.ok) throw new Error('Failed to update field status');
    // return response.json();

    const index = mockFields.findIndex((f) => f.id === id)
    if (index === -1) {
      throw new Error(`字段不存在 (ID: ${id})`)
    }

    mockFields[index] = {
      ...mockFields[index],
      status,
      updatedAt: new Date(),
      updatedBy: currentUser,
    }

    return mockFields[index]
  } catch (error) {
    console.error(`更新字段状态(ID: ${id})失败:`, error)
    throw error
  }
}

/**
 * 获取特定类型的字段
 *
 * @param type 字段类型
 * @returns 指定类型的字段列表
 *
 * TODO: 替换为真实API调用
 * GET /api/fields/type/:type
 */
export async function getFieldsByType(type: FieldType): Promise<Field[]> {
  try {
    // 模拟API延迟
    await delay(400)

    // TODO: 替换为真实API调用
    // const response = await fetch(`/api/fields/type/${type}`);
    // if (!response.ok) throw new Error('Failed to fetch fields by type');
    // return response.json();

    return mockFields.filter((f) => f.type === type)
  } catch (error) {
    console.error(`获取字段(类型: ${type})失败:`, error)
    throw error
  }
}

// 保存事项字段配置（mock实现）
// TODO: 替换为真实API
export async function saveTaskFields(taskId: string, fields: any[]): Promise<boolean> {
  await delay(500)
  // 这里只是mock，实际应保存到后端
  return true
}
