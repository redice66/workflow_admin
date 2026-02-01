"use client"

import { create } from "zustand"

// 字段类型
export type FieldType =
  | "singleLineText" // 单行文本框
  | "multiLineText" // 多行文本框
  | "richText" // 富文本框
  | "attachment" // 附件
  | "dropdown" // 下拉单选框
  | "multiSelect" // 下拉多选框
  | "number" // 数字输入框
  | "dateTime" // 时间选择框
  | "userSelect" // 用户单选框
  | "userMultiSelect" // 用户多选框
  | "reference" // 引用字段
  | "email" // 邮箱
  | "phone" // 电话
  | "url" // 网址
  | "file" // 文件
  | "image" // 图片
  | "checkbox" // 复选框
  | "radio" // 单选框

// 字段状态
export type FieldStatus = "active" | "inactive"

// 字段选项
export interface FieldOption {
  id: string
  label: string // 选项名称
  value: string // 选项值
  hint?: string // 选项提示
}

// 字段定义
export interface Field {
  id: string
  name: string // 字段名称
  displayName: string // C端展示名称
  hint: string // 字段释义
  clientHint?: string // C端展示释义
  type: FieldType // 元件类型
  options?: FieldOption[] // 选项数据
  useReference?: boolean // 是否引用选项
  referenceFieldId?: string // 引用的字段ID
  createdBy: string // 创建人
  updatedBy: string // 更新人
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
  status: FieldStatus // 状态
}

// 字段过滤条件
export interface FieldFilter {
  name?: string
  type?: FieldType | "all"
  status?: FieldStatus | "all"
  createdBy?: string
}

// 字段状态存储
interface FieldState {
  fields: Field[]
  filter: FieldFilter
  isLoading: boolean
  error: string | null

  // 获取所有字段
  fetchFields: () => Promise<void>

  // 添加字段
  addField: (field: Omit<Field, "id" | "createdAt" | "updatedAt">) => void

  // 更新字段
  updateField: (id: string, field: Partial<Field>) => void

  // 删除字段
  deleteField: (id: string) => void

  // 切换字段状态
  toggleFieldStatus: (id: string) => void

  // 设置过滤条件
  setFilter: (filter: FieldFilter) => void

  // 获取过滤后的字段
  getFilteredFields: () => Field[]
}

// 模拟字段数据
const mockFields: Field[] = [
  {
    id: "field-1",
    name: "title",
    displayName: "标题",
    hint: "请输入文章标题",
    clientHint: "请输入标题内容",
    type: "singleLineText",
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    status: "active",
  },
  {
    id: "field-2",
    name: "content",
    displayName: "内容",
    hint: "请输入文章内容",
    clientHint: "请输入详细内容",
    type: "richText",
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2023-01-02"),
    status: "active",
  },
  {
    id: "field-3",
    name: "category",
    displayName: "分类",
    hint: "请选择文章分类",
    clientHint: "选择合适的分类",
    type: "dropdown",
    options: [
      { id: "opt-1", label: "技术", value: "tech", hint: "技术相关内容" },
      { id: "opt-2", label: "生活", value: "life", hint: "生活相关内容" },
      { id: "opt-3", label: "工作", value: "work", hint: "工作相关内容" },
    ],
    createdBy: "Editor",
    updatedBy: "Admin",
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-01-10"),
    status: "active",
  },
  {
    id: "field-4",
    name: "tags",
    displayName: "标签",
    hint: "请选择文章标签",
    clientHint: "可选择多个标签",
    type: "multiSelect",
    options: [
      { id: "opt-4", label: "前端", value: "frontend", hint: "前端开发" },
      { id: "opt-5", label: "后端", value: "backend", hint: "后端开发" },
      { id: "opt-6", label: "设计", value: "design", hint: "UI/UX设计" },
    ],
    createdBy: "Editor",
    updatedBy: "Editor",
    createdAt: new Date("2023-01-04"),
    updatedAt: new Date("2023-01-04"),
    status: "active",
  },
  {
    id: "field-5",
    name: "publishDate",
    displayName: "发布日期",
    hint: "请选择发布日期",
    clientHint: "选择文章发布时间",
    type: "dateTime",
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-01-05"),
    status: "active",
  },
  {
    id: "field-6",
    name: "author",
    displayName: "作者",
    hint: "请选择作者",
    clientHint: "选择文章作者",
    type: "userSelect",
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: new Date("2023-01-06"),
    updatedAt: new Date("2023-01-06"),
    status: "inactive",
  },
  {
    id: "field-7",
    name: "attachment",
    displayName: "附件",
    hint: "请上传附件",
    clientHint: "上传相关文件",
    type: "attachment",
    createdBy: "Editor",
    updatedBy: "Editor",
    createdAt: new Date("2023-01-07"),
    updatedAt: new Date("2023-01-07"),
    status: "active",
  },
]

// 创建字段状态存储
export const useFieldStore = create<FieldState>((set, get) => ({
  fields: [...mockFields],
  filter: {},
  isLoading: false,
  error: null,

  // 获取所有字段
  fetchFields: async () => {
    set({ isLoading: true, error: null })
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500))
      set({ fields: [...mockFields], isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "获取字段列表失败",
        isLoading: false,
      })
    }
  },

  // 添加字段
  addField: (field) => {
    const newField: Field = {
      ...field,
      id: `field-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set((state) => ({
      fields: [...state.fields, newField],
    }))
  },

  // 更新字段
  updateField: (id, field) => {
    set((state) => ({
      fields: state.fields.map((f) =>
        f.id === id
          ? {
              ...f,
              ...field,
              updatedAt: new Date(),
              updatedBy: field.updatedBy || f.updatedBy,
            }
          : f,
      ),
    }))
  },

  // 删除字段
  deleteField: (id) => {
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
    }))
  },

  // 切换字段状态
  toggleFieldStatus: (id) => {
    set((state) => ({
      fields: state.fields.map((f) =>
        f.id === id
          ? {
              ...f,
              status: f.status === "active" ? "inactive" : "active",
              updatedAt: new Date(),
            }
          : f,
      ),
    }))
  },

  // 设置过滤条件
  setFilter: (filter) => {
    set({ filter })
  },

  // 获取过滤后的字段
  getFilteredFields: () => {
    const { fields, filter } = get()
    return fields.filter((field) => {
      // 按名称或显示名称过滤
      if (
        filter.name &&
        !field.name.toLowerCase().includes(filter.name.toLowerCase()) &&
        !field.displayName.toLowerCase().includes(filter.name.toLowerCase())
      ) {
        return false
      }

      // 按类型过滤
      if (filter.type && filter.type !== "all" && field.type !== filter.type) {
        return false
      }

      // 按状态过滤
      if (filter.status && filter.status !== "all" && field.status !== filter.status) {
        return false
      }

      // 按创建人过滤
      if (filter.createdBy && !field.createdBy.toLowerCase().includes(filter.createdBy.toLowerCase())) {
        return false
      }

      return true
    })
  },
}))
