"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/api/task-api"

interface TaskPreviewDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskPreviewDialog({ task, open, onOpenChange }: TaskPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-50">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-lg font-medium">事项预览</DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">事项ID</h3>
              <p className="text-sm">{task.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">状态</h3>
              <Badge
                variant={task.status === "active" ? "default" : "secondary"}
                className={task.status === "active" ? "bg-blue-500" : "bg-gray-500"}
              >
                {task.status === "active" ? "启用" : "停用"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">事项名称</h3>
              <p className="text-sm">{task.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">C端展示名称</h3>
              <p className="text-sm">{task.displayName || "-"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">事项释义</h3>
            <p className="text-sm bg-white p-3 rounded border">{task.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">C端展示释义</h3>
            <p className="text-sm bg-white p-3 rounded border">{task.displayDescription || "-"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">创建者</h3>
              <p className="text-sm">{task.creator}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">创建时间</h3>
              <p className="text-sm">{task.createdAt}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">更新者</h3>
              <p className="text-sm">{task.updater}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">更新时间</h3>
              <p className="text-sm">{task.updatedAt}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
