"use client"

import { useCallback } from "react"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  type Connection,
  type NodeTypes,
  useEdgesState,
  useNodesState,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { useNodeStore } from "@/lib/node-store"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock 节点组件
const MockNode = () => <div>节点</div>;

// 定义节点类型
const nodeTypes: NodeTypes = {
  startNode: MockNode,
  agentNode: MockNode,
  conditionNode: MockNode,
  llmNode: MockNode,
  replyNode: MockNode,
}

export function WorkflowEditor() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    nodeTemplates,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
  } = useNodeStore()
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges)

  // 连接节点
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(connection, edges)
      setEdges(newEdges)
      setStoreEdges(newEdges)
    },
    [edges, setEdges, setStoreEdges],
  )

  // 添加节点
  const addNode = useCallback(
    (templateId: string) => {
      const template = nodeTemplates.find((t) => t.id === templateId)
      if (!template) return

      const newNode = {
        id: `node-${Date.now()}`,
        type: template.type,
        position: { x: 100, y: 100 },
        data: { ...template.properties },
      }

      const newNodes = [...nodes, newNode]
      setNodes(newNodes)
      setStoreNodes(newNodes)
    },
    [nodes, nodeTemplates, setNodes, setStoreNodes],
  )

  // 节点变化时同步到 store
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes)
      setStoreNodes(nodes)
    },
    [nodes, onNodesChange, setStoreNodes],
  )

  // 边变化时同步到 store
  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes)
      setStoreEdges(edges)
    },
    [edges, onEdgesChange, setStoreEdges],
  )

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="bg-background p-2 rounded-md shadow-md border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                添加节点
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {nodeTemplates.map((template) => (
                <DropdownMenuItem key={template.id} onClick={() => addNode(template.id)}>
                  {template.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Panel>
      </ReactFlow>
    </div>
  )
}
