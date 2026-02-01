"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface WorkflowPermissionsProps {
  workflowId: string
  onClose: () => void
}

// TODO: 从后端API获取可用角色列表
const availableRoles = [
  { id: "admin", name: "管理员" },
  { id: "manager", name: "经理" },
  { id: "user", name: "普通用户" },
  { id: "guest", name: "访客" },
]

export function WorkflowPermissionsEditor({ workflowId, onClose }: WorkflowPermissionsProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [permissions, setPermissions] = useState({
    viewRoles: [] as string[],
    editRoles: [] as string[],
    executeRoles: [] as string[],
    adminRoles: [] as string[],
  })

  // 加载工作流权限
  useEffect(() => {
    const fetchWorkflowPermissions = async () => {
      setIsLoading(true)
      try {
        // TODO: 从后端API获取工作流权限
        // const response = await fetch(`/api/workflows/${workflowId}/permissions`);
        // if (!response.ok) throw new Error('Failed to fetch workflow permissions');
        // const data = await response.json();
        // setPermissions(data);

        // 模拟数据
        setPermissions({
          viewRoles: ["admin", "manager"],
          editRoles: ["admin"],
          executeRoles: ["admin", "manager"],
          adminRoles: ["admin"],
        })

        console.log("应该从API获取工作流权限, ID:", workflowId)
      } catch (error) {
        toast({
          title: "加载失败",
          description: error instanceof Error ? error.message : "加载工作流权限失败",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkflowPermissions()
  }, [workflowId, toast])

  // 处理角色选择变更
  const handleRoleToggle = (role: string, permissionType: keyof typeof permissions) => {
    setPermissions((prev) => {
      const currentRoles = [...prev[permissionType]]
      const newRoles = currentRoles.includes(role) ? currentRoles.filter((r) => r !== role) : [...currentRoles, role]

      return {
        ...prev,
        [permissionType]: newRoles,
      }
    })
  }

  // 保存权限设置
  const handleSavePermissions = async () => {
    setIsSaving(true)
    try {
      // TODO: 调用后端API保存工作流权限
      // const response = await fetch(`/api/workflows/${workflowId}/permissions`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(permissions)
      // });
      // if (!response.ok) throw new Error('Failed to update workflow permissions');

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("应该保存工作流权限到后端, ID:", workflowId, "权限:", permissions)

      toast({
        title: "保存成功",
        description: "工作流权限设置已更新",
      })

      onClose()
    } catch (error) {
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "更新工作流权限失败",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>权限设置</CardTitle>
          <CardDescription>管理此工作流的访问和操作权限</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 查看权限 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">查看权限</Label>
              <div className="flex gap-1">
                {permissions.viewRoles.map((role) => (
                  <Badge key={role} variant="outline">
                    {availableRoles.find((r) => r.id === role)?.name || role}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`view-${role.id}`}
                    checked={permissions.viewRoles.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleToggle(role.id, "viewRoles")}
                  />
                  <Label htmlFor={`view-${role.id}`} className="text-sm font-normal">
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">可以查看工作流定义和执行状态的角色</p>
          </div>

          {/* 编辑权限 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">编辑权限</Label>
              <div className="flex gap-1">
                {permissions.editRoles.map((role) => (
                  <Badge key={role} variant="outline">
                    {availableRoles.find((r) => r.id === role)?.name || role}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${role.id}`}
                    checked={permissions.editRoles.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleToggle(role.id, "editRoles")}
                  />
                  <Label htmlFor={`edit-${role.id}`} className="text-sm font-normal">
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">可以修改工作流定义的角色</p>
          </div>

          {/* 执行权限 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">执行权限</Label>
              <div className="flex gap-1">
                {permissions.executeRoles.map((role) => (
                  <Badge key={role} variant="outline">
                    {availableRoles.find((r) => r.id === role)?.name || role}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`execute-${role.id}`}
                    checked={permissions.executeRoles.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleToggle(role.id, "executeRoles")}
                  />
                  <Label htmlFor={`execute-${role.id}`} className="text-sm font-normal">
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">可以执行和触发工作流的角色</p>
          </div>

          {/* 管理权限 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">管理权限</Label>
              <div className="flex gap-1">
                {permissions.adminRoles.map((role) => (
                  <Badge key={role} variant="outline">
                    {availableRoles.find((r) => r.id === role)?.name || role}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`admin-${role.id}`}
                    checked={permissions.adminRoles.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleToggle(role.id, "adminRoles")}
                  />
                  <Label htmlFor={`admin-${role.id}`} className="text-sm font-normal">
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">可以管理工作流权限和发布状态的角色</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePermissions} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                保存中...
              </>
            ) : (
              "保存权限设置"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
