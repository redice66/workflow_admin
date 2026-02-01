import { 
  StateItem, 
  WorkflowStateConfig, 
  StateMatrixConfig,
  StateType,
  StateListResponse,
  SaveConfigResponse 
} from '@/types/workflow-state'

// TODO: 替换为真实的API端点
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

// Mock数据 - 状态列表（从状态管理菜单页获取）
const mockStates: StateItem[] = [
  {
    id: 'state_001',
    name: '待开始',
    description: '任务尚未开始执行',
    order: 0,
    isDefault: true,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z'
  },
  {
    id: 'state_002',
    name: '需求收集',
    description: '收集和整理项目需求',
    order: 1,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'state_003',
    name: '设计阶段',
    description: '进行产品设计和架构设计',
    order: 2,
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 'state_004',
    name: '开发中',
    description: '正在进行开发工作',
    order: 3,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'state_005',
    name: '测试中',
    description: '正在进行测试验证',
    order: 4,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'state_006',
    name: '已完成',
    description: '任务已完成',
    order: 5,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 'state_007',
    name: '暂停中',
    description: '任务暂时停止',
    order: 6,
    createdAt: '2024-01-15T11:30:00Z',
    updatedAt: '2024-01-15T11:30:00Z'
  }
]

// Mock默认工作流配置
const mockDefaultConfig: WorkflowStateConfig = {
  id: 'config_001',
  name: '默认工作流配置',
  description: '系统默认的工作流状态配置',
  states: mockStates,
  matrix: {
    [StateType.INITIAL]: 'state_001',    // 待开始
    [StateType.PROGRESS]: ['state_004'], // 开发中
    [StateType.END]: 'state_006',        // 已完成
    [StateType.PAUSE]: ['state_007']     // 暂停中
  },
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-01-15T08:00:00Z'
}

/**
 * 获取状态列表（仅启用的状态）
 * TODO: 集成状态管理菜单页的API接口 - 需要从状态管理页面获取启用状态
 * 
 * @returns 状态列表
 */
export async function getStateList(): Promise<StateListResponse> {
  try {
    // TODO: 替换为真实API调用 - 获取状态管理页面的启用状态
    // const response = await fetch(`${API_BASE_URL}/status?enabled=true`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}` // 如果需要认证
    //   }
    // })
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }
    // 
    // const data = await response.json()
    // return data

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      data: mockStates,
      message: '获取状态列表成功'
    }
  } catch (error) {
    console.error('获取状态列表失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取状态列表失败'
    }
  }
}

/**
 * 获取可用状态列表（用于添加状态选择）
 * TODO: 集成状态管理菜单页的API接口 - 获取所有启用的状态用于选择
 * 
 * @returns 可用状态列表
 */
export async function getAvailableStates(): Promise<StateListResponse> {
  try {
    // TODO: 替换为真实API调用 - 从状态管理页面获取所有启用的状态
    // const response = await fetch(`${API_BASE_URL}/status?enabled=true&available=true`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}` // 如果需要认证
    //   }
    // })
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }
    // 
    // const data = await response.json()
    // return data

    // 模拟可用状态数据（从状态管理页面获取的启用状态）
    const availableStates: StateItem[] = [
      ...mockStates,
      {
        id: 'state_008',
        name: '评审中',
        description: '正在进行评审',
        order: 8,
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z'
      },
      {
        id: 'state_009',
        name: '待发布',
        description: '准备发布',
        order: 9,
        createdAt: '2024-01-15T12:30:00Z',
        updatedAt: '2024-01-15T12:30:00Z'
      }
    ]

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      data: availableStates,
      message: '获取可用状态列表成功'
    }
  } catch (error) {
    console.error('获取可用状态列表失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取可用状态列表失败'
    }
  }
}

/**
 * 添加新状态
 * TODO: 集成状态管理菜单页的API接口
 * 
 * @param stateData 状态数据
 * @returns 添加结果
 */
export async function addState(stateData: { name: string; description?: string }): Promise<StateListResponse> {
  try {
    // TODO: 替换为真实API调用
    // const response = await fetch(`${API_BASE_URL}/states`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}` // 如果需要认证
    //   },
    //   body: JSON.stringify(stateData)
    // })
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }
    // 
    // const data = await response.json()
    // return data

    // 模拟添加新状态
    const newState: StateItem = {
      id: `state_${Date.now()}`,
      name: stateData.name,
      description: stateData.description || '',
      order: mockStates.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockStates.push(newState)

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      data: mockStates,
      message: '添加状态成功'
    }
  } catch (error) {
    console.error('添加状态失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '添加状态失败'
    }
  }
}

