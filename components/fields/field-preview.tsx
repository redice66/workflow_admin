"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Field, FieldOption } from "@/lib/fields-store"

interface FieldPreviewDialogProps {
  field: Field
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FieldPreviewDialog({ field, open, onOpenChange }: FieldPreviewDialogProps) {
  const [value, setValue] = useState<any>("")

  // 根据字段类型渲染不同的预览组件
  const renderFieldPreview = () => {
    switch (field.type) {
      case "singleLineText":
        return (
          <Input
            placeholder={field.hint || `请输入${field.displayName}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )
      case "multiLineText":
        return (
          <Textarea
            placeholder={field.hint || `请输入${field.displayName}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
          />
        )
      case "richText":
        return (
          <div className="border rounded-md p-3 min-h-[100px] bg-background">
            <p className="text-muted-foreground">富文本编辑器预览</p>
          </div>
        )
      case "attachment":
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline">选择文件</Button>
            <span className="text-sm text-muted-foreground">未选择文件</span>
          </div>
        )
      case "dropdown":
        return (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue placeholder={field.hint || `请选择${field.displayName}`} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option: FieldOption) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "multiSelect":
        return (
          <div className="space-y-2">
            {(field.options || []).map((option: FieldOption) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        )
      case "number":
        return (
          <Input
            type="number"
            placeholder={field.hint || `请输入${field.displayName}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )
      case "dateTime":
        return (
          <Input
            type="date"
            placeholder={field.hint || `请选择日期`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )
      case "userSelect":
      case "userMultiSelect":
        return (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue placeholder={field.hint || `请选择用户`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">用户1</SelectItem>
              <SelectItem value="user2">用户2</SelectItem>
              <SelectItem value="user3">用户3</SelectItem>
            </SelectContent>
          </Select>
        )
      case "reference":
        return (
          <div className="border rounded-md p-3 bg-muted/20">
            <p className="text-sm text-muted-foreground">引用字段预览</p>
          </div>
        )
      default:
        return <p className="text-muted-foreground">无法预览此字段类型</p>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle>字段预览</DialogTitle>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>{field.displayName}</Label>
            {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}
            {renderFieldPreview()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
