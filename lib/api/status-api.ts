const API_BASE_URL = 'http://localhost:8080/api'

// 状态类型定义
export interface Status {
  id: number
  name: string
  clientDisplayName: string
  description: string
  clientDescription: string
  status: string
  creator: string
  createdAt: string
}

// 分页结果接口
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// API 请求类型定义
interface PageStatusInfoReqDTO {
  currentPage: number
  pageSize: number
  statusName?: string
}

interface StatusInfoReqDTO {
  id?: number
  statusName: string
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

// 模拟数据
const mockStatuses: Status[] = [
  {
    id: 1,
    name: "分工确认",
    clientDisplayName: "任务分配",
    description: "确认项目成员的具体分工和职责范围",
    clientDescription: "正在进行任务分配，请耐心等待",
    status: "启用",
    creator: "王长军",
    createdAt: "2025-04-08 15:42:30",
  },
  {
    id: 2,
    name: "档期安排",
    clientDisplayName: "时间规划",
    description: "安排项目时间节点和里程碑",
    clientDescription: "正在制定详细的时间计划",
    status: "启用",
    creator: "王长军",
    createdAt: "2025-04-08 15:42:20",
  },
  {
    id: 3,
    name: "人员盘点",
    clientDisplayName: "团队核查",
    description: "统计和确认项目参与人员情况",
    clientDescription: "正在核实团队成员信息",
    status: "启用",
    creator: "王长军",
    createdAt: "2025-04-08 15:41:55",
  },
  {
    id: 4,
    name: "需求评审",
    clientDisplayName: "需求确认",
    description: "对项目需求进行详细评审和确认",
    clientDescription: "正在评估您的需求",
    status: "启用",
    creator: "李明",
    createdAt: "2025-04-08 14:30:00",
  },
  {
    id: 5,
    name: "技术评估",
    clientDisplayName: "技术分析",
    description: "评估技术可行性和实现方案",
    clientDescription: "正在进行技术方案分析",
    status: "停用",
    creator: "张伟",
    createdAt: "2025-04-08 13:15:22",
  },
  {
    id: 6,
    name: "项目立项",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "王长军",
    createdAt: "2025-04-07 16:42:30",
  },
  {
    id: 7,
    name: "资源分配",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "李明",
    createdAt: "2025-04-07 15:22:10",
  },
  {
    id: 8,
    name: "进度跟踪",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "张伟",
    createdAt: "2025-04-07 14:18:45",
  },
  {
    id: 9,
    name: "质量检查",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "停用",
    creator: "王长军",
    createdAt: "2025-04-07 11:32:15",
  },
  {
    id: 10,
    name: "风险评估",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "李明",
    createdAt: "2025-04-06 17:05:30",
  },
  {
    id: 11,
    name: "成本控制",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "张伟",
    createdAt: "2025-04-06 16:28:40",
  },
  {
    id: 12,
    name: "验收测试",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "王长军",
    createdAt: "2025-04-06 15:14:20",
  },
  {
    id: 13,
    name: "上线准备",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "停用",
    creator: "李明",
    createdAt: "2025-04-06 14:09:55",
  },
  {
    id: 14,
    name: "培训安排",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "张伟",
    createdAt: "2025-04-06 13:47:30",
  },
  {
    id: 15,
    name: "文档归档",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "王长军",
    createdAt: "2025-04-05 16:33:10",
  },
  {
    id: 16,
    name: "复盘总结",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "李明",
    createdAt: "2025-04-05 15:21:45",
  },
  {
    id: 17,
    name: "绩效评估",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "停用",
    creator: "张伟",
    createdAt: "2025-04-05 14:18:30",
  },
  {
    id: 18,
    name: "客户反馈",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "王长军",
    createdAt: "2025-04-05 13:05:15",
  },
  {
    id: 19,
    name: "迭代规划",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "李明",
    createdAt: "2025-04-04 17:42:20",
  },
  {
    id: 20,
    name: "版本发布",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    status: "启用",
    creator: "张伟",
    createdAt: "2025-04-04 16:38:10",
  },
]

// 获取所有状态
export async function getStatuses(): Promise<{ success: boolean; data: Status[]; message?: string }> {
  try {
    // 获取大量数据，避免分页限制
    const result = await getPaginatedStatuses(1, 1000)
    return {
      success: result.success,
      data: result.data.data,
      message: result.message,
    }
  } catch (error) {
    console.error('获取状态列表失败:', error)
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "获取状态列表失败",
    }
  }
}

// 获取分页状态
export async function getPaginatedStatuses(
  page = 1,
  pageSize = 10,
  searchQuery = "",
): Promise<{ success: boolean; data: PaginatedResult<Status>; message?: string }> {
  try {
    const requestData: PageStatusInfoReqDTO = {
      currentPage: page,
      pageSize,
      statusName: searchQuery || undefined,
    }

    const response = await apiRequest<BaseResult<PageResult<any>>>('/status/pageQuery', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    const statuses: Status[] = response.result?.data.map((item: any) => ({
      id: item.id,
      name: item.statusName || item.name,
      clientDisplayName: item.displayName || '',
      description: item.description || '',
      clientDescription: item.displayDescription || '',
      status: item.status === 'ACTIVE' ? '启用' : item.status === 'INACTIVE' ? '停用' : '启用',
      creator: item.creator || '系统',
      createdAt: item.gmtCreated || new Date().toISOString(),
    })) || []

    const total = response.result?.totalCount || 0
    const totalPages = Math.ceil(total / pageSize)

    return {
      success: true,
      data: {
        data: statuses,
        total,
        page,
        pageSize,
        totalPages,
      },
    }
  } catch (error) {
    console.error('获取状态列表失败:', error)
    return {
      success: false,
      data: {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      },
      message: error instanceof Error ? error.message : "获取状态列表失败",
    }
  }
}

export async function addStatus(statusData: {
  name: string
  clientDisplayName: string
  description: string
  clientDescription: string
}): Promise<{ success: boolean; message: string; data?: Status }> {
  try {
    if (!statusData.name.trim()) {
      return {
        success: false,
        message: "状态名称不能为空",
      }
    }

    if (!statusData.description.trim()) {
      return {
        success: false,
        message: "状态释义不能为空",
      }
    }

    const requestData: StatusInfoReqDTO = {
      statusName: statusData.name,
      displayName: statusData.clientDisplayName,
      description: statusData.description,
      displayDescription: statusData.clientDescription,
    }

    const response = await apiRequest<BaseResult<void>>('/status/saveStatus', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    return {
      success: true,
      message: response.message || "状态添加成功",
    }
  } catch (error) {
    console.error('添加状态失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "状态添加失败",
    }
  }
}

export async function deleteStatus(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiRequest<BaseResult<boolean>>(`/status/${id}`, {
      method: 'DELETE',
    })

    return {
      success: response.result === true,
      message: response.message || "状态删除成功",
    }
  } catch (error) {
    console.error('删除状态失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "状态删除失败",
    }
  }
}

export async function updateStatus(
  id: number,
  data: Partial<Status>,
): Promise<{ success: boolean; message: string; data?: Status }> {
  try {
    const requestData: StatusInfoReqDTO = {
      id,
      statusName: data.name || '',
      displayName: data.clientDisplayName || '',
      description: data.description || '',
      displayDescription: data.clientDescription || '',
    }

    const response = await apiRequest<BaseResult<void>>('/status/updateStatus', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    return {
      success: true,
      message: response.message || "状态更新成功",
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "状态更新失败",
    }
  }
}
