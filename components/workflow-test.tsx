"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TaskWorkflowDialog } from '@/components/tasks/task-workflow-dialog'

// 测试组件 - 验证状态定义标签页的拖拽和选择修复
export function WorkflowTest() {
  const [open, setOpen] = useState(false)
  
  const mockTask = {
    id: 1,
    name: "测试任务 - 状态矩阵拖拽修复"
  }

  return (
    <div className="p-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">工作流状态矩阵测试</h1>
        <div className="space-y-2">
          <p className="text-gray-600">测试修复的功能：</p>
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
            <li>拖拽排序时所选列文字和单选框排列问题修复</li>
            <li>每行状态可以多选，每列只能单选的逻辑实现</li>
            <li>拖拽克隆样式优化，确保文字和复选框正确对齐</li>
          </ul>
        </div>
        
        <Button 
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          打开工作流配置对话框
        </Button>
      </div>

      <TaskWorkflowDialog
        task={mockTask}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}