"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, X, Edit2, Trash2, Save, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface WorkflowState {
  id: string
  name: string
  type: "start" | "progress" | "end"
  color: string
  description?: string
  isDefault?: boolean
}

interface WorkflowTransition {
  id: string
  fromStateId: string
  toStateId: string
  name: string
  description?: string
  condition?: string
  requiredRole?: string
}

interface TransitionField {
  id: string
  fieldName: string
  displayName: string
  componentType: string
  editable: boolean
  required: boolean
  defaultValue?: string
}

interface TransitionEvent {
  id: string
  eventType: string
  description: string
}

interface ValidationRule {
  id: string
  ruleType: string
  description: string
  strategy: string
}

interface TransitionEditDrawerProps {
  transition: WorkflowTransition
  states: WorkflowState[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (transition: WorkflowTransition) => void
}

export function TransitionEditDrawer({ 
  transition, 
  states, 
  open, 
  onOpenChange, 
  onSave 
}: TransitionEditDrawerProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("steps")
  const [saving, setSaving] = useState(false)

  // 转换基本信息
  const [transitionData, setTransitionData] = useState<WorkflowTransition>(transition)

  // 步骤执行字段
  const [fields, setFields] = useState<TransitionField[]>([
    {
      id: "field1",
      fieldName: "审批意见",
      displayName: "审批意见",
      componentType: "textarea",
      editable: true,
      required: true,
      defaultValue: ""
    }
  ])

  // 后置事件
  const [events, setEvents] = useState<TransitionEvent[]>([
    {
      id: "event1",
      eventType: "发送通知",
      description: "向相关人员发送审批结果通知"
    }
  ])

  // 校验规则
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([
    {
      id: "rule1",
      ruleType: "权限校验",
      description: "检查用户是否有权限执行此转换",
      strategy: "拒绝"
    }
  ])

  // 编辑状态
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingEvent, setEditingEvent] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<string | null>(null)

  // 获取状态名称
  const getStateName = (stateId: string) => {
    return states.find(s => s.id === stateId)?.name || "未知状态"
  }

  // 筛选可用的起始状态
  const getAvailableFromStates = () => {
    return states.filter(state => state.type !== "end")
  }

  // 筛选可用的目标状态
  const getAvailableToStates = () => {
    return states.filter(state => state.type !== "end")
  }

  // 添加字段
  const handleAddField = () => {
    const newField: TransitionField = {
      id: `field_${Date.now()}`,
      fieldName: "",
      displayName: "",
      componentType: "input",
      editable: true,
      required: false,
      defaultValue: ""
    }
    setFields([...fields, newField])
    setEditingField(newField.id)
  }

