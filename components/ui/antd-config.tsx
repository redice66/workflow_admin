"use client"

import React, { useState, useEffect } from 'react'
import { ConfigProvider, App } from 'antd'
import zhCN from 'antd/locale/zh_CN'

interface AntdConfigProps {
  children: React.ReactNode
}

export function AntdConfig({ children }: AntdConfigProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent SSR rendering of Ant Design components to avoid hydration issues
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
        cssVar: true,
        hashed: false,
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  )
} 
