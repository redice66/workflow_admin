import { useState, useMemo } from 'react'

export interface UsePaginationOptions<T> {
  data: T[]
  initialPage?: number
  initialPageSize?: number
}

export interface UsePaginationResult<T> {
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
  paginatedData: T[]
  startIndex: number
  endIndex: number
  hasPrevious: boolean
  hasNext: boolean
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  goToPage: (page: number) => void
  goToFirst: () => void
  goToLast: () => void
  goToPrevious: () => void
  goToNext: () => void
}

export function usePagination<T>({
  data,
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationOptions<T>): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalItems = data.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex)
  }, [data, startIndex, endIndex])

  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  const handleSetCurrentPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const handleSetPageSize = (size: number) => {
    setPageSize(size)
    // 重新计算当前页码，确保不会超出范围
    const newTotalPages = Math.max(1, Math.ceil(totalItems / size))
    setCurrentPage(Math.min(currentPage, newTotalPages))
  }

  const goToPage = (page: number) => {
    handleSetCurrentPage(page)
  }

  const goToFirst = () => {
    setCurrentPage(1)
  }

  const goToLast = () => {
    setCurrentPage(totalPages)
  }

  const goToPrevious = () => {
    if (hasPrevious) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (hasNext) {
      setCurrentPage(currentPage + 1)
    }
  }

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    startIndex,
    endIndex,
    hasPrevious,
    hasNext,
    setCurrentPage: handleSetCurrentPage,
    setPageSize: handleSetPageSize,
    goToPage,
    goToFirst,
    goToLast,
    goToPrevious,
    goToNext,
  }
}