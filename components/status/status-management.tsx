"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { StatusTable } from "./status-table"
import { ProjectPagination } from "@/components/projects/project-pagination"
import { AddStatusDialog } from "./add-status-dialog"
import { useToast } from "@/components/ui/use-toast"
import { getPaginatedStatuses, addStatus, type Status } from "@/lib/api/status-api"

export function StatusManagement() {
const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [allStatuses, setAllStatuses] = useState<Status[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 计算分页数据
  const filteredStatuses = useMemo(() => {
    if (!searchQuery) return allStatuses
    
    const searchQueryLower = searchQuery.toLowerCase()
    return allStatuses.filter(
      (status) =>
        status.name.toLowerCase().includes(searchQueryLower) ||
        status.clientDisplayName.toLowerCase().includes(searchQueryLower) ||
        status.description.toLowerCase().includes(searchQueryLower) ||
        status.clientDescription.toLowerCase().includes(searchQueryLower)
    )
  }, [allStatuses, searchQuery])

  const totalItems = filteredStatuses.length
  const totalPages = Math.ceil(totalItems / pageSize)

  const paginatedStatuses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredStatuses.slice(startIndex, endIndex)
  }, [filteredStatuses, currentPage, pageSize])
  const { toast } = useToast()

  useEffect(() => {
    fetchStatuses()
  }, [searchQuery]) // 当搜索查询变化时重新加载

  const fetchStatuses = async () => {
    setLoading(true)
    try {
      // 使用分页API获取所有数据（大页面大小模拟获取全部）
      const response = await getPaginatedStatuses(1, 1000, searchQuery)
      if (response.success) {
        setAllStatuses(response.data.data || [])
        setTotal(response.data.total || response.data.data?.length || 0)
      } else {
        toast({
          title: "获取状态列表失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "获取状态列表失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 搜索逻辑已在 useEffect 中实现
    fetchStatuses()
  }

  const handleAddStatus = async (statusData: {
    name: string
    clientDisplayName: string
    description: string
    clientDescription: string
  }) => {
    try {
      const response = await addStatus(statusData)
      if (response.success) {
        toast({
          title: "状态添加成功",
          description: `已成功添加状态: ${statusData.name}`,
        })
        fetchStatuses()
        setIsAddDialogOpen(false)
      } else {
        toast({
          title: "状态添加失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "状态添加失败",
        description: error instanceof Error ? error.message : "未知错误",
      })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize)
    setCurrentPage(1)
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
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>新增状态</span>
        </Button>
      </div>

      <StatusTable statuses={paginatedStatuses} loading={loading} onStatusesChange={fetchStatuses} />

      {totalItems > 0 && (
        <ProjectPagination
          total={totalItems}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <AddStatusDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddStatus} />
    </div>
  )
}
