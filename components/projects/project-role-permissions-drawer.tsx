"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, FileText, Database, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { type Project, type ProjectRole, type ProjectRolePermission } from "@/types/project"

interface ProjectRolePermissionsDrawerProps {
  role: ProjectRole
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 页面权限配置
const pagePermissions = [
  { id: "project_view", name: "项目查看", description: "查看项目基本信息" },
  { id: "project_edit", name: "项目编辑", description: "编辑项目基本信息" },
  { id: "fields_manage", name: "字段管理", description: "管理项目字段配置" },
  { id: "stages_manage", name: "阶段管理", description: "管理项目阶段配置" },
  { id: "content_manage", name: "内容管理", description: "管理项目内容库" },
  { id: "members_manage", name: "成员管理", description: "管理项目成员和角色" },
]

// 字段权限配置
const fieldPermissions = [
  { id: "field_name", name: "项目名称", description: "项目基本名称字段" },
  { id: "field_display", name: "展示名称", description: "C端展示名称字段" },
  { id: "field_description", name: "项目释义", description: "项目详细描述字段" },
  { id: "field_tags", name: "项目标签", description: "项目分类标签字段" },
  { id: "field_priority", name: "优先级", description: "项目优先级字段" },
  { id: "field_status", name: "状态", description: "项目当前状态字段" },
]

// 事项权限配置
const taskPermissions = [
  { id: "task_create", name: "创建事项", description: "在项目中创建新事项" },
  { id: "task_edit", name: "编辑事项", description: "编辑项目中的事项" },
  { id: "task_delete", name: "删除事项", description: "删除项目中的事项" },
  { id: "task_assign", name: "分配事项", description: "分配事项给其他成员" },
  { id: "task_status", name: "状态流转", description: "更改事项状态" },
  { id: "task_comment", name: "评论事项", description: "在事项中添加评论" },
]

// 可见性权限配置
const visibilityPermissions = [
  { id: "view_all_projects", name: "查看所有项目", description: "查看系统中所有项目" },
  { id: "view_assigned_projects", name: "查看分配项目", description: "仅查看分配给自己的项目" },
  { id: "view_public_projects", name: "查看公开项目", description: "查看标记为公开的项目" },
  { id: "view_team_projects", name: "查看团队项目", description: "查看同团队的项目" },
]

export function ProjectRolePermissionsDrawer({
  role,
  project,
  open,
  onOpenChange,
}: ProjectRolePermissionsDrawerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    // 默认权限设置
    project_view: true,
    project_edit: role.identity === "管理者",
    fields_manage: role.identity === "管理者",
    stages_manage: role.identity === "管理者",
    content_manage: role.identity === "管理者",
    members_manage: role.identity === "管理者",
    
    field_name: true,
    field_display: true,
    field_description: true,
    field_tags: true,
    field_priority: role.identity === "管理者",
    field_status: role.identity === "管理者",
    
    task_create: true,
    task_edit: true,
    task_delete: role.identity === "管理者",
    task_assign: role.identity === "管理者",
    task_status: true,
    task_comment: true,
    
    view_all_projects: role.identity === "管理者",
    view_assigned_projects: true,
    view_public_projects: true,
    view_team_projects: true,
  })

  const handlePermissionChange = (permissionId: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [permissionId]: value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "保存成功",
        description: `已更新角色 ${role.roleName} 的权限配置`,
      })
      
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderPermissionSection = (
    title: string,
    description: string,
    icon: React.ReactNode,
    permissions: typeof pagePermissions,
    permissionType: string
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {permissions.map((permission) => (
          <div key={permission.id} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{permission.name}</div>
              <div className="text-xs text-muted-foreground">{permission.description}</div>
            </div>
            <Switch
              checked={(permissions as any)[permission.id] || false}
              onCheckedChange={(value) => handlePermissionChange(permission.id, value)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            权限配置
          </SheetTitle>
          <SheetDescription>
            为角色 <Badge variant="outline">{role.roleName}</Badge> 配置在项目 <Badge variant="outline">{project.name}</Badge> 中的权限
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* 角色信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">角色信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">角色名称：</span>
                <span className="text-sm font-medium">{role.roleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">C端名称：</span>
                <span className="text-sm font-medium">{role.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">身份：</span>
                <Badge variant={role.identity === "管理者" ? "default" : "secondary"}>
                  {role.identity}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">定义：</span>
                <span className="text-sm font-medium">{role.definition}</span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* 权限配置标签页 */}
          <Tabs defaultValue="pages" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pages">页面权限</TabsTrigger>
              <TabsTrigger value="fields">字段权限</TabsTrigger>
              <TabsTrigger value="tasks">事项权限</TabsTrigger>
              <TabsTrigger value="visibility">可见性权限</TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="space-y-4">
              {renderPermissionSection(
                "页面权限",
                "控制角色可以访问的页面和功能模块",
                <FileText className="h-4 w-4" />,
                pagePermissions,
                "page"
              )}
            </TabsContent>

            <TabsContent value="fields" className="space-y-4">
              {renderPermissionSection(
                "字段权限",
                "控制角色可以查看和编辑的字段",
                <Database className="h-4 w-4" />,
                fieldPermissions,
                "field"
              )}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              {renderPermissionSection(
                "事项权限",
                "控制角色在事项管理中的操作权限",
                <FileText className="h-4 w-4" />,
                taskPermissions,
                "task"
              )}
            </TabsContent>

            <TabsContent value="visibility" className="space-y-4">
              {renderPermissionSection(
                "可见性权限",
                "控制角色可以查看的项目范围",
                <Eye className="h-4 w-4" />,
                visibilityPermissions,
                "visibility"
              )}
            </TabsContent>
          </Tabs>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "保存中..." : "保存配置"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 