"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RoleType, Role } from "./roles-management"

interface EditRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleId: string | null
  roles: Role[]
  onUpdateRole: (id: string, updatedData: Partial<Role>) => void
}

export function EditRoleDialog({ open, onOpenChange, roleId, roles, onUpdateRole }: EditRoleDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const roleTypeOptions = [
    { value: "project", label: "项目角色" },
    { value: "platform", label: "平台角色" },
    { value: "data", label: "数据角色" },
  ]

  // 当对话框打开或角色ID变化时，加载角色数据
  useEffect(() => {
    if (open && roleId) {
      const currentRole = roles.find((r) => r.id === roleId)
      if (currentRole) {
        setRole(currentRole)
      } else {
        setRole(null)
        onOpenChange(false)
      }
    } else {
      setRole(null)
    }
  }, [open, roleId, roles, onOpenChange])

  // 验证表单
  const validateForm = () => {
    if (!role) return false

    const newErrors: Record<string, string> = {}

    if (!role.name.trim()) {
      newErrors.name = "角色名称不能为空"
    }

    if (!role.description.trim()) {
      newErrors.description = "角色释义不能为空"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!role || !validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      onUpdateRole(role.id, {
        name: role.name,
        clientDisplayName: role.clientDisplayName,
        description: role.description,
        clientDescription: role.clientDescription,
        type: role.type,
        status: role.status,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("更新角色失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理输入变化，清除对应的错误
  const handleInputChange = (field: string, value: string | RoleType) => {
    if (!role) return

    setRole({ ...role, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  // 如果没有角色数据，不渲染表单内容
  if (!role) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-600">编辑角色</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">加载角色信息中...</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-600">编辑角色</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* 角色名称和C端展示名称 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium">
                角色名称<span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="请输入角色名称"
                value={role.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-clientDisplayName" className="text-sm font-medium">
                C端展示名称
              </Label>
              <Input
                id="edit-clientDisplayName"
                placeholder="请输入C端展示名称"
                value={role.clientDisplayName}
                onChange={(e) => handleInputChange("clientDisplayName", e.target.value)}
              />
            </div>
          </div>

          {/* 角色释义 */}
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">
              角色释义<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="edit-description"
              placeholder="请输入角色释义"
              value={role.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[120px] resize-none ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* C端展示释义 */}
          <div className="space-y-2">
            <Label htmlFor="edit-clientDescription" className="text-sm font-medium">
              C端展示释义
            </Label>
            <Textarea
              id="edit-clientDescription"
              placeholder="请输入C端展示释义"
              value={role.clientDescription}
              onChange={(e) => handleInputChange("clientDescription", e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* 角色类型 */}
          <div className="space-y-2">
            <Label htmlFor="edit-type" className="text-sm font-medium">
              角色类型
            </Label>
            <Select value={role.type} onValueChange={(value: RoleType) => handleInputChange("type", value)}>
              <SelectTrigger id="edit-type">
                <SelectValue placeholder="选择角色类型" />
              </SelectTrigger>
              <SelectContent>
                {roleTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 角色状态 */}
          <div className="space-y-2">
            <Label htmlFor="edit-status" className="text-sm font-medium">
              角色状态
            </Label>
            <Select
              value={role.status}
              onValueChange={(value: "active" | "inactive") => handleInputChange("status", value)}
            >
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="选择角色状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">启用</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  处理中...
                </>
              ) : (
                "确定"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
