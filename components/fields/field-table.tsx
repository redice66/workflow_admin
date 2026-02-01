"use client"

import { useState } from "react"
import { useFieldStore, type Field } from "@/lib/fields-store"
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
import { FieldPreviewDialog } from "@/components/fields/field-preview"

// 字段类型映射
const fieldTypeMap: Record<string, string> = {
  singleLineText: "单行文本框",
  multiLineText: "多行文本框",
  richText: "富文本框",
  attachment: "附件",
  dropdown: "下拉单选框",
  multiSelect: "下拉多选框",
  number: "数字输入框",
  dateTime: "时间选择框",
  userSelect: "用户单选框",
  userMultiSelect: "用户多选框",
}

interface FieldTableProps {
  fields: Field[]
  onEdit: (field: Field) => void
}

export function FieldTable({ fields, onEdit }: FieldTableProps) {
  const { toggleFieldStatus, deleteField } = useFieldStore()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [fieldToPreview, setFieldToPreview] = useState<Field | null>(null)
  const { toast } = useToast()

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 格式化选项数据
  const formatOptions = (field: Field) => {
    if (field.useReference && field.referenceFieldId) {
      return "引用选项"
    }
    if (field.options && field.options.length > 0) {
      return `${field.options.length}个选项`
    }
    return "-"
  }

  // 处理删除字段
  const handleDeleteField = () => {
    if (!fieldToDelete) return

    try {
      deleteField(fieldToDelete.id)
      toast({
        title: "删除成功",
        description: `字段 "${fieldToDelete.displayName}" 已成功删除`,
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: error instanceof Error ? error.message : "删除字段时发生错误",
        variant: "destructive",
      })
    } finally {
      setFieldToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  // 处理切换字段状态
  const handleToggleStatus = (field: Field) => {
    try {
      toggleFieldStatus(field.id)
      toast({
        title: "状态更新成功",
        description: `字段 "${field.displayName}" 已${field.status === "active" ? "停用" : "启用"}`,
      })
    } catch (error) {
      toast({
        title: "状态更新失败",
        description: error instanceof Error ? error.message : "更新字段状态时发生错误",
        variant: "destructive",
      })
    }
  }

  // 处理预览字段
  const handlePreviewField = (field: Field) => {
    setFieldToPreview(field)
    setPreviewDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">字段ID</TableHead>
              <TableHead className="w-[120px]">字段名称</TableHead>
              <TableHead className="w-[120px]">C端展示名称</TableHead>
              <TableHead className="w-[150px]">字段释义</TableHead>
              <TableHead className="w-[150px]">C端展示释义</TableHead>
              <TableHead className="w-[120px]">元件类型</TableHead>
              <TableHead className="w-[100px]">选项数据</TableHead>
              <TableHead className="w-[80px]">创建人</TableHead>
              <TableHead className="w-[80px]">更新人</TableHead>
              <TableHead className="w-[120px]">创建时间</TableHead>
              <TableHead className="w-[120px]">更新时间</TableHead>
              <TableHead className="w-[80px]">状态</TableHead>
              <TableHead className="text-right w-[80px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-mono text-xs">{field.id}</TableCell>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>{field.displayName}</TableCell>
                <TableCell className="max-w-[150px] truncate" title={field.hint}>
                  {field.hint}
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={field.clientHint}>
                  {field.clientHint || "-"}
                </TableCell>
                <TableCell>{fieldTypeMap[field.type] || field.type}</TableCell>
                <TableCell>{formatOptions(field)}</TableCell>
                <TableCell>{field.createdBy}</TableCell>
                <TableCell>{field.updatedBy}</TableCell>
                <TableCell>{formatDate(field.createdAt)}</TableCell>
                <TableCell>{formatDate(field.updatedAt)}</TableCell>
                <TableCell>
                  <Badge variant={field.status === "active" ? "default" : "secondary"}>
                    {field.status === "active" ? "启用" : "停用"}
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
                      <DropdownMenuLabel>字段操作</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handlePreviewField(field)}>
                        <Eye className="mr-2 h-4 w-4" />
                        预览
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(field)}>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(field)}>
                        {field.status === "active" ? (
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
                          setFieldToDelete(field)
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
              您确定要删除字段 "{fieldToDelete?.displayName}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteField} className="bg-destructive text-destructive-foreground">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 字段预览对话框 */}
      {fieldToPreview && (
        <FieldPreviewDialog
          field={fieldToPreview}
          open={previewDialogOpen}
          onOpenChange={setPreviewDialogOpen}
        />
      )}
    </>
  )
}
