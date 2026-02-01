"use client"

import React from 'react'
import { createPortal } from 'react-dom'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

// 高级拖拽配置，解决 fixed 定位和复杂布局问题
interface AdvancedDragDropProps {
  children: React.ReactNode
  droppableId: string
  onDragEnd: (result: DropResult) => void
  className?: string
}

export function AdvancedDragDropProvider({ 
  children, 
  droppableId, 
  onDragEnd,
  className = ""
}: AdvancedDragDropProps) {
  
  // 自定义拖拽门户 - 解决 fixed 定位问题
  const dragPortal = typeof window !== 'undefined' 
    ? document.getElementById('drag-portal') || createDragPortal()
    : null

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${className} relative`}
            style={{
              // 确保容器不影响拖拽坐标
              position: 'static',
              transform: 'none',
              overflow: snapshot.isDraggingOver ? 'visible' : 'auto',
            }}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

// 创建拖拽门户容器
function createDragPortal(): HTMLElement {
  let portal = document.getElementById('drag-portal')
  if (!portal) {
    portal = document.createElement('div')
    portal.id = 'drag-portal'
    portal.className = 'drag-portal-container'
    portal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      pointer-events: none;
    `
    document.body.appendChild(portal)
  }
  return portal
}

// 高级 Draggable 包装器
interface AdvancedDraggableProps {
  children: (provided: any, snapshot: any) => React.ReactNode
  draggableId: string
  index: number
  isDragDisabled?: boolean
}

export function AdvancedDraggable({ 
  children, 
  draggableId, 
  index, 
  isDragDisabled = false 
}: AdvancedDraggableProps) {
  return (
    <Draggable 
      draggableId={draggableId} 
      index={index} 
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => {
        const style = provided.draggableProps.style
        
        // 修复拖拽时的定位问题
        const fixedStyle = snapshot.isDragging ? {
          ...style,
          position: 'fixed' as const,
          top: (style as any)?.top || 0,
          left: (style as any)?.left || 0,
          zIndex: 9999,
          transform: style?.transform || 'none',
        } : style
        
        const child = children(
          {
            ...provided,
            draggableProps: {
              ...provided.draggableProps,
              style: fixedStyle,
            },
          },
          snapshot
        )
        
        // 如果正在拖拽，使用门户渲染
        if (snapshot.isDragging && typeof window !== 'undefined') {
          const portal = document.getElementById('drag-portal')
          if (portal) {
            return createPortal(child, portal)
          }
        }
        
        return child
      }}
    </Draggable>
  )
}

// 拖拽工具函数
export const dragUtils = {
  // 重新排序数组
  reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  },

  // 在不同列表间移动项目
  move<T>(
    source: T[],
    destination: T[],
    droppableSource: { index: number; droppableId: string },
    droppableDestination: { index: number; droppableId: string }
  ) {
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const [removed] = sourceClone.splice(droppableSource.index, 1)

    destClone.splice(droppableDestination.index, 0, removed)

    return {
      [droppableSource.droppableId]: sourceClone,
      [droppableDestination.droppableId]: destClone,
    }
  },
  
  // 获取拖拽项的样式
  getDragItemStyle: (isDragging: boolean, draggableStyle: any) => ({
    // 基础样式
    userSelect: 'none' as const,
    padding: '0',
    margin: '0',
    
    // 拖拽时的特殊样式
    ...(isDragging && {
      transform: 'rotate(2deg)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
    }),
    
    // 应用拖拽库的样式
    ...draggableStyle,
  }),
  
  // 获取拖拽区域的样式
  getDroppableStyle: (isDraggingOver: boolean) => ({
    transition: 'all 0.2s ease',
    ...(isDraggingOver && {
      backgroundColor: '#f0f9ff',
      borderColor: '#3b82f6',
    }),
  }),
}