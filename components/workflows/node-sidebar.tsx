"use client"

import { useState } from "react"
import type { Node } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NodeSidebarProps {
  node: Node
  updateNodeData: (nodeId: string, newData: any) => void
  onClose: () => void
  readOnly?: boolean
}

export function NodeSidebar({ node, updateNodeData, onClose, readOnly = false }: NodeSidebarProps) {
  const [label, setLabel] = useState(node.data.label || "")
  const [config, setConfig] = useState<any>(node.data.config || {})
  const [conditions, setConditions] = useState<any[]>(node.data.conditions || [])

  // 更新节点数据
  const handleSave = () => {
    if (readOnly) return

    const newData: any = { label }

    if (node.type === "exclusiveGateway" || node.type === "parallelGateway") {
      newData.conditions = conditions
    } else {
      newData.config = config
    }

    updateNodeData(node.id, newData)
    onClose()
  }

  // 更新条件
  const updateCondition = (index: number, field: string, value: string) => {
    if (readOnly) return

    const newConditions = [...conditions]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setConditions(newConditions)
  }

  // 添加条件
  const addCondition = () => {
    if (readOnly) return

    setConditions([...conditions, { type: "ELSE IF", condition: "" }])
  }

  // 删除条件
  const removeCondition = (index: number) => {
    if (readOnly || conditions.length <= 2) return // 保留至少两个条件（IF 和 ELSE）

    const newConditions = [...conditions]
    newConditions.splice(index, 1)
    setConditions(newConditions)
  }

  // 根据节点类型渲染不同的配置表单
  const renderConfigForm = () => {
    switch (node.type) {
      case "startNode":
      case "endNode":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">节点标签</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} disabled={readOnly} />
            </div>
          </div>
        )

      case "userTask":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">节点标签</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">处理人</Label>
              <Input
                id="assignee"
                value={config.assignee || ""}
                onChange={(e) => setConfig({ ...config, assignee: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form">表单</Label>
              <Select
                value={config.form || ""}
                onValueChange={(value) => setConfig({ ...config, form: value })}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择表单" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="form1">表单1</SelectItem>
                  <SelectItem value="form2">表单2</SelectItem>
                  <SelectItem value="form3">表单3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">截止日期</Label>
              <Input
                id="dueDate"
                type="date"
                value={config.dueDate || ""}
                onChange={(e) => setConfig({ ...config, dueDate: e.target.value })}
                disabled={readOnly}
              />
            </div>
          </div>
        )

      case "serviceTask":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">节点标签</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">服务名称</Label>
              <Input
                id="service"
                value={config.service || ""}
                onChange={(e) => setConfig({ ...config, service: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">方法名称</Label>
              <Input
                id="method"
                value={config.method || ""}
                onChange={(e) => setConfig({ ...config, method: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parameters">参数 (JSON格式)</Label>
              <Textarea
                id="parameters"
                rows={4}
                value={config.parameters || "{}"}
                onChange={(e) => setConfig({ ...config, parameters: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asyncTask">异步执行</Label>
              <Select
                value={config.asyncTask ? "true" : "false"}
                onValueChange={(value) => setConfig({ ...config, asyncTask: value === "true" })}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="是否异步执行" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">是</SelectItem>
                  <SelectItem value="false">否</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "scriptTask":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">节点标签</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="implementation">实现方式</Label>
              <Select
                value={config.implementation || ""}
                onValueChange={(value) => setConfig({ ...config, implementation: value })}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择实现方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="script">脚本内容</Label>
              <Textarea
                id="script"
                rows={5}
                value={config.script || ""}
                onChange={(e) => setConfig({ ...config, script: e.target.value })}
                disabled={readOnly}
              />
            </div>
          </div>
        )

      case "httpRequest":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">节点标签</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">请求方法</Label>
              <Select
                value={config.method || "GET"}
                onValueChange={(value) => setConfig({ ...config, method: value })}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择请求方法" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={config.url || ""}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headers">请求头 (JSON格式)</Label>
              <Textarea
                id="headers"
                rows={3}
                value={config.headers || "{}"}
                onChange={(e) => setConfig({ ...config, headers: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">请求体</Label>
              <Textarea
                id="body"
                rows={3}
                value={config.body || ""}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                disabled={readOnly}
              />
            </div>
          </div>
        )

      case "emailTask":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">节点标签</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">收件人</Label>
              <Input
                id="to"
                value={config.to || ""}
                onChange={(e) => setConfig({ ...config, to: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">主题</Label>
              <Input
                id="subject"
                value={config.subject || ""}
                onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                rows={5}
                value={config.content || ""}
                onChange={(e) => setConfig({ ...config, content: e.target.value })}
                disabled={readOnly}
              />
            </div>
          </div>
        )

      case "exclusiveGateway":
      case "parallelGateway":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">节点标签</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} disabled={readOnly} />
            </div>

            {node.type === "exclusiveGateway" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>条件列表</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCondition}
                    disabled={readOnly || conditions.length >= 5}
                  >
                    添加条件
                  </Button>
                </div>
                <div className="space-y-4">
                  {conditions.map((condition, index) => (
                    <div key={index} className="space-y-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <Label>条件 {index + 1}</Label>
                        {index > 0 && index < conditions.length - 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removeCondition(index)} disabled={readOnly}>
                            删除
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`type-${index}`}>类型</Label>
                        <Select
                          value={condition.type}
                          onValueChange={(value) => updateCondition(index, "type", value)}
                          disabled={readOnly || index === 0 || index === conditions.length - 1}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择类型" />
                          </SelectTrigger>
                          <SelectContent>
                            {index === 0 ? (
                              <SelectItem value="IF">IF</SelectItem>
                            ) : index === conditions.length - 1 ? (
                              <SelectItem value="ELSE">ELSE</SelectItem>
                            ) : (
                              <SelectItem value="ELSE IF">ELSE IF</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      {condition.type !== "ELSE" && (
                        <div className="space-y-2">
                          <Label htmlFor={`condition-${index}`}>条件表达式</Label>
                          <Input
                            id={`condition-${index}`}
                            value={condition.condition}
                            onChange={(e) => updateCondition(index, "condition", e.target.value)}
                            disabled={readOnly}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case "timerEvent":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">节点标签</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timerType">定时器类型</Label>
              <Select
                value={config.timerType || "date"}
                onValueChange={(value) => setConfig({ ...config, timerType: value })}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择定时器类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">日期</SelectItem>
                  <SelectItem value="duration">持续时间</SelectItem>
                  <SelectItem value="cycle">循环</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timerValue">定时器值</Label>
              <Input
                id="timerValue"
                value={config.timerValue || ""}
                onChange={(e) => setConfig({ ...config, timerValue: e.target.value })}
                disabled={readOnly}
              />
              <p className="text-xs text-muted-foreground">
                {config.timerType === "date"
                  ? "格式: ISO日期 (例如: 2023-12-31T23:59:59Z)"
                  : config.timerType === "duration"
                    ? "格式: ISO持续时间 (例如: PT1H30M - 1小时30分钟)"
                    : "格式: CRON表达式 (例如: 0 0 12 * * ? - 每天中午12点)"}
              </p>
            </div>
          </div>
        )

      case "messageEvent":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">节点标签</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="messageName">消息名称</Label>
              <Input
                id="messageName"
                value={config.messageName || ""}
                onChange={(e) => setConfig({ ...config, messageName: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correlationKey">关联键</Label>
              <Input
                id="correlationKey"
                value={config.correlationKey || ""}
                onChange={(e) => setConfig({ ...config, correlationKey: e.target.value })}
                disabled={readOnly}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <Tabs defaultValue="config">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config">基本配置</TabsTrigger>
          <TabsTrigger value="advanced">高级设置</TabsTrigger>
        </TabsList>
        <TabsContent value="config" className="space-y-4 py-4">
          {renderConfigForm()}
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>节点ID</Label>
            <div className="rounded-md bg-muted p-2">
              <code className="text-xs">{node.id}</code>
            </div>
          </div>
          <div className="space-y-2">
            <Label>节点类型</Label>
            <div className="rounded-md bg-muted p-2">
              <code className="text-xs">{node.type}</code>
            </div>
          </div>
          <div className="space-y-2">
            <Label>节点位置</Label>
            <div className="rounded-md bg-muted p-2">
              <code className="text-xs">
                X: {Math.round(node.position.x)}, Y: {Math.round(node.position.y)}
              </code>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          {readOnly ? "关闭" : "取消"}
        </Button>
        {!readOnly && <Button onClick={handleSave}>保存</Button>}
      </div>
    </div>
  )
}
