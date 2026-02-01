"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeTypes,
  type ReactFlowInstance,
  Connection,
  addEdge,
  MarkerType,
} from "reactflow"
import dagre from 'dagre'
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Eye, EyeOff } from "lucide-react"

// 自定义节点组件
const CustomNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start': return '#10B981';
      case 'progress': return '#3B82F6';
      case 'pause': return '#F59E0B';
      case 'end': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // 优先使用传入的color，如果没有则根据type计算
  const color = data.color || getNodeColor(data.type);
  
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        background: 'white',
        width: 180, // 固定宽度，与dagre布局保持一致
        height: 60,  // 固定高度，与dagre布局保持一致
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: selected ? '0 0 0 3px #3B82F6' : '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        cursor: 'grab',
      }}
    >
      <div style={{ 
        color: color, 
        fontWeight: 600, 
        fontSize: '14px',
        lineHeight: '1.4',
        wordBreak: 'break-word',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        // 确保颜色不被CSS覆盖
        borderColor: color,
        backgroundColor: 'white'
      }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} id="s-right" />
      <Handle type="target" position={Position.Left} id="t-left" />
      <Handle type="source" position={Position.Top} id="s-top" />
      <Handle type="target" position={Position.Top} id="t-top" />
      <Handle type="source" position={Position.Bottom} id="s-bottom" />
      <Handle type="target" position={Position.Bottom} id="t-bottom" />
    </div>
  );
};

// 节点类型定义
const nodeTypes: NodeTypes = {
  customNode: CustomNode,
}

// 使用dagre进行自动布局，减少边交叉
function generateDagreLayout(states: any[], transitions: any[]) {
  try {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    
    // 设置布局参数
    dagreGraph.setGraph({
      rankdir: 'LR', // 从左到右布局
      nodesep: 100,  // 节点间距
      ranksep: 150,  // 层次间距
      marginx: 50,   // 左右边距
      marginy: 50,   // 上下边距
    });

    // 添加节点，使用固定尺寸
    states.forEach(state => {
      dagreGraph.setNode(state.id, {
        width: 180, // 固定宽度，与CustomNode保持一致
        height: 60, // 固定高度，与CustomNode保持一致
      });
    });

    // 添加边
    transitions.forEach(transition => {
      dagreGraph.setEdge(transition.fromStateId, transition.toStateId);
    });

    // 执行布局
    dagre.layout(dagreGraph);

    // 获取布局结果并转换为ReactFlow节点格式
    return states.map(state => {
      const node = dagreGraph.node(state.id);
      return {
        id: state.id,
        type: 'customNode',
        position: { 
          x: node.x - 90, // 减去节点宽度的一半
          y: node.y - 30  // 减去节点高度的一半
        },
        data: {
          label: state.name,
          type: state.type,
          color: state.color
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: true,
      };
    });
  } catch (error) {
    console.warn('Dagre layout failed, falling back to horizontal layout:', error);
    // 如果dagre布局失败，回退到简单的水平布局
    return states.map((state, index) => ({
      id: state.id,
      type: 'customNode',
      position: { 
        x: index * 300 + 100, 
        y: 200 
      },
      data: {
        label: state.name,
        type: state.type,
        color: state.color
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      draggable: true,
    }));
  }
}

interface EnhancedWorkflowPreviewProps {
  states: Array<{
    id: string
    name: string
    type: "start" | "progress" | "pause" | "end"
    color: string
    description?: string
    order?: number
  }>
  transitions: Array<{
    id: string
    fromStateId: string
    toStateId: string
    name: string
    description?: string
    condition?: string
    requiredRole?: string
  }>
  height?: number
  showFullscreen?: boolean
}

export function EnhancedWorkflowPreview({ 
  states, 
  transitions, 
  height = 500,
  showFullscreen = true 
}: EnhancedWorkflowPreviewProps) {
  // 所有hooks必须在顶部声明，不能有条件判断
  const [isClient, setIsClient] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [showMiniMap, setShowMiniMap] = useState(true)
  
  // 所有计算逻辑也使用hooks，避免条件调用
  const initialNodesAndEdges = useMemo(() => {
    if (!isClient || states.length === 0) {
      return { nodes: [], edges: [] };
    }
    
    
    
    // 1. 使用dagre生成布局
    const flowNodes = generateDagreLayout(states, transitions);

    // 2. 生成边 - 使用多端口避免边交叉
    const flowEdges: Edge[] = transitions.map(transition => {
      // 检查是否存在反向边
      const hasReverse = transitions.some(
        r => r.fromStateId === transition.toStateId && r.toStateId === transition.fromStateId
      );

      return {
        id: transition.id,
        source: transition.fromStateId,
        target: transition.toStateId,
        type: 'smoothstep', // 使用内置smoothstep类型
        // 正向: 右 -> 左；反向: 走顶部避免重合
        sourceHandle: hasReverse && transition.fromStateId > transition.toStateId ? 's-top' : 's-right',
        targetHandle: hasReverse && transition.fromStateId > transition.toStateId ? 't-top' : 't-left',
        animated: false,
        label: transition.name,
        labelBgPadding: [6, 3],
        labelBgBorderRadius: 6,
        labelBgStyle: { 
          fill: 'rgba(255,255,255,0.9)', 
          stroke: '#ddd',
          strokeWidth: 1
        },
        style: {
          stroke: '#6B7280',
          strokeWidth: 2
        }
      }
    })

    return { nodes: flowNodes, edges: flowEdges }
  }, [states, transitions, isClient]);

  // 统一初始化流程
  useEffect(() => {
    if (initialNodesAndEdges.nodes.length > 0) {
      setNodes(initialNodesAndEdges.nodes);
      setEdges(initialNodesAndEdges.edges);
    }
  }, [initialNodesAndEdges, setNodes, setEdges])

  // 处理连接
  const handleConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges]);

  // 重置视图 - 使用requestAnimationFrame优化
  const handleResetView = useCallback(() => {
    if (initialNodesAndEdges.nodes.length > 0) {
      setNodes(initialNodesAndEdges.nodes);
      setEdges(initialNodesAndEdges.edges);
      
      requestAnimationFrame(() => {
        if (reactFlowInstance) {
          reactFlowInstance.fitView({ padding: 0.2 });
        }
      });
    }
  }, [initialNodesAndEdges, setNodes, setEdges, reactFlowInstance]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 渲染逻辑必须放在最后，不能中断hooks的顺序
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">加载工作流中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 控制面板 */}
      <div className="flex items-center justify-between p-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">工作流预览</h3>
          <Badge variant="secondary">{states.length} 个状态</Badge>
          <Badge variant="secondary">{transitions.length} 个转换</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowMiniMap(!showMiniMap)}
          >
            {showMiniMap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            缩略图
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetView}
          >
            <RefreshCw className="h-4 w-4" />
            重置视图
          </Button>
        </div>
      </div>

      {/* 流程图 */}
      <div className="flex-1 workflow-container" style={{ width: '100%', height: `${height - 60}px`, position: 'relative' }}>
        <ReactFlowProvider>
          <WorkflowFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            showMiniMap={showMiniMap}
          />
        </ReactFlowProvider>
      </div>
    </div>
  )
}

