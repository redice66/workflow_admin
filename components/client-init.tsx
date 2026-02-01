"use client"

import { useEffect } from 'react'

export function ClientInit() {
  useEffect(() => {
    // ResizeObserver错误处理
    const handleError = (event: ErrorEvent) => {
      if (
        event.message === "ResizeObserver loop completed with undelivered notifications." ||
        event.message === "ResizeObserver loop limit exceeded"
      ) {
        event.stopImmediatePropagation()
      }
    }

    // React 19兼容性配置 - 抑制Ant Design警告
    const originalConsoleError = console.error
    console.error = (...args) => {
      // 过滤掉Ant Design React兼容性警告
      if (typeof args[0] === 'string' && args[0].includes('[antd: compatible]')) {
        return
      }
      originalConsoleError.apply(console, args)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
      console.error = originalConsoleError
    }
  }, [])

  return null
} 