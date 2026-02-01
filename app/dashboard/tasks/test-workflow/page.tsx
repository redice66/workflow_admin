"use client"

import React, { useState } from "react"
import { EnhancedWorkflowPreview } from "@/components/tasks/enhanced-workflow-preview"

export default function TestWorkflowPage() {
  // 模拟工作流数据
  const [states] = useState([
    {
      id: "1",
      name: "创建",
      type: "start" as const,
      color: "#10B981"
    },
    {
      id: "2", 
      name: "OA审核中",
      type: "progress" as const,
      color: "#3B82F6"
    },
    {
      id: "3",
      name: "产品上架", 
      type: "progress" as const,
      color: "#3B82F6"
    },
    {
      id: "4",
      name: "暂停审核",
      type: "progress" as const,
      color: "#F59E0B"
    },
    {
      id: "5",
      name: "完成",
      type: "end" as const,
      color: "#EF4444"
    },
    {
      id: "6",
      name: "因故终止",
      type: "end" as const,
      color: "#EF4444"
    }
  ])

  const [transitions] = useState([
    {
      id: "t1",
      fromStateId: "1",
      toStateId: "2", 
      name: "提交审核",
      description: "提交到OA审核"
    },
    {
      id: "t2",
      fromStateId: "2",
      toStateId: "1",
      name: "驳回",
      description: "驳回回到创建状态"
    },
    {
      id: "t3", 
      fromStateId: "2",
      toStateId: "3",
      name: "自动上架",
      description: "审核通过自动上架"
    },
    {
      id: "t4",
      fromStateId: "3", 
      toStateId: "5",
      name: "完成",
      description: "上架完成"
    },
    {
      id: "t5",
      fromStateId: "2",
      toStateId: "4", 
      name: "暂停审核",
      description: "暂停审核流程"
    },
    {
      id: "t6",
      fromStateId: "4",
      toStateId: "2", 
      name: "恢复审核",
      description: "恢复审核流程"
    },
    {
      id: "t7",
      fromStateId: "2",
      toStateId: "6", 
      name: "作废",
      description: "审核阶段作废"
    },
    {
      id: "t8",
      fromStateId: "1",
      toStateId: "6",
      name: "作废", 
      description: "创建阶段作废"
    }
  ])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">工作流预览测试</h1>
      <div className="h-[600px] border rounded-lg">
        <EnhancedWorkflowPreview
          states={states}
          transitions={transitions}
          height={600}
          showFullscreen={true}
        />
      </div>
    </div>
  )
}
