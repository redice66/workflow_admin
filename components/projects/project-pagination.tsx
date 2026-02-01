"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react"
import { useState } from "react"

interface ProjectPaginationProps {
  currentPage: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function ProjectPagination({
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: ProjectPaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const [jumpPage, setJumpPage] = useState("")

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpPage("")
    }
  }

  const handleJumpPage = () => {
    const pageNum = parseInt(jumpPage)
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpPage()
    }
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      // 如果总页数小于等于5，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 始终显示第一页
      pages.push(1)
      
      // 计算中间页码的起始和结束
      let startPage = Math.max(2, currentPage - Math.floor(maxVisible / 2))
      const endPage = Math.min(totalPages - 1, startPage + maxVisible - 1)
      
      // 调整起始页，确保显示足够的页码
      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(2, endPage - maxVisible + 1)
      }
      
      // 添加省略号
      if (startPage > 2) {
        pages.push("ellipsis")
      }
      
      // 添加中间页码
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // 添加省略号
      if (endPage < totalPages - 1) {
        pages.push("ellipsis")
      }
      
      // 添加最后一页
      pages.push(totalPages)
    }
    
    return pages
  }

  if (totalPages <= 1 && total <= 10) {
    return null
  }

  return (
    <div className="mt-4">
      {/* 桌面版布局 - 紧凑型左右分布 */}
      <div className="hidden sm:flex items-center justify-between text-sm">
        {/* 左侧：记录统计和页大小选择 */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-muted-foreground text-sm">共{total}条</span>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-7 w-[70px] text-sm px-2">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10条</SelectItem>
              <SelectItem value="20">20条</SelectItem>
              <SelectItem value="50">50条</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 右侧：分页导航和跳转 */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 px-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>

          {generatePageNumbers().map((pageNumber, index) =>
            pageNumber === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-0.5 text-muted-foreground text-xs">
                ..
              </span>
            ) : (
              <Button
                key={`page-${pageNumber}`}
                variant={currentPage === pageNumber ? "default" : "ghost"}
                className={currentPage === pageNumber ? "h-7 w-7 px-1 text-xs" : "h-7 w-7 px-1 text-xs"}
                onClick={() => handlePageChange(Number(pageNumber))}
              >
                {pageNumber}
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 px-1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>

          <div className="flex items-center ml-1.5 whitespace-nowrap">
            <span className="text-muted-foreground text-xs">前往</span>
            <Input
              className="h-7 w-10 text-center px-1 text-xs"
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                const pageNum = parseInt(jumpPage)
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                  handlePageChange(pageNum)
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 移动端布局 - 超紧凑型单行左右分布 */}
      <div className="sm:hidden flex items-center justify-between text-xs">
        {/* 左侧：记录统计和页大小选择 */}
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-muted-foreground">{total}条</span>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-6 w-[55px] px-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 右侧：分页导航和跳转 */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 px-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>

          {generatePageNumbers().slice(0, 3).map((pageNumber, index) =>
            pageNumber === "ellipsis" ? (
              <span key={`ellipsis-mobile-${index}`} className="px-0.5 text-muted-foreground">..</span>
            ) : (
              <Button
                key={`page-mobile-${pageNumber}`}
                variant={currentPage === pageNumber ? "default" : "ghost"}
                className={currentPage === pageNumber ? "h-6 w-6 px-1" : "h-6 w-6 px-1"}
                onClick={() => handlePageChange(Number(pageNumber))}
              >
                {pageNumber}
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 px-1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>

          <div className="flex items-center ml-1">
            <Input
              className="h-6 w-9 text-center px-1"
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                const pageNum = parseInt(jumpPage)
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                  handlePageChange(pageNum)
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 