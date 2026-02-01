"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { MoreHorizontal, Power, PowerOff, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { type Status, deleteStatus, updateStatus } from "@/lib/api/status-api"

interface StatusTableProps {
  statuses: Status[]
  loading: boolean
  onStatusesChange: () => void
}

export function StatusTable({ statuses, loading, onStatusesChange }: StatusTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteStatus(id)
      if (response.success) {
        toast({
          title: "状态删除成功",
          description: response.message,
        })
        onStatusesChange()
      } else {
        toast({
          title: "状态删除失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "状态删除失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleToggleStatus = async (status: Status) => {
    try {
      const newStatus = status.status === "启用" ? "停用" : "启用"
      const response = await updateStatus(status.id, { status: newStatus })
      if (response.success) {
        toast({
          title: "状态更新成功",
          description: `状态 "${status.name}" 已${newStatus}`,
        })
        onStatusesChange()
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

  if (loading) {
    return <div className="text-center py-4">加载中...</div>
  }

  if (statuses.length === 0) {
    return <div className="text-center py-4">暂无数据</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>状态ID</TableHead>
              <TableHead>状态名称</TableHead>
              <TableHead>C端展示名称</TableHead>
              <TableHead>状态释义</TableHead>
              <TableHead>C端展示释义</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建者</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.map((status) => (
              <TableRow key={status.id}>
                <TableCell className="font-medium">{status.id}</TableCell>
                <TableCell className="font-medium">{status.name}</TableCell>
                <TableCell>{status.clientDisplayName || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={status.description}>
                  {status.description}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={status.clientDescription}>
                  {status.clientDescription || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={status.status === "启用" ? "default" : "secondary"}>{status.status}</Badge>
                </TableCell>
                <TableCell>{status.creator}</TableCell>
                <TableCell>{status.createdAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>状态操作</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleToggleStatus(status)}>
                        {status.status === "启用" ? (
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
                        onClick={() => setDeleteId(status.id)}
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
            <AlertDialogDescription>您确定要删除这个状态吗？此操作无法撤销。</AlertDialogDescription>
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
    </>
  )
}
