"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { RoleTable } from "./role-table"
import { ProjectPagination } from "@/components/projects/project-pagination"
import { AddRoleDialog } from "./add-role-dialog"
import { EditRoleDialog } from "./edit-role-dialog"
import { RolePreviewDialog } from "./role-preview-dialog"
import { useToast } from "@/components/ui/use-toast"

// 角色类型定义
export type RoleType = "project" | "platform" | "data"

// 角色接口定义
export interface Role {
  id: string
  name: string
  clientDisplayName: string
  description: string
  clientDescription: string
  type: RoleType
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

// 模拟数据 - 增加数据量以显示分页导航
const mockRoles: Role[] = [
  {
    id: "role_001",
    name: "项目经理",
    clientDisplayName: "项目负责人",
    description: "负责项目的整体规划、执行和管理，协调团队资源，确保项目按时交付",
    clientDescription: "项目负责人，负责项目管理和团队协调",
    type: "project",
    status: "active",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-20T14:22:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "role_002",
    name: "系统管理员",
    clientDisplayName: "管理员",
    description: "负责系统的维护、用户管理、权限配置和安全管理",
    clientDescription: "系统管理员，负责平台维护和用户管理",
    type: "platform",
    status: "active",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "role_003",
    name: "数据分析师",
    clientDisplayName: "分析师",
    description: "负责数据收集、分析和报告生成，为业务决策提供数据支持",
    clientDescription: "数据分析专家，提供数据洞察和分析报告",
    type: "data",
    status: "active",
    createdAt: "2024-01-12T10:20:00Z",
    updatedAt: "2024-01-19T11:30:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "role_004",
    name: "开发工程师",
    clientDisplayName: "开发者",
    description: "负责软件开发、代码编写、测试和维护工作",
    clientDescription: "软件开发工程师，负责产品开发和技术实现",
    type: "project",
    status: "inactive",
    createdAt: "2024-01-08T14:10:00Z",
    updatedAt: "2024-01-16T09:25:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "role_005",
    name: "产品经理",
    clientDisplayName: "产品负责人",
    description: "负责产品规划、需求分析、用户体验设计和产品迭代",
    clientDescription: "产品经理，负责产品策略和用户体验",
    type: "project",
    status: "active",
    createdAt: "2024-01-05T11:45:00Z",
    updatedAt: "2024-01-22T15:30:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "role_006",
    name: "运维工程师",
    clientDisplayName: "运维专员",
    description: "负责系统运维、服务器管理、监控和故障处理",
    clientDescription: "运维工程师，确保系统稳定运行",
    type: "platform",
    status: "active",
    createdAt: "2024-01-03T09:20:00Z",
    updatedAt: "2024-01-21T13:15:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "role_007",
    name: "数据工程师",
    clientDisplayName: "数据专家",
    description: "负责数据架构设计、ETL流程开发和数据质量管理",
    clientDescription: "数据工程师，负责数据处理和分析",
    type: "data",
    status: "active",
    createdAt: "2024-01-01T14:30:00Z",
    updatedAt: "2024-01-20T10:45:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "role_008",
    name: "测试工程师",
    clientDisplayName: "测试专员",
    description: "负责软件测试、质量保证、自动化测试和缺陷管理",
    clientDescription: "测试工程师，确保产品质量",
    type: "project",
    status: "inactive",
    createdAt: "2023-12-28T16:10:00Z",
    updatedAt: "2024-01-18T12:20:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "role_009",
    name: "安全专家",
    clientDisplayName: "安全工程师",
    description: "负责信息安全、风险评估、安全策略制定和安全事件响应",
    clientDescription: "安全专家，保障系统和数据安全",
    type: "platform",
    status: "active",
    createdAt: "2023-12-25T08:45:00Z",
    updatedAt: "2024-01-19T14:55:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "role_010",
    name: "业务分析师",
    clientDisplayName: "业务专家",
    description: "负责业务需求分析、流程优化、数据分析和业务建模",
    clientDescription: "业务分析师，优化业务流程",
    type: "data",
    status: "active",
    createdAt: "2023-12-20T13:25:00Z",
    updatedAt: "2024-01-17T11:40:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  // 增加更多测试数据以显示分页导航
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `role_${String(i + 11).padStart(3, '0')}`,
    name: `测试角色${i + 11}`,
    clientDisplayName: `测试显示${i + 11}`,
    description: `这是测试角色${i + 11}的详细描述信息`,
    clientDescription: `测试角色${i + 11}的客户端描述`,
    type: (["project", "platform", "data"] as RoleType[])[i % 3],
    status: (i % 2 === 0 ? "active" : "inactive") as "active" | "inactive",
    createdAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    updatedAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')}T12:00:00Z`,
    createdBy: "admin",
    updatedBy: "admin",
  })),
]