/**
 * 删除状态
 * TODO: 集成状态管理菜单页的API接口
 * 
 * @param stateId 状态ID
 * @returns 删除结果
 */
export async function deleteState(stateId: string): Promise<StateListResponse> {
  try {
    // TODO: 替换为真实API调用
    // const response = await fetch(`${API_BASE_URL}/states/${stateId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}` // 如果需要认证
    //   }
    // })
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }
    // 
    // const data = await response.json()
    // return data

    // 临时实现：从mock数据中删除
    const index = mockStates.findIndex(state => state.id === stateId)
    
    if (index > -1) {
      mockStates.splice(index, 1)
      // 重新排序
      mockStates.forEach((state, index) => {
        state.order = index
      })
    } else {
      return {
        success: false,
        message: '未找到要删除的状态'
      }
    }

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))

    return {
      success: true,
      data: [...mockStates], // 返回副本而不是原数组
      message: '删除状态成功'
    }
  } catch (error) {
    console.error('删除状态失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '删除状态失败'
    }
  }
}

/**
 * 更新状态名称
 * TODO: 集成状态管理菜单页的API接口
 * 
 * @param stateId 状态ID
 * @param name 新名称
 * @returns 更新结果
 */
export async function updateStateName(stateId: string, name: string): Promise<StateListResponse> {
  try {
    // TODO: 替换为真实API调用
    // const response = await fetch(`${API_BASE_URL}/states/${stateId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}` // 如果需要认证
    //   },
    //   body: JSON.stringify({ name })
    // })
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }
    // 
    // const data = await response.json()
    // return data

    // 模拟更新状态名称
    const stateIndex = mockStates.findIndex(state => state.id === stateId)
    if (stateIndex !== -1) {
      mockStates[stateIndex] = {
        ...mockStates[stateIndex],
        name,
        updatedAt: new Date().toISOString()
      }
    }

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))

    return {
      success: true,
      data: mockStates,
      message: '更新状态名称成功'
    }
  } catch (error) {
    console.error('更新状态名称失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '更新状态名称失败'
    }
  }
}

/**
 * 获取工作流配置
 * TODO: 替换为真实API调用
 * 
 * @param configId 配置ID（可选）
 * @returns 工作流配置
 */
export async function getWorkflowConfig(configId?: string): Promise<SaveConfigResponse> {
  try {
    // TODO: 替换为真实API调用
    // const url = configId 
    //   ? `${API_BASE_URL}/workflow-configs/${configId}`
    //   : `${API_BASE_URL}/workflow-configs/default`
    // 
    // const response = await fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}` // 如果需要认证
    //   }
    // })
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }
    // 
    // const data = await response.json()
    // return data

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      data: mockDefaultConfig,
      message: '获取工作流配置成功'
    }
  } catch (error) {
    console.error('获取工作流配置失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取工作流配置失败'
    }
  }
}

/**
 * 保存工作流配置
 * TODO: 替换为真实API调用
 * 
 * @param config 工作流配置
 * @returns 保存结果
 */
export async function saveWorkflowConfig(config: {
  states: StateItem[]
  matrix: StateMatrixConfig
  name?: string
  description?: string
}): Promise<SaveConfigResponse> {
  try {
    // TODO: 替换为真实API调用
    // const response = await fetch(`${API_BASE_URL}/workflow-configs`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}` // 如果需要认证
    //   },
    //   body: JSON.stringify(config)
    // })
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }
    // 
    // const data = await response.json()
    // return data

    // 模拟保存配置
    const savedConfig: WorkflowStateConfig = {
      ...mockDefaultConfig,
      ...config,
      id: config.name ? `config_${Date.now()}` : mockDefaultConfig.id,
      updatedAt: new Date().toISOString()
    }

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      data: savedConfig,
      message: '保存工作流配置成功'
    }
  } catch (error) {
    console.error('保存工作流配置失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '保存工作流配置失败'
    }
  }
} 