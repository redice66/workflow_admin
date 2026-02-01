"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { logout } from "@/lib/api/auth-api"
import { useState } from "react"

export function UserNav() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // 处理退出登录
  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      // 调用登出API
      const result = await logout()

      if (result.success) {
        // 清除记住我的用户名（如果用户不想被记住）
        // 注意：我们不会自动清除，因为用户可能希望下次仍然记住他们
        // 如果需要清除，可以取消下面的注释
        // localStorage.removeItem("rememberedUsername");

        // 显示退出成功提示
        toast({
          title: "退出成功",
          description: result.message || "您已成功退出登录",
        })

        // 跳转到登录页面
        router.push("/login")
      } else {
        toast({
          title: "退出失败",
          description: result.message || "退出登录时发生错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "退出失败",
        description: error instanceof Error ? error.message : "退出登录时发生错误",
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="@user" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">svcvit</p>
            <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
  )
}
