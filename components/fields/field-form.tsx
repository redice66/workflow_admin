"use client"

import { useState, useEffect } from "react"
import { useFieldStore, type Field, type FieldType, type FieldOption } from "@/lib/fields-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

// 字段类型选项
const fieldTypeOptions = [
  { value: "singleLineText", label: "单行文本框" },
  { value: "multiLineText", label: "多行文本框" },
  { value: "richText", label: "富文本框" },
  { value: "attachment", label: "附件" },
  { value: "dropdown", label: "下拉单选框" },
  { value: "multiSelect", label: "下拉多选框" },
  { value: "number", label: "数字输入框" },
  { value: "dateTime", label: "时间选择框" },
  { value: "userSelect", label: "用户单选框" },
  { value: "userMultiSelect", label: "用户多选框" },
]

// 当前用户
const currentUser = "Admin User"

interface FieldFormProps {
  field?: Field
  onClose: () => void
}

export function FieldForm({ field, onClose }: FieldFormProps) {
  const { addField, updateField, fields } = useFieldStore()
  const { toast } = useToast()

  // 表单状态
  const [formState, setFormState] = useState<{
    name: string
    displayName: string
    hint: string
    clientHint: string
    type: FieldType
    options: FieldOption[]
    useReference: boolean
    referenceFieldId: string
    status: "active" | "inactive"
  }>({
    name: "",
    displayName: "",
    hint: "",
    clientHint: "",
    type: "singleLineText",
    options: [],
    useReference: false,
    referenceFieldId: "",
    status: "active",
  })

  // 初始化表单状态
  useEffect(() => {
    if (field) {
      setFormState({
        name: field.name,
        displayName: field.displayName,
        hint: field.hint,
        clientHint: field.clientHint || "",
        type: field.type,
        options: field.options || [],
        useReference: field.useReference || false,
        referenceFieldId: field.referenceFieldId || "",
        status: field.status,
      })
    }
  }, [field])

  // 更新表单字段
  const updateFormField = (key: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  // 添加选项
  const addOption = () => {
    const newOption: FieldOption = {
      id: `opt-${Date.now()}`,
      label: "",
      value: "",
      hint: "",
    }
    updateFormField("options", [...formState.options, newOption])
  }

  // 更新选项
  const updateOption = (index: number, key: keyof FieldOption, value: string) => {
    const updatedOptions = [...formState.options]
    updatedOptions[index] = { ...updatedOptions[index], [key]: value }
    updateFormField("options", updatedOptions)
  }

  // 删除选项
  const removeOption = (index: number) => {
    const updatedOptions = [...formState.options]
    updatedOptions.splice(index, 1)
    updateFormField("options", updatedOptions)
  }

  // 检查是否需要显示选项配置
  const needsOptions = formState.type === "dropdown" || formState.type === "multiSelect"

  // 获取可引用的字段列表
  const getReferencableFields = () => {
    return fields.filter(
      (f) =>
        (f.type === "dropdown" || f.type === "multiSelect") &&
        f.options &&
        f.options.length > 0 &&
        (!field || f.id !== field.id),
    )
  }

  // 处理引用选项变化
  const handleReferenceChange = (checked: boolean) => {
    updateFormField("useReference", checked)
    if (checked) {
      updateFormField("options", [])
    } else {
      updateFormField("referenceFieldId", "")
    }
  }

  // 提交表单
  const handleSubmit = () => {
    // 验证表单
    if (!formState.name || !formState.hint) {
      toast({
        title: "表单验证失败",
        description: "字段名称和字段释义不能为空",
        variant: "destructive",
      })
      return
    }

    if (needsOptions && !formState.useReference && formState.options.length === 0) {
      toast({
        title: "表单验证失败",
        description: "下拉框类型字段必须配置选项数据或引用其他字段",
        variant: "destructive",
      })
      return
    }

    if (formState.useReference && !formState.referenceFieldId) {
      toast({
        title: "表单验证失败",
        description: "请选择要引用的字段",
        variant: "destructive",
      })
      return
    }

    try {
      if (field) {
        // 更新字段
        updateField(field.id, {
          name: formState.name,
          displayName: formState.displayName,
          hint: formState.hint,
          clientHint: formState.clientHint,
          type: formState.type,
          options: formState.useReference ? undefined : formState.options,
          useReference: formState.useReference,
          referenceFieldId: formState.useReference ? formState.referenceFieldId : undefined,
          status: formState.status,
          updatedBy: currentUser,
        })
        toast({
          title: "更新成功",
          description: `字段 "${formState.displayName}" 已成功更新`,
        })
      } else {
        // 添加字段
        addField({
          name: formState.name,
          displayName: formState.displayName,
          hint: formState.hint,
          clientHint: formState.clientHint,
          type: formState.type,
          options: formState.useReference ? undefined : formState.options,
          useReference: formState.useReference,
          referenceFieldId: formState.useReference ? formState.referenceFieldId : undefined,
          createdBy: currentUser,
          updatedBy: currentUser,
          status: formState.status,
        })
        toast({
          title: "创建成功",
          description: `字段 "${formState.displayName}" 已成功创建`,
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: field ? "更新失败" : "创建失败",
        description: error instanceof Error ? error.message : "操作字段时发生错误",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 py-4">
      {/* 基本信息 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            字段名称<span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="请输入字段名称"
            value={formState.name}
            onChange={(e) => updateFormField("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="displayName">C端展示名称</Label>
          <Input
            id="displayName"
            placeholder="请输入C端展示名称"
            value={formState.displayName}
            onChange={(e) => updateFormField("displayName", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hint">
          字段释义<span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="hint"
          placeholder="请输入字段名称"
          value={formState.hint}
          onChange={(e) => updateFormField("hint", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientHint">C端展示释义</Label>
        <Textarea
          id="clientHint"
          placeholder="请输入字段名称"
          value={formState.clientHint}
          onChange={(e) => updateFormField("clientHint", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">
          元件类型<span className="text-red-500">*</span>
        </Label>
        <Select
          value={formState.type}
          onValueChange={(value) => updateFormField("type", value as FieldType)}
          disabled={!!field} // 编辑模式下不允许修改类型
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="单行文本框" />
          </SelectTrigger>
          <SelectContent>
            {fieldTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 选项配置 */}
      {needsOptions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>
              选项数据<span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="useReference" checked={formState.useReference} onCheckedChange={handleReferenceChange} />
              <Label htmlFor="useReference" className="text-sm font-normal">
                引用选项
              </Label>
              <div className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded">1</div>
            </div>
          </div>

          {formState.useReference ? (
            <div className="space-y-2">
              <Select
                value={formState.referenceFieldId}
                onValueChange={(value) => updateFormField("referenceFieldId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择要引用的字段" />
                </SelectTrigger>
                <SelectContent>
                  {getReferencableFields().map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.displayName} ({field.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>选项名称</TableHead>
                      <TableHead>选项提示</TableHead>
                      <TableHead className="w-20">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formState.options.map((option, index) => (
                      <TableRow key={option.id}>
                        <TableCell>
                          <Input
                            value={option.label}
                            onChange={(e) => updateOption(index, "label", e.target.value)}
                            placeholder="选项名称"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={option.hint || ""}
                            onChange={(e) => updateOption(index, "hint", e.target.value)}
                            placeholder="选项提示"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(index)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            删除
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                添加选项
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          取消
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-500 text-white hover:bg-blue-600">
          确定
        </Button>
      </div>
    </div>
  )
}
