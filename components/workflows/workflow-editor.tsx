"use client"

import type React from "react"

import { useCallback, useRef, useState, useEffect } from "react"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  type Connection,
  type Node,
  type NodeTypes,
  useEdgesState,
  useNodesState,
  type ReactFlowInstance,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Eye,
  EyeOff,
  GitBranch,
  Play,
  Clock,
  Search,
  Square,
  FileText,
  Globe,
  Code,
  Mail,
  Activity,
} from "lucide-react"
import { useNodeStore } from "@/lib/node-store"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { NodeSidebar } from "./node-sidebar"
import { WorkflowPreview } from "./workflow-preview"
import { WorkflowPermissionsEditor } from "./workflow-permissions"

// 模拟当前用户权限，实际应用中应从权限系统获取
// TODO: 从后端API获取当前用户的权限信息
const currentUserPermissions = {
  workflows: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    publish: true,
  },
}

// 导入所有节点组件
import { StartNode } from "@/components/workflows/nodes/start-node"
import { EndNode } from "@/components/workflows/nodes/end-node"
import { UserTaskNode } from "@/components/workflows/nodes/user-task-node"
import { ServiceTaskNode } from "@/components/workflows/nodes/service-task-node"
import { ScriptTaskNode } from "@/components/workflows/nodes/script-task-node"
import { HttpRequestNode } from "@/components/workflows/nodes/http-request-node"
import { EmailTaskNode } from "@/components/workflows/nodes/email-task-node"
import { ExclusiveGatewayNode } from "@/components/workflows/nodes/exclusive-gateway-node"
import { ParallelGatewayNode } from "@/components/workflows/nodes/parallel-gateway-node"
import { TimerEventNode } from "@/components/workflows/nodes/timer-event-node"
import { MessageEventNode } from "@/components/workflows/nodes/message-event-node"

// 定义节点类型
const nodeTypes: NodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  userTask: UserTaskNode,
  serviceTask: ServiceTaskNode,
  scriptTask: ScriptTaskNode,
  httpRequest: HttpRequestNode,
  emailTask: EmailTaskNode,
  exclusiveGateway: ExclusiveGatewayNode,
  parallelGateway: ParallelGatewayNode,
  timerEvent: TimerEventNode,
  messageEvent: MessageEventNode,
}

