"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (statusData: {
    name: string
    clientDisplayName: string
    description: string
    clientDescription: string
  }) => void
}

export function AddStatusDialog({ open, onOpenChange, onAdd }: AddStatusDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    clientDisplayName: "",
    description: "",
    clientDescription: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "请输入状态名称"
    }

    if (!formData.description.trim()) {
      newErrors.description = "请输入状态释义"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onAdd(formData)
    handleReset()
  }

  const handleReset = () => {
    setFormData({
      name: "",
      clientDisplayName: "",
      description: "",
      clientDescription: "",
    })
    setErrors({})
  }

  const handleCancel = () => {
    handleReset()
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>新增状态</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* 第一行：状态名称和C端展示名称 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center">
                  状态名称
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="请输入字段名称"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientDisplayName">C端展示名称</Label>
                <Input
                  id="clientDisplayName"
                  placeholder="请输入C端展示名称"
                  value={formData.clientDisplayName}
                  onChange={(e) => handleInputChange("clientDisplayName", e.target.value)}
                />
              </div>
            </div>

            {/* 第二行：状态释义 */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="flex items-center">
                状态释义
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="请输入字段名称"
                className="min-h-[100px]"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* 第三行：C端展示释义 */}
            <div className="grid gap-2">
              <Label htmlFor="clientDescription">C端展示释义</Label>
              <Textarea
                id="clientDescription"
                placeholder="请输入字段名称"
                className="min-h-[100px]"
                value={formData.clientDescription}
                onChange={(e) => handleInputChange("clientDescription", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              确定
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
