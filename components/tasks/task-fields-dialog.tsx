"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, Search, Settings, Eye, GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Task } from "@/lib/api/task-api"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Field } from "@/lib/fields-store"
import { getAllFields } from "@/lib/api/fields-api"

interface TaskField {
  id: string
  fieldId: string
  fieldName: string
  displayName: string
  displayDescription: string
  componentType: string
  editable: boolean
  required: boolean
  applications: string[]
  defaultValue: any
}

interface TaskFieldsDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

const applicationOptions = [
  { id: "detail", label: "详情页" },
  { id: "share", label: "分享 H5 页" },
  { id: "create", label: "项目创建页" },
]

export function TaskFieldsDialog({ task, open, onOpenChange }: TaskFieldsDialogProps) {
  const { toast } = useToast()
  const [availableFields, setAvailableFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [fields, setFields] = useState<TaskField[]>([
    {
      id: "1",
      fieldId: "field-1",
      fieldName: "title",
      displayName: "标题",
      displayDescription: "请输入标题",
      componentType: "singleLineText",
      editable: true,
      required: true,
      applications: ["detail", "create"],
      defaultValue: "",
    },
    {
      id: "2",
      fieldId: "field-2",
      fieldName: "description",
      displayName: "描述",
      displayDescription: "请输入详细描述",
      componentType: "multiLineText",
      editable: true,
      required: true,
      applications: ["detail", "share"],
      defaultValue: "",
    },
  ])

  const [descriptionDialog, setDescriptionDialog] = useState<{ open: boolean; content: string }>({
    open: false,
    content: "",
  })

  const [defaultValueDialog, setDefaultValueDialog] = useState<{
    open: boolean
    fieldId: string
    fieldType: string
    currentValue: any
  }>({
    open: false,
    fieldId: "",
    fieldType: "",
    currentValue: null,
  })

  // 加载字段管理中的字段数据
  useEffect(() => {
    if (open) {
      loadAvailableFields()
    }
  }, [open])

  const loadAvailableFields = async () => {
    setLoading(true)
    try {
      const fieldsData = await getAllFields()
      setAvailableFields(fieldsData)
    } catch (error) {
      console.error("加载字段数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载字段数据，请重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addNewField = () => {
    const newField: TaskField = {
      id: Date.now().toString(),
      fieldId: "",
      fieldName: "",
      displayName: "",
      displayDescription: "",
      componentType: "",
      editable: true,
      required: false,
      applications: [],
      defaultValue: "",
    }
    setFields([...fields, newField])
  }

  const updateField = (fieldId: string, updates: Partial<TaskField>) => {
    setFields(fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)))
  }

  const deleteField = (fieldId: string) => {
    setFields(fields.filter((field) => field.id !== fieldId))
  }

  const handleFieldNameChange = (fieldId: string, selectedFieldId: string) => {
    const selectedField = availableFields.find((f) => f.id === selectedFieldId)
    if (selectedField) {
      updateField(fieldId, {
        fieldId: selectedField.id,
        fieldName: selectedField.name,
        displayName: selectedField.displayName || selectedField.name,
        displayDescription: selectedField.hint || "",
        componentType: selectedField.type,
      })
    }
  }

  const handleApplicationChange = (fieldId: string, appId: string, checked: boolean) => {
    const field = fields.find((f) => f.id === fieldId)
    if (field) {
      const newApplications = checked
        ? [...field.applications, appId]
        : field.applications.filter((app) => app !== appId)
      updateField(fieldId, { applications: newApplications })
    }
  }

  const showDescription = (description: string) => {
    setDescriptionDialog({ open: true, content: description })
  }

  const openDefaultValueDialog = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId)
    if (field) {
      setDefaultValueDialog({
        open: true,
        fieldId: fieldId,
        fieldType: field.componentType,
        currentValue: field.defaultValue,
      })
    }
  }

  const saveDefaultValue = (value: any) => {
    updateField(defaultValueDialog.fieldId, { defaultValue: value })
    setDefaultValueDialog({ open: false, fieldId: "", fieldType: "", currentValue: null })
  }

  // 处理拖拽结束事件
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // 更新字段顺序
    const reorderedFields = items.map((field, index) => ({
      ...field,
      sortOrder: index + 1
    }))

    setFields(reorderedFields)
    toast({
      title: "字段顺序已更新",
      description: '请点击下方"保存"按钮以应用更改',
    })
  }

  // 保存字段配置
  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: 调用后端API保存字段配置
      // await saveTaskFields(task.id, fields)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "保存成功",
        description: "事项字段配置已保存",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("保存字段配置失败:", error)
      toast({
        title: "保存失败",
        description: "请重试",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // 获取字段类型的显示名称
  const getFieldTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      singleLineText: "单行文本",
      multiLineText: "多行文本",
      dropdown: "下拉选择",
      multiSelect: "多选",
      dateTime: "日期时间",
      number: "数字",
      checkbox: "复选框",
      radio: "单选框",
      file: "文件上传",
    }
    return typeMap[type] || type
  }

  // 构造字段下拉 options
  const fieldOptions = availableFields.map(f => ({ value: f.id, label: f.displayName || f.name }))

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">事项内容 | {task.name} | 事项字段</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {loading ? (
              <div className="text-center py-8">
                <p>加载字段数据中...</p>
              </div>
            ) : (
              <>
                <div className="border rounded-lg overflow-x-auto relative">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Table style={{ tableLayout: 'fixed' }}>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">排序</TableHead>
                          <TableHead className="w-[150px]">字段名称</TableHead>
                          <TableHead className="w-[150px]">C端展示名称</TableHead>
                          <TableHead className="w-[120px]">字段释义</TableHead>
                          <TableHead className="w-[120px]">元件类型</TableHead>
                          <TableHead className="w-[100px]">是否可编辑</TableHead>
                          <TableHead className="w-[100px]">是否必填</TableHead>
                          <TableHead className="w-[200px]">展示应用</TableHead>
                          <TableHead className="w-[120px]">默认值设置</TableHead>
                          <TableHead className="w-[80px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <Droppable droppableId="fields" renderClone={(provided, snapshot, rubric) => {
                        const field = fields[rubric.source.index]
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="dragging-row"
                            style={{
                              ...provided.draggableProps.style,
                              display: 'flex',
                              width: '1190px',
                              minWidth: '1190px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                              zIndex: 1000,
                              position: 'fixed',
                              alignItems: 'center',
                            }}
                          >
                            <div className="w-[50px] p-2 border-r border-border flex items-center justify-center">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="w-[150px] p-2 border-r border-border">
                              <div className="w-full">
                                <select
                                  value={field.fieldId || ''}
                                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                                  disabled
                                >
                                  <option>
                                    {fieldOptions.find(opt => opt.value === field.fieldId)?.label || '选择字段'}
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="w-[150px] p-2 border-r border-border">
                              <input
                                type="text"
                                value={field.displayName}
                                className="w-full px-3 py-1.5 border rounded-md text-sm"
                                placeholder="C端展示名称"
                                disabled
                              />
                            </div>
                            <div className="w-[120px] p-2 border-r border-border">
                              <button
                                className="px-2 py-1 text-sm text-blue-600 border rounded"
                                disabled
                              >
                                <Eye className="h-4 w-4 mr-1 inline" />
                                查看
                              </button>
                            </div>
                            <div className="w-[120px] p-2 border-r border-border">
                              <span className="text-sm text-gray-600">
                                {getFieldTypeDisplayName(field.componentType)}
                              </span>
                            </div>
                            <div className="w-[100px] p-2 border-r border-border text-center">
                              <div className={`w-6 h-3 rounded-full ${field.editable ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            </div>
                            <div className="w-[100px] p-2 border-r border-border text-center">
                              <div className={`w-6 h-3 rounded-full ${field.required ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            </div>
                            <div className="w-[200px] p-2 border-r border-border">
                              <div className="space-y-1">
                                {applicationOptions.map((app) => (
                                  <div key={app.id} className="flex items-center space-x-1">
                                    <div className={`w-3 h-3 border rounded ${field.applications.includes(app.id) ? 'bg-blue-500' : 'bg-white'}`}></div>
                                    <span className="text-xs">{app.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="w-[120px] p-2 border-r border-border">
                              <button
                                className="px-2 py-1 text-sm text-blue-600 border rounded"
                                disabled
                              >
                                <Settings className="h-4 w-4 mr-1 inline" />
                                设置
                              </button>
                            </div>
                            <div className="w-[80px] p-2">
                              <button className="p-1 text-red-600" disabled>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )
                      }}>
                        {(provided, snapshot) => (
                          <TableBody 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            style={{ overflow: 'visible' }}
                          >
                            {fields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided, snapshot) => (
                                  <TableRow
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={snapshot.isDragging ? 'opacity-50' : 'bg-white'}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <TableCell className="w-[50px]" {...provided.dragHandleProps}>
                                      <div className="flex items-center justify-center cursor-grab active:cursor-grabbing">
                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Select
                                        value={field.fieldId || ''}
                                        onValueChange={(value) => handleFieldNameChange(field.id, value)}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="选择字段">
                                            {fieldOptions.find(opt => opt.value === field.fieldId)?.label || ''}
                                          </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                          {fieldOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={field.displayName}
                                        onChange={(e) => updateField(field.id, { displayName: e.target.value })}
                                        placeholder="C端展示名称"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => showDescription(field.displayDescription)}
                                        className="text-blue-600 hover:text-blue-700"
                                        disabled={!field.displayDescription}
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        查看
                                      </Button>
                                    </TableCell>
                                    <TableCell>
                                      <span className="text-sm text-gray-600">
                                        {getFieldTypeDisplayName(field.componentType)}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <Switch
                                        checked={field.editable}
                                        onCheckedChange={(checked) => updateField(field.id, { editable: checked })}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Switch
                                        checked={field.required}
                                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-2">
                                        {applicationOptions.map((app) => (
                                          <div key={app.id} className="flex items-center space-x-2">
                                            <Checkbox
                                              id={`${field.id}-${app.id}`}
                                              checked={field.applications.includes(app.id)}
                                              onCheckedChange={(checked) =>
                                                handleApplicationChange(field.id, app.id, !!checked)
                                              }
                                            />
                                            <Label htmlFor={`${field.id}-${app.id}`} className="text-sm">
                                              {app.label}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openDefaultValueDialog(field.id)}
                                        className="text-blue-600 hover:text-blue-700"
                                        disabled={!field.componentType}
                                      >
                                        <Settings className="h-4 w-4 mr-1" />
                                        设置
                                      </Button>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteField(field.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </TableBody>
                        )}
                      </Droppable>
                    </Table>
                  </DragDropContext>
                </div>

                <div className="mt-4">
                  <Button onClick={addNewField} variant="outline" className="text-blue-600 hover:text-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    添加字段
                  </Button>
                </div>
              </>
            )}
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

      {/* 字段释义查看弹窗 */}
      <Dialog
        open={descriptionDialog.open}
        onOpenChange={(open) => setDescriptionDialog({ ...descriptionDialog, open })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>字段释义</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">{descriptionDialog.content}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setDescriptionDialog({ ...descriptionDialog, open: false })}>关闭</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 默认值设置弹窗 */}
      <DefaultValueDialog
        open={defaultValueDialog.open}
        fieldType={defaultValueDialog.fieldType}
        currentValue={defaultValueDialog.currentValue}
        onSave={saveDefaultValue}
        onClose={() => setDefaultValueDialog({ open: false, fieldId: "", fieldType: "", currentValue: null })}
      />
    </>
  )
}

// 默认值设置弹窗组件
function DefaultValueDialog({
  open,
  fieldType,
  currentValue,
  onSave,
  onClose,
}: {
  open: boolean
  fieldType: string
  currentValue: any
  onSave: (value: any) => void
  onClose: () => void
}) {
  // 确保初始值是正确的类型
  const getInitialValue = () => {
    if (fieldType === "multiSelect" && !Array.isArray(currentValue)) {
      return []
    }
    if ((fieldType === "dropdown" || fieldType === "radio") && Array.isArray(currentValue)) {
      return currentValue.length > 0 ? currentValue[0] : ""
    }
    return currentValue || ""
  }

  const [value, setValue] = useState(getInitialValue())

  // 当字段类型或当前值变化时重置值
  useEffect(() => {
    setValue(getInitialValue())
  }, [fieldType, currentValue])

  const handleSave = () => {
    onSave(value)
  }

  const getFieldTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      singleLineText: "单行文本",
      multiLineText: "多行文本",
      dropdown: "下拉选择",
      multiSelect: "多选",
      dateTime: "日期时间",
      number: "数字",
      checkbox: "复选框",
      radio: "单选框",
      file: "文件上传",
    }
    return typeMap[type] || type
  }

  const renderValueInput = () => {
    switch (fieldType) {
      case "singleLineText":
      case "multiLineText":
        return <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="请输入默认值" />
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder="请输入默认数值"
          />
        )
      case "dropdown":
      case "radio":
        return (
          <div className="space-y-2">
            <Label>选择默认选项</Label>
            <Select value={String(value)} onValueChange={(val) => setValue(val)}>
              <SelectTrigger>
                <SelectValue placeholder="选择默认值" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="选项1">选项1</SelectItem>
                <SelectItem value="选项2">选项2</SelectItem>
                <SelectItem value="选项3">选项3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case "multiSelect":
        return (
          <div className="space-y-2">
            <Label>选择默认选项（可多选）</Label>
            <div className="space-y-2">
              {["选项1", "选项2", "选项3"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={Array.isArray(value) && value.includes(option)}
                    onCheckedChange={(checked) => {
                      if (!Array.isArray(value)) {
                        setValue(checked ? [option] : [])
                      } else if (checked) {
                        setValue([...value, option])
                      } else {
                        setValue(value.filter((v) => v !== option))
                      }
                    }}
                  />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
        )
      case "dateTime":
        return (
          <Input
            type="datetime-local"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="选择默认日期时间"
          />
        )
      default:
        return <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="请输入默认值" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>设置默认值</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">字段类型：{getFieldTypeDisplayName(fieldType)}</Label>
            </div>
            {renderValueInput()}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            确定
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
