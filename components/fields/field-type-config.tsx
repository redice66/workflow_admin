"use client"

import type { FieldType, FieldOption, Field } from "@/lib/fields-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

interface FieldTypeConfigProps {
  type: FieldType
  options: FieldOption[]
  referenceFieldId: string
  onAddOption: () => void
  onUpdateOption: (index: number, key: keyof FieldOption, value: string) => void
  onRemoveOption: (index: number) => void
  onReferenceFieldChange: (id: string) => void
  referencableFields: Field[]
}

export function FieldTypeConfig({
  type,
  options,
  referenceFieldId,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onReferenceFieldChange,
  referencableFields,
}: FieldTypeConfigProps) {
  // 根据字段类型渲染不同的配置
  switch (type) {
    case "dropdown":
    case "multiSelect":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>选项配置</Label>
            <Button type="button" variant="outline" size="sm" onClick={onAddOption}>
              <Plus className="mr-2 h-4 w-4" />
              添加选项
            </Button>
          </div>

          {options.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">暂无选项，点击"添加选项"按钮创建</p>
            </div>
          ) : (
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    placeholder="选项标签"
                    value={option.label}
                    onChange={(e) => onUpdateOption(index, "label", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="选项值"
                    value={option.value}
                    onChange={(e) => onUpdateOption(index, "value", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveOption(index)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            配置{type === "dropdown" ? "下拉单选" : "多选"}字段的选项，包括显示标签和实际值
          </p>
        </div>
      )

    case "reference":
      return (
        <div className="space-y-2">
          <Label htmlFor="referenceField">引用字段</Label>
          <Select value={referenceFieldId} onValueChange={onReferenceFieldChange}>
            <SelectTrigger id="referenceField">
              <SelectValue placeholder="选择要引用的字段" />
            </SelectTrigger>
            <SelectContent>
              {referencableFields.length === 0 ? (
                <SelectItem value="" disabled>
                  没有可引用的字段
                </SelectItem>
              ) : (
                referencableFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.displayName} ({field.name})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">选择要引用的字段，引用字段将继承被引用字段的属性和配置</p>
        </div>
      )

    case "richText":
      return (
        <div className="space-y-2">
          <Label>富文本配置</Label>
          <div className="rounded-md border p-3">
            <p className="text-sm">富文本编辑器将支持以下功能：</p>
            <ul className="ml-4 mt-2 list-disc text-sm">
              <li>文本格式化（粗体、斜体、下划线）</li>
              <li>段落样式（标题、引用、列表）</li>
              <li>插入链接和图片</li>
              <li>表格编辑</li>
            </ul>
          </div>
        </div>
      )

    case "attachment":
      return (
        <div className="space-y-2">
          <Label>附件配置</Label>
          <div className="rounded-md border p-3">
            <p className="text-sm">附件上传将支持以下功能：</p>
            <ul className="ml-4 mt-2 list-disc text-sm">
              <li>多文件上传</li>
              <li>文件类型限制</li>
              <li>文件大小限制</li>
              <li>文件预览</li>
            </ul>
          </div>
        </div>
      )

    case "number":
      return (
        <div className="space-y-2">
          <Label>数字字段配置</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min" className="text-xs">
                最小值
              </Label>
              <Input id="min" type="number" placeholder="最小值" />
            </div>
            <div>
              <Label htmlFor="max" className="text-xs">
                最大值
              </Label>
              <Input id="max" type="number" placeholder="最大值" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="step" className="text-xs">
                步长
              </Label>
              <Input id="step" type="number" placeholder="步长" defaultValue="1" />
            </div>
            <div>
              <Label htmlFor="unit" className="text-xs">
                单位
              </Label>
              <Input id="unit" placeholder="单位" />
            </div>
          </div>
        </div>
      )

    case "dateTime":
      return (
        <div className="space-y-2">
          <Label>时间字段配置</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format" className="text-xs">
                日期格式
              </Label>
              <Select defaultValue="datetime">
                <SelectTrigger id="format">
                  <SelectValue placeholder="选择日期格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">仅日期</SelectItem>
                  <SelectItem value="datetime">日期和时间</SelectItem>
                  <SelectItem value="time">仅时间</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="picker" className="text-xs">
                选择器类型
              </Label>
              <Select defaultValue="calendar">
                <SelectTrigger id="picker">
                  <SelectValue placeholder="选择器类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calendar">日历</SelectItem>
                  <SelectItem value="dropdown">下拉列表</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )

    case "userSelect":
    case "userMultiSelect":
      return (
        <div className="space-y-2">
          <Label>用户选择配置</Label>
          <div className="rounded-md border p-3">
            <p className="text-sm">用户选择字段将支持以下功能：</p>
            <ul className="ml-4 mt-2 list-disc text-sm">
              <li>搜索用户</li>
              <li>按部门筛选</li>
              <li>按角色筛选</li>
              <li>{type === "userSelect" ? "单选" : "多选"}模式</li>
            </ul>
          </div>
        </div>
      )

    // 默认情况（单行文本、多行文本等简单类型）
    default:
      return (
        <div className="rounded-md border p-3">
          <p className="text-sm">此字段类型无需额外配置</p>
        </div>
      )
  }
}
