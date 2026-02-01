"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Task } from "@/lib/api/task-api"

interface TaskNotificationsDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskNotificationsDialog({ task, open, onOpenChange }: TaskNotificationsDialogProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  // TODO: 实现保存事项通知配置的API接口
  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: 调用后端API保存通知配置
      // const response = await saveTaskNotifications(task.id, notificationsConfig)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "保存成功",
        description: "事项通知配置已保存",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("保存通知配置失败:", error)
      toast({
        title: "保存失败",
        description: "请重试",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">事项内容 | {task.name} | 事项通知</DialogTitle>
        </DialogHeader>

        <div className="py-8">
          <div className="text-center text-gray-500">
            <p className="text-lg">通知配置功能</p>
            <p className="text-sm mt-2">此模块内容待后续开发完善</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={saving}>
            {saving ? "保存中..." : "确定"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