  // 删除字段
  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId))
    if (editingField === fieldId) {
      setEditingField(null)
    }
  }

  // 更新字段
  const handleUpdateField = (fieldId: string, updates: Partial<TransitionField>) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f))
    setEditingField(null)
  }

  // 添加事件
  const handleAddEvent = () => {
    const newEvent: TransitionEvent = {
      id: `event_${Date.now()}`,
      eventType: "",
      description: ""
    }
    setEvents([...events, newEvent])
    setEditingEvent(newEvent.id)
  }

  // 删除事件
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId))
    if (editingEvent === eventId) {
      setEditingEvent(null)
    }
  }

  // 更新事件
  const handleUpdateEvent = (eventId: string, updates: Partial<TransitionEvent>) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, ...updates } : e))
    setEditingEvent(null)
  }

  // 添加校验规则
  const handleAddValidationRule = () => {
    const newRule: ValidationRule = {
      id: `rule_${Date.now()}`,
      ruleType: "",
      description: "",
      strategy: "拒绝"
    }
    setValidationRules([...validationRules, newRule])
    setEditingRule(newRule.id)
  }

  // 删除校验规则
  const handleDeleteValidationRule = (ruleId: string) => {
    setValidationRules(validationRules.filter(r => r.id !== ruleId))
    if (editingRule === ruleId) {
      setEditingRule(null)
    }
  }

  // 更新校验规则
  const handleUpdateValidationRule = (ruleId: string, updates: Partial<ValidationRule>) => {
    setValidationRules(validationRules.map(r => r.id === ruleId ? { ...r, ...updates } : r))
    setEditingRule(null)
  }

  // 保存转换规则
  const handleSave = async () => {
    setSaving(true)
    try {
      // 验证基本信息
      if (!transitionData.name.trim()) {
        toast({
          title: "错误",
          description: "请输入转换名称",
          variant: "destructive",
        })
        return
      }

      if (!transitionData.fromStateId || !transitionData.toStateId) {
        toast({
          title: "错误",
          description: "请选择起始状态和目标状态",
          variant: "destructive",
        })
        return
      }

      // 构建完整的转换数据
      const completeTransition: WorkflowTransition = {
        ...transitionData,
      }

      // 调用保存回调
      onSave(completeTransition)

      toast({
        title: "保存成功",
        description: "转换规则已保存",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("保存转换规则失败:", error)
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "请重试",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[50vw] min-w-[600px] max-w-[90vw] sm:w-full sm:max-w-full flex flex-col">
        <SheetHeader className="border-b">
          <SheetTitle className="text-xl font-semibold">
            编辑转换规则
          </SheetTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 pb-4">
            <Badge variant="outline">{getStateName(transitionData.fromStateId)}</Badge>
            <ArrowRight className="h-4 w-4" />
            <Badge variant="outline">{getStateName(transitionData.toStateId)}</Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="p-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="steps">步骤执行</TabsTrigger>
                <TabsTrigger value="events">后置事件</TabsTrigger>
                <TabsTrigger value="validation">校验规则</TabsTrigger>
              </TabsList>
            </div>

            {/* 步骤执行 */}
            <TabsContent value="steps" className="space-y-4 p-6 pt-0 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">步骤执行字段</h3>
                <Button onClick={handleAddField} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  添加字段
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>字段名称</TableHead>
                        <TableHead>C端展示名称</TableHead>
                        <TableHead>元件类型</TableHead>
                        <TableHead>是否可编辑</TableHead>
                        <TableHead>是否必填</TableHead>
                        <TableHead>默认值</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            {editingField === field.id ? (
                              <Input
                                value={field.fieldName}
                                onChange={(e) => handleUpdateField(field.id, { fieldName: e.target.value })}
                                placeholder="字段名称"
                              />
                            ) : (
                              field.fieldName
                            )}
                          </TableCell>
                          <TableCell>
                            {editingField === field.id ? (
                              <Input
                                value={field.displayName}
                                onChange={(e) => handleUpdateField(field.id, { displayName: e.target.value })}
                                placeholder="C端展示名称"
                              />
                            ) : (
                              field.displayName
                            )}
                          </TableCell>
                          <TableCell>
                            {editingField === field.id ? (
                              <Select
                                value={field.componentType}
                                onValueChange={(value) => handleUpdateField(field.id, { componentType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="input">输入框</SelectItem>
                                  <SelectItem value="textarea">文本域</SelectItem>
                                  <SelectItem value="select">下拉选择</SelectItem>
                                  <SelectItem value="checkbox">复选框</SelectItem>
                                  <SelectItem value="radio">单选框</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              field.componentType
                            )}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={field.editable}
                              onCheckedChange={(checked) => handleUpdateField(field.id, { editable: checked })}
                              disabled={editingField !== field.id}
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) => handleUpdateField(field.id, { required: checked })}
                              disabled={editingField !== field.id}
                            />
                          </TableCell>
                          <TableCell>
                            {editingField === field.id ? (
                              <Input
                                value={field.defaultValue || ""}
                                onChange={(e) => handleUpdateField(field.id, { defaultValue: e.target.value })}
                                placeholder="默认值"
                              />
                            ) : (
                              field.defaultValue || "-"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              {editingField === field.id ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingField(null)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingField(field.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteField(field.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 后置事件 */}
            <TabsContent value="events" className="space-y-4 p-6 pt-0 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">后置事件</h3>
                <Button onClick={handleAddEvent} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  添加事件
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>事件类型</TableHead>
                        <TableHead>事件说明</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            {editingEvent === event.id ? (
                              <Select
                                value={event.eventType}
                                onValueChange={(value) => handleUpdateEvent(event.id, { eventType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="发送通知">发送通知</SelectItem>
                                  <SelectItem value="更新状态">更新状态</SelectItem>
                                  <SelectItem value="触发工作流">触发工作流</SelectItem>
                                  <SelectItem value="记录日志">记录日志</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              event.eventType
                            )}
                          </TableCell>
                          <TableCell>
                            {editingEvent === event.id ? (
                              <Input
                                value={event.description}
                                onChange={(e) => handleUpdateEvent(event.id, { description: e.target.value })}
                                placeholder="事件说明"
                              />
                            ) : (
                              event.description
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              {editingEvent === event.id ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingEvent(null)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingEvent(event.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 校验规则 */}
            <TabsContent value="validation" className="space-y-4 p-6 pt-0 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">校验规则</h3>
                <Button onClick={handleAddValidationRule} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  添加校验
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>规则类型</TableHead>
                        <TableHead>规则说明</TableHead>
                        <TableHead>校验策略</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationRules.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell>
                            {editingRule === rule.id ? (
                              <Select
                                value={rule.ruleType}
                                onValueChange={(value) => handleUpdateValidationRule(rule.id, { ruleType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="权限校验">权限校验</SelectItem>
                                  <SelectItem value="数据校验">数据校验</SelectItem>
                                  <SelectItem value="业务校验">业务校验</SelectItem>
                                  <SelectItem value="时间校验">时间校验</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              rule.ruleType
                            )}
                          </TableCell>
                          <TableCell>
                            {editingRule === rule.id ? (
                              <Input
                                value={rule.description}
                                onChange={(e) => handleUpdateValidationRule(rule.id, { description: e.target.value })}
                                placeholder="规则说明"
                              />
                            ) : (
                              rule.description
                            )}
                          </TableCell>
                          <TableCell>
                            {editingRule === rule.id ? (
                              <Select
                                value={rule.strategy}
                                onValueChange={(value) => handleUpdateValidationRule(rule.id, { strategy: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="拒绝">拒绝</SelectItem>
                                  <SelectItem value="警告">警告</SelectItem>
                                  <SelectItem value="提示">提示</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              rule.strategy
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              {editingRule === rule.id ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingRule(null)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingRule(rule.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteValidationRule(rule.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : "保存"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
} 