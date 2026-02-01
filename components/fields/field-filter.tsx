"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X, Plus, Trash2 } from "lucide-react"
import type { FieldFilter, FieldType, FieldStatus } from "@/lib/fields-store"
import { Badge } from "@/components/ui/badge"

// 字段类型选项
const fieldTypeOptions = [
  { value: "singleLineText", label: "单行文本" },
  { value: "multiLineText", label: "多行文本" },
  { value: "richText", label: "富文本" },
  { value: "attachment", label: "附件" },
  { value: "dropdown", label: "下拉单选" },
  { value: "multiSelect", label: "多选" },
  { value: "number", label: "数字" },
  { value: "dateTime", label: "时间" },
  { value: "userSelect", label: "用户单选" },
  { value: "userMultiSelect", label: "用户多选" },
  { value: "reference", label: "引用组件" },
]

// 字段状态选项
const fieldStatusOptions = [
  { value: "active", label: "启用" },
  { value: "inactive", label: "停用" },
]

// 条件选项
const conditionOptions = [
  { value: "contains", label: "包含" },
  { value: "notContains", label: "不包含" },
  { value: "equals", label: "等于" },
  { value: "notEquals", label: "不等于" },
  { value: "startsWith", label: "开头是" },
  { value: "endsWith", label: "结尾是" },
]

// 过滤字段选项
const filterFieldOptions = [
  { value: "name", label: "名称" },
  { value: "displayName", label: "C端展示名称" },
  { value: "type", label: "字段类型" },
  { value: "status", label: "状态" },
  { value: "createdBy", label: "创建人" },
]

interface FilterCondition {
  field: string
  operator: string
  value: string
}

interface FieldFilterPopoverProps {
  filter: FieldFilter
  onFilterChange: (filter: FieldFilter) => void
  onClearFilter: () => void
}

export function FieldFilterPopover({ filter, onFilterChange, onClearFilter }: FieldFilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [conditions, setConditions] = useState<FilterCondition[]>([
    { field: "name", operator: "contains", value: filter.name || "" },
  ])

  // 应用过滤器
  const applyFilter = () => {
    const newFilter: FieldFilter = {}

    conditions.forEach((condition) => {
      if (condition.value) {
        if (condition.field === "type") {
          newFilter.type = condition.value as FieldType
        } else if (condition.field === "status") {
          newFilter.status = condition.value as FieldStatus
        } else if (condition.field === "createdBy") {
          newFilter.createdBy = condition.value
        } else if (condition.field === "name" || condition.field === "displayName") {
          newFilter.name = condition.value
        }
      }
    })

    onFilterChange(newFilter)
    setOpen(false)
  }

  // 重置过滤器
  const resetFilter = () => {
    setConditions([{ field: "name", operator: "contains", value: "" }])
    onClearFilter()
    setOpen(false)
  }

  // 更新条件
  const updateCondition = (index: number, field: keyof FilterCondition, value: string) => {
    const newConditions = [...conditions]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setConditions(newConditions)
  }

  // 添加条件
  const addCondition = () => {
    setConditions([...conditions, { field: "name", operator: "contains", value: "" }])
  }

  // 删除条件
  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      const newConditions = [...conditions]
      newConditions.splice(index, 1)
      setConditions(newConditions)
    }
  }

  // 计算活跃过滤器数量
  const activeFilterCount = Object.values(filter).filter(Boolean).length

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="请输入名称"
            className="pr-20"
            value={filter.name || ""}
            onChange={(e) => onFilterChange({ ...filter, name: e.target.value })}
          />
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="absolute right-0 rounded-l-none border-l-0">
              <Filter className="mr-2 h-4 w-4" />
              筛选
              {activeFilterCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs" variant="secondary">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[480px] p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">筛选条件</h4>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={resetFilter}>
                    <X className="mr-2 h-3 w-3" />
                    清除
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {conditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2 py-1">
                    <Select value={condition.field} onValueChange={(value) => updateCondition(index, "field", value)}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterFieldOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(index, "operator", value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {condition.field === "type" ? (
                      <Select
                        value={condition.value}
                        onValueChange={(value) => updateCondition(index, "value", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择字段类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : condition.field === "status" ? (
                      <Select
                        value={condition.value}
                        onValueChange={(value) => updateCondition(index, "value", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder="请输入值"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, "value", e.target.value)}
                      />
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCondition(index)}
                      disabled={conditions.length === 1}
                      className="h-9 w-9 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col space-y-4">
                <Button variant="outline" size="sm" className="self-start" onClick={addCondition}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加筛选条件
                </Button>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                    取消
                  </Button>
                  <Button size="sm" onClick={applyFilter}>
                    应用筛选
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
