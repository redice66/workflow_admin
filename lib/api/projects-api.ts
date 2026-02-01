import { type Project, type ProjectResponse, ProjectStatus, type ProjectField, type ProjectStage, type ProjectContent, type ProjectRole, type ProjectRolePermission, type ProjectSettings, type ProjectActivity } from "@/types/project"

// Re-export types for convenience
export type { Project, ProjectResponse, ProjectField, ProjectStage, ProjectContent, ProjectRole, ProjectRolePermission, ProjectSettings, ProjectActivity } from "@/types/project"
export { ProjectStatus } from "@/types/project"

// TODO: 当连接真实API时，恢复以下配置
// const API_BASE_URL = 'http://localhost:8080/api'

// 目前使用mock数据，避免fetch连接错误
// 如需连接真实API，请确保后端服务正在运行，然后取消注释相关代码

// 模拟数据 - 项目列表
const mockProjects: Project[] = [
  {
    id: 1,
    name: "产品开发项目",
    displayName: "产品研发",
    description: "用于管理产品开发过程中的各种事项和流程",
    displayDescription: "参与产品开发相关工作",
    status: ProjectStatus.ACTIVE,
    createdBy: "张三",
    createdAt: "2024-01-15 10:30:00",
    updatedBy: "张三",
    updatedAt: "2024-01-15 10:30:00",
  },
  {
    id: 2,
    name: "客户服务项目",
    displayName: "客服支持",
    description: "处理客户咨询、投诉和服务请求的项目模板",
    displayDescription: "为客户提供优质服务",
    status: ProjectStatus.ACTIVE,
    createdBy: "李四",
    createdAt: "2024-01-16 14:20:00",
    updatedBy: "王五",
    updatedAt: "2024-01-17 09:15:00",
  },
  {
    id: 3,
    name: "营销活动项目",
    displayName: "市场推广",
    description: "组织和执行各类营销活动的项目模板",
    displayDescription: "参与市场营销活动",
    status: ProjectStatus.INACTIVE,
    createdBy: "王五",
    createdAt: "2024-01-10 16:45:00",
    updatedBy: "王五",
    updatedAt: "2024-01-18 11:30:00",
  },
  {
    id: 4,
    name: "财务审计项目",
    displayName: "财务审计",
    description: "企业财务审计和合规检查的项目模板",
    displayDescription: "进行财务审计和合规管理",
    status: ProjectStatus.ACTIVE,
    createdBy: "赵六",
    createdAt: "2024-01-20 09:00:00",
    updatedBy: "赵六",
    updatedAt: "2024-01-22 14:30:00",
  },
  {
    id: 5,
    name: "人力资源项目",
    displayName: "人事管理",
    description: "员工招聘、培训和绩效管理的项目模板",
    displayDescription: "管理人力资源相关事务",
    status: ProjectStatus.ACTIVE,
    createdBy: "孙七",
    createdAt: "2024-01-18 13:15:00",
    updatedBy: "孙七",
    updatedAt: "2024-01-25 10:45:00",
  },
  {
    id: 6,
    name: "IT基础设施项目",
    displayName: "IT运维",
    description: "服务器维护、网络管理和系统升级的项目模板",
    displayDescription: "维护IT基础设施稳定运行",
    status: ProjectStatus.PENDING,
    createdBy: "周八",
    createdAt: "2024-01-22 08:30:00",
    updatedBy: "周八",
    updatedAt: "2024-01-28 16:20:00",
  },
  {
    id: 7,
    name: "法务合规项目",
    displayName: "法务管理",
    description: "合同审核、法律风险评估和合规管理的项目模板",
    displayDescription: "处理法务合规相关事务",
    status: ProjectStatus.ACTIVE,
    createdBy: "吴九",
    createdAt: "2024-01-25 11:00:00",
    updatedBy: "吴九",
    updatedAt: "2024-01-30 09:15:00",
  },
  {
    id: 8,
    name: "供应链管理项目",
    displayName: "供应链",
    description: "供应商管理、采购流程和物流协调的项目模板",
    displayDescription: "优化供应链管理流程",
    status: ProjectStatus.INACTIVE,
    createdBy: "郑十",
    createdAt: "2024-01-28 14:45:00",
    updatedBy: "郑十",
    updatedAt: "2024-02-01 13:30:00",
  },
  {
    id: 9,
    name: "质量保证项目",
    displayName: "质量管理",
    description: "产品质量检测、测试流程和质量改进的项目模板",
    displayDescription: "确保产品和服务质量",
    status: ProjectStatus.ACTIVE,
    createdBy: "王十一",
    createdAt: "2024-02-01 10:00:00",
    updatedBy: "王十一",
    updatedAt: "2024-02-03 15:45:00",
  },
  {
    id: 10,
    name: "销售管理项目",
    displayName: "销售跟进",
    description: "客户开发、销售流程和业绩跟踪的项目模板",
    displayDescription: "提升销售业绩和客户满意度",
    status: ProjectStatus.ACTIVE,
    createdBy: "李十二",
    createdAt: "2024-02-03 09:30:00",
    updatedBy: "李十二",
    updatedAt: "2024-02-05 11:20:00",
  },
  {
    id: 11,
    name: "教育培训项目",
    displayName: "员工培训",
    description: "员工技能培训、课程开发和培训效果评估的项目模板",
    displayDescription: "提升员工专业技能和素质",
    status: ProjectStatus.PENDING,
    createdBy: "张十三",
    createdAt: "2024-02-05 14:00:00",
    updatedBy: "张十三",
    updatedAt: "2024-02-07 16:30:00",
  },
  {
    id: 12,
    name: "研发创新项目",
    displayName: "技术创新",
    description: "新技术研究、产品创新和专利申请的项目模板",
    displayDescription: "推动技术创新和产品升级",
    status: ProjectStatus.ACTIVE,
    createdBy: "刘十四",
    createdAt: "2024-02-08 10:15:00",
    updatedBy: "刘十四",
    updatedAt: "2024-02-10 09:45:00",
  },
  {
    id: 13,
    name: "数据治理项目",
    displayName: "数据管理",
    description: "数据质量管理、数据安全和数据分析的项目模板",
    displayDescription: "确保数据质量和安全合规",
    status: ProjectStatus.ACTIVE,
    createdBy: "陈十五",
    createdAt: "2024-02-10 13:30:00",
    updatedBy: "陈十五",
    updatedAt: "2024-02-12 14:20:00",
  },
  {
    id: 14,
    name: "风险管理项目",
    displayName: "风险控制",
    description: "风险识别、评估和应对策略制定的项目模板",
    displayDescription: "识别和管理企业各类风险",
    status: ProjectStatus.INACTIVE,
    createdBy: "杨十六",
    createdAt: "2024-02-12 11:00:00",
    updatedBy: "杨十六",
    updatedAt: "2024-02-14 15:30:00",
  },
  {
    id: 15,
    name: "采购管理项目",
    displayName: "采购流程",
    description: "供应商选择、采购审批和合同管理的项目模板",
    displayDescription: "优化采购流程和成本控制",
    status: ProjectStatus.ACTIVE,
    createdBy: "黄十七",
    createdAt: "2024-02-15 09:45:00",
    updatedBy: "黄十七",
    updatedAt: "2024-02-16 11:15:00",
  },
  {
    id: 16,
    name: "客户服务升级项目",
    displayName: "服务升级",
    description: "客户服务流程优化和客户体验提升的项目模板",
    displayDescription: "提升客户服务质量和效率",
    status: ProjectStatus.PENDING,
    createdBy: "林十八",
    createdAt: "2024-02-16 14:30:00",
    updatedBy: "林十八",
    updatedAt: "2024-02-18 10:00:00",
  },
  {
    id: 17,
    name: "数字化转型项目",
    displayName: "数字化改革",
    description: "企业数字化转型和技术升级的项目模板",
    displayDescription: "推动企业数字化转型进程",
    status: ProjectStatus.ACTIVE,
    createdBy: "赵十九",
    createdAt: "2024-02-18 16:00:00",
    updatedBy: "赵十九",
    updatedAt: "2024-02-20 13:45:00",
  },
  {
    id: 18,
    name: "品牌建设项目",
    displayName: "品牌推广",
    description: "品牌形象设计、宣传和推广的项目模板",
    displayDescription: "提升企业品牌价值和影响力",
    status: ProjectStatus.ACTIVE,
    createdBy: "钱二十",
    createdAt: "2024-02-20 10:30:00",
    updatedBy: "钱二十",
    updatedAt: "2024-02-22 15:15:00",
  },
  {
    id: 19,
    name: "环境健康安全项目",
    displayName: "EHS管理",
    description: "环境保护、员工健康和安全生产的项目模板",
    displayDescription: "确保环境健康与安全生产",
    status: ProjectStatus.INACTIVE,
    createdBy: "孙二十一",
    createdAt: "2024-02-22 09:15:00",
    updatedBy: "孙二十一",
    updatedAt: "2024-02-24 11:30:00",
  },
  {
    id: 20,
    name: "知识管理项目",
    displayName: "知识库建设",
    description: "企业知识库建设、文档管理和经验分享的项目模板",
    displayDescription: "构建企业知识体系和文化",
    status: ProjectStatus.ACTIVE,
    createdBy: "李二十二",
    createdAt: "2024-02-24 13:45:00",
    updatedBy: "李二十二",
    updatedAt: "2024-02-26 14:00:00",
  },
  {
    id: 21,
    name: "客户关系管理项目",
    displayName: "CRM系统",
    description: "客户关系管理系统实施和优化的项目模板",
    displayDescription: "提升客户关系管理水平",
    status: ProjectStatus.PENDING,
    createdBy: "周二十三",
    createdAt: "2024-02-26 15:30:00",
    updatedBy: "周二十三",
    updatedAt: "2024-02-28 10:15:00",
  },
  {
    id: 22,
    name: "移动办公项目",
    displayName: "移动化办公",
    description: "移动办公应用开发和推广的项目模板",
    displayDescription: "实现随时随地高效办公",
    status: ProjectStatus.ACTIVE,
    createdBy: "吴二十四",
    createdAt: "2024-02-28 11:45:00",
    updatedBy: "吴二十四",
    updatedAt: "2024-03-01 16:30:00",
  },
  {
    id: 23,
    name: "企业文化建设项目",
    displayName: "文化建设",
    description: "企业文化理念设计、推广和落地的项目模板",
    displayDescription: "塑造积极向上的企业文化",
    status: ProjectStatus.ACTIVE,
    createdBy: "郑二十五",
    createdAt: "2024-03-01 09:00:00",
    updatedBy: "郑二十五",
    updatedAt: "2024-03-03 13:30:00",
  },
  {
    id: 24,
    name: "供应商评估项目",
    displayName: "供应商管理",
    description: "供应商绩效评估、选择和优化的项目模板",
    displayDescription: "建立优质供应商体系",
    status: ProjectStatus.INACTIVE,
    createdBy: "王二十六",
    createdAt: "2024-03-03 14:15:00",
    updatedBy: "王二十六",
    updatedAt: "2024-03-05 11:45:00",
  },
  {
    id: 25,
    name: "内部审计项目",
    displayName: "内审管理",
    description: "企业内部审计流程优化和风险控制的项目模板",
    displayDescription: "提升内部审计质量和效率",
    status: ProjectStatus.ACTIVE,
    createdBy: "陈二十七",
    createdAt: "2024-03-05 10:30:00",
    updatedBy: "陈二十七",
    updatedAt: "2024-03-07 15:20:00",
  },
  {
    id: 26,
    name: "会议管理项目",
    displayName: "会议效率",
    description: "会议组织、记录和跟进管理的项目模板",
    displayDescription: "提高会议效率和决策质量",
    status: ProjectStatus.PENDING,
    createdBy: "林二十八",
    createdAt: "2024-03-07 16:45:00",
    updatedBy: "林二十八",
    updatedAt: "2024-03-08 09:30:00",
  },
  {
    id: 27,
    name: "预算管理项目",
    displayName: "预算控制",
    description: "企业预算编制、执行和监控的项目模板",
    displayDescription: "实现精细化预算管理",
    status: ProjectStatus.ACTIVE,
    createdBy: "黄二十九",
    createdAt: "2024-03-08 11:15:00",
    updatedBy: "黄二十九",
    updatedAt: "2024-03-10 14:00:00",
  }
]

