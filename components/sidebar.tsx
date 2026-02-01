"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, LayoutDashboard, LogOut, Database, Activity, FileText, FolderOpen } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

const sidebarItems = [
  {
    title: "角色管理",
    href: "/dashboard/roles",
    icon: Users,
  },
  {
    title: "字段管理",
    href: "/dashboard/fields",
    icon: Database,
  },
  {
    title: "状态管理",
    href: "/dashboard/status",
    icon: Activity,
  },
  {
    title: "事项管理",
    href: "/dashboard/tasks",
    icon: FileText,
  },
  {
    title: "项目管理",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      // 模拟登出API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "退出成功",
        description: "您已成功退出登录",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "退出失败",
        description: "退出登录时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <LayoutDashboard className="mr-2 h-6 w-6" />
        <span className="font-semibold">管理系统</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "退出中..." : "退出登录"}
        </Button>
      </div>
    </div>
  )
}
