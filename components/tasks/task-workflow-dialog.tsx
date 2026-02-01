"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContentNoTransform, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Plus, X, Edit2, ArrowRight, Save, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { StatusMatrix } from '@/components/workflow/StatusMatrix'
import { StateItem, StateMatrixConfig, StateType, WorkflowStateConfig, getSelectedStates } from '@/types/workflow-state'
import { TransitionEditDrawer } from './transition-edit-drawer'
import { DraggableTransitionList } from '@/components/draggable-transition-list'
import { getWorkflowConfig, getStateList } from "@/lib/api/workflow-state-api"
import { EnhancedWorkflowPreview } from './enhanced-workflow-preview'
import '@/styles/drag-drop.css'

interface Task {
  id: number
  name: string
}

interface WorkflowState {
  id: string
  name: string
  type: "start" | "progress" | "pause" | "end"
  color: string
  description?: string
  isDefault?: boolean
  order: number
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

interface TaskWorkflowDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskWorkflowDialog({ task, open, onOpenChange }: TaskWorkflowDialogProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("transitions")

  // 状态管理 - 由本组件作为唯一数据源
  const [rawStates, setRawStates] = useState<StateItem[]>([])
  const [matrixConfig, setMatrixConfig] = useState<StateMatrixConfig | null>(null)
  const [loadingStates, setLoadingStates] = useState(true)

  // 在弹窗打开时，从API加载数据
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoadingStates(true)
        console.log("TaskWorkflowDialog: 开始加载状态和配置数据...")
        try {
          const [stateResponse, configResponse] = await Promise.all([
            getStateList(),
            getWorkflowConfig()
          ])

          if (stateResponse.success && stateResponse.data) {
            const sortedStates = stateResponse.data.sort((a, b) => a.order - b.order)
            setRawStates(sortedStates)
            console.log("TaskWorkflowDialog: 状态列表加载成功", sortedStates)
          } else {
             console.error("TaskWorkflowDialog: 状态列表加载失败", stateResponse.message)
          }

          if (configResponse.success && configResponse.data) {
            setMatrixConfig(configResponse.data.matrix)
            console.log("TaskWorkflowDialog: 矩阵配置加载成功", configResponse.data.matrix)
          } else {
            console.error("TaskWorkflowDialog: 矩阵配置加载失败", configResponse.message)
          }
        } catch (error) {
          console.error("TaskWorkflowDialog: 加载数据时发生严重错误", error)
          toast({ title: "错误", description: "加载工作流数据失败", variant: "destructive" })
        } finally {
          setLoadingStates(false)
          console.log("TaskWorkflowDialog: 数据加载流程结束")
        }
      }
      fetchData()
    }
  }, [open, toast])

  // 组合并丰富状态信息 - 只包含被选择的状态
  const states = useMemo((): WorkflowState[] => {
    if (!matrixConfig) return []
    
    console.log("TaskWorkflowDialog: useMemo开始计算，依赖项变化", { rawStates, matrixConfig })

    // 获取所有被选择的状态ID，处理多选情况
    const selectedStateIds = new Set<string>()
    const typeMapping: { [stateId: string]: StateType } = {}
    
    for (const key in matrixConfig) {
      const type = key as StateType
      const selectedIds = getSelectedStates(matrixConfig, type)
      
      selectedIds.forEach(stateId => {
        selectedStateIds.add(stateId)
        typeMapping[stateId] = type
      })
    }
    
    // 只处理被选择的状态
    const result = rawStates
      .filter(state => selectedStateIds.has(state.id))
      .map(state => {
        const stateType = typeMapping[state.id]
        let mappedType: "start" | "progress" | "end" = 'progress'
        let stateColor = '#3B82F6' // 默认蓝色
        
        if (stateType === StateType.INITIAL) {
          mappedType = 'start'
          stateColor = '#10B981' // 绿色
        } else if (stateType === StateType.END) {
          mappedType = 'end'
          stateColor = '#EF4444' // 红色
        } else if (stateType === StateType.PAUSE) {
          mappedType = 'progress'
          stateColor = '#F59E0B' // 橙色
        }

        return {
          ...state,
          type: mappedType,
          color: stateColor
        }
      })
      .sort((a, b) => {
        // 按状态类型排序：start -> progress -> end
        const typeOrder = { start: 0, progress: 1, end: 2 }
        return typeOrder[a.type] - typeOrder[b.type]
      })
    
    console.log("TaskWorkflowDialog: useMemo计算完成，生成最终states:", result)
    return result
  }, [rawStates, matrixConfig])


  // 转换管理
  const [transitions, setTransitions] = useState<WorkflowTransition[]>([
    {
      id: "trans1",
      fromStateId: "state1",
      toStateId: "state2",
      name: "开始执行",
      description: "从开始状态转换到进行中",
    },
    {
      id: "trans2",
      fromStateId: "state2",
      toStateId: "state3",
      name: "完成任务",
      description: "从进行中转换到已完成",
    },
  ])

  // 新转换表单
  const [newTransition, setNewTransition] = useState<Partial<WorkflowTransition>>({
    fromStateId: "",
    toStateId: "",
    name: "",
    description: "",
  })

  const [editingTransition, setEditingTransition] = useState<WorkflowTransition | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // 筛选可用的起始状态 (不包含 'end' 类型)
  const getAvailableFromStates = () => {
    return states.filter(state => state.type !== 'end')
  }

  // 筛选可用的目标状态 (不包含 'start' 类型)
  const getAvailableToStates = () => {
    return states.filter(state => state.type !== 'start')
  }

  // 状态矩阵配置完成回调
  const handleStatusMatrixSave = (config: WorkflowStateConfig) => {
    console.log('状态矩阵配置已保存:', config)
    toast({
      title: "状态配置成功",
      description: "状态定义矩阵配置已更新",
    })
  }

  const handleStatusMatrixCancel = () => {
    console.log('用户取消了状态矩阵配置')
  }

  // 处理来自StatusMatrix的数据更新
  const handleConfigChange = (config: { states: StateItem[], matrix: StateMatrixConfig }) => {
    console.log("TaskWorkflowDialog: 接收到来自StatusMatrix的变更", config)
    setRawStates(config.states)
    setMatrixConfig(config.matrix)
  }

  // 添加转换
  const handleAddTransition = () => {
    if (!newTransition.fromStateId || !newTransition.toStateId || !newTransition.name) {
      toast({ title: "错误", description: "请填写完整的转换信息", variant: "destructive" })
      return
    }

    if (newTransition.fromStateId === newTransition.toStateId) {
      toast({ title: "错误", description: "起始状态和目标状态不能相同", variant: "destructive" })
      return
    }

    const transition: WorkflowTransition = {
      id: `trans_${Date.now()}`,
      fromStateId: newTransition.fromStateId!,
      toStateId: newTransition.toStateId!,
      name: newTransition.name!,
      description: newTransition.description,
    }

    setTransitions([...transitions, transition])
    setNewTransition({ fromStateId: "", toStateId: "", name: "", description: "" })
    
    toast({ title: "添加成功", description: "转换规则已添加" })
  }

  // 删除转换
  const handleDeleteTransition = (transitionId: string) => {
    setTransitions(transitions.filter(t => t.id !== transitionId))
    toast({ title: "删除成功", description: "转换规则已删除" })
  }

  // 更新转换
  const handleUpdateTransition = (updatedTransition: WorkflowTransition) => {
    setTransitions(transitions.map(t => t.id === updatedTransition.id ? updatedTransition : t))
    setIsDrawerOpen(false)
    setEditingTransition(null)
  }

  // 处理拖拽排序
  const handleTransitionReorder = (newTransitions: WorkflowTransition[]) => {
    setTransitions(newTransitions)
    toast({ title: "排序已更新", description: "转换规则顺序已重新排列" })
  }

  // 打开编辑抽屉
  const handleEditTransition = (transition: WorkflowTransition) => {
    setEditingTransition(transition)
    setIsDrawerOpen(true)
  }

  // 获取状态名称
  const getStateName = (stateId: string) => {
    return states.find(s => s.id === stateId)?.name || "未知状态"
  }

  // 保存工作流
  const handleSave = async () => {
    setSaving(true)
    try {
      const hasStartState = states.some(s => s.type === "start")
      const hasEndState = states.some(s => s.type === "end")
      if (!hasStartState) throw new Error("工作流必须包含至少一个开始状态")
      if (!hasEndState) throw new Error("工作流必须包含至少一个结束状态")
      
      // 构建要保存的工作流数据
      const workflowData = {
        taskId: task.id,
        taskName: task.name,
        states: states.map(state => ({
          id: state.id,
          name: state.name,
          type: state.type,
          color: state.color,
          description: state.description,
          isDefault: state.isDefault,
          order: state.order
        })),
        transitions: transitions.map(transition => ({
          id: transition.id,
          fromStateId: transition.fromStateId,
          toStateId: transition.toStateId,
          name: transition.name,
          description: transition.description,
          condition: transition.condition,
          requiredRole: transition.requiredRole
        })),
        matrixConfig: matrixConfig,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // TODO: 替换为实际的API调用
      // 目前使用Mock API，后续替换为真实API
      const { saveTaskWorkflow } = await import("@/lib/api/workflow-api")
      const mockResponse = await saveTaskWorkflow(workflowData)
      
      toast({ 
        title: "保存成功", 
        description: `工作流配置已保存 (工作流ID: ${mockResponse.data.workflowId})` 
      })
      onOpenChange(false)
    } catch (error) {
      console.error("保存工作流配置失败:", error)
      toast({ 
        title: "保存失败", 
        description: error instanceof Error ? error.message : "请重试", 
        variant: "destructive" 
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes dash {
          0% { stroke-dasharray: 0, 1000; }
          50% { stroke-dasharray: 100, 1000; }
          100% { stroke-dasharray: 0, 1000; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .workflow-node {
          animation: float 6s ease-in-out infinite;
        }
        
        .workflow-node:nth-child(2n) {
          animation-delay: -2s;
        }
        
        .workflow-node:nth-child(3n) {
          animation-delay: -4s;
        }
      `}</style>
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContentNoTransform className="sm:max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            事项内容 | {task.name} | 工作流配置
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="states">状态定义</TabsTrigger>
              <TabsTrigger value="transitions">转换规则</TabsTrigger>
              <TabsTrigger value="preview">流程预览</TabsTrigger>
            </TabsList>

            <TabsContent value="states" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="h-[60vh] bg-white rounded-lg">
                <StatusMatrix 
                  states={rawStates}
                  matrix={matrixConfig}
                  loading={loadingStates}
                  onCancel={handleStatusMatrixCancel}
                  onSave={handleStatusMatrixSave}
                  onConfigChange={handleConfigChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="transitions" className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* 添加新转换 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    添加转换规则
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>起始状态 *</Label>
                      <Select
                        value={newTransition.fromStateId}
                        onValueChange={(value) => setNewTransition({ ...newTransition, fromStateId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择起始状态" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableFromStates().map((state) => (
                            <SelectItem key={state.id} value={state.id}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>目标状态 *</Label>
                      <Select
                        value={newTransition.toStateId}
                        onValueChange={(value) => setNewTransition({ ...newTransition, toStateId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择目标状态" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableToStates().map((state) => (
                            <SelectItem key={state.id} value={state.id}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>转换名称 *</Label>
                      <Input
                        value={newTransition.name || ""}
                        onChange={(e) => setNewTransition({ ...newTransition, name: e.target.value })}
                        placeholder="请输入转换名称"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>转换描述</Label>
                    <Textarea
                      value={newTransition.description || ""}
                      onChange={(e) => setNewTransition({ ...newTransition, description: e.target.value })}
                      placeholder="请输入转换描述"
                    />
                  </div>
                  <Button onClick={handleAddTransition} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    添加转换
                  </Button>
                </CardContent>
              </Card>

              <Separator />

              {/* 转换列表 - 支持拖拽排序 */}
              <div className="space-y-3 drag-drop-container">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">转换规则</h3>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    拖拽 ⋮⋮ 图标可重新排序
                  </div>
                </div>
                
                {transitions.length > 0 ? (
                  <DraggableTransitionList
                    transitions={transitions}
                    states={states}
                    onReorder={handleTransitionReorder}
                    onEdit={handleEditTransition}
                    onDelete={handleDeleteTransition}
                    getStateName={getStateName}
                  />
                ) : (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="p-8 text-center">
                      <div className="text-gray-500">
                        <div className="text-4xl mb-2">📋</div>
                        <div className="text-lg font-medium mb-1">暂无转换规则</div>
                        <div className="text-sm">请先添加转换规则，然后可以通过拖拽进行排序</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 h-[60vh] overflow-hidden">
              <EnhancedWorkflowPreview 
                states={states}
                transitions={transitions}
                height={400}
                showFullscreen={true}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={saving}>
            {saving ? "保存中..." : "确定"}
          </Button>
        </div>
      </DialogContentNoTransform>
      
      {editingTransition && (
        <TransitionEditDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          transition={editingTransition}
          states={states}
          onSave={handleUpdateTransition}
        />
      )}
    </Dialog>
    </>
  )
}