// 模拟API延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 获取项目列表
export async function getProjects(params?: {
  page?: number
  pageSize?: number
  search?: string
}): Promise<ProjectResponse> {
  try {
    // 模拟API延迟
    await delay(800)

    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const search = params?.search

    // 过滤mock数据
    let filteredProjects = mockProjects
    if (search) {
      filteredProjects = mockProjects.filter(project =>
        project.name.includes(search) ||
        project.displayName.includes(search) ||
        project.description.includes(search)
      )
    }

    // 分页处理
    const total = filteredProjects.length
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

    return {
      success: true,
      message: "获取项目列表成功",
      data: paginatedProjects,
      total: total,
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "获取项目列表失败",
      data: [],
      total: 0,
    }
  }
}

// 创建项目
export async function createProject(projectData: {
  name: string
  displayName: string
  description: string
  displayDescription: string
}): Promise<ProjectResponse> {
  try {
    // 模拟API延迟
    await delay(1200)

    // 检查项目名称是否已存在
    const existingProject = mockProjects.find(p => p.name === projectData.name)
    if (existingProject) {
      return {
        success: false,
        message: "项目名称已存在，请使用其他名称",
      }
    }

    // 创建新项目（在实际应用中会保存到数据库）
    const newProject: Project = {
      id: Math.max(...mockProjects.map(p => p.id)) + 1,
      name: projectData.name,
      displayName: projectData.displayName,
      description: projectData.description,
      displayDescription: projectData.displayDescription,
      status: ProjectStatus.ACTIVE,
      createdBy: "当前用户", // 在实际应用中从认证信息获取
      createdAt: new Date().toISOString(),
      updatedBy: "当前用户",
      updatedAt: new Date().toISOString(),
    }

    // 添加到mock数据中（仅供演示，实际应用中不会修改内存数据）
    mockProjects.push(newProject)

    return {
      success: true,
      message: "项目创建成功",
    }
  } catch (error) {
    console.error('创建项目失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "项目创建失败",
    }
  }
}

