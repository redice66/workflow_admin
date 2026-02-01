"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Check, Lock } from "lucide-react"
import { resetPassword } from "@/lib/api/auth-api"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // 从URL参数获取令牌和从localStorage获取邮箱
  useEffect(() => {
    const tokenParam = searchParams.get("token")
    const storedEmail = localStorage.getItem("resetPasswordEmail")
    const isVerified = localStorage.getItem("codeVerified") === "true"

    if (tokenParam) {
      setToken(tokenParam)
    } else {
      const storedToken = localStorage.getItem("resetToken")
      if (storedToken) {
        setToken(storedToken)
      }
    }

    if (storedEmail) {
      setEmail(storedEmail)
    }

    // 如果没有令牌或验证状态，重定向到忘记密码页面
    if (!tokenParam && (!isVerified || !localStorage.getItem("resetToken"))) {
      toast({
        title: "无效的请求",
        description: "请先完成邮箱验证",
        variant: "destructive",
      })
      router.push("/forgot-password")
    }
  }, [searchParams, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast({
        title: "无效的请求",
        description: "缺少验证令牌，请重新验证",
        variant: "destructive",
      })
      router.push("/forgot-password")
      return
    }

    // 验证密码
    if (password.length < 8) {
      toast({
        title: "密码太短",
        description: "密码长度至少为8个字符",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "两次输入的密码不一致",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 调用API重置密码
      const result = await resetPassword(token, password)

      if (result.success) {
        // 显示成功状态
        setIsSuccess(true)

        toast({
          title: "密码已重置",
          description: result.message || "您的密码已成功重置，请使用新密码登录",
        })

        // 3秒后跳转到登录页面
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        toast({
          title: "重置失败",
          description: result.message || "重置密码时出错",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "重置失败",
        description: error instanceof Error ? error.message : "重置密码时出错",
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
          <CardTitle className="text-2xl font-bold">重置密码</CardTitle>
          <CardDescription>{isSuccess ? "您的密码已成功重置" : `为账户 ${email} 设置新密码`}</CardDescription>
        </CardHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">新密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入新密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">密码长度至少为8个字符</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">确认新密码</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="请再次输入新密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    重置中...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    重置密码
                  </>
                )}
              </Button>
              <Button variant="ghost" className="w-full" type="button" onClick={() => router.push("/login")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回登录
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-1 text-lg font-medium text-green-800 dark:text-green-300">密码重置成功</h3>
              <p className="text-sm text-green-700 dark:text-green-400">您的密码已成功重置，现在可以使用新密码登录</p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>3秒后将自动跳转到登录页面</p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full w-full origin-left bg-primary transition-all duration-3000"
                  style={{ transform: "scaleX(1)" }}
                ></div>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/login")}>
              立即登录
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
