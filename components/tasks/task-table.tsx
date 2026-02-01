"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye, FileText, Power, PowerOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { type Task, deleteTask, toggleTaskStatus } from "@/lib/api/task-api"
import { EditTaskDialog } from "./edit-task-dialog"
import { TaskPreviewDialog } from "./task-preview-dialog"
import { TaskContentDialog } from "./task-content-dialog"

interface TaskTableProps {
  tasks: Task[]
  loading: boolean
  onTasksChange: () => void
}

export function TaskTable({ tasks, loading, onTasksChange }: TaskTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [previewTask, setPreviewTask] = useState<Task | null>(null)
  const [contentTask, setContentTask] = useState<Task | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteTask(id)
      if (response.success) {
        toast({
          title: "事项删除成功",
          description: response.message,
        })
        onTasksChange() // 重新获取事项列表
      } else {
        toast({
          title: "事项删除失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "事项删除失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await toggleTaskStatus(id)
      if (response.success) {
        toast({
          title: "状态更新成功",
          description: response.message,
        })
        onTasksChange() // 重新获取事项列表
      } else {
        toast({
          title: "状态更新失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "状态更新失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (task: Task) => {
    setEditTask(task)
    setIsEditDialogOpen(true)
  }

  const handlePreview = (task: Task) => {
    setPreviewTask(task)
    setIsPreviewDialogOpen(true)
  }

  const handleContent = (task: Task) => {
    setContentTask(task)
    setIsContentDialogOpen(true)
  }

  const truncateText = (text: string, maxLength = 20) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (loading) {
    return <div className="text-center py-4">加载中...</div>
  }

  if (tasks.length === 0) {
    return <div className="text-center py-4">暂无数据</div>
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead className="w-[100px]">事项名称</TableHead>
              <TableHead className="w-[100px]">C端展示名称</TableHead>
              <TableHead className="w-[150px]">事项释义</TableHead>
              <TableHead className="w-[150px]">C端展示释义</TableHead>
              <TableHead className="w-[80px]">状态</TableHead>
              <TableHead className="w-[80px]">创建者</TableHead>
              <TableHead className="w-[120px]">创建时间</TableHead>
              <TableHead className="w-[80px]">更新者</TableHead>
              <TableHead className="w-[120px]">更新时间</TableHead>
              <TableHead className="text-right w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>
                  <div title={task.name}>{truncateText(task.name, 10)}</div>
                </TableCell>
                <TableCell>
                  <div title={task.displayName}>{truncateText(task.displayName, 10)}</div>
                </TableCell>
                <TableCell>
                  <div title={task.description}>{truncateText(task.description, 15)}</div>
                </TableCell>
                <TableCell>
                  <div title={task.displayDescription}>{truncateText(task.displayDescription, 15)}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={task.status === "active" ? "default" : "secondary"}
                    className={task.status === "active" ? "bg-blue-500" : "bg-gray-500"}
                  >
                    {task.status === "active" ? "启用" : "停用"}
                  </Badge>
                </TableCell>
                <TableCell>{task.creator}</TableCell>
                <TableCell>{task.createdAt}</TableCell>
                <TableCell>{task.updater}</TableCell>
                <TableCell>{task.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>事项操作</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handlePreview(task)}>
                        <Eye className="mr-2 h-4 w-4" />
                        预览
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(task)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleContent(task)}>
                        <FileText className="mr-2 h-4 w-4" />
                        内容
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleStatus(task.id)}>
                        {task.status === "active" ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4" />
                            停用
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4" />
                            启用
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(task.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>您确定要删除这个事项吗？此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editTask && (
        <EditTaskDialog
          task={editTask}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={onTasksChange}
        />
      )}

      {previewTask && (
        <TaskPreviewDialog task={previewTask} open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen} />
      )}

      {contentTask && (
        <TaskContentDialog task={contentTask} open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen} />
      )}
    </>
  )
}
