// TODO: 当连接真实API时，恢复以下配置
// const API_BASE_URL = 'http://localhost:8080/api'

// 目前使用mock数据，避免fetch连接错误
// 如需连接真实API，请确保后端服务正在运行，然后取消注释相关代码

export interface Task {
  id: number
  name: string
  displayName: string
  description: string
  displayDescription: string
  status: "active" | "inactive"
  creator: string
  createdAt: string
  updater: string
  updatedAt: string
}

export interface TaskResponse {
  success: boolean
  message: string
  data?: Task[]
  total?: number
}

export interface CreateTaskRequest {
  name: string
  displayName: string
  description: string
  displayDescription: string
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: number
  status?: "active" | "inactive"
}

// 模拟API延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 模拟数据 - 增加数据量以显示分页导航
const mockTasks: Task[] = [
  {
    id: 1,
    name: "用户注册",
    displayName: "注册账号",
    description: "用户通过手机号或邮箱注册新账号的流程",
    displayDescription: "快速注册，开启您的专属账号",
    status: "active",
    creator: "张三",
    createdAt: "2024-01-15 10:30:00",
    updater: "张三",
    updatedAt: "2024-01-15 10:30:00",
  },
  {
    id: 2,
    name: "密码重置",
    displayName: "找回密码",
    description: "用户忘记密码时通过验证码重置密码的流程",
    displayDescription: "忘记密码？通过验证码快速找回",
    status: "active",
    creator: "李四",
    createdAt: "2024-01-16 14:20:00",
    updater: "王五",
    updatedAt: "2024-01-18 09:15:00",
  },
  {
    id: 3,
    name: "实名认证",
    displayName: "身份验证",
    description: "用户提交身份证信息进行实名认证的流程",
    displayDescription: "完成身份验证，享受更多服务",
    status: "inactive",
    creator: "王五",
    createdAt: "2024-01-17 09:15:00",
    updater: "李四",
    updatedAt: "2024-01-19 16:30:00",
  },
  {
    id: 4,
    name: "银行卡绑定",
    displayName: "绑定银行卡",
    description: "用户绑定银行卡用于资金操作的流程",
    displayDescription: "绑定银行卡，方便资金管理",
    status: "active",
    creator: "赵六",
    createdAt: "2024-01-18 16:45:00",
    updater: "赵六",
    updatedAt: "2024-01-18 16:45:00",
  },
  {
    id: 5,
    name: "订单支付",
    displayName: "在线支付",
    description: "用户完成商品订单支付的流程",
    displayDescription: "安全便捷的在线支付体验",
    status: "active",
    creator: "钱七",
    createdAt: "2024-01-19 11:30:00",
    updater: "钱七",
    updatedAt: "2024-01-20 14:25:00",
  },
  {
    id: 6,
    name: "退款申请",
    displayName: "申请退款",
    description: "用户对已支付订单申请退款的流程",
    displayDescription: "不满意？支持快速退款",
    status: "inactive",
    creator: "孙八",
    createdAt: "2024-01-20 13:20:00",
    updater: "张三",
    updatedAt: "2024-01-21 10:15:00",
  },
  {
    id: 7,
    name: "客服咨询",
    displayName: "在线客服",
    description: "用户通过在线客服获取帮助的流程",
    displayDescription: "24小时在线客服，随时为您服务",
    status: "active",
    creator: "周九",
    createdAt: "2024-01-21 08:10:00",
    updater: "周九",
    updatedAt: "2024-01-21 08:10:00",
  },
  {
    id: 8,
    name: "积分兑换",
    displayName: "积分商城",
    description: "用户使用积分兑换商品或优惠券的流程",
    displayDescription: "积分兑好礼，惊喜等着您",
    status: "active",
    creator: "吴十",
    createdAt: "2024-01-22 15:40:00",
    updater: "李四",
    updatedAt: "2024-01-23 11:20:00",
  },
  // 增加更多测试数据以显示分页导航
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 9,
    name: `测试事项${i + 9}`,
    displayName: `测试显示${i + 9}`,
    description: `这是测试事项${i + 9}的详细描述信息`,
    displayDescription: `测试事项${i + 9}的显示描述`,
    status: (i % 2 === 0 ? "active" : "inactive") as "active" | "inactive",
    creator: `创建者${i + 1}`,
    createdAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
    updater: `更新者${i + 1}`,
    updatedAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')} 12:00:00`,
  })),
]

