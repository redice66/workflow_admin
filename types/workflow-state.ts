// 状态类型枚举
export enum StateType {
  INITIAL = 'initial',      // 初始状态
  PROGRESS = 'progress',    // 进行中状态
  PAUSE = 'pause',          // 暂停状态
  END = 'end'               // 结束状态
}

// 状态类型配置
export const STATE_TYPE_CONFIG = {
  [StateType.INITIAL]: {
    label: '初始状态',
    color: '#52c41a',
    multiSelect: false  // 只能单选
  },
  [StateType.PROGRESS]: {
    label: '进行中状态', 
    color: '#1890ff',
    multiSelect: true   // 可以多选
  },
  [StateType.PAUSE]: {
    label: '暂停状态',
    color: '#faad14',
    multiSelect: true   // 可以多选
  },
  [StateType.END]: {
    label: '结束状态',
    color: '#595959',
    multiSelect: false   // 只能单选
  }
}

// 辅助函数：判断状态类型是否支持多选
export const isMultiSelectType = (type: StateType): boolean => {
  return STATE_TYPE_CONFIG[type].multiSelect
}

// 辅助函数：检查状态是否被选中
export const isStateSelected = (matrix: StateMatrixConfig, type: StateType, stateId: string): boolean => {
  const value = matrix[type]
  if (isMultiSelectType(type)) {
    return Array.isArray(value) ? value.includes(stateId) : false
  } else {
    return value === stateId
  }
}

// 辅助函数：获取选中的状态ID列表
export const getSelectedStates = (matrix: StateMatrixConfig, type: StateType): string[] => {
  const value = matrix[type]
  if (isMultiSelectType(type)) {
    return Array.isArray(value) ? value : []
  } else {
    return value ? [value as string] : []
  }
}

// 状态数据接口
export interface StateItem {
  id: string           // 状态唯一标识
  name: string         // 状态名称
  description?: string // 状态描述
  order: number        // 排序序号
  isDefault?: boolean  // 是否为默认状态
  createdAt?: string   // 创建时间
  updatedAt?: string   // 更新时间
}

// 状态矩阵配置接口 - 支持部分多选：初始状态和结束状态只能单选，进行中和暂停状态可以多选
export interface StateMatrixConfig {
  [StateType.INITIAL]: string | null      // 初始状态选中的状态ID（只能单选）
  [StateType.PROGRESS]: string[] | null   // 进行中状态选中的状态ID数组（可以多选）
  [StateType.PAUSE]: string[] | null      // 暂停状态选中的状态ID数组（可以多选）
  [StateType.END]: string | null          // 结束状态选中的状态ID（只能单选）
}

// 扩展状态矩阵配置接口 - 支持每行多选
export interface ExtendedStateMatrixConfig {
  [stateId: string]: StateType[]           // 每个状态ID对应的类型数组（支持多选）
}

// 工作流状态配置接口
export interface WorkflowStateConfig {
  id?: string                              // 配置ID
  name: string                             // 配置名称
  description?: string                     // 配置描述
  states: StateItem[]                      // 状态列表
  matrix: StateMatrixConfig                // 状态矩阵配置
  createdAt?: string                       // 创建时间
  updatedAt?: string                       // 更新时间
}

// 添加状态对话框表单接口
export interface AddStateFormData {
  name: string         // 状态名称
  description?: string // 状态描述
}

// API响应基础接口
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: string | number
}

// 状态列表API响应
export interface StateListResponse extends ApiResponse<StateItem[]> {}

// 保存配置API响应
export interface SaveConfigResponse extends ApiResponse<WorkflowStateConfig> {}

// 拖拽结果接口
export interface DragResult {
  source: {
    index: number
    droppableId: string
  }
  destination: {
    index: number
    droppableId: string
  } | null
  draggableId: string
} 