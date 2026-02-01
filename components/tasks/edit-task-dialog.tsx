"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { type Task, updateTask } from "@/lib/api/task-api"

interface EditTaskDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function EditTaskDialog({ task, open, onOpenChange, onUpdate }: EditTaskDialogProps) {
  const [taskName, setTaskName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [displayDescription, setDisplayDescription] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    description?: string
  }>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setTaskName(task.name)
      setDisplayName(task.displayName)
      setTaskDescription(task.description)
      setDisplayDescription(task.displayDescription)
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string; description?: string } = {}

    if (!taskName.trim()) {
      newErrors.name = "请输入事项名称"
    }

    if (!taskDescription.trim()) {
      newErrors.description = "请输入事项释义"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const response = await updateTask({
        id: task.id,
        name: taskName.trim(),
        displayName: displayName.trim(),
        description: taskDescription.trim(),
        displayDescription: displayDescription.trim(),
      })

      if (response.success) {
        toast({
          title: "事项更新成功",
          description: response.message,
        })
        onUpdate()
        onOpenChange(false)
      } else {
        toast({
          title: "事项更新失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "事项更新失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
          <DialogTitle className="text-lg font-medium">编辑事项</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            {/* 第一行：事项名称 和 C端展示名称 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="taskName" className="flex items-center text-sm font-medium">
                  事项名称
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="taskName"
                  placeholder="请输入字段名称"
                  value={taskName}
                  onChange={(e) => {
                    setTaskName(e.target.value)
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

            {/* 第二行：事项释义 */}
            <div className="grid gap-2">
              <Label htmlFor="taskDescription" className="flex items-center text-sm font-medium">
                事项释义
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="taskDescription"
                placeholder="请输入字段名称"
                value={taskDescription}
                onChange={(e) => {
                  setTaskDescription(e.target.value)
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, description: undefined })
                  }
                }}
                className="resize-none bg-white"
                rows={4}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* 第三行：C端展示释义 */}
            <div className="grid gap-2">
              <Label htmlFor="displayDescription" className="text-sm font-medium">
                C端展示释义
              </Label>
              <Textarea
                id="displayDescription"
                placeholder="请输入字段名称"
                value={displayDescription}
                onChange={(e) => setDisplayDescription(e.target.value)}
                className="resize-none bg-white"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="border-t border-gray-200 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600">
              {loading ? "保存中..." : "确定"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
