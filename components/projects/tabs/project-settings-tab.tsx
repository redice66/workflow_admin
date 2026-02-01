"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { type Project } from "@/lib/api/projects-api"

interface ProjectSettingsTabProps {
  project: Project
}

export function ProjectSettingsTab({ project }: ProjectSettingsTabProps) {
  const [settings, setSettings] = useState({
    basicInfo: true,
    announcement: true,
    members: true
  })
  const { toast } = useToast()


  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    // TODO: 调用后端接口更新权限设置
  }


  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* 可设置内容 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">可设置内容</h3>
          <div className="grid gap-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">基本信息</Label>
              <Switch
                checked={settings.basicInfo}
                onCheckedChange={(checked) => handleSettingChange('basicInfo', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">项目公告</Label>
              <Switch
                checked={settings.announcement}
                onCheckedChange={(checked) => handleSettingChange('announcement', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">项目成员</Label>
              <Switch
                checked={settings.members}
                onCheckedChange={(checked) => handleSettingChange('members', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 