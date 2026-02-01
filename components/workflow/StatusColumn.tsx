import React from 'react'
import { Checkbox, Button, Tooltip, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Draggable } from '@hello-pangea/dnd'

import { StateItem, StateType, StateMatrixConfig, isStateSelected, isMultiSelectType, STATE_TYPE_CONFIG } from '@/types/workflow-state'

interface StatusColumnProps {
  state: StateItem                                    // 状态数据
  index: number                                       // 在数组中的索引
  matrix: StateMatrixConfig                          // 状态矩阵配置
  onMatrixChange: (type: StateType, stateId: string | null, checked: boolean) => void // 矩阵变更回调
  onStateNameChange: (stateId: string, name: string) => void        // 状态名称变更回调
  onDeleteState?: (stateId: string) => void          // 删除状态回调
  isDragDisabled?: boolean                           // 是否禁用拖拽
}

/**
 * 状态列组件
 * 
 * 功能：
 * 1. 显示状态名称（支持编辑）
 * 2. 显示4行Radio选项
 * 3. 支持拖拽排序
 * 4. 响应式设计
 */
export const StatusColumn: React.FC<StatusColumnProps> = ({
  state,
  index,
  matrix,
  onMatrixChange,
  onStateNameChange,
  onDeleteState,
  isDragDisabled = false
}) => {

  // 状态类型数组 - 按新顺序排列
  const stateTypes = [StateType.INITIAL, StateType.PROGRESS, StateType.PAUSE, StateType.END]

  // 处理删除状态 - 完全隔离的事件处理
  const handleDeleteState = (e: React.MouseEvent) => {
    // 严格阻止所有事件传播和默认行为
    e.stopPropagation()
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    
    // 确保只执行删除操作
    if (onDeleteState) {
      onDeleteState(state.id)
    }
  }

  // 处理删除确认 - 完全隔离的事件处理
  const handleDeleteConfirm = (e?: React.MouseEvent) => {
    // 严格阻止所有事件传播和默认行为
    e?.stopPropagation()
    e?.preventDefault()
    e?.nativeEvent.stopImmediatePropagation()
    
    // 确保只执行删除操作
    if (onDeleteState) {
      onDeleteState(state.id)
    }
  }

  // 处理删除取消 - 完全隔离的事件处理
  const handleDeleteCancel = (e?: React.MouseEvent) => {
    // 严格阻止所有事件传播和默认行为
    e?.stopPropagation()
    e?.preventDefault()
    e?.nativeEvent.stopImmediatePropagation()
  }

  return (
    <Draggable
        draggableId={state.id}
        index={index}
        isDragDisabled={isDragDisabled}
      >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            min-w-[120px] border-r border-gray-200 last:border-r-0 group status-matrix-table
            ${snapshot.isDragging 
              ? 'status-column-dragging' 
              : 'bg-white'
            }
            ${isDragDisabled ? '' : 'hover:bg-gray-50'}
            transition-all duration-200
          `}
          style={{
            ...provided.draggableProps.style,
            ...(snapshot.isDragging && {
              position: 'fixed',
              zIndex: 1000,
              transform: provided.draggableProps.style?.transform || 'none',
            })
          }}
        >
          {/* 状态名称头部 */}
          <div className="h-12 px-3 flex items-center justify-between border-b border-gray-200 bg-gray-50 relative">
            {/* 拖拽手柄区域 */}
            <div 
              {...provided.dragHandleProps}
              className={`
                absolute inset-0 flex items-center justify-center
                ${isDragDisabled ? '' : 'cursor-grab hover:bg-gray-100 active:cursor-grabbing'}
              `}
            >
              <Tooltip title={state.description || state.name} placement="top">
                <div className="text-sm font-medium text-gray-700 truncate text-center cursor-default">
                  {state.name}
                </div>
              </Tooltip>
            </div>
            
            {/* 删除按钮区域 - 不受拖拽手柄影响 */}
            <div className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              {onDeleteState && (
                <Popconfirm
                  title="删除状态"
                  description="确定要删除这个状态吗？删除后将清除相关配置。"
                  onConfirm={handleDeleteConfirm}
                  onCancel={handleDeleteCancel}
                  okText="确定"
                  cancelText="取消"
                  placement="top"
                  overlayStyle={{ zIndex: 9999 }}
                  // 确保Popconfirm不会触发任何外部事件
                  onVisibleChange={(visible) => {
                    // 阻止任何可能的副作用
                  }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    className="text-gray-400 hover:text-red-500"
                    onClick={handleDeleteState}
                    // 确保按钮不会触发任何外部事件
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                  />
                </Popconfirm>
              )}
            </div>
          </div>

          {/* Checkbox/Radio选项列表 - 支持部分多选/单选 */}
          <div className="flex flex-col">
            {stateTypes.map((type) => {
              const isSelected = isStateSelected(matrix, type, state.id)
              const config = STATE_TYPE_CONFIG[type]
              const isMulti = isMultiSelectType(type)
              
              return (
                <div
                  key={type}
                  className={`h-12 px-3 flex items-center justify-center border-b border-gray-100 last:border-b-0 transition-colors
                    ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        onMatrixChange(type, state.id, e.target.checked)
                      }}
                      className="w-full flex justify-center"
                      aria-label={`选择 ${state.name} 作为 ${config.label}`}
                    />
                    {isMulti && (
                      <div className="text-xs text-gray-500">多选</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      </Draggable>
  )
} 