// 内部组件，使用优化后的ReactFlow配置
function WorkflowFlow({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  onInit, 
  nodeTypes, 
  showMiniMap
}: {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: any
  onEdgesChange: any
  onConnect: any
  onInit: any
  nodeTypes: NodeTypes
  showMiniMap: boolean
}) {
  // 处理初始化，仅在onInit后调用fitView，避免重复
  const handleInit = useCallback((instance: ReactFlowInstance) => {
    onInit(instance)
    // 使用requestAnimationFrame确保DOM已渲染
    requestAnimationFrame(() => {
      instance.fitView({ padding: 0.2 })
    })
  }, [onInit])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={handleInit}
      nodeTypes={nodeTypes}
      // 移除edgeTypes，使用内置smoothstep类型
      defaultEdgeOptions={{
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
        style: { strokeWidth: 2, stroke: '#6B7280' },
      }}
      className="bg-gray-50"
      nodesDraggable={true}
      elementsSelectable={true}
      nodesConnectable={false}
      panOnDrag={true}
      zoomOnScroll={true}
      zoomOnPinch={true}
      snapToGrid={true}
      snapGrid={[5, 5]}
      onlyRenderVisibleElements={true}
      translateExtent={[[-5000, -5000], [12000, 8000]]}
      nodeExtent={[[-2000, -2000], [8000, 4000]]}
      minZoom={0.25}
      maxZoom={2}
      // 移除fitView和fitViewOptions，避免与onInit中的fitView重复
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={12} size={1} />
      <Controls className="!bg-white !shadow-lg" />
      {showMiniMap && (
        <MiniMap 
          className="!bg-white !shadow-lg" 
          nodeColor={(node) => {
            const nodeData = node.data
            switch (nodeData?.type) {
              case 'start': return '#10B981'
              case 'progress': return '#3B82F6'
              case 'pause': return '#F59E0B'
              case 'end': return '#EF4444'
              default: return '#6B7280'
            }
          }}
        />
      )}
    </ReactFlow>
  )
}
