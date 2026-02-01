"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme } = useTheme()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // 根据路径获取页面标题
  const getPageTitle = () => {
    if (pathname.includes("/roles")) return "角色管理"
    if (pathname.includes("/fields")) return "字段管理"
    if (pathname.includes("/status")) return "状态管理"
    if (pathname.includes("/tasks")) return "事项管理"
    if (pathname.includes("/projects")) return "项目管理"
    if (pathname.includes("/settings")) return "账户设置"
    if (pathname.includes("/profile")) return "个人资料"
    return "管理系统"
  }

  // 处理退出登录
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

  // 跳转到个人资料页面
  const goToProfile = () => {
    router.push("/dashboard/profile")
  }

  // 跳转到账户设置页面
  const goToSettings = () => {
    router.push("/dashboard/settings")
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索..."
            className="w-64 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-4">
              <span className="font-medium">通知</span>
              <Button variant="ghost" size="sm">
                全部标为已读
              </Button>
            </div>
            <div className="border-t p-4 text-center text-sm text-muted-foreground">暂无新通知</div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>浅色模式</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>深色模式</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>系统默认</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={goToProfile}>个人资料</DropdownMenuItem>
            <DropdownMenuItem onClick={goToSettings}>账户设置</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isLoggingOut ? "退出中..." : "退出登录"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
