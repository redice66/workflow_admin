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
  getBezierPath,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  type EdgeProps,
  MarkerType,
  ReactFlowInstance,
  Connection,
  addEdge,
} from "reactflow"
import "reactflow/dist/style.css"

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

  const color = getNodeColor(data.type);
  
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        background: 'white',
        minWidth: 120,
        minHeight: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: selected ? '0 0 0 3px #3B82F6' : '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ 
        color: color, 
        fontWeight: 600, 
        fontSize: '14px',
        lineHeight: '1.4',
        wordBreak: 'break-word'
      }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

// 自定义边组件
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        d={edgePath}
        style={{ ...style, strokeWidth: 2, stroke: '#6B7280' }}
        fill="none"
        markerEnd={markerEnd}
      />
      {label && (
        <foreignObject
          width={120}
          height={50}
          x={labelX - 60}
          y={labelY - 25}
          style={{ overflow: 'visible' }}
        >
          <div
            style={{
              background: 'transparent',
              border: 'none',
              padding: '2px 4px',
              fontSize: 12,
              fontWeight: 500,
              color: '#374151',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              textAlign: 'center',
              textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.8)',
              pointerEvents: 'none',
            }}
          >
            {label}
          </div>
        </foreignObject>
      )}
    </>
  );
};

// 节点类型定义
const nodeTypes: NodeTypes = {
  customNode: CustomNode,
}

// 边类型定义
const edgeTypes: EdgeTypes = {
  customEdge: CustomEdge,
}

// 示例数据
const exampleStates = [
  { id: "1", name: "创建", type: "start" as const, color: "#10B981" },
  { id: "2", name: "审核中", type: "progress" as const, color: "#3B82F6" },
  { id: "3", name: "上架", type: "progress" as const, color: "#3B82F6" },
  { id: "4", name: "完成", type: "end" as const, color: "#EF4444" },
  { id: "5", name: "暂停", type: "pause" as const, color: "#F59E0B" },
]

const exampleTransitions = [
  { id: "t1", fromStateId: "1", toStateId: "2", name: "提交审核" },
  { id: "t2", fromStateId: "2", toStateId: "3", name: "审核通过" },
  { id: "t3", fromStateId: "3", toStateId: "4", name: "上架完成" },
  { id: "t4", fromStateId: "2", toStateId: "5", name: "暂停审核" },
  { id: "t5", fromStateId: "5", toStateId: "2", name: "恢复审核" },
]

export function WorkflowExample() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  // 1. 生成节点 - 使用网格布局避免重叠
  const initialNodesAndEdges = useMemo(() => {
    // 节点定义 - 使用网格布局确保不重叠
    const flowNodes: Node[] = exampleStates.map((state, index) => {
      // 计算网格位置，确保节点不重叠
      const gridCols = 3; // 每行最多3个节点
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;
      
      // 设置合理的间距
      const nodeSpacing = 250; // 节点间距
      const x = col * nodeSpacing + 100;
      const y = row * nodeSpacing + 100;
      
      return {
        id: state.id,
        type: 'customNode',
        position: { x, y }, // 明确的初始位置
        data: {
          label: state.name,
          type: state.type,
          color: state.color
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: true,
      }
    })

    // 2. 生成边 - 确保有箭头连接
    const flowEdges: Edge[] = exampleTransitions.map(transition => ({
      id: transition.id,
      source: transition.fromStateId,
      target: transition.toStateId,
      type: 'smoothstep', // 使用平滑步进路径
      animated: false,
      label: transition.name,
      markerEnd: { 
        type: MarkerType.ArrowClosed, // 闭合箭头
        width: 20,
        height: 20,
        color: '#6B7280'
      },
      style: {
        stroke: '#6B7280',
        strokeWidth: 2
      }
    }))

    return { nodes: flowNodes, edges: flowEdges }
  }, [])

  // 3. 初始化节点和边，并自动居中
  useEffect(() => {
    if (initialNodesAndEdges.nodes.length > 0) {
      // 直接使用计算好的节点位置，避免重叠
      setNodes(initialNodesAndEdges.nodes);
      setEdges(initialNodesAndEdges.edges);
      
      // 延迟调用 fitView 确保节点已渲染
      setTimeout(() => {
        if (reactFlowInstance) {
          reactFlowInstance.fitView({ 
            padding: 0.2,
            minZoom: 0.4,
            maxZoom: 1.5
          });
        }
      }, 100);
    }
  }, [initialNodesAndEdges, setNodes, setEdges, reactFlowInstance])

  // 处理连接
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges])

  // 处理初始化，调用 fitView 确保节点居中
  const handleInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance)
    // 延迟调用 fitView 确保节点已渲染
    setTimeout(() => {
      instance.fitView({ 
        padding: 0.2,
        minZoom: 0.4,
        maxZoom: 1.5
      })
    }, 100)
  }, [])

  // 重置视图
  const handleResetView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ 
        padding: 0.2,
        minZoom: 0.4,
        maxZoom: 1.5
      });
    }
  }, [reactFlowInstance])

  return (
    <div className="w-full h-full flex flex-col">
      {/* 控制面板 */}
      <div className="flex items-center justify-between p-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">工作流示例</h3>
          <span className="text-sm text-gray-500">{exampleStates.length} 个状态</span>
          <span className="text-sm text-gray-500">{exampleTransitions.length} 个转换</span>
        </div>
        
        <button
          onClick={handleResetView}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重置视图
        </button>
      </div>

      {/* 流程图 */}
      <div className="flex-1" style={{ width: '100%', height: '500px' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={handleInit}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            className="bg-gray-50"
            nodesDraggable={true}
            elementsSelectable={true}
            nodesConnectable={false}
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            snapToGrid={false}
            onlyRenderVisibleElements={false}
            fitView
            minZoom={0.1}
            maxZoom={4}
            attributionPosition="bottom-left"
          >
            <Background gap={12} size={1} />
            <Controls className="!bg-white !shadow-lg" />
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
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  )
}