// 更新项目
export async function updateProject(
  id: number,
  projectData: {
    name: string
    displayName: string
    description: string
    displayDescription: string
  }
): Promise<ProjectResponse> {
  try {
    // 模拟API延迟
    await delay(1000)

    // 查找要更新的项目
    const projectIndex = mockProjects.findIndex(p => p.id === id)
    if (projectIndex === -1) {
      return {
        success: false,
        message: "项目不存在",
      }
    }

    // 检查项目名称是否与其他项目冲突
    const existingProject = mockProjects.find(p => p.name === projectData.name && p.id !== id)
    if (existingProject) {
      return {
        success: false,
        message: "项目名称已存在，请使用其他名称",
      }
    }

    // 更新项目信息
    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      name: projectData.name,
      displayName: projectData.displayName,
      description: projectData.description,
      displayDescription: projectData.displayDescription,
      updatedBy: "当前用户",
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      message: "项目更新成功",
    }
  } catch (error) {
    console.error('更新项目失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "项目更新失败",
    }
  }
}

// 删除项目
export async function deleteProject(id: number): Promise<ProjectResponse> {
  try {
    // 模拟API延迟
    await delay(800)

    // 查找要删除的项目
    const projectIndex = mockProjects.findIndex(p => p.id === id)
    if (projectIndex === -1) {
      return {
        success: false,
        message: "项目不存在",
      }
    }

    // 删除项目（在实际应用中会从数据库删除）
    mockProjects.splice(projectIndex, 1)

    return {
      success: true,
      message: "项目删除成功",
    }
  } catch (error) {
    console.error('删除项目失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "项目删除失败",
    }
  }
}

