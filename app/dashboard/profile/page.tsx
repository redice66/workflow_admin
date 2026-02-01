"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Upload, User } from "lucide-react"
import { getUserProfile, updateUserProfile, uploadUserAvatar, type UserProfile } from "@/lib/api/user-api"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [userData, setUserData] = useState<UserProfile>({
    name: "",
    email: "",
    role: "",
    bio: "",
    phone: "",
    location: "",
  })
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // 加载用户信息
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true)
      try {
        const profile = await getUserProfile()
        setUserData(profile)
        setAvatarUrl(profile.avatar)
      } catch (error) {
        toast({
          title: "加载失败",
          description: error instanceof Error ? error.message : "加载用户信息失败",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [toast])

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 调用API更新用户信息
      const updatedProfile = await updateUserProfile(userData)
      setUserData(updatedProfile)

      toast({
        title: "保存成功",
        description: "个人资料已更新",
      })
    } catch (error) {
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "更新个人资料时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 处理头像上传
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // 调用API上传头像
      const result = await uploadUserAvatar(file)

      if (result.success && result.url) {
        setAvatarUrl(result.url)
        toast({
          title: "上传成功",
          description: result.message || "头像已成功上传",
        })
      } else {
        toast({
          title: "上传失败",
          description: result.message || "上传头像时发生错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "上传头像时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoadingProfile) {
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
          <h2 className="text-2xl font-bold tracking-tight">个人资料</h2>
          <p className="text-muted-foreground">查看和更新您的个人信息</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 个人资料卡片 */}
        <Card className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>更新您的个人信息和联系方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">邮箱地址不可修改</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">电话</Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">所在地</Label>
                  <Input
                    id="location"
                    value={userData.location}
                    onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={userData.bio}
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  placeholder="介绍一下自己..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    保存中...
                  </>
                ) : (
                  "保存更改"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* 头像卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>个人头像</CardTitle>
            <CardDescription>更新您的个人头像</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} alt="@user" />
              <AvatarFallback className="text-4xl">
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload">
              <Button variant="outline" className="w-full" asChild disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    上传新头像
                  </>
                )}
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarUpload}
                disabled={isUploading}
              />
            </label>
            <p className="text-xs text-center text-muted-foreground">支持 JPG, PNG 或 GIF 格式，文件大小不超过 2MB</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
