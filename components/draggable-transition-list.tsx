"use client"

import React from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Edit2, Trash2, GripVertical } from "lucide-react"

interface WorkflowTransition {
  id: string
  fromStateId: string
  toStateId: string
  name: string
  description?: string
  condition?: string
  requiredRole?: string
}

interface WorkflowState {
  id: string
  name: string
  type: "start" | "progress" | "end"
  color: string
  description?: string
  isDefault?: boolean
  order: number
}

interface DraggableTransitionListProps {
  transitions: WorkflowTransition[]
  states: WorkflowState[]
  onReorder: (newTransitions: WorkflowTransition[]) => void
  onEdit: (transition: WorkflowTransition) => void
  onDelete: (transitionId: string) => void
  getStateName: (stateId: string) => string
}

export function DraggableTransitionList({
  transitions,
  states,
  onReorder,
  onEdit,
  onDelete,
  getStateName
}: DraggableTransitionListProps) {
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(transitions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onReorder(items)
  }

  // 自定义拖拽克隆组件，解决样式问题
  const renderClone = (provided: any, snapshot: any, rubric: any) => {
    const transition = transitions[rubric.source.index]
    
    return (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        style={{
          ...provided.draggableProps.style,
          // 重要：覆盖默认的 transform，确保拖拽项跟随鼠标
          transform: provided.draggableProps.style?.transform || 'none',
        }}
        className="bg-white shadow-lg border-2 border-blue-300 rounded-lg"
      >
        <TransitionCard 
          transition={transition}
          getStateName={getStateName}
          onEdit={onEdit}
          onDelete={onDelete}
          isDragging={snapshot.isDragging}
          isClone={true}
        />
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable 
        droppableId="transitions"
        renderClone={renderClone}
      >
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
            style={{
              // 确保容器不会影响拖拽坐标
              position: 'static',
              transform: 'none',
            }}
          >
            {transitions.map((transition, index) => (
              <Draggable 
                key={transition.id} 
                draggableId={transition.id} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...provided.draggableProps.style,
                      // 重要：确保非拖拽状态下的正常定位
                      position: snapshot.isDragging ? 'fixed' : 'static',
                      zIndex: snapshot.isDragging ? 9999 : 'auto',
                      // 确保拖拽时的正确变换
                      transform: provided.draggableProps.style?.transform || 'none',
                    }}
                    className={`transition-all duration-200 ${
                      snapshot.isDragging 
                        ? 'rotate-2 shadow-2xl scale-105' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <TransitionCard 
                      transition={transition}
                      getStateName={getStateName}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDragging={snapshot.isDragging}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

// 转换卡片组件
interface TransitionCardProps {
  transition: WorkflowTransition
  getStateName: (stateId: string) => string
  onEdit: (transition: WorkflowTransition) => void
  onDelete: (transitionId: string) => void
  isDragging?: boolean
  isClone?: boolean
  dragHandleProps?: any
}

function TransitionCard({
  transition,
  getStateName,
  onEdit,
  onDelete,
  isDragging = false,
  isClone = false,
  dragHandleProps
}: TransitionCardProps) {
  return (
    <Card className={`
      ${isDragging ? 'bg-blue-50 border-blue-300' : 'bg-white'}
      ${isClone ? 'shadow-xl' : 'shadow-sm'}
      transition-all duration-200
    `}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* 拖拽手柄 */}
            <div 
              {...dragHandleProps}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing transition-colors"
              title="拖拽排序"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                {getStateName(transition.fromStateId)}
              </Badge>
              <ArrowRight className="h-4 w-4 text-blue-500" />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                {getStateName(transition.toStateId)}
              </Badge>
            </div>
            
            <div className="flex-1">
              <div className="font-medium text-gray-900">{transition.name}</div>
              {transition.description && (
                <p className="text-sm text-gray-600 mt-1">{transition.description}</p>
              )}
            </div>
          </div>
          
          {!isClone && (
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(transition)}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(transition.id)}
                className="hover:bg-red-50 hover:border-red-300 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}