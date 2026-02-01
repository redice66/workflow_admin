"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface PaginationProps {
  total: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function RolePagination({ total, pageSize, currentPage, onPageChange, onPageSizeChange }: PaginationProps) {
  const [goToPage, setGoToPage] = useState("")
  const totalPages = Math.ceil(total / pageSize)

  // 生成页码数组
  const getPageNumbers = (isMobile = false) => {
    const pages = []
    // 移动端显示更少的页码
    const maxVisiblePages = isMobile ? 3 : 5

    if (totalPages <= maxVisiblePages + 2) {
      // 如果总页数较少，直接显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 始终显示第一页
      pages.push(1)

      // 计算中间页码的起始和结束
      let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
      const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)

      // 调整起始页，确保显示足够的页码
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(2, endPage - maxVisiblePages + 1)
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

  const handleGoToPage = () => {
    const page = Number.parseInt(goToPage)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
    setGoToPage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage()
    }
  }

  const desktopPageNumbers = getPageNumbers(false)
  const mobilePageNumbers = getPageNumbers(true)

  return (
    <div className="mt-4">
      {/* 桌面版布局 */}
      <div className="hidden sm:flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span>共 {total} 条记录</span>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-8 w-[90px]">
              <SelectValue placeholder={`${pageSize}条/页`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10条/页</SelectItem>
              <SelectItem value="20">20条/页</SelectItem>
              <SelectItem value="50">50条/页</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {desktopPageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span key={`ellipsis-${index}`} className="px-2">
                  ...
                </span>
              )
            }

            return (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "ghost"}
                className={cn("h-8 w-8", currentPage === page ? "bg-blue-600 hover:bg-blue-700" : "")}
                onClick={() => onPageChange(Number(page))}
              >
                {page}
              </Button>
            )
          })}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex items-center ml-2">
            <span className="mr-1">前往</span>
            <Input
              className="h-8 w-12 text-center px-1"
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleGoToPage}
            />
            <span className="ml-1">页</span>
          </div>
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm">共 {total} 条记录</div>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-8 w-[80px] text-sm">
              <SelectValue placeholder={`${pageSize}条/页`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10条/页</SelectItem>
              <SelectItem value="20">20条/页</SelectItem>
              <SelectItem value="50">50条/页</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {mobilePageNumbers.map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <span key={`ellipsis-mobile-${index}`} className="px-2">
                    ...
                  </span>
                )
              }

              return (
                <Button
                  key={`page-mobile-${page}`}
                  variant={currentPage === page ? "default" : "ghost"}
                  className={cn("h-9 w-9", currentPage === page ? "bg-blue-600 hover:bg-blue-700" : "")}
                  onClick={() => onPageChange(Number(page))}
                >
                  {page}
                </Button>
              )
            })}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center">
            <Input
              className="h-9 w-12 text-center px-1"
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleGoToPage}
              placeholder={currentPage.toString()}
            />
            <span className="ml-1 text-sm">/ {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
