"use client"

import React, { useState, useEffect, useMemo, lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Maximize2, 
  Minimize2, 
  Play, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  PauseCircle, 
  XCircle,
  Eye,
  EyeOff,
  GitBranch,
  Users,
  Settings,
  RotateCcw
} from "lucide-react"
import { useNodeStore } from "@/lib/node-store"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import "./workflow-preview.css"

interface WorkflowPreviewProps {
  workflowId?: string
  onClose?: () => void
  showFullScreen?: boolean
}

interface FlowStep {
  id: string
  label: string
  type: string
  status: 'pending' | 'in-progress' | 'completed' | 'skipped'
  description?: string
  assignee?: string
  duration?: string
  conditions?: string[]
  nextSteps?: string[]
}

export function WorkflowPreview({ 
  workflowId, 
  onClose, 
  showFullScreen = false 
}: WorkflowPreviewProps) {
  const { nodes, edges } = useNodeStore()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showMiniMap, setShowMiniMap] = useState(true)
  const [activeTab, setActiveTab] = useState("flow")
  const [simulationRunning, setSimulationRunning] = useState(false)

  // 计算工作流步骤
  const flowSteps = useMemo(() => {
    const steps: FlowStep[] = []
    
    // 按拓扑排序节点
    const sortedNodes = topologicalSort(nodes, edges)
    
    sortedNodes.forEach((node, index) => {
      const step: FlowStep = {
        id: node.id,
        label: node.data?.label || node.type || "未知节点",
        type: node.type || "task",
        status: index === 0 ? 'in-progress' : 'pending',
        description: node.data?.description || "",
        assignee: node.data?.assignee || "系统",
        duration: node.data?.estimatedDuration || "-",
        conditions: node.data?.conditions || [],
        nextSteps: getNextSteps(node.id, edges, nodes)
      }
      steps.push(step)
    })
    
    return steps
  }, [nodes, edges])

  // 获取节点类型图标
  const getNodeIcon = (type?: string) => {
    switch (type) {
      case 'startNode':
        return <Play className="h-4 w-4" />
      case 'endNode':
        return <CheckCircle2 className="h-4 w-4" />
      case 'userTask':
        return <Users className="h-4 w-4" />
      case 'serviceTask':
      case 'scriptTask':
        return <Settings className="h-4 w-4" />
      case 'exclusiveGateway':
        return <GitBranch className="h-4 w-4" />
      case 'timerEvent':
        return <Clock className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Play className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'skipped':
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  // 工作流统计
  const workflowStats = useMemo(() => {
    const stats = {
      totalSteps: nodes.length,
      completedSteps: 0,
      pendingSteps: 0,
      estimatedDuration: "0小时",
      criticalPath: []
    }
    
    // 计算关键路径
    const criticalPath = calculateCriticalPath(nodes, edges)
    stats.criticalPath = criticalPath
    
    return stats
  }, [nodes, edges])

  // 全屏模式切换
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // 模拟运行工作流
  const runSimulation = async () => {
    setSimulationRunning(true)
    
    // 模拟工作流执行
    for (let i = 0; i < flowSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // 这里可以更新步骤状态
    }
    
    setSimulationRunning(false)
  }

  // 渲染流程图
  const renderFlowDiagram = () => {
    const { FlowVisualizer } = require('./flow-visualizer')
    
    return (
      <div className="h-full w-full">
        <FlowVisualizer
          showControls={true}
          showMiniMap={showMiniMap}
          interactive={false}
        />
      </div>
    )
  }

  // 渲染步骤列表
  const renderStepList = () => (
    <div className="space-y-4">
      {flowSteps.map((step, index) => (
        <Card key={step.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  {getNodeIcon(step.type)}
                </div>
                <div>
                  <CardTitle className="text-base">{step.label}</CardTitle>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {step.type.replace('Node', '')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">执行人:</span>
                <span>{step.assignee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">预计时长:</span>
                <span>{step.duration}</span>
              </div>
              {step.conditions && step.conditions.length > 0 && (
                <div>
                  <span className="text-muted-foreground">条件:</span>
                  <ul className="mt-1 space-y-1">
                    {step.conditions.map((condition, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        • {condition}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {step.nextSteps && step.nextSteps.length > 0 && (
                <div>
                  <span className="text-muted-foreground">下一步:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {step.nextSteps.map((next, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {next}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // 渲染统计信息
  const renderStats = () => (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{workflowStats.totalSteps}</div>
          <p className="text-sm text-muted-foreground">总步骤</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{workflowStats.estimatedDuration}</div>
          <p className="text-sm text-muted-foreground">预计时长</p>
        </CardContent>
      </Card>
    </div>
  )

  const content = (
    <div className={cn(
      "flex flex-col bg-background",
      isFullScreen ? "fixed inset-0 z-50" : "h-full"
    )}>
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">工作流预览</h2>
          <Badge variant="outline">{nodes.length} 个节点</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMiniMap(!showMiniMap)}
            className="hidden sm:flex"
          >
            {showMiniMap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            缩略图
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={runSimulation}
            disabled={simulationRunning}
          >
            <Play className="h-4 w-4 mr-1" />
            {simulationRunning ? "运行中..." : "模拟运行"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b px-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="flow">流程图</TabsTrigger>
              <TabsTrigger value="steps">步骤列表</TabsTrigger>
              <TabsTrigger value="stats">统计信息</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="h-[calc(100%-60px)] p-4 overflow-auto">
            <TabsContent value="flow" className="h-full m-0">
              {renderFlowDiagram()}
            </TabsContent>
            
            <TabsContent value="steps" className="m-0">
              {renderStepList()}
            </TabsContent>
            
            <TabsContent value="stats" className="m-0">
              {renderStats()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )

  // 全屏模式使用Portal
  if (isFullScreen) {
    return createPortal(content, document.body)
  }

  return content
}

// 工具函数：拓扑排序
function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
  const visited = new Set<string>()
  const result: Node[] = []
  const adjacencyList = new Map<string, string[]>()
  
  // 构建邻接表
  nodes.forEach(node => adjacencyList.set(node.id, []))
  edges.forEach(edge => {
    if (adjacencyList.has(edge.source)) {
      adjacencyList.get(edge.source)!.push(edge.target)
    }
  })
  
  // DFS遍历
  function dfs(nodeId: string) {
    if (visited.has(nodeId)) return
    visited.add(nodeId)
    
    const neighbors = adjacencyList.get(nodeId) || []
    neighbors.forEach(neighborId => {
      dfs(neighborId)
    })
    
    const node = nodes.find(n => n.id === nodeId)
    if (node) result.unshift(node)
  }
  
  // 从所有开始节点开始
  const hasIncoming = new Set(edges.map(e => e.target))
  const startNodes = nodes.filter(node => !hasIncoming.has(node.id))
  
  startNodes.forEach(node => dfs(node.id))
  
  // 如果还有未访问的节点（循环依赖），直接添加
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      result.push(node)
    }
  })
  
  return result
}

// 工具函数：获取下一步骤
function getNextSteps(nodeId: string, edges: Edge[], nodes: Node[]): string[] {
  const nextNodeIds = edges
    .filter(edge => edge.source === nodeId)
    .map(edge => edge.target)
  
  return nextNodeIds
    .map(id => nodes.find(n => n.id === id)?.data?.label || id)
    .filter(Boolean)
}

// 工具函数：计算关键路径
function calculateCriticalPath(nodes: Node[], edges: Edge[]): string[] {
  // 简化版本：返回从开始到结束的最长路径
  const startNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id)
  )
  
  const endNodes = nodes.filter(node => 
    !edges.some(edge => edge.source === node.id)
  )
  
  if (startNodes.length === 0 || endNodes.length === 0) return []
  
  return startNodes.map(node => node.data?.label || node.id)
}