// 切换项目状态
export async function toggleProjectStatus(id: number): Promise<ProjectResponse> {
  try {
    // 模拟API延迟
    await delay(600)

    // 查找要更新状态的项目
    const projectIndex = mockProjects.findIndex(p => p.id === id)
    if (projectIndex === -1) {
      return {
        success: false,
        message: "项目不存在",
      }
    }

    // 切换状态
    const currentStatus = mockProjects[projectIndex].status
    const newStatus = currentStatus === ProjectStatus.ACTIVE
      ? ProjectStatus.INACTIVE
      : ProjectStatus.ACTIVE

    // 更新项目状态
    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      status: newStatus,
      updatedBy: "当前用户",
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      message: `项目状态已${newStatus === ProjectStatus.ACTIVE ? '激活' : '停用'}`,
    }
  } catch (error) {
    console.error('切换项目状态失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "项目状态更新失败",
    }
  }
}

// 获取项目字段配置
export async function getProjectFields(projectId: number): Promise<{
  success: boolean
  message: string
  data?: ProjectField[]
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock 数据
      const mockFields: ProjectField[] = [
        {
          id: "1",
          projectId,
          fieldId: "field_1",
          fieldName: "项目标题",
          displayName: "项目名称",
          componentType: "singleLineText",
          required: true,
          editable: true,
          sortOrder: 1,
          createdAt: "2024-01-15 10:30:00",
          updatedAt: "2024-01-15 10:30:00",
        },
        {
          id: "2",
          projectId,
          fieldId: "field_2",
          fieldName: "项目描述",
          displayName: "详细描述",
          componentType: "multiLineText",
          required: false,
          editable: true,
          sortOrder: 2,
          createdAt: "2024-01-15 10:30:00",
          updatedAt: "2024-01-15 10:30:00",
        }
      ]

      resolve({
        success: true,
        message: "获取项目字段成功",
        data: mockFields,
      })
    }, 500)
  })
}

