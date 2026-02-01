import React, { useState, useEffect } from 'react'
import { Button, Card, Space, Spin, Typography } from 'antd'
import { PlusOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { StatusColumn } from './StatusColumn'
import { AddStateModal } from './AddStateModal'

import { 
  StateItem, 
  StateType, 
  StateMatrixConfig, 
  WorkflowStateConfig,
  AddStateFormData,
  STATE_TYPE_CONFIG,
  isMultiSelectType,
  isStateSelected
} from '@/types/workflow-state'
import {
  getStateList,
  addState,
  updateStateName,
  getWorkflowConfig,
  saveWorkflowConfig,
  getAvailableStates,
  deleteState
} from '@/lib/api/workflow-state-api'
import { useToast } from '@/components/ui/use-toast'

const { Title, Text } = Typography

interface StatusMatrixProps {
  states: StateItem[] // 直接接收状态列表
  matrix: StateMatrixConfig | null // 直接接收矩阵配置
  loading?: boolean // 外部控制的加载状态
  onCancel?: () => void     // 取消回调
  onSave?: (config: WorkflowStateConfig) => void // 保存回调
  onConfigChange?: (config: { states: StateItem[], matrix: StateMatrixConfig }) => void // 统一配置变更回调
}

/**
 * 状态矩阵主组件
 * 
 * 功能：
 * 1. 状态定义矩阵表格展示
 * 2. 支持拖拽排序
 * 3. 添加状态功能
 * 4. 状态名称编辑
 * 5. 保存/取消操作
 */
export const StatusMatrix: React.FC<StatusMatrixProps> = ({
  states = [],
  matrix = null,
  loading: externalLoading = true,
  onCancel,
  onSave,
  onConfigChange
}) => {
  const { toast } = useToast()
  
  const [saving, setSaving] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [addLoading, setAddLoading] = useState(false)

  const currentMatrix = matrix || {
    [StateType.INITIAL]: null,
    [StateType.PROGRESS]: null,
    [StateType.END]: null,
    [StateType.PAUSE]: null
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result
    if (!destination || destination.index === source.index) return

    const newStates = Array.from(states)
    const [removed] = newStates.splice(source.index, 1)
    newStates.splice(destination.index, 0, removed)

    const updatedStates = newStates.map((state, index) => ({
      ...state,
      order: index
    }))

    onConfigChange?.({ states: updatedStates, matrix: currentMatrix })
  }

  const handleMatrixChange = (type: StateType, stateId: string | null, checked: boolean) => {
    const newMatrix = { ...currentMatrix }
    
    if (stateId === null) return
    
    if (isMultiSelectType(type)) {
      // 多选类型（PROGRESS, PAUSE）
      const currentValue = newMatrix[type] as string[] | null
      const currentSelection = currentValue || []
      
      if (checked) {
        // 添加到选择列表
        newMatrix[type] = [...currentSelection, stateId] as any
      } else {
        // 从选择列表中移除
        newMatrix[type] = currentSelection.filter(id => id !== stateId) as any
        if ((newMatrix[type] as string[]).length === 0) {
          newMatrix[type] = null
        }
      }
    } else {
      // 单选类型（INITIAL, END）
      if (checked) {
        // 单选：直接设置
        newMatrix[type] = stateId as any
      } else {
        // 取消选中：清除选择
        if (newMatrix[type] === stateId) {
          newMatrix[type] = null
        }
      }
    }
    
    onConfigChange?.({ states: states, matrix: newMatrix })
  }

  const handleStateNameChange = async (stateId: string, name: string) => {
    try {
      const response = await updateStateName(stateId, name)
      if (response.success && response.data) {
        const updatedStates = response.data.sort((a:StateItem, b:StateItem) => a.order - b.order)
        onConfigChange?.({ states: updatedStates, matrix: currentMatrix })
        toast({ title: "成功", description: "状态名称更新成功" })
      } else {
        toast({ title: "错误", description: response.message || "状态名称更新失败", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "错误", description: "状态名称更新失败", variant: "destructive" })
    }
  }

  const handleDeleteState = async (stateId: string) => {
    const updatedStates = states.filter(state => state.id !== stateId)
    
    const newMatrix = { ...currentMatrix }
    Object.keys(newMatrix).forEach(key => {
      const type = key as StateType
      if (isMultiSelectType(type)) {
        // 多选类型：从数组中移除
        const currentValue = newMatrix[type] as string[] | null
        if (currentValue && currentValue.includes(stateId)) {
          const filtered = currentValue.filter(id => id !== stateId)
          newMatrix[type] = filtered.length > 0 ? filtered as any : null
        }
      } else {
        // 单选类型：直接比较并清除
        if (newMatrix[type] === stateId) {
          newMatrix[type] = null
        }
      }
    })
    
    toast({ title: "成功", description: "状态删除成功" })
    onConfigChange?.({ states: updatedStates, matrix: newMatrix })
    
    try {
      await deleteState(stateId)
    } catch (apiError) {
      console.error('API删除失败，但UI已更新:', apiError)
    }
  }

  // 处理添加状态
  const handleAddState = async (stateIds: string[]) => {
    setAddLoading(true)
    try {
      // TODO: 调用API将选中的状态添加到当前工作流配置
      // const response = await addStatesToWorkflow(stateIds)
      
      // 临时实现：从可用状态中获取选中的状态并添加到当前列表
      const response = await getAvailableStates()
      if (response.success && response.data) {
        const selectedStates = response.data.filter((state: StateItem) => stateIds.includes(state.id))
        const newStates = [
          ...states,
          ...selectedStates.map((state: StateItem, index: number) => ({
            ...state,
            order: states.length + index
          }))
        ]
        onConfigChange?.({ states: newStates.sort((a, b) => a.order - b.order), matrix: currentMatrix })
        setAddModalVisible(false)
        toast({ title: "成功", description: "状态添加成功" })
      } else {
        throw new Error(response.message || '添加状态失败')
      }
    } catch (error) {
      throw error
    } finally {
      setAddLoading(false)
    }
  }

  // 处理保存
  const handleSave = async () => {
    setSaving(true)
    try {
      // 验证矩阵配置
      const hasInitial = currentMatrix[StateType.INITIAL] !== null
      const hasEnd = currentMatrix[StateType.END] !== null

      if (!hasInitial) {
        toast({ title: "警告", description: "请至少选择一个初始状态", variant: "destructive" })
        return
      }

      if (!hasEnd) {
        toast({ title: "警告", description: "请至少选择一个结束状态", variant: "destructive" })
        return
      }

      // 保存配置
      const response = await saveWorkflowConfig({
        states,
        matrix: currentMatrix,
        name: '工作流状态配置',
        description: '用户配置的工作流状态矩阵'
      })

      if (response.success && response.data) {
        toast({ title: "成功", description: "保存成功" })
        onSave?.(response.data)
      } else {
        toast({ title: "错误", description: response.message || "保存失败", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "错误", description: "保存失败", variant: "destructive" })
      console.error('保存失败:', error)
    } finally {
      setSaving(false)
    }
  }

  // 获取选中状态的统计信息
  const getSelectedStatesInfo = () => {
    let totalCount = 0
    
    const initialCount = currentMatrix[StateType.INITIAL] ? 1 : 0
    const progressCount = Array.isArray(currentMatrix[StateType.PROGRESS]) 
      ? (currentMatrix[StateType.PROGRESS] as string[]).length 
      : (currentMatrix[StateType.PROGRESS] ? 1 : 0)
    const endCount = currentMatrix[StateType.END] ? 1 : 0
    const pauseCount = Array.isArray(currentMatrix[StateType.PAUSE])
      ? (currentMatrix[StateType.PAUSE] as string[]).length
      : (currentMatrix[StateType.PAUSE] ? 1 : 0)
    
    totalCount = initialCount + progressCount + endCount + pauseCount
    
    return {
      total: totalCount,
      initial: initialCount,
      progress: progressCount,
      end: endCount,
      pause: pauseCount
    }
  }

  const selectedInfo = getSelectedStatesInfo()

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 头部 */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={3} className="mb-2">状态定义配置</Title>
            <Text type="secondary">
              配置工作流的状态矩阵：初始状态为单选，进行中和暂停状态为多选，结束状态为单选
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
            disabled={externalLoading || saving}
          >
            添加状态
          </Button>
        </div>

        {/* 配置统计 */}
        <div className="flex items-center gap-6 text-sm">
          <span>总状态数: <strong>{states.length}</strong></span>
          <span>已配置: <strong>{selectedInfo.total}/4</strong></span>
          <div className="flex gap-4">
            {[StateType.INITIAL, StateType.PROGRESS, StateType.PAUSE, StateType.END].map((type) => {
              const config = STATE_TYPE_CONFIG[type]
              const hasSelection = isMultiSelectType(type) 
                ? (Array.isArray(currentMatrix[type]) && (currentMatrix[type] as string[]).length > 0)
                : currentMatrix[type] !== null
              
              return (
                <span key={type} style={{ color: config.color }}>
                  {config.label}: {hasSelection ? '✓' : '✗'}
                  {config.multiSelect && hasSelection && (
                    <span className="ml-1 text-xs">
                      ({Array.isArray(currentMatrix[type]) ? (currentMatrix[type] as string[]).length : 1})
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 p-6 overflow-hidden">
        <Card className="h-full">
          {externalLoading ? (
            <div className="h-full flex items-center justify-center">
              <Spin size="large" spinning={true}>
                <div className="h-32 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">加载状态数据中...</span>
                </div>
              </Spin>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* 表格头部 */}
              <div className="flex border border-gray-200 rounded-t-md status-matrix-table">
                {/* 行标签列 */}
                <div className="w-32 bg-gray-50 border-r border-gray-200">
                  <div className="h-12 flex items-center justify-center border-b border-gray-200 bg-gray-100">
                    <Text strong>状态类型</Text>
                  </div>
                  {[StateType.INITIAL, StateType.PROGRESS, StateType.PAUSE, StateType.END].map((type) => {
                    const config = STATE_TYPE_CONFIG[type]
                    return (
                      <div 
                        key={type}
                        className="h-12 flex items-center justify-center border-b border-gray-100 last:border-b-0 px-2"
                        style={{ backgroundColor: `${config.color}10` }}
                      >
                        <Text 
                          className="text-xs font-medium text-center"
                          style={{ color: config.color }}
                        >
                          {config.label}
                        </Text>
                      </div>
                    )
                  })}
                </div>

                {/* 状态列容器 */}
                <div className="flex-1 overflow-x-auto relative">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="states" direction="horizontal" renderClone={(provided, snapshot, rubric) => {
                      const state = states[rubric.source.index]
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="dragging-column-clone"
                          style={{
                            ...provided.draggableProps.style,
                            minWidth: '120px',
                            width: '120px',
                            backgroundColor: '#ffffff',
                            border: '2px solid #3b82f6',
                            borderRadius: '8px',
                            boxShadow: '0 12px 40px rgba(59, 130, 246, 0.25)',
                            zIndex: 1000,
                            position: 'fixed',
                            pointerEvents: 'none',
                            transform: provided.draggableProps.style?.transform || 'none',
                          }}
                        >
                          {/* 状态名称头部 - 修复布局 */}
                          <div className="h-12 px-3 flex items-center justify-center border-b border-blue-200 bg-blue-50">
                            <div className="text-sm font-semibold text-blue-700 truncate text-center w-full">
                              {state.name}
                            </div>
                          </div>
                          
                          {/* Radio选项列表 - 修复对齐 */}
                          <div className="flex flex-col">
                            {[StateType.INITIAL, StateType.PROGRESS, StateType.PAUSE, StateType.END].map((type) => (
                              <div
                                key={type}
                                className="h-12 px-3 flex items-center justify-center border-b border-gray-100 last:border-b-0 bg-white"
                              >
                                <div 
                                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                                    currentMatrix[type] === state.id 
                                      ? 'bg-blue-500 border-blue-500' 
                                      : 'bg-white border-gray-300'
                                  }`}
                                >
                                  {currentMatrix[type] === state.id && (
                                    <div className="w-2 h-2 bg-white"></div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex min-w-max relative"
                          style={{ position: 'relative' }}
                        >
                          {states.map((state, index) => (
                            <StatusColumn
                              key={state.id}
                              state={state}
                              index={index}
                              matrix={currentMatrix}
                              onMatrixChange={handleMatrixChange}
                              onStateNameChange={handleStateNameChange}
                              onDeleteState={handleDeleteState}
                              isDragDisabled={externalLoading || saving}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>

              {/* 空状态提示 */}
              {states.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-lg mb-2">暂无状态数据</div>
                    <div className="text-sm">点击右上角"添加状态"按钮开始配置</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* 添加状态Modal */}
      <AddStateModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSubmit={handleAddState}
        loading={addLoading}
        existingStateIds={states.map(state => state.id)}
      />
      </div>
  )
} 