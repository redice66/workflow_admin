"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { type Project, updateProject } from "@/lib/api/projects-api"

interface EditProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function EditProjectDialog({ project, open, onOpenChange, onUpdate }: EditProjectDialogProps) {
  const [projectName, setProjectName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [displayDescription, setDisplayDescription] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    description?: string
  }>({})
  const { toast } = useToast()

  // 初始化表单数据
  useEffect(() => {
    if (project) {
      setProjectName(project.name)
      setDisplayName(project.displayName)
      setProjectDescription(project.description)
      setDisplayDescription(project.displayDescription)
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string; description?: string } = {}

    if (!projectName.trim()) {
      newErrors.name = "请输入项目名称"
    }

    if (!projectDescription.trim()) {
      newErrors.description = "请输入项目释义"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await updateProject(project.id, {
        name: projectName.trim(),
        displayName: displayName.trim(),
        description: projectDescription.trim(),
        displayDescription: displayDescription.trim(),
      })

      if (response.success) {
        toast({
          title: "项目更新成功",
          description: response.message,
        })
        onUpdate()
        onOpenChange(false)
      } else {
        toast({
          title: "项目更新失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "项目更新失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-50">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-lg font-medium">编辑项目</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            {/* 第一行：项目名称 和 C端展示名称 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectName" className="flex items-center text-sm font-medium">
                  项目名称
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="projectName"
                  placeholder="请输入项目名称"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value)
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, name: undefined })
                    }
                  }}
                  className="bg-white"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="displayName" className="text-sm font-medium">
                  C端展示名称
                </Label>
                <Input
                  id="displayName"
                  placeholder="请输入C端展示名称"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            {/* 第二行：项目释义 */}
            <div className="grid gap-2">
              <Label htmlFor="projectDescription" className="flex items-center text-sm font-medium">
                项目释义
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="projectDescription"
                placeholder="请输入项目释义"
                rows={3}
                value={projectDescription}
                onChange={(e) => {
                  setProjectDescription(e.target.value)
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, description: undefined })
                  }
                }}
                className="bg-white resize-none"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* 第三行：C端提示语 */}
            <div className="grid gap-2">
              <Label htmlFor="displayDescription" className="text-sm font-medium">
                C端提示语
              </Label>
              <Textarea
                id="displayDescription"
                placeholder="请输入C端提示语"
                rows={3}
                value={displayDescription}
                onChange={(e) => setDisplayDescription(e.target.value)}
                className="bg-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={handleCancel}>
              取消
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              确定
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 