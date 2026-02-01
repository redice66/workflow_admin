"use client"

import React from 'react'
import { ConfigProvider, App } from 'antd'
import zhCN from 'antd/locale/zh_CN'

interface AntdConfigProps {
  children: React.ReactNode
}

export function AntdConfig({ children }: AntdConfigProps) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // 自定义主题配置
          colorPrimary: '#1890ff',
        },
      }}
      // 添加 CSS-in-JS 配置以防止清理函数警告
      csp={{ nonce: 'antd-css' }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  )
} 