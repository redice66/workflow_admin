"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, KeyRound } from "lucide-react"
import { verifyPasswordResetCode } from "@/lib/api/auth-api"

export default function VerifyCodePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // 初始化输入框引用
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  // 从localStorage获取邮箱
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetPasswordEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // 如果没有邮箱，重定向到忘记密码页面
      toast({
        title: "无效的请求",
        description: "请先提交您的邮箱地址",
        variant: "destructive",
      })
      router.push("/forgot-password")
    }
  }, [router, toast])

  // 处理验证码输入
  const handleCodeChange = (index: number, value: string) => {
    // 只允许输入数字
    if (value && !/^\d*$/.test(value)) return

    // 更新验证码数组
    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // 自动聚焦到下一个输入框
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // 处理键盘事件
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // 按下退格键时，如果当前输入框为空，则聚焦到上一个输入框
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // 处理粘贴事件
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // 如果粘贴的内容是6位数字，则填充到所有输入框
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setVerificationCode(digits)

      // 聚焦到最后一个输入框
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const code = verificationCode.join("")

    if (code.length !== 6) {
      toast({
        title: "验证码不完整",
        description: "请输入完整的6位验证码",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 调用API验证验证码
      const result = await verifyPasswordResetCode(email, code)

      if (result.success && result.token) {
        // 保存验证令牌
        setResetToken(result.token)

        // 跳转到重置密码页面
        toast({
          title: "验证成功",
          description: result.message || "请设置新密码",
        })

        // 将令牌作为查询参数传递给重置密码页面
        router.push(`/reset-password?token=${encodeURIComponent(result.token)}`)
      } else {
        toast({
          title: "验证失败",
          description: result.message || "验证码验证失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "验证失败",
        description: error instanceof Error ? error.message : "验证码验证失败",
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
          <CardTitle className="text-2xl font-bold">验证邮箱</CardTitle>
          <CardDescription>请输入发送到 {email} 的6位验证码</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">验证码</Label>
              <div className="flex justify-between gap-2">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    className="h-12 w-12 text-center text-lg"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                没有收到验证码？
                <Button variant="link" className="h-auto p-0 text-xs" onClick={() => router.push("/forgot-password")}>
                  重新发送
                </Button>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  验证中...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  验证并继续
                </>
              )}
            </Button>
            <Button variant="ghost" className="w-full" type="button" onClick={() => router.push("/login")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回登录
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
