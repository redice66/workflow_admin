"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { type Task, getTasks, createTask } from "@/lib/api/task-api"
import { TaskTable } from "./task-table"
import { ProjectPagination } from "@/components/projects/project-pagination"
import { AddTaskDialog } from "./add-task-dialog"

export function TaskManagement() {
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  // 计算分页数据
  const filteredTasks = useMemo(() => {
    if (!searchTerm) return allTasks
    
    const searchTermLower = searchTerm.toLowerCase()
    return allTasks.filter(
      (task) =>
        task.name.toLowerCase().includes(searchTermLower) ||
        task.displayName.toLowerCase().includes(searchTermLower) ||
        task.description.toLowerCase().includes(searchTermLower) ||
        task.displayDescription.toLowerCase().includes(searchTermLower)
    )
  }, [allTasks, searchTerm])

  const totalPages = Math.ceil(filteredTasks.length / pageSize)
  const totalItems = filteredTasks.length

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredTasks.slice(startIndex, endIndex)
  }, [filteredTasks, currentPage, pageSize])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      // 获取所有任务数据用于前端分页
      const response = await getTasks()

      if (response.success && response.data) {
        setAllTasks(response.data)
        setTotal(response.total || response.data.length)
      } else {
        toast({
          title: "获取事项列表失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "获取事项列表失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, []) // 只加载一次所有数据

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // 重置到第一页
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // 重置到第一页
  }

  const handleAddTask = async (taskData: {
    name: string
    displayName: string
    description: string
    displayDescription: string
  }) => {
    try {
      const response = await createTask(taskData)
      if (response.success) {
        toast({
          title: "事项创建成功",
          description: response.message,
        })
        setIsAddDialogOpen(false)
        fetchTasks() // 重新获取事项列表
      } else {
        toast({
          title: "事项创建失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "事项创建失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* 搜索和操作栏 */}
      <div className="flex items-center justify-between">
        <form className="flex w-full max-w-sm items-center space-x-2">
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
          <span>新增事项</span>
        </Button>
      </div>

      {/* 事项表格 */}
      <TaskTable tasks={paginatedTasks} loading={loading} onTasksChange={fetchTasks} />

      {/* 分页 */}
      <ProjectPagination
        currentPage={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* 新增事项对话框 */}
      <AddTaskDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddTask} />
    </div>
  )
}
