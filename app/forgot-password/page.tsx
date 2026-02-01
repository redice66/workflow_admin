"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Mail } from "lucide-react"
import { sendPasswordResetCode } from "@/lib/api/auth-api"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "请输入邮箱",
        description: "请输入您的注册邮箱地址",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 调用API发送验证码
      const result = await sendPasswordResetCode(email)

      if (result.success) {
        // 显示成功提交状态
        setIsSubmitted(true)

        toast({
          title: "验证码已发送",
          description: result.message || "请检查您的邮箱，输入收到的验证码",
        })
      } else {
        toast({
          title: "发送失败",
          description: result.message || "发送验证码时出错",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "发送验证码时出错",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = () => {
    router.push("/verify-code")
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
          <CardTitle className="text-2xl font-bold">忘记密码</CardTitle>
          <CardDescription>
            {isSubmitted ? "验证码已发送到您的邮箱，请查收" : "输入您的邮箱地址，我们将发送验证码"}
          </CardDescription>
        </CardHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入您的邮箱地址"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    发送中...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    发送验证码
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
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <Mail className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="text-sm">
                验证码已发送到 <strong>{email}</strong>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                如果您没有收到验证码，请检查垃圾邮件文件夹，或
                <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setIsSubmitted(false)}>
                  重新发送
                </Button>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">为了演示，验证码已打印到控制台</p>
            </div>
            <Button className="w-full" onClick={handleVerifyCode}>
              前往验证
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => router.push("/login")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回登录
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
