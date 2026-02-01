"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, FileText, Pencil, Trash2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { type Project, type ProjectStage, getProjectStages } from "@/lib/api/projects-api"

interface ProjectContentTabProps {
  project: Project
}

export function ProjectContentTab({ project }: ProjectContentTabProps) {
  const [stages, setStages] = useState<ProjectStage[]>([])
  const [selectedStage, setSelectedStage] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchStages = async () => {
    setLoading(true)
    try {
      const response = await getProjectStages(project.id)
      if (response.success && response.data) {
        setStages(response.data)
        if (response.data.length > 0) {
          setSelectedStage(response.data[0].id)
        }
      } else {
        toast({
          title: "获取阶段列表失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "获取阶段列表失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStages()
  }, [project.id])

  // Mock 内容数据
  const mockContents = [
    {
      id: "1",
      title: "需求文档模板",
      description: "标准的需求文档格式",
      stageId: stages[0]?.id || "",
    },
    {
      id: "2",
      title: "设计规范",
      description: "UI/UX设计标准和规范",
      stageId: stages[1]?.id || "",
    },
  ]

  const filteredContents = mockContents.filter(content => 
    !selectedStage || content.stageId === selectedStage
  )

  const currentStage = stages.find(stage => stage.id === selectedStage)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 阶段选择和操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">内容库</h3>
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择阶段" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="flex items-center gap-2" disabled={!selectedStage}>
          <Plus className="h-4 w-4" />
          新增内容
        </Button>
      </div>

      {/* 当前阶段信息 */}
      {currentStage && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              当前阶段
            </Badge>
            <h4 className="font-medium">{currentStage.displayName}</h4>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            阶段名称: {currentStage.name}
          </p>
        </div>
      )}

      {/* 内容列表 */}
      <div className="space-y-4">
        {filteredContents.length === 0 ? (
          <div className="text-center py-10 border rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {selectedStage ? "该阶段暂无内容模块" : "请先选择阶段"}
            </p>
          </div>
        ) : (
          filteredContents.map((content) => (
            <div key={content.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-blue-500" />
              
              <div className="flex-1 space-y-1">
                <h4 className="font-medium">{content.title}</h4>
                <p className="text-sm text-muted-foreground">{content.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 提示信息 */}
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        <p>• 按阶段配置内容模块，支持文档、模板、规范等各类内容</p>
        <p>• 内容模块可以关联到具体的项目阶段</p>
        <p>• 支持对内容进行分类管理和版本控制</p>
      </div>
    </div>
  )
} 