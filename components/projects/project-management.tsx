"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { type Project, getProjects, createProject } from "@/lib/api/projects-api"
import { usePagination } from "@/lib/hooks/use-pagination"
import { ProjectTable } from "./project-table"
import { ProjectPagination } from "./project-pagination"
import { AddProjectDialog } from "./add-project-dialog"

export function ProjectManagement() {
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  // 使用前端分页
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return allProjects
    
    const searchTermLower = searchTerm.toLowerCase()
    return allProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTermLower) ||
        project.displayName.toLowerCase().includes(searchTermLower) ||
        project.description.toLowerCase().includes(searchTermLower) ||
        project.displayDescription.toLowerCase().includes(searchTermLower)
    )
  }, [allProjects, searchTerm])

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData: projects,
    setCurrentPage,
    setPageSize,
    goToPage,
    goToFirst,
    goToLast,
  } = usePagination({
    data: filteredProjects,
    initialPage: 1,
    initialPageSize: 10,
  })

  const fetchProjects = async () => {
    setLoading(true)
    try {
      // 获取所有项目数据用于前端分页
      const response = await getProjects()

      if (response.success && response.data) {
        setAllProjects(response.data)
      } else {
        toast({
          title: "获取项目列表失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "获取项目列表失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, []) // 只加载一次所有数据

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    goToFirst() // 重置到第一页
  }

  const handlePageChange = (page: number) => {
    goToPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
  }

  const handleAddProject = async (projectData: {
    name: string
    displayName: string
    description: string
    displayDescription: string
  }) => {
    try {
      const response = await createProject(projectData)
      if (response.success) {
        toast({
          title: "项目创建成功",
          description: response.message,
        })
        setIsAddDialogOpen(false)
        fetchProjects() // 重新获取项目列表
      } else {
        toast({
          title: "项目创建失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "项目创建失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* 搜索和操作栏 */}
      <div className="flex items-center justify-between">
        <form 
          className="flex w-full max-w-sm items-center space-x-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="请输入内容"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button type="submit">搜索</Button>
        </form>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>新增项目模版</span>
        </Button>
      </div>

      {/* 项目表格 */}
      <ProjectTable projects={projects} loading={loading} onProjectsChange={fetchProjects} />

      {/* 分页 */}
      {totalItems > 0 && (
        <ProjectPagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* 新增项目对话框 */}
      <AddProjectDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddProject} />
    </div>
  )
} 