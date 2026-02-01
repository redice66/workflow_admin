import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { ClientInit } from "@/components/client-init"
import { AntdConfig } from "@/components/ui/antd-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "管理系统",
  description: "前端管理系统",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientInit />
        <AntdConfig>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AntdConfig>
      </body>
    </html>
  )
}
