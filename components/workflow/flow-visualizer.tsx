"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  Position,
  MarkerType,
  BaseEdge,
  EdgeLabelRenderer,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw } from "lucide-react"
import { useNodeStore } from "@/lib/node-store"
import { autoLayoutNodes } from "@/lib/utils"

interface FlowVisualizerProps {
  height?: number
  showControls?: boolean
  showMiniMap?: boolean
  interactive?: boolean
}

export function FlowVisualizer({
  height = 400,
  showControls = true,
  showMiniMap = true,
  interactive = false
}: FlowVisualizerProps) {
  const { nodes: storeNodes, edges: storeEdges } = useNodeStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // 转换节点和边为流程图格式，使用自动布局算法
  const flowData = useMemo(() => {
    // 强制使用自动布局算法优化节点位置，即使原始数据有重叠
    let nodesToLayout = [...storeNodes]
    
    // 如果节点位置重叠（y坐标相同或接近），强制应用布局
    const hasOverlappingNodes = nodesToLayout.some((node, index) => {
      if (index === 0) return false
      return Math.abs(node.position.y - nodesToLayout[0].position.y) < 50
    })
    
    if (hasOverlappingNodes || nodesToLayout.length <= 2) {
      // 为简单流程手动设置布局，避免重叠
      nodesToLayout = nodesToLayout.map((node, index) => {
        const baseX = 150 + index * 300
        const baseY = 200
        
        // 根据节点类型调整位置
        switch (node.type) {
          case 'startNode':
            return { ...node, position: { x: 150, y: 200 } }
          case 'endNode':
            return { ...node, position: { x: 150 + (nodesToLayout.length - 1) * 300, y: 200 } }
          default:
            return { ...node, position: { x: baseX, y: baseY } }
        }
      })
    } else {
      // 使用自动布局算法
      nodesToLayout = autoLayoutNodes(storeNodes, storeEdges)
    }
    
    const nodes: Node[] = nodesToLayout.map(node => ({
      id: node.id,
      type: getNodeType(node.type),
      position: { x: node.position.x, y: node.position.y },
      data: {
        label: node.data?.label || node.type,
        description: node.data?.description,
        status: 'pending',
        ...node.data
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: getNodeStyle(node.type, 'pending')
    }))

    const edges: Edge[] = storeEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type || 'smoothstep',
      animated: false,
      label: edge.label,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#64748b',
      },
      style: {
        stroke: '#64748b',
        strokeWidth: 2,
        strokeLinecap: 'round',
      }
    }))

    return { nodes, edges }
  }, [storeNodes, storeEdges])

  useEffect(() => {
    setNodes(flowData.nodes)
    setEdges(flowData.edges)
  }, [flowData, setNodes, setEdges])

  // 模拟工作流执行
  const startSimulation = () => {
    setIsPlaying(true)
    setCurrentStep(0)

    const steps = flowData.nodes.length
    let step = 0

    const interval = setInterval(() => {
      if (step < steps) {
        // 更新当前步骤状态
        setNodes(prevNodes => 
          prevNodes.map((node, index) => ({
            ...node,
            style: getNodeStyle(node.type, index === step ? 'running' : index < step ? 'completed' : 'pending'),
            data: {
              ...node.data,
              status: index === step ? 'running' : index < step ? 'completed' : 'pending'
            }
          }))
        )

        // 更新边的动画
        setEdges(prevEdges => 
          prevEdges.map(edge => ({
            ...edge,
            animated: flowData.nodes.findIndex(n => n.id === edge.source) <= step
          }))
        )

        setCurrentStep(step)
        step++
      } else {
        clearInterval(interval)
        setIsPlaying(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }

  const pauseSimulation = () => {
    setIsPlaying(false)
  }

  const resetSimulation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setNodes(flowData.nodes)
    setEdges(flowData.edges.map(edge => ({ ...edge, animated: false })))
  }

  // 边类型定义
  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 控制面板 */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isPlaying ? "outline" : "default"}
            onClick={isPlaying ? pauseSimulation : startSimulation}
            disabled={flowData.nodes.length === 0}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={resetSimulation}
            disabled={flowData.nodes.length === 0}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary">{flowData.nodes.length} 个节点</Badge>
          <Badge variant="secondary">{flowData.edges.length} 条连接</Badge>
          <Badge variant="outline">
            步骤 {currentStep}/{flowData.nodes.length}
          </Badge>
        </div>
      </div>

      {/* 流程图 */}
      <div style={{ height: `${height - 60}px` }} className="flex-1">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={interactive ? onNodesChange : undefined}
            onEdgesChange={interactive ? onEdgesChange : undefined}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ 
              padding: 0.2,
              maxZoom: 1.5,
              minZoom: 0.5
            }}
            nodesDraggable={interactive}
            nodesConnectable={interactive}
            elementsSelectable={interactive}
            panOnDrag={true}
            panOnScroll={false}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={true}
            preventScrolling={true}
            defaultZoom={0.8}
            minZoom={0.2}
            maxZoom={4}
            className="workflow-flow-visualizer"
            style={{
              background: '#fafafa',
            }}
          >
            <Background 
              gap={16} 
              size={1} 
              color="#e5e7eb"
              style={{ 
                backgroundColor: '#fafafa' 
              }} 
            />
            {showControls && <Controls />}
            {showMiniMap && <MiniMap />}
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      
      {/* 全局样式 */}
      <style jsx global>{`
        .workflow-flow-visualizer {
          border-radius: 8px;
        }
        
        .workflow-flow-visualizer .react-flow__pane {
          cursor: grab;
        }
        
        .workflow-flow-visualizer .react-flow__pane.dragging {
          cursor: grabbing;
        }
        
        .workflow-flow-visualizer .react-flow__node {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .workflow-flow-visualizer .react-flow__edge {
          cursor: pointer;
        }
        
        .workflow-flow-visualizer .react-flow__edge.selected .react-flow__edge-path {
          stroke: #3b82f6;
          stroke-width: 3;
        }
      `}</style>
    </div>
  )
}