// 获取事项列表
export async function getTasks(params?: {
  page?: number
  pageSize?: number
  search?: string
}): Promise<TaskResponse> {
  try {
    // 模拟API延迟
    await delay(800)

    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const search = params?.search

    // 过滤mock数据
    let filteredTasks = mockTasks
    if (search) {
      filteredTasks = mockTasks.filter(task =>
        task.name.includes(search) ||
        task.displayName.includes(search) ||
        task.description.includes(search)
      )
    }

    // 分页处理
    const total = filteredTasks.length
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

    return {
      success: true,
      message: "获取事项列表成功",
      data: paginatedTasks,
      total: total,
    }
  } catch (error) {
    console.error('获取事项列表失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "获取事项列表失败",
      data: [],
      total: 0,
    }
  }
}

// 创建事项
export async function createTask(taskData: CreateTaskRequest): Promise<TaskResponse> {
  try {
    // 模拟API延迟
    await delay(1200)

    // 检查事项名称是否已存在
    const existingTask = mockTasks.find(t => t.name === taskData.name)
    if (existingTask) {
      return {
        success: false,
        message: "事项名称已存在，请使用其他名称",
      }
    }

    // 创建新事项（在实际应用中会保存到数据库）
    const newTask: Task = {
      id: Math.max(...mockTasks.map(t => t.id)) + 1,
      name: taskData.name,
      displayName: taskData.displayName,
      description: taskData.description,
      displayDescription: taskData.displayDescription,
      status: "active",
      creator: "当前用户", // 在实际应用中从认证信息获取
      createdAt: new Date().toISOString(),
      updater: "当前用户",
      updatedAt: new Date().toISOString(),
    }

    // 添加到mock数据中（仅供演示，实际应用中不会修改内存数据）
    mockTasks.push(newTask)

    return {
      success: true,
      message: "事项创建成功",
    }
  } catch (error) {
    console.error('创建事项失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "事项创建失败",
    }
  }
}

// 更新事项
export async function updateTask(taskData: UpdateTaskRequest): Promise<TaskResponse> {
  try {
    // 模拟API延迟
    await delay(1000)

    // 查找要更新的事项
    const taskIndex = mockTasks.findIndex(t => t.id === taskData.id)
    if (taskIndex === -1) {
      return {
        success: false,
        message: "事项不存在",
      }
    }

    // 检查事项名称是否与其他事项冲突
    if (taskData.name) {
      const existingTask = mockTasks.find(t => t.name === taskData.name && t.id !== taskData.id)
      if (existingTask) {
        return {
          success: false,
          message: "事项名称已存在，请使用其他名称",
        }
      }
    }

    // 更新事项信息
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      name: taskData.name || mockTasks[taskIndex].name,
      displayName: taskData.displayName || mockTasks[taskIndex].displayName,
      description: taskData.description || mockTasks[taskIndex].description,
      displayDescription: taskData.displayDescription || mockTasks[taskIndex].displayDescription,
      status: taskData.status || mockTasks[taskIndex].status,
      updater: "当前用户",
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      message: "事项更新成功",
    }
  } catch (error) {
    console.error('更新事项失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "事项更新失败",
    }
  }
}

// 删除事项
export async function deleteTask(id: number): Promise<TaskResponse> {
  try {
    // 模拟API延迟
    await delay(800)

    // 查找要删除的事项
    const taskIndex = mockTasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      return {
        success: false,
        message: "事项不存在",
      }
    }

    // 删除事项（在实际应用中会从数据库删除）
    mockTasks.splice(taskIndex, 1)

    return {
      success: true,
      message: "事项删除成功",
    }
  } catch (error) {
    console.error('删除事项失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "事项删除失败",
    }
  }
}

// 切换事项状态
export async function toggleTaskStatus(id: number): Promise<TaskResponse> {
  try {
    // 模拟API延迟
    await delay(600)

    // 查找要更新状态的事项
    const taskIndex = mockTasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      return {
        success: false,
        message: "事项不存在",
      }
    }

    // 切换状态
    const currentStatus = mockTasks[taskIndex].status
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    // 更新事项状态
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      status: newStatus,
      updater: "当前用户",
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      message: `事项状态已${newStatus === "active" ? '激活' : '停用'}`,
    }
  } catch (error) {
    console.error('切换事项状态失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "事项状态更新失败",
    }
  }
}
