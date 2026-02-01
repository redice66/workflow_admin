"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Database, Shield, Bell } from "lucide-react"
import type { Task } from "@/lib/api/task-api"
import { TaskFieldsDialog } from "./task-fields-dialog"
import { TaskWorkflowDialog } from "./task-workflow-dialog"
import { TaskPermissionsDialog } from "./task-permissions-dialog"
import { TaskNotificationsDialog } from "./task-notifications-dialog"

interface TaskContentDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskContentDialog({ task, open, onOpenChange }: TaskContentDialogProps) {
  const [fieldsDialogOpen, setFieldsDialogOpen] = useState(false)
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false)

  const modules = [
    {
      title: "事项字段",
      description: "配置事项的字段信息和属性",
      icon: Database,
      onClick: () => setFieldsDialogOpen(true),
    },
    {
      title: "事项工作流",
      description: "设置事项的状态流转规则",
      icon: Settings,
      onClick: () => setWorkflowDialogOpen(true),
    },
    {
      title: "事项权限",
      description: "管理事项的访问权限设置",
      icon: Shield,
      onClick: () => setPermissionsDialogOpen(true),
    },
    {
      title: "事项通知",
      description: "配置事项的通知规则",
      icon: Bell,
      onClick: () => setNotificationsDialogOpen(true),
    },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">事项内容 | {task.name}</DialogTitle>
          </DialogHeader>

          <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module) => {
                const IconComponent = module.icon
                return (
                  <Card key={module.title} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button onClick={module.onClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        配置 {module.title}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">确定</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 子模块对话框 */}
      <TaskFieldsDialog task={task} open={fieldsDialogOpen} onOpenChange={setFieldsDialogOpen} />
      <TaskWorkflowDialog task={task} open={workflowDialogOpen} onOpenChange={setWorkflowDialogOpen} />
      <TaskPermissionsDialog task={task} open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen} />
      <TaskNotificationsDialog task={task} open={notificationsDialogOpen} onOpenChange={setNotificationsDialogOpen} />
    </>
  )
}