// 工具函数：获取节点类型
function getNodeType(type?: string): string {
  switch (type) {
    case 'startNode':
      return 'input'
    case 'endNode':
      return 'output'
    case 'exclusiveGateway':
      return 'diamond'
    case 'parallelGateway':
      return 'diamond'
    default:
      return 'default'
  }
}

// 自定义边组件 - 修复拖拽问题并添加箭头
const CustomEdge = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  label, 
  markerEnd,
  style,
  data 
}) => {
  // 计算边的中点
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  // 计算边的角度（用于标签旋转）
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;
  
  // 计算边长，用于调整标签位置
  const length = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
  
  // 标签偏移量，避免与线条重叠
  const offset = 15;
  const isHorizontal = Math.abs(angle) < 45 || Math.abs(angle) > 135;
  
  let labelX = midX;
  let labelY = midY;
  
  if (isHorizontal) {
    labelY -= offset;
  } else {
    labelX -= offset;
  }

  return (
    <>
      <BaseEdge 
        id={id} 
        path={`M${sourceX},${sourceY} L${targetX},${targetY}`} 
        markerEnd={markerEnd} 
        style={style}
      />
      
      {label && (
        <EdgeLabelRenderer>
          <div
            title={typeof label === 'string' ? label : undefined}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              maxWidth: '120px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pointerEvents: 'all',
              textAlign: 'center',
              color: '#374151',
              lineHeight: '1.3',
              backdropFilter: 'blur(4px)',
              zIndex: 10,
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// 工具函数：获取节点样式
function getNodeStyle(type?: string, status?: string) {
  const baseStyle = {
    border: '2px solid',
    borderRadius: '8px',
    padding: '10px',
    minWidth: '120px',
    textAlign: 'center' as const
  }

  let color = '#64748b'
  switch (type) {
    case 'startNode':
      color = '#22c55e'
      break
    case 'endNode':
      color = '#ef4444'
      break
    case 'userTask':
      color = '#3b82f6'
      break
    case 'serviceTask':
    case 'scriptTask':
      color = '#8b5cf6'
      break
    case 'exclusiveGateway':
    case 'parallelGateway':
      color = '#f59e0b'
      break
    case 'timerEvent':
    case 'messageEvent':
      color = '#ec4899'
      break
  }

  let backgroundColor = '#ffffff'
  switch (status) {
    case 'running':
      backgroundColor = '#dbeafe'
      break
    case 'completed':
      backgroundColor = '#dcfce7'
      break
    case 'pending':
      backgroundColor = '#ffffff'
      break
  }

  return {
    ...baseStyle,
    borderColor: color,
    backgroundColor,
    color: color
  }
}