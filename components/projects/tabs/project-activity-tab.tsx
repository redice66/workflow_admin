"use client"

import { useState } from "react"
import { Activity, User, Clock, FileText, Users, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { type Project } from "@/lib/api/projects-api"

interface ProjectActivityTabProps {
  project: Project
}

export function ProjectActivityTab({ project }: ProjectActivityTabProps) {
  // Mock 活动数据
  const mockActivities = [
    {
      id: "1",
      type: "field_added",
      description: "添加了新字段 \"项目状态\"",
      user: "张三",
      timestamp: "2024-01-20 10:30:00",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: "2", 
      type: "role_updated",
      description: "更新了角色 \"项目经理\" 的权限设置",
      user: "李四",
      timestamp: "2024-01-20 09:15:00",
      icon: Users,
      color: "bg-green-500",
    },
    {
      id: "3",
      type: "stage_added", 
      description: "新增了项目阶段 \"验收测试\"",
      user: "王五",
      timestamp: "2024-01-19 16:45:00",
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      id: "4",
      type: "settings_changed",
      description: "修改了项目设置",
      user: "赵六",
      timestamp: "2024-01-19 14:20:00",
      icon: Settings,
      color: "bg-purple-500",
    },
  ]

  const getActivityTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      field_added: "字段添加",
      field_updated: "字段更新", 
      field_deleted: "字段删除",
      role_added: "角色添加",
      role_updated: "角色更新",
      role_deleted: "角色删除",
      stage_added: "阶段添加",
      stage_updated: "阶段更新",
      stage_deleted: "阶段删除",
      settings_changed: "设置变更",
      content_added: "内容添加",
      content_updated: "内容更新",
    }
    return typeMap[type] || "其他操作"
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        <h3 className="text-lg font-medium">项目动态</h3>
        <Badge variant="outline" className="ml-2">
          {mockActivities.length} 条记录
        </Badge>
      </div>

      {/* 活动时间线 */}
      <div className="space-y-4">
        {mockActivities.length === 0 ? (
          <div className="text-center py-10 border rounded-lg">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">暂无项目动态</p>
          </div>
        ) : (
          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
            
            {mockActivities.map((activity, index) => {
              const IconComponent = activity.icon
              return (
                <div key={activity.id} className="relative flex gap-4 pb-6">
                  {/* 图标 */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${activity.color} text-white relative z-10`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getActivityTypeLabel(activity.type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {activity.timestamp}
                      </span>
                    </div>

                    <p className="text-sm font-medium mb-1">{activity.description}</p>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>操作人: {activity.user}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center p-3 border rounded-lg">
          <FileText className="h-6 w-6 text-blue-500 mx-auto mb-1" />
          <p className="text-sm font-medium">字段变更</p>
          <p className="text-lg font-bold">
            {mockActivities.filter(a => a.type.includes('field')).length}
          </p>
        </div>
        <div className="text-center p-3 border rounded-lg">
          <Users className="h-6 w-6 text-green-500 mx-auto mb-1" />
          <p className="text-sm font-medium">角色变更</p>
          <p className="text-lg font-bold">
            {mockActivities.filter(a => a.type.includes('role')).length}
          </p>
        </div>
        <div className="text-center p-3 border rounded-lg">
          <Clock className="h-6 w-6 text-orange-500 mx-auto mb-1" />
          <p className="text-sm font-medium">阶段变更</p>
          <p className="text-lg font-bold">
            {mockActivities.filter(a => a.type.includes('stage')).length}
          </p>
        </div>
        <div className="text-center p-3 border rounded-lg">
          <Settings className="h-6 w-6 text-purple-500 mx-auto mb-1" />
          <p className="text-sm font-medium">设置变更</p>
          <p className="text-lg font-bold">
            {mockActivities.filter(a => a.type.includes('settings')).length}
          </p>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        <p>• 展示项目相关的所有变更内容和操作记录</p>
        <p>• 包括字段变更、角色权限调整、阶段配置等操作历史</p>
        <p>• 支持按时间顺序查看项目的演变过程</p>
      </div>
    </div>
  )
} 