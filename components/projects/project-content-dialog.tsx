"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Settings, Clock, FolderOpen, Users, Activity } from "lucide-react"
import { type Project } from "@/lib/api/projects-api"
import { ProjectFieldsTab } from "./tabs/project-fields-tab"
import { ProjectSettingsTab } from "./tabs/project-settings-tab"
import { ProjectStagesTab } from "./tabs/project-stages-tab"
import { ProjectContentTab } from "./tabs/project-content-tab"
import { ProjectRolesTab } from "./tabs/project-roles-tab"
import { ProjectActivityTab } from "./tabs/project-activity-tab"

interface ProjectContentDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectContentDialog({ project, open, onOpenChange }: ProjectContentDialogProps) {
  const [activeTab, setActiveTab] = useState("fields")

  const modules = [
    {
      id: "fields",
      title: "项目页面",
      description: "配置项目的字段信息和属性",
      icon: Database,
    },
    {
      id: "settings",
      title: "项目设置",
      description: "统一控制字段显示和编辑权限",
      icon: Settings,
    },
    {
      id: "stages",
      title: "事项阶段",
      description: "管理项目的各个阶段配置",
      icon: Clock,
    },
    {
      id: "content",
      title: "内容库",
      description: "按阶段配置内容模块",
      icon: FolderOpen,
    },
    {
      id: "roles",
      title: "成员角色",
      description: "管理项目角色和权限设置",
      icon: Users,
    },
    {
      id: "activity",
      title: "项目动态",
      description: "查看项目相关变更记录",
      icon: Activity,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">项目内容 | {project.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-6">
              {modules.map((module) => (
                <TabsTrigger
                  key={module.id}
                  value={module.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <module.icon className="h-4 w-4" />
                  {module.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="fields" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <ProjectFieldsTab project={project} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <ProjectSettingsTab project={project} />
            </TabsContent>

            <TabsContent value="stages" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <ProjectStagesTab project={project} />
            </TabsContent>

            <TabsContent value="content" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <ProjectContentTab project={project} />
            </TabsContent>

            <TabsContent value="roles" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <ProjectRolesTab project={project} />
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <ProjectActivityTab project={project} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">确定</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 