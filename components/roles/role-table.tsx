"use client"

import React, { useState } from "react"
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
import { Edit, Trash2, MoreHorizontal, Power, PowerOff, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Role, RoleType } from "./roles-management"

// 角色类型映射
const roleTypeMap: Record<RoleType, string> = {
  project: "项目角色",
  platform: "平台角色",
  data: "数据角色",
}

interface RoleTableProps {
  roles: Role[]
  loading: boolean
  onEdit: (role: Role) => void
  onDelete: (id: string) => void
  onPreview: (role: Role) => void
  onToggleStatus: (id: string) => void
}

export function RoleTable({ roles, loading, onEdit, onDelete, onPreview, onToggleStatus }: RoleTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const { toast } = useToast()

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 处理删除角色
  const handleDeleteRole = () => {
    if (!roleToDelete) return

    try {
      onDelete(roleToDelete.id)
      toast({
        title: "删除成功",
        description: `角色 "${roleToDelete.name}" 已成功删除`,
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: error instanceof Error ? error.message : "删除角色时发生错误",
        variant: "destructive",
      })
    } finally {
      setRoleToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  // 处理切换角色状态
  const handleToggleStatus = (role: Role) => {
    try {
      onToggleStatus(role.id)
      toast({
        title: "状态更新成功",
        description: `角色 "${role.name}" 已${role.status === "active" ? "停用" : "启用"}`,
      })
    } catch (error) {
      toast({
        title: "状态更新失败",
        description: error instanceof Error ? error.message : "更新角色状态时发生错误",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-4">加载中...</div>
  }

  if (roles.length === 0) {
    return <div className="text-center py-4">暂无数据</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>角色ID</TableHead>
              <TableHead>角色名称</TableHead>
              <TableHead>C端展示名称</TableHead>
              <TableHead>角色释义</TableHead>
              <TableHead>C端展示释义</TableHead>
              <TableHead>角色类型</TableHead>
              <TableHead>创建人</TableHead>
              <TableHead>更新人</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-mono text-sm">{role.id}</TableCell>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.clientDisplayName || "-"}</TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={role.description}>
                    {role.description}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={role.clientDescription}>
                    {role.clientDescription || "-"}
                  </div>
                </TableCell>
                <TableCell>{roleTypeMap[role.type]}</TableCell>
                <TableCell>{role.createdBy}</TableCell>
                <TableCell>{role.updatedBy}</TableCell>
                <TableCell className="text-sm">{formatDate(role.createdAt)}</TableCell>
                <TableCell className="text-sm">{formatDate(role.updatedAt)}</TableCell>
                <TableCell>
                  <Badge variant={role.status === "active" ? "default" : "secondary"}>
                    {role.status === "active" ? "启用" : "停用"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>角色操作</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onPreview(role)}>
                        <Eye className="mr-2 h-4 w-4" />
                        预览
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(role)}>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(role)}>
                        {role.status === "active" ? (
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
                        onClick={() => {
                          setRoleToDelete(role)
                          setDeleteDialogOpen(true)
                        }}
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

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除角色 "{roleToDelete?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive text-destructive-foreground">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
