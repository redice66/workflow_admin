"use client"

import React, { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, User, Shield, Database, Briefcase } from "lucide-react"
import type { Role, RoleType } from "./roles-management"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

interface RolePreviewDialogProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 角色类型映射
const roleTypeMap: Record<RoleType, string> = {
  project: "项目角色",
  platform: "平台角色", 
  data: "数据角色",
}

  // 获取角色类型图标
  const getRoleTypeIcon = (type: RoleType) => {
    switch (type) {
      case "project":
      return <Briefcase className="h-4 w-4" />
      case "platform":
      return <Shield className="h-4 w-4" />
      case "data":
      return <Database className="h-4 w-4" />
      default:
      return <User className="h-4 w-4" />
    }
  }

  // 获取角色类型颜色
  const getRoleTypeColor = (type: RoleType) => {
    switch (type) {
      case "project":
      return "bg-blue-500"
      case "platform":
      return "bg-green-500"
      case "data":
      return "bg-purple-500"
      default:
      return "bg-gray-500"
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

export function RolePreviewDialog({ role, open, onOpenChange }: RolePreviewDialogProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {!role ? (
          <div className="text-center py-8">
            <p>未找到角色信息</p>
          </div>
        ) : (
          <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getRoleTypeColor(role.type)}`} />
                角色预览 - {role.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">基本信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">角色ID:</span>
                      <span className="col-span-2 font-mono">{role.id}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">角色名称:</span>
                      <span className="col-span-2 font-medium">{role.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">C端展示名称:</span>
                      <span className="col-span-2">{role.clientDisplayName || "-"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">角色类型:</span>
                      <span className="col-span-2">
                        <div className="flex items-center gap-2">
                          {getRoleTypeIcon(role.type)}
                          <span>{roleTypeMap[role.type]}</span>
                        </div>
                      </span>
                </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">状态:</span>
                      <span className="col-span-2">
                  <Badge variant={role.status === "active" ? "default" : "secondary"}>
                    {role.status === "active" ? "启用" : "停用"}
                  </Badge>
                      </span>
              </div>
            </CardContent>
          </Card>

          <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">操作信息</CardTitle>
            </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">创建人:</span>
                      <span className="col-span-2">{role.createdBy}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">更新人:</span>
                      <span className="col-span-2">{role.updatedBy}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">创建时间:</span>
                      <span className="col-span-2">{formatDate(role.createdAt)}</span>
              </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">更新时间:</span>
                      <span className="col-span-2">{formatDate(role.updatedAt)}</span>
                </div>
            </CardContent>
          </Card>
              </div>

          <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">角色描述</CardTitle>
            </CardHeader>
            <CardContent>
                  <div className="space-y-4">
                <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">管理端释义</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md min-h-[60px]">
                        {role.description}
                      </p>
                </div>
                    <Separator />
                <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">C端展示释义</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md min-h-[60px]">
                        {role.clientDescription || "未设置"}
                      </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
