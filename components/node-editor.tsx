"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useNodeStore, type NodeTemplate, type NodeType } from "@/lib/node-store"
import { Plus, Edit, Trash2, User, MessageSquare, GitBranch, Play, MessageCircle } from "lucide-react"

export function NodeEditor() {
  const { nodeTemplates, addNodeTemplate, updateNodeTemplate, deleteNodeTemplate } = useNodeStore()
  const [selectedTemplate, setSelectedTemplate] = useState<NodeTemplate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<NodeTemplate>>({
    name: "",
    type: "agentNode",
    description: "",
    properties: {},
  })

  // 获取节点图标
  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case "startNode":
        return <Play className="h-5 w-5" />
      case "agentNode":
        return <User className="h-5 w-5" />
      case "conditionNode":
        return <GitBranch className="h-5 w-5" />
      case "llmNode":
        return <MessageSquare className="h-5 w-5" />
      case "replyNode":
        return <MessageCircle className="h-5 w-5" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  // 创建新节点模板
  const handleCreateTemplate = () => {
    if (!newTemplate.name) return

    const template: NodeTemplate = {
      id: `template-${Date.now()}`,
      type: newTemplate.type as NodeType,
      name: newTemplate.name,
      description: newTemplate.description || "",
      icon: newTemplate.type || "message-square",
      properties: newTemplate.properties || {},
    }

    addNodeTemplate(template)
    setIsDialogOpen(false)
    setNewTemplate({
      name: "",
      type: "agentNode",
      description: "",
      properties: {},
    })
  }

  // 更新节点模板
  const handleUpdateTemplate = () => {
    if (!selectedTemplate) return

    updateNodeTemplate(selectedTemplate.id, {
      name: selectedTemplate.name,
      description: selectedTemplate.description,
      properties: selectedTemplate.properties,
    })

    setSelectedTemplate(null)
  }

  // 删除节点模板
  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return

    deleteNodeTemplate(selectedTemplate.id)
    setSelectedTemplate(null)
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">节点编辑</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建节点
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新节点</DialogTitle>
              <DialogDescription>定义新节点的名称、类型和属性。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">节点名称</Label>
                <Input
                  id="name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">节点类型</Label>
                <Select
                  value={newTemplate.type}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value as NodeType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择节点类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startNode">开始节点</SelectItem>
                    <SelectItem value="agentNode">代理节点</SelectItem>
                    <SelectItem value="conditionNode">条件分支节点</SelectItem>
                    <SelectItem value="llmNode">LLM节点</SelectItem>
                    <SelectItem value="replyNode">回复节点</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">节点描述</Label>
                <Textarea
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreateTemplate}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {nodeTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-2 bg-muted/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                {getNodeIcon(template.type)}
              </div>
              <div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.type}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">属性</h4>
                <div className="rounded-md bg-muted p-2">
                  <pre className="text-xs">{JSON.stringify(template.properties, null, 2)}</pre>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-muted/30 p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTemplate(template)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </Button>
              <Button variant="default" size="sm" onClick={() => setSelectedTemplate(template)}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>编辑节点</DialogTitle>
              <DialogDescription>修改节点的名称、描述和属性。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">节点名称</Label>
                <Input
                  id="edit-name"
                  value={selectedTemplate.name}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">节点描述</Label>
                <Textarea
                  id="edit-description"
                  value={selectedTemplate.description}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-properties">节点属性 (JSON)</Label>
                <Textarea
                  id="edit-properties"
                  rows={5}
                  value={JSON.stringify(selectedTemplate.properties, null, 2)}
                  onChange={(e) => {
                    try {
                      const properties = JSON.parse(e.target.value)
                      setSelectedTemplate({ ...selectedTemplate, properties })
                    } catch (error) {
                      // 解析错误时不更新
                    }
                  }}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                取消
              </Button>
              <Button onClick={handleUpdateTemplate}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>您确定要删除节点 "{selectedTemplate?.name}" 吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
