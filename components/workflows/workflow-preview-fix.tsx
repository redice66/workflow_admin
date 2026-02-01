import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  useReactFlow,
  BaseEdge,
  EdgeLabelRenderer,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// 定义节点和边的类型
interface WorkflowNode {
  id: string;
  type?: string;
  data: { label: string; [key: string]: any };
  position: { x: number; y: number };
  style?: React.CSSProperties;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  markerEnd?: any;
  style?: React.CSSProperties;
  animated?: boolean;
}

// 自定义箭头标记
const markerEnd = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: '#6B7280',
};

// 初始节点数据 - 使用线性布局确保不重叠
const initialNodes: WorkflowNode[] = [
  { 
    id: 'state_001', 
    data: { label: '待开始' }, 
    position: { x: 100, y: 200 },
    style: {
      background: '#fff',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '14px',
      minWidth: '100px',
      textAlign: 'center',
    }
  },
  { 
    id: 'state_002', 
    data: { label: '进行中' }, 
    position: { x: 400, y: 200 },
    style: {
      background: '#fff',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '14px',
      minWidth: '100px',
      textAlign: 'center',
    }
  },
  { 
    id: 'state_003', 
    data: { label: '已完成' }, 
    position: { x: 700, y: 200 },
    style: {
      background: '#fff',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '14px',
      minWidth: '100px',
      textAlign: 'center',
    }
  },
];

// 初始边数据
const initialEdges: WorkflowEdge[] = [
  {
    id: 'e1-2',
    source: 'state_001',
    target: 'state_002',
    label: '开始处理',
    type: 'smoothstep',
    markerEnd,
    style: { 
      stroke: '#6B7280', 
      strokeWidth: 2,
      strokeDasharray: '5,5',
    },
    animated: true,
  },
  {
    id: 'e2-3',
    source: 'state_002',
    target: 'state_003',
    label: '处理完成',
    type: 'smoothstep',
    markerEnd,
    style: { 
      stroke: '#10b981', 
      strokeWidth: 2,
    },
  },
  {
    id: 'e1-3',
    source: 'state_001',
    target: 'state_003',
    label: '这是一个很长的转换名称，需要支持换行并且在太长时显示省略号',
    type: 'smoothstep',
    markerEnd,
    style: { 
      stroke: '#3b82f6', 
      strokeWidth: 2,
    },
  },
];

// 自定义边组件 - 带箭头和标签
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
      <EdgeLabelRenderer>
        <div
          title={label}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            maxWidth: '140px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'all',
            textAlign: 'center',
            color: '#374151',
            lineHeight: '1.4',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
          }}
          className="nodrag nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// 工作流预览组件
export default function WorkflowPreview() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project, screenToFlowPosition } = useReactFlow();

  // 修复节点拖拽漂移问题 - 使用正确的坐标转换
  const onNodeDrag = useCallback(
    (event: React.MouseEvent, node: any) => {
      // 使用 screenToFlowPosition 而不是 project 来获取准确的画布坐标
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id 
            ? { ...n, position: { x: flowPosition.x, y: flowPosition.y } } 
            : n
        )
      );
    },
    [screenToFlowPosition, setNodes]
  );

  // 修复节点拖拽结束时的位置
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: any) => {
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id 
            ? { ...n, position: { x: flowPosition.x, y: flowPosition.y } } 
            : n
        )
      );
    },
    [screenToFlowPosition, setNodes]
  );

  // 边类型定义
  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

  return (
    <div className="workflow-preview-container" style={{ 
      width: '100%', 
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        edgeTypes={edgeTypes}
        
        // 画布配置
        fitView
        fitViewOptions={{ maxZoom: 1.5, minZoom: 0.5 }}
        
        // 拖拽和缩放配置
        nodesDraggable={true}
        nodesConnectable={false}
        nodesFocusable={true}
        elementsSelectable={true}
        
        // 画布拖拽配置
        panOnDrag={true}
        panOnScroll={false}
        panOnScrollSpeed={1}
        panOnScrollMode="free"
        
        // 缩放配置
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        defaultZoom={0.8}
        minZoom={0.2}
        maxZoom={4}
        
        // 防止样式冲突
        preventScrolling={true}
        
        // 样式配置
        style={{
          background: '#fafafa',
        }}
        
        // 自定义样式类
        className="workflow-preview"
      >
        <Background 
          color="#e5e7eb" 
          gap={16} 
          size={1} 
          style={{ 
            backgroundColor: '#fafafa' 
          }} 
        />
        <Controls 
          style={{
            bottom: 20,
            right: 20,
          }}
        />
        <MiniMap 
          nodeStrokeColor="#6b7280"
          nodeColor="#e5e7eb"
          nodeBorderRadius={2}
          style={{
            width: 150,
            height: 100,
            bottom: 20,
            left: 20,
          }}
        />
      </ReactFlow>
      
      {/* 全局样式，确保画布正常工作 */}
      <style jsx global>{`
        .workflow-preview {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        
        .workflow-preview .react-flow__pane {
          cursor: grab;
        }
        
        .workflow-preview .react-flow__pane.dragging {
          cursor: grabbing;
        }
        
        .workflow-preview .react-flow__node {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .workflow-preview .react-flow__edge {
          cursor: pointer;
        }
        
        .workflow-preview .react-flow__edge.selected .react-flow__edge-path {
          stroke: #3b82f6;
          stroke-width: 3;
        }
        
        .workflow-preview .react-flow__controls {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        
        .workflow-preview .react-flow__minimap {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}