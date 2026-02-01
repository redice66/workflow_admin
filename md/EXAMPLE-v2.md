import React, { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

const nodeWidth = 150;
const nodeHeight = 50;

// dagre 初始化
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

function getLayoutedElements(nodes, edges, direction = 'LR') {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
    };
  });
}

// 初始节点和边
const initialNodes = [
  { id: 'state_001', data: { label: '待开始' }, position: { x: 0, y: 0 }, type: 'default' },
  { id: 'state_006', data: { label: '已完成' }, position: { x: 0, y: 0 }, type: 'default' },
];

const initialEdges = [
  { id: 'e1-2', source: 'state_001', target: 'state_006', type: 'smoothstep', label: '结束' },
];

function Flow() {
  const layoutedNodes = getLayoutedElements(initialNodes, initialEdges);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    [setEdges]
  );

  // 重新布局按钮
  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);
    setNodes([...layouted]); // 更新节点位置
  }, [nodes, edges, setNodes]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={{ padding: 8, background: '#f9fafb', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={onLayout}
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: 6,
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          重新布局
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