// 获取项目阶段
export async function getProjectStages(projectId: number): Promise<{
  success: boolean
  message: string
  data?: ProjectStage[]
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock 数据
      const mockStages: ProjectStage[] = [
        {
          id: "stage_1",
          projectId,
          name: "需求分析",
          displayName: "需求分析阶段",
          sortOrder: 1,
          createdAt: "2024-01-15 10:30:00",
          updatedAt: "2024-01-15 10:30:00",
        },
        {
          id: "stage_2",
          projectId,
          name: "设计开发",
          displayName: "设计开发阶段", 
          sortOrder: 2,
          createdAt: "2024-01-15 10:30:00",
          updatedAt: "2024-01-15 10:30:00",
        },
        {
          id: "stage_3",
          projectId,
          name: "测试验收",
          displayName: "测试验收阶段",
          sortOrder: 3,
          createdAt: "2024-01-15 10:30:00",
          updatedAt: "2024-01-15 10:30:00",
        }
      ]

      resolve({
        success: true,
        message: "获取项目阶段成功",
        data: mockStages,
      })
    }, 500)
  })
}

// 获取项目角色
export async function getProjectRoles(projectId: number): Promise<{
  success: boolean
  message: string
  data?: ProjectRole[]
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock 数据
      const mockRoles: ProjectRole[] = [
        {
          id: "role_1",
          projectId,
          roleId: "pm",
          roleName: "项目经理",
          displayName: "PM",
          identity: "管理者",
          definition: "负责项目整体规划和管理",
          createdAt: "2024-01-15 10:30:00",
          updatedAt: "2024-01-15 10:30:00",
        },
        {
          id: "role_2",
          projectId,
          roleId: "developer",
          roleName: "开发人员",
          displayName: "DEV",
          identity: "执行者",
          definition: "负责具体功能的开发实现",
          createdAt: "2024-01-15 10:30:00",
          updatedAt: "2024-01-15 10:30:00",
        }
      ]

      resolve({
        success: true,
        message: "获取项目角色成功",
        data: mockRoles,
      })
    }, 500)
  })
} 