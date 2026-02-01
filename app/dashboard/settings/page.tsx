"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Bell, Lock, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { getUserSettings, updateUserSettings, updateUserPassword } from "@/lib/api/user-api"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

  // 密码设置
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 通知设置
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  // 加载用户设置
  useEffect(() => {
    const fetchUserSettings = async () => {
      setIsLoadingSettings(true)
      try {
        const settings = await getUserSettings()
        setNotifications(settings.notifications)
      } catch (error) {
        toast({
          title: "加载失败",
          description: error instanceof Error ? error.message : "加载用户设置失败",
          variant: "destructive",
        })
      } finally {
        setIsLoadingSettings(false)
      }
    }

    fetchUserSettings()
  }, [toast])

  // 处理密码更新
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "新密码和确认密码不一致",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "密码太短",
        description: "新密码长度至少为8个字符",
        variant: "destructive",
      })
      return
    }

    setIsLoadingPassword(true)

    try {
      // 调用API更新密码
      const result = await updateUserPassword(passwordData.currentPassword, passwordData.newPassword)

      if (result.success) {
        toast({
          title: "密码已更新",
          description: result.message || "您的密码已成功更新",
        })

        // 清空表单
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "更新失败",
          description: result.message || "更新密码时发生错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "更新失败",
        description: error instanceof Error ? error.message : "更新密码时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPassword(false)
    }
  }

  // 处理通知设置更新
  const handleNotificationUpdate = async () => {
    setIsLoadingNotifications(true)

    try {
      // 调用API更新通知设置
      const updatedSettings = await updateUserSettings({ notifications })
      setNotifications(updatedSettings.notifications)

      toast({
        title: "设置已更新",
        description: "您的通知设置已成功更新",
      })
    } catch (error) {
      toast({
        title: "更新失败",
        description: error instanceof Error ? error.message : "更新通知设置时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  if (isLoadingSettings) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">账户设置</h2>
          <p className="text-muted-foreground">管理您的账户设置和偏好</p>
        </div>
      </div>

      <Tabs defaultValue="password" className="space-y-4">
        <TabsList>
          <TabsTrigger value="password">密码安全</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
          <TabsTrigger value="appearance">外观设置</TabsTrigger>
        </TabsList>

        {/* 密码安全 */}
        <TabsContent value="password">
          <Card>
            <form onSubmit={handlePasswordUpdate}>
              <CardHeader>
                <CardTitle>密码安全</CardTitle>
                <CardDescription>更新您的账户密码</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">当前密码</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">新密码</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">密码长度至少为8个字符</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">确认新密码</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoadingPassword}>
                  {isLoadingPassword ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      更新中...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      更新密码
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>配置您希望接收的通知类型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">通知渠道</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">电子邮件通知</Label>
                    <p className="text-xs text-muted-foreground">接收电子邮件通知</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">推送通知</Label>
                    <p className="text-xs text-muted-foreground">接收浏览器推送通知</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">通知类型</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-updates">任务更新</Label>
                    <p className="text-xs text-muted-foreground">任务流状态变更通知</p>
                  </div>
                  <Switch
                    id="task-updates"
                    checked={notifications.taskUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, taskUpdates: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security-alerts">安全提醒</Label>
                    <p className="text-xs text-muted-foreground">账户安全相关通知</p>
                  </div>
                  <Switch
                    id="security-alerts"
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, securityAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">营销邮件</Label>
                    <p className="text-xs text-muted-foreground">产品更新和促销信息</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNotificationUpdate} disabled={isLoadingNotifications}>
                {isLoadingNotifications ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    保存设置
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 外观设置 */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription>自定义系统界面外观</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">主题设置</h3>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      浅色模式
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      深色模式
                    </Button>
                  </div>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("system")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    跟随系统
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
