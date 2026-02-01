"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useFieldStore, type Field, type FieldFilter } from "@/lib/fields-store"
import { FieldTable } from "@/components/fields/field-table"
import { FieldForm } from "@/components/fields/field-form"
import { ProjectPagination } from "@/components/projects/project-pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, PlusCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import * as fieldsApi from "@/lib/api/fields-api"

export function FieldsManagement() {
  const { filter, setFilter } = useFieldStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [allFields, setAllFields] = useState<Field[]>([])

  // 计算分页数据
  const filteredFields = useMemo(() => {
    if (!filter.name && !filter.type && !filter.status && !filter.createdBy) return allFields
    
    return allFields.filter((field) => {
      const nameMatch = !filter.name || field.name.toLowerCase().includes(filter.name.toLowerCase())
      const typeMatch = !filter.type || field.type === filter.type
      const statusMatch = !filter.status || field.status === filter.status
      const createdByMatch = !filter.createdBy || field.createdBy === filter.createdBy
      
      return nameMatch && typeMatch && statusMatch && createdByMatch
    })
  }, [allFields, filter])

  const totalPages = Math.ceil(filteredFields.length / pageSize)
  const totalItems = filteredFields.length

  const paginatedFields = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredFields.slice(startIndex, endIndex)
  }, [filteredFields, currentPage, pageSize])

  // 加载字段数据
  useEffect(() => {
    loadFields()
  }, [filter]) // 当过滤器变化时重新加载

  // 加载字段数据
  const loadFields = async () => {
    setIsLoading(true)
    try {
      // 使用分页API获取所有数据（大页面大小模拟获取全部）
      const result = await fieldsApi.getFieldsByPage(1, 1000, {
        name: filter.name,
        type: filter.type,
        status: filter.status,
        createdBy: filter.createdBy,
      })

      setAllFields(result.list)
      setTotal(result.total)

      toast({
        title: "加载成功",
        description: "字段数据已成功加载",
      })
    } catch (error) {
      toast({
        title: "加载失败",
        description: error instanceof Error ? error.message : "加载字段数据时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 编辑字段
  const handleEditField = (field: Field) => {
    setSelectedField(field)
    setIsEditDialogOpen(true)
  }

  // 关闭编辑对话框
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedField(null)
  }

  // 更新过滤器
  const handleFilterChange = (newFilter: FieldFilter) => {
    setFilter({ ...filter, ...newFilter })
    setCurrentPage(1) // 重置到第一页
  }

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadFields()
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
              value={filter.name || ""}
              onChange={(e) => handleFilterChange({ name: e.target.value })}
            />
          </div>
          <Button type="submit">搜索</Button>
        </form>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>新增字段</span>
        </Button>
      </div>

      <FieldTable fields={paginatedFields} onEdit={handleEditField} />

      {/* 分页组件 */}
      {!isLoading && totalItems > 0 && (
        <ProjectPagination
          total={totalItems}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* 新增字段对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>新建字段</DialogTitle>
            <DialogDescription>创建新的字段定义，填写必要的字段信息。</DialogDescription>
          </DialogHeader>
          <FieldForm
            onClose={() => {
              setIsAddDialogOpen(false)
              loadFields() // 刷新数据
            }}
          />
        </DialogContent>
      </Dialog>

      {/* 编辑字段对话框 */}
      {selectedField && (
        <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>编辑字段</DialogTitle>
              <DialogDescription>修改字段的定义和属性。</DialogDescription>
            </DialogHeader>
            <FieldForm
              field={selectedField}
              onClose={() => {
                handleCloseEditDialog()
                loadFields() // 刷新数据
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
