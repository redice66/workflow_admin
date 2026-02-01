"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WorkflowSidebarProps {
  workflowName: string
  setWorkflowName: (name: string) => void
  workflowDescription: string
  setWorkflowDescription: (description: string) => void
  onClose: () => void
  onSave: () => void
}

export function WorkflowSidebar({
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  onClose,
  onSave,
}: WorkflowSidebarProps) {
  return (
    <div className="mt-6 space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="advanced">高级设置</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">工作流名称</Label>
            <Input id="name" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">工作流描述</Label>
            <Textarea
              id="description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select defaultValue="draft">
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="active">已激活</SelectItem>
                <SelectItem value="inactive">已停用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="version">版本</Label>
            <Input id="version" defaultValue="1.0.0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeout">超时设置 (秒)</Label>
            <Input id="timeout" type="number" defaultValue={30} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retries">重试次数</Label>
            <Input id="retries" type="number" defaultValue={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="concurrency">并发限制</Label>
            <Input id="concurrency" type="number" defaultValue={10} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          取消
        </Button>
        <Button onClick={onSave}>保存</Button>
      </div>
    </div>
  )
}
