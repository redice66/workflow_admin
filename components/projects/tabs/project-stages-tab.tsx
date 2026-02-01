"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, GripVertical, Pencil, Trash2, ChevronDown, ChevronRight, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { type Project, type ProjectStage, getProjectStages } from "@/lib/api/projects-api"
import { type Task, getTasks } from "@/lib/api/task-api"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface ProjectStagesTabProps {
  project: Project
}

interface StageWithTasks extends ProjectStage {
  tasks: Task[]
  isExpanded?: boolean
}

export function ProjectStagesTab({ project }: ProjectStagesTabProps) {
  const [stages, setStages] = useState<StageWithTasks[]>([])
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const { toast } = useToast()

  // 弹窗状态
  const [isAddStageDialogOpen, setIsAddStageDialogOpen] = useState(false)
  const [isEditStageDialogOpen, setIsEditStageDialogOpen] = useState(false)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<StageWithTasks | null>(null)
  const [selectedStageForTask, setSelectedStageForTask] = useState<StageWithTasks | null>(null)
  
  // 表单状态
  const [newStageName, setNewStageName] = useState("")
  const [editingStageName, setEditingStageName] = useState("")
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")

  const fetchStages = async () => {
    setLoading(true)
    try {
      const response = await getProjectStages(project.id)
      if (response.success && response.data) {
        // 为每个阶段添加任务数组和展开状态
        const stagesWithTasks: StageWithTasks[] = response.data.map(stage => ({
          ...stage,
          tasks: [],
          isExpanded: false
        }))
        setStages(stagesWithTasks)
      } else {
        toast({
          title: "获取阶段列表失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "获取阶段列表失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTasks = async () => {
    setLoadingTasks(true)
    try {
      const response = await getTasks()
      if (response.success && response.data) {
        setTasks(response.data)
      } else {
        toast({
          title: "获取事项列表失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "获取事项列表失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setLoadingTasks(false)
    }
  }

  useEffect(() => {
    fetchStages()
    fetchTasks()
  }, [project.id])

  // 新增阶段
  const handleAddStage = () => {
    if (!newStageName.trim()) {
      toast({
        title: "请输入阶段名称",
        description: "阶段名称不能为空",
        variant: "destructive",
      })
      return
    }

    const newStage: StageWithTasks = {
      id: `stage_${Date.now()}`,
      projectId: project.id,
      name: newStageName.trim(),
      displayName: newStageName.trim(),
      sortOrder: stages.length + 1,
      createdAt: new Date().toLocaleString("zh-CN"),
      updatedAt: new Date().toLocaleString("zh-CN"),
      tasks: [],
      isExpanded: false
    }

    setStages([...stages, newStage])
    setNewStageName("")
    setIsAddStageDialogOpen(false)
    
    toast({
      title: "阶段创建成功",
      description: `已创建阶段：${newStageName}`,
    })
  }

  // 编辑阶段
  const handleEditStage = () => {
    if (!editingStage || !editingStageName.trim()) {
      toast({
        title: "请输入阶段名称",
        description: "阶段名称不能为空",
        variant: "destructive",
      })
      return
    }

    setStages(stages.map(stage => 
      stage.id === editingStage.id 
        ? { ...stage, name: editingStageName.trim(), displayName: editingStageName.trim() }
        : stage
    ))
    
    setEditingStageName("")
    setEditingStage(null)
    setIsEditStageDialogOpen(false)
    
    toast({
      title: "阶段更新成功",
      description: `已更新阶段名称：${editingStageName}`,
    })
  }

  // 添加事项到阶段
  const handleAddTaskToStage = () => {
    if (!selectedStageForTask || !selectedTaskId) {
      toast({
        title: "请选择事项",
        description: "请选择要添加到阶段的事项",
        variant: "destructive",
      })
      return
    }

    const selectedTask = tasks.find(task => task.id.toString() === selectedTaskId)
    if (!selectedTask) {
      toast({
        title: "事项不存在",
        description: "选择的事项不存在",
        variant: "destructive",
      })
      return
    }

    // 检查事项是否已经添加到其他阶段
    const isTaskAlreadyAdded = stages.some(stage => 
      stage.tasks.some(task => task.id === selectedTask.id)
    )

    if (isTaskAlreadyAdded) {
      toast({
        title: "事项已存在",
        description: "该事项已经添加到其他阶段",
        variant: "destructive",
      })
      return
    }

    setStages(stages.map(stage => 
      stage.id === selectedStageForTask.id 
        ? { ...stage, tasks: [...stage.tasks, selectedTask] }
        : stage
    ))
    
    setSelectedTaskId("")
    setSelectedStageForTask(null)
    setIsAddTaskDialogOpen(false)
    
    toast({
      title: "事项添加成功",
      description: `已将"${selectedTask.displayName}"添加到"${selectedStageForTask.displayName}"阶段`,
    })
  }

  // 删除阶段
  const handleDeleteStage = (stageId: string) => {
    const stageToDelete = stages.find(stage => stage.id === stageId)
    if (!stageToDelete) return

    if (stageToDelete.tasks.length > 0) {
      toast({
        title: "无法删除阶段",
        description: "该阶段下还有事项，请先移除所有事项",
        variant: "destructive",
      })
      return
    }

    setStages(stages.filter(stage => stage.id !== stageId))
    
    toast({
      title: "阶段删除成功",
      description: `已删除阶段：${stageToDelete.displayName}`,
    })
  }

  // 删除事项
  const handleDeleteTask = (stageId: string, taskId: number) => {
    setStages(stages.map(stage => 
      stage.id === stageId 
        ? { ...stage, tasks: stage.tasks.filter(task => task.id !== taskId) }
        : stage
    ))
    
    toast({
      title: "事项移除成功",
      description: "已从阶段中移除该事项",
    })
  }

  // 切换展开/收起状态
  const toggleStageExpansion = (stageId: string) => {
    setStages(stages.map(stage => 
      stage.id === stageId 
        ? { ...stage, isExpanded: !stage.isExpanded }
        : stage
    ))
  }

  // 打开编辑弹窗
  const openEditDialog = (stage: StageWithTasks) => {
    setEditingStage(stage)
    setEditingStageName(stage.name)
    setIsEditStageDialogOpen(true)
  }

  // 打开添加事项弹窗
  const openAddTaskDialog = (stage: StageWithTasks) => {
    setSelectedStageForTask(stage)
    setSelectedTaskId("")
    setIsAddTaskDialogOpen(true)
  }

  // 处理拖拽结束事件
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === 'stage') {
      // 拖拽阶段
      const items = Array.from(stages)
      const [reorderedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, reorderedItem)

      // 更新阶段顺序
      const reorderedStages = items.map((stage, index) => ({
        ...stage,
        sortOrder: index + 1
      }))

      setStages(reorderedStages)
      toast({
        title: "阶段顺序已更新",
        description: '阶段排序已调整',
      })
    } else if (type === 'task') {
      // 拖拽事项
      const sourceStageId = source.droppableId
      const destStageId = destination.droppableId

      if (sourceStageId === destStageId) {
        // 同一阶段内重新排序
        const stage = stages.find(s => s.id === sourceStageId)
        if (!stage) return

        const items = Array.from(stage.tasks)
        const [reorderedItem] = items.splice(source.index, 1)
        items.splice(destination.index, 0, reorderedItem)

        setStages(stages.map(s => 
          s.id === sourceStageId 
            ? { ...s, tasks: items }
            : s
        ))
      } else {
        // 跨阶段移动事项
        const sourceStage = stages.find(s => s.id === sourceStageId)
        const destStage = stages.find(s => s.id === destStageId)
        
        if (!sourceStage || !destStage) return

        const sourceTasks = Array.from(sourceStage.tasks)
        const destTasks = Array.from(destStage.tasks)
        const [movedTask] = sourceTasks.splice(source.index, 1)
        destTasks.splice(destination.index, 0, movedTask)

        setStages(stages.map(s => {
          if (s.id === sourceStageId) {
            return { ...s, tasks: sourceTasks }
          } else if (s.id === destStageId) {
            return { ...s, tasks: destTasks }
          }
          return s
        }))

        toast({
          title: "事项移动成功",
          description: `已将"${movedTask.displayName}"从"${sourceStage.displayName}"移动到"${destStage.displayName}"`,
        })
      }
    }
  }

  // 阶段拖拽克隆渲染
  const renderStageClone = (provided: any, snapshot: any, rubric: any) => {
    const stage = stages[rubric.source.index]
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className="border rounded-lg overflow-hidden shadow-2xl bg-white border-blue-400 ring-2 ring-blue-400 ring-offset-2"
      >
        <div className="flex items-center gap-4 p-4 bg-gray-50">
          <div {...provided.dragHandleProps} className="flex-shrink-0">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="flex-shrink-0">阶段 {rubric.source.index + 1}</Badge>
              <h4 className="font-medium truncate">{stage?.displayName}</h4>
              {stage?.tasks.length > 0 && (
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {stage.tasks.length} 个事项
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">阶段名称: {stage?.name}</p>
          </div>
        </div>
      </div>
    )
  }

  // 事项拖拽克隆渲染
  const renderTaskClone = (provided: any, snapshot: any, rubric: any) => {
    const stage = stages.find(s => s.id === rubric.source.droppableId)
    const task = stage?.tasks[rubric.source.index]
    
    if (!task) return null
    
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className="flex items-center gap-4 p-4 border shadow-lg bg-blue-50 border-blue-200 transform scale-105"
      >
        <div {...provided.dragHandleProps} className="flex-shrink-0">
          <div className="w-4 h-4 border-l-2 border-b-2 border-gray-300 ml-4"></div>
        </div>
        <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className="font-medium text-sm truncate">{task.displayName}</h5>
            <Badge 
              variant={task.status === "active" ? "default" : "secondary"}
              className={`text-xs flex-shrink-0 ${
                task.status === "active" ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              {task.status === "active" ? "启用" : "停用"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">{task.description}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">事项阶段管理</h3>
        <Button onClick={() => setIsAddStageDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新增阶段
        </Button>
      </div>

      {/* 阶段列表容器 */}
      <div className="border rounded-lg p-4 bg-white">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="stages" type="stage" renderClone={renderStageClone}>
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className={`space-y-4 transition-colors duration-200 ${
                  snapshot.isDraggingOver ? 'bg-blue-50/50 rounded-lg p-2' : ''
                }`}
                style={{ minHeight: '200px' }}
              >
                {stages.length === 0 ? (
                  <div className="text-center py-10 border rounded-lg">
                    <p className="text-muted-foreground">暂无阶段数据</p>
                  </div>
                ) : (
                  stages.map((stage, index) => (
                    <Draggable key={stage.id} draggableId={stage.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                            snapshot.isDragging 
                              ? 'opacity-95 shadow-2xl bg-white border-blue-400 ring-2 ring-blue-400 ring-offset-2' 
                              : 'bg-white hover:shadow-md'
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          {/* 阶段头部 */}
                          <div className="flex items-center gap-4 p-4 bg-gray-50">
                            <div {...provided.dragHandleProps} className="flex-shrink-0">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing hover:text-gray-600 transition-colors" />
                            </div>
                            
                            <div className="flex-1 space-y-2 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="flex-shrink-0">阶段 {index + 1}</Badge>
                                <h4 className="font-medium truncate">{stage.displayName}</h4>
                                {stage.tasks.length > 0 && (
                                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                                    {stage.tasks.length} 个事项
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">阶段名称: {stage.name}</p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openAddTaskDialog(stage)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                添加事项
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditDialog(stage)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {stage.tasks.length > 0 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => toggleStageExpansion(stage.id)}
                                >
                                  {stage.isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive"
                                onClick={() => handleDeleteStage(stage.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* 事项列表（树形展示） */}
                          {stage.isExpanded && stage.tasks.length > 0 && (
                            <div className="border-t bg-white">
                              <Droppable droppableId={stage.id} type="task" renderClone={renderTaskClone}>
                                {(provided, snapshot) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`transition-colors duration-200 ${
                                      snapshot.isDraggingOver ? 'bg-blue-50/30' : ''
                                    }`}
                                  >
                                    {stage.tasks.map((task, taskIndex) => (
                                      <Draggable key={task.id} draggableId={`task-${task.id}`} index={taskIndex}>
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`flex items-center gap-4 p-4 border-b last:border-b-0 transition-all duration-200 ${
                                              snapshot.isDragging 
                                                ? 'opacity-90 shadow-lg bg-blue-50 border-blue-200 transform scale-105' 
                                                : 'hover:bg-gray-50'
                                            }`}
                                            style={{
                                              ...provided.draggableProps.style,
                                            }}
                                          >
                                            <div {...provided.dragHandleProps} className="flex-shrink-0">
                                              <div className="w-4 h-4 border-l-2 border-b-2 border-gray-300 ml-4 cursor-grab active:cursor-grabbing hover:border-gray-400 transition-colors"></div>
                                            </div>
                                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                            
                                            <div className="flex-1 space-y-1 min-w-0">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <h5 className="font-medium text-sm truncate">{task.displayName}</h5>
                                                <Badge 
                                                  variant={task.status === "active" ? "default" : "secondary"}
                                                  className={`text-xs flex-shrink-0 ${
                                                    task.status === "active" ? "bg-green-500" : "bg-gray-500"
                                                  }`}
                                                >
                                                  {task.status === "active" ? "启用" : "停用"}
                                                </Badge>
                                              </div>
                                              <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                                            </div>

                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="text-destructive flex-shrink-0"
                                              onClick={() => handleDeleteTask(stage.id, task.id)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* 提示信息 */}
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        <p>• 可以通过拖拽左侧的图标来调整阶段顺序</p>
        <p>• 每个阶段支持重命名、顺序调整</p>
        <p>• 可新增多个阶段，阶段顺序将影响项目流程</p>
        <p>• 点击收起按钮可以展开/收起阶段下的事项列表</p>
        <p>• 支持拖拽事项在阶段内重新排序或跨阶段移动</p>
      </div>

      {/* 新增阶段弹窗 */}
      <Dialog open={isAddStageDialogOpen} onOpenChange={setIsAddStageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新增阶段</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="stageName">阶段名称</Label>
                <Input
                  id="stageName"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="请输入阶段名称"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStageDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddStage}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑阶段弹窗 */}
      <Dialog open={isEditStageDialogOpen} onOpenChange={setIsEditStageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑阶段</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="editStageName">阶段名称</Label>
                <Input
                  id="editStageName"
                  value={editingStageName}
                  onChange={(e) => setEditingStageName(e.target.value)}
                  placeholder="请输入阶段名称"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStageDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEditStage}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加事项弹窗 */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加事项到阶段</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="taskSelect">选择事项</Label>
                <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="请选择要添加的事项" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{task.displayName}</span>
                          <span className="text-xs text-muted-foreground">{task.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddTaskToStage}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 