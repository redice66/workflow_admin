"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RoleType } from "./roles-management"

interface AddRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddRole: (role: {
    name: string
    clientDisplayName: string
    description: string
    clientDescription: string
    type: RoleType
    status: "active" | "inactive"
  }) => void
}

export function AddRoleDialog({ open, onOpenChange, onAddRole }: AddRoleDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const [newRole, setNewRole] = useState({
    name: "",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
    type: "project" as RoleType,
    status: "active" as const,
  })

  const roleTypeOptions = [
    { value: "project", label: "项目角色" },
    { value: "platform", label: "平台角色" },
    { value: "data", label: "数据角色" },
  ]

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!newRole.name.trim()) {
      newErrors.name = "角色名称不能为空"
    }

    if (!newRole.description.trim()) {
      newErrors.description = "角色释义不能为空"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      onAddRole(newRole)
      onOpenChange(false)

      // 重置表单
      setNewRole({
        name: "",
        clientDisplayName: "",
        description: "",
        clientDescription: "",
        type: "project",
        status: "active",
      })
      setErrors({})
    } catch (error) {
      console.error("添加角色失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理输入变化，清除对应的错误
  const handleInputChange = (field: string, value: string) => {
    setNewRole({ ...newRole, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-600">新增角色</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* 角色名称和C端展示名称 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                角色名称<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="请输入角色名称"
                value={newRole.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientDisplayName" className="text-sm font-medium">
                C端展示名称
              </Label>
              <Input
                id="clientDisplayName"
                placeholder="请输入C端展示名称"
                value={newRole.clientDisplayName}
                onChange={(e) => handleInputChange("clientDisplayName", e.target.value)}
              />
            </div>
          </div>

          {/* 角色释义 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              角色释义<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="请输入角色释义"
              value={newRole.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[120px] resize-none ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* C端展示释义 */}
          <div className="space-y-2">
            <Label htmlFor="clientDescription" className="text-sm font-medium">
              C端展示释义
            </Label>
            <Textarea
              id="clientDescription"
              placeholder="请输入C端展示释义"
              value={newRole.clientDescription}
              onChange={(e) => handleInputChange("clientDescription", e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* 角色类型 */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              角色类型
            </Label>
            <Select value={newRole.type} onValueChange={(value: RoleType) => setNewRole({ ...newRole, type: value })}>
              <SelectTrigger id="type">
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
