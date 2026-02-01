"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { login } from "@/lib/api/auth-api"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })

  // 页面加载时检查是否有保存的用户名
  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername")
    if (rememberedUsername) {
      setFormData((prev) => ({
        ...prev,
        username: rememberedUsername,
        rememberMe: true,
      }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      toast({
        title: "登录失败",
        description: "请输入用户名和密码",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 调用登录API
      const result = await login(formData.username, formData.password)

      if (result.success && result.user && result.token) {
        // 存储登录状态和令牌
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("token", result.token)
        localStorage.setItem("user", JSON.stringify(result.user))

        // 如果选择了"记住我"，存储用户名
        if (formData.rememberMe) {
          localStorage.setItem("rememberedUsername", formData.username)
        } else {
          localStorage.removeItem("rememberedUsername")
        }

        toast({
          title: "登录成功",
          description: "欢迎回来！",
        })

        // 登录成功后跳转到仪表盘
        router.push("/dashboard/members")
      } else {
        toast({
          title: "登录失败",
          description: result.message || "用户名或密码错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "用户名或密码错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-md bg-primary/20 p-2">
              <div className="h-full w-full rounded bg-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">管理系统登录</CardTitle>
          <CardDescription>请输入您的账号和密码登录系统</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">密码</Label>
              <Button
                variant="link"
                className="h-auto p-0 text-sm"
                type="button"
                onClick={() => router.push("/forgot-password")}
              >
                忘记密码?
              </Button>
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                记住我
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  登录中...
                </>
              ) : (
                "登录"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
