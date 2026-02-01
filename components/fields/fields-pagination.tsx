"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  total: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function FieldsPagination({ total, pageSize, currentPage, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const [inputPage, setInputPage] = useState<string>("")

  // 生成页码数组
  const getPageNumbers = (isMobile = false) => {
    const pages = []
    // 移动端显示更少的页码
    const maxVisiblePages = isMobile ? 3 : 5

    // 当总页数小于等于最大可见页码数时，显示所有页码
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    // 始终显示第一页
    pages.push(1)

    // 计算中间页码的起始和结束
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2) + 1)
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2)

    // 调整起始页，确保显示足够的页码
    if (endPage - startPage + 1 < maxVisiblePages - 2) {
      startPage = Math.max(2, endPage - maxVisiblePages + 3)
    }

    // 添加省略号
    if (startPage > 2) {
      pages.push("ellipsis-start")
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // 添加省略号
    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end")
    }

    // 添加最后一页
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const desktopPageNumbers = getPageNumbers(false)
  const mobilePageNumbers = getPageNumbers(true)

  // 处理页码输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setInputPage(value)
  }

  // 处理页码跳转
  const handleGoToPage = () => {
    if (inputPage) {
      const page = Number.parseInt(inputPage)
      if (page >= 1 && page <= totalPages) {
        onPageChange(page)
      }
      setInputPage("")
    }
  }

  // 处理输入框按键事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage()
    }
  }

  return (
    <div className="mt-4">
      {/* 桌面版布局 */}
      <div className="hidden sm:flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
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
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {desktopPageNumbers.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <Button key={`ellipsis-${index}`} variant="outline" size="icon" className="h-8 w-8" disabled>
                  ...
                </Button>
              )
            }

            return (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "outline"}
                className="h-8 w-8"
                onClick={() => onPageChange(Number(page))}
              >
                {page}
              </Button>
            )
          })}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex items-center ml-2">
            <span className="text-muted-foreground mr-1">前往</span>
            <Input
              className="h-8 w-12 text-center"
              value={inputPage}
              onChange={handleInputChange}
              onBlur={handleGoToPage}
              onKeyDown={handleKeyDown}
            />
            <span className="text-muted-foreground ml-1">页</span>
          </div>
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">共 {total} 条记录</div>
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
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {mobilePageNumbers.map((page, index) => {
              if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                  <Button key={`ellipsis-mobile-${index}`} variant="outline" size="icon" className="h-9 w-9" disabled>
                    ...
                  </Button>
                )
              }

              return (
                <Button
                  key={`page-mobile-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  className="h-9 w-9"
                  onClick={() => onPageChange(Number(page))}
                >
                  {page}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center">
            <Input
              className="h-9 w-12 text-center"
              value={inputPage}
              onChange={handleInputChange}
              onBlur={handleGoToPage}
              onKeyDown={handleKeyDown}
              placeholder={currentPage.toString()}
            />
            <span className="ml-1 text-sm text-muted-foreground">/ {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