export function WorkflowEditor({ workflowId }: { workflowId?: string }) {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    nodeTemplates,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
  } = useNodeStore()
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isNodeSheetOpen, setIsNodeSheetOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [activeNodeCategory, setActiveNodeCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPermissions, setShowPermissions] = useState(false)

  // TODO: 从后端API获取工作流数据
  useEffect(() => {
    if (workflowId) {
      // 这里应该调用API获取工作流数据
      console.log("应该从API获取工作流数据，ID:", workflowId)
    }
  }, [workflowId])

  // 连接节点
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(connection, edges)
      setEdges(newEdges)
      setStoreEdges(newEdges)
    },
    [edges, setEdges, setStoreEdges],
  )

  // 节点点击事件
  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNode(node)
    setIsNodeSheetOpen(true)
  }, [])

  // 更新节点数据
  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          }
          return node
        }),
      )
      setStoreNodes(nodes)

      // TODO: 将更新后的节点数据同步到后端
      console.log("应该将更新后的节点数据同步到后端")
    },
    [nodes, setNodes, setStoreNodes],
  )

  // 拖拽开始事件
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.setData("application/nodedata", JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = "move"
  }

  // 拖拽结束事件
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // 放置事件
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")
      const nodeData = JSON.parse(event.dataTransfer.getData("application/nodedata") || "{}")

      // 检查是否有效的节点类型
      if (!type) return

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { ...nodeData },
      }

      setNodes((nds) => nds.concat(newNode))
      setStoreNodes([...nodes, newNode])

      // TODO: 将新节点数据同步到后端
      console.log("应该将新节点数据同步到后端")
    },
    [reactFlowInstance, nodes, setNodes, setStoreNodes],
  )

  // 节点变化时同步到 store
  const handleNodesChange = useCallback(
    (changes: any) => {
      // 使用 requestAnimationFrame 避免潜在的 resize 循环
      requestAnimationFrame(() => {
        onNodesChange(changes)
        setStoreNodes(nodes)

        // TODO: 将节点变化同步到后端
        console.log("应该将节点变化同步到后端")
      })
    },
    [nodes, onNodesChange, setStoreNodes],
  )

  // 边变化时同步到 store
  const handleEdgesChange = useCallback(
    (changes: any) => {
      // 使用 requestAnimationFrame 避免潜在的 resize 循环
      requestAnimationFrame(() => {
        onEdgesChange(changes)
        setStoreEdges(edges)

        // TODO: 将边变化同步到后端
        console.log("应该将边变化同步到后端")
      })
    },
    [edges, onEdgesChange, setStoreEdges],
  )

  // 检查编辑权限
  const canEdit = currentUserPermissions.workflows.edit

  return (
    <div className="h-full w-full flex workflow-editor-container">
      {/* 节点类型侧边栏 */}
      <div className="w-64 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium">节点面板</h3>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索节点..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {/* 基础节点 */}
          <div className="p-4 border-b">
            <h4 className="text-sm font-medium mb-3">基础节点</h4>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "startNode", { label: "开始节点" })}
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-1">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs">开始节点</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "endNode", { label: "结束节点" })}
              >
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mb-1">
                  <Square className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs">结束节点</span>
              </div>
            </div>
          </div>

          {/* 用户任务 */}
          <div className="p-4 border-b">
            <h4 className="text-sm font-medium mb-3">用户任务</h4>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "userTask", { label: "表单节点" })}
              >
                <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center mb-1">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs">表单节点</span>
              </div>
            </div>
          </div>

          {/* 系统任务 */}
          <div className="p-4 border-b">
            <h4 className="text-sm font-medium mb-3">系统任务</h4>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "serviceTask", { label: "服务任务" })}
              >
                <div className="w-10 h-10 rounded-md bg-purple-500 flex items-center justify-center mb-1">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs">服务任务</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "scriptTask", { label: "脚本任务" })}
              >
                <div className="w-10 h-10 rounded-md bg-indigo-500 flex items-center justify-center mb-1">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs">脚本任务</span>
              </div>
            </div>
          </div>

          {/* 通信任务 */}
          <div className="p-4 border-b">
            <h4 className="text-sm font-medium mb-3">通信任务</h4>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "httpRequest", { label: "HTTP请求" })}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500 flex items-center justify-center mb-1">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs">HTTP请求</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "emailTask", { label: "邮件任务" })}
              >
                <div className="w-10 h-10 rounded-md bg-cyan-500 flex items-center justify-center mb-1">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs">邮件任务</span>
              </div>
            </div>
          </div>

          {/* 网关节点 */}
          <div className="p-4 border-b">
            <h4 className="text-sm font-medium mb-3">网关节点</h4>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "exclusiveGateway", { label: "条件网关" })}
              >
                <div className="w-10 h-10 rounded-md bg-yellow-500 flex items-center justify-center mb-1 rotate-45">
                  <GitBranch className="h-5 w-5 text-white -rotate-45" />
                </div>
                <span className="text-xs">条件网关</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "parallelGateway", { label: "并行网关" })}
              >
                <div className="w-10 h-10 rounded-md bg-yellow-500 flex items-center justify-center mb-1 rotate-45">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white -rotate-45"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span className="text-xs">并行网关</span>
              </div>
            </div>
          </div>

          {/* 事件节点 */}
          <div className="p-4">
            <h4 className="text-sm font-medium mb-3">事件节点</h4>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "timerEvent", { label: "定时器" })}
              >
                <div className="w-10 h-10 rounded-full border-2 border-pink-500 flex items-center justify-center mb-1">
                  <Clock className="h-5 w-5 text-pink-500" />
                </div>
                <span className="text-xs">定时器</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-grab bg-white"
                draggable={canEdit}
                onDragStart={(event) => canEdit && onDragStart(event, "messageEvent", { label: "消息事件" })}
              >
                <div className="w-10 h-10 rounded-full border-2 border-teal-500 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-teal-500"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span className="text-xs">消息事件</span>
              </div>
            </div>
          </div>
        </div>

        {/* 权限管理按钮 */}
        {workflowId && currentUserPermissions.workflows.edit && (
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" onClick={() => setShowPermissions(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              角色权限管理
            </Button>
          </div>
        )}
      </div>

      {/* 工作流编辑器 */}
      <div className={`flex-1 ${showPreview ? "w-[calc(100%-500px)]" : "w-[calc(100%-16rem)]"}`}>
        <div className="h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            nodesDraggable={canEdit}
            nodesConnectable={canEdit}
            elementsSelectable={canEdit}
          >
            <Background />
            <Controls />
            <Panel position="top-right" className="bg-background p-2 rounded-md shadow-md border">
              <Button size="sm" variant="outline" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    隐藏预览
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    预览
                  </>
                )}
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* 预览面板 */}
      {showPreview && (
        <div className="w-[500px] border-l">
          <WorkflowPreview 
            workflowId={workflowId} 
            onClose={() => setShowPreview(false)} 
          />
        </div>
      )}

      {/* 节点配置侧边栏 */}
      <Sheet open={isNodeSheetOpen} onOpenChange={setIsNodeSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>节点配置</SheetTitle>
            <SheetDescription>配置选中节点的属性和行为</SheetDescription>
          </SheetHeader>
          {selectedNode && (
            <NodeSidebar
              node={selectedNode}
              updateNodeData={updateNodeData}
              onClose={() => setIsNodeSheetOpen(false)}
              readOnly={!canEdit}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* 权限管理侧边栏 */}
      {workflowId && (
        <Sheet open={showPermissions} onOpenChange={setShowPermissions}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>角色权限管理</SheetTitle>
              <SheetDescription>设置不同角色对此任务流的访问权限</SheetDescription>
            </SheetHeader>
            <WorkflowPermissionsEditor workflowId={workflowId} onClose={() => setShowPermissions(false)} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