export function RolesManagement() {
  const [allRoles, setAllRoles] = useState<Role[]>(mockRoles)
  const [searchQuery, setSearchQuery] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [roleToEdit, setRoleToEdit] = useState<string | null>(null)
  const [roleToPreview, setRoleToPreview] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 计算分页数据
  const filteredRoles = useMemo(() => {
    if (!searchQuery) return allRoles
    
    const searchQueryLower = searchQuery.toLowerCase()
    return allRoles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchQueryLower) ||
        role.clientDisplayName.toLowerCase().includes(searchQueryLower) ||
        role.description.toLowerCase().includes(searchQueryLower)
    )
  }, [allRoles, searchQuery])

  const totalItems = filteredRoles.length
  const totalPages = Math.ceil(totalItems / pageSize)

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredRoles.slice(startIndex, endIndex)
  }, [filteredRoles, currentPage, pageSize])

  // 添加角色
  const handleAddRole = (newRole: Omit<Role, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">) => {
    const role: Role = {
      ...newRole,
      id: `role_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "当前用户",
      updatedBy: "当前用户",
    }
    setAllRoles([...allRoles, role])
    toast({
      title: "添加成功",
      description: "角色已成功添加到系统",
    })
  }

  // 更新角色
  const handleUpdateRole = (id: string, updatedData: Partial<Role>) => {
    setAllRoles(
      allRoles.map((role) =>
        role.id === id
          ? {
              ...role,
              ...updatedData,
              updatedAt: new Date().toISOString(),
              updatedBy: "当前用户",
            }
          : role,
      ),
    )
    toast({
      title: "更新成功",
      description: "角色信息已成功更新",
    })
  }

  // 删除角色
  const handleDeleteRole = (id: string) => {
    setAllRoles(allRoles.filter((role) => role.id !== id))
    toast({
      title: "删除成功",
      description: "角色已成功删除",
    })
  }

  // 切换角色状态
  const handleToggleStatus = (id: string) => {
    setAllRoles(
      allRoles.map((role) =>
        role.id === id
          ? {
              ...role,
              status: role.status === "active" ? "inactive" : "active",
              updatedAt: new Date().toISOString(),
              updatedBy: "当前用户",
            }
          : role,
      ),
    )
  }

  // 编辑角色
  const handleEditRole = (role: Role) => {
    setRoleToEdit(role.id)
    setEditDialogOpen(true)
  }

  // 预览角色
  const handlePreviewRole = (role: Role) => {
    setRoleToPreview(role)
    setPreviewDialogOpen(true)
  }

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // 重置到第一页
  }

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 处理每页条数变化
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // 重置到第一页
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="请输入内容"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">搜索</Button>
        </form>
        <Button onClick={() => setAddDialogOpen(true)} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>新增角色</span>
        </Button>
      </div>

      <RoleTable
        roles={paginatedRoles}
        loading={isLoading}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
        onPreview={handlePreviewRole}
        onToggleStatus={handleToggleStatus}
      />

      <ProjectPagination
        total={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* 新增角色对话框 */}
      <AddRoleDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAddRole={handleAddRole} />

      {/* 编辑角色对话框 */}
      <EditRoleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        roleId={roleToEdit}
        roles={allRoles}
        onUpdateRole={handleUpdateRole}
      />

      {/* 预览角色对话框 */}
      <RolePreviewDialog role={roleToPreview} open={previewDialogOpen} onOpenChange={setPreviewDialogOpen} />
    </div>
  )
}
