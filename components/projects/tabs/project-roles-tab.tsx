"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Shield, Users, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { type Project, type ProjectRole, getProjectRoles } from "@/lib/api/projects-api"
import { ProjectRolePermissionsDrawer } from "../project-role-permissions-drawer"

interface ProjectRolesTabProps {
  project: Project
}

type RoleType = "项目角色" | "平台角色" | "数据角色"

interface ProjectRoleForm {
  roleName: string
  clientName: string
  roleType: RoleType
  description: string
}

interface Permission {
  id: string
  name: string
  type: "all" | "specific"
  specificRoles?: string[]
}

interface RoleFromRoleTable {
  id: string
  name: string
  type: RoleType
  status: "active" | "inactive"
}

export function ProjectRolesTab({ project }: ProjectRolesTabProps) {
  const [roles, setRoles] = useState<ProjectRole[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<ProjectRole | null>(null)
  const [isPermissionsDrawerOpen, setIsPermissionsDrawerOpen] = useState(false)
  
  // New role dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPermissionsConfigOpen, setIsPermissionsConfigOpen] = useState(false)
  
  // Form states
  const [roleForm, setRoleForm] = useState<ProjectRoleForm>({
    roleName: "",
    clientName: "",
    roleType: "项目角色",
    description: ""
  })
  const [editingRole, setEditingRole] = useState<ProjectRole | null>(null)
  const [deletingRole, setDeletingRole] = useState<ProjectRole | null>(null)
  const [permissionConfigRole, setPermissionConfigRole] = useState<ProjectRole | null>(null)
  
  // Permissions state
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: "create", name: "项目创建", type: "all" },
    { id: "delete", name: "项目删除", type: "all" },
    { id: "edit", name: "项目编辑", type: "all" },
    { id: "view", name: "项目查看", type: "all" },
    { id: "assign", name: "项目人员角色分配", type: "all" }
  ])
  
  // Mock data for roles from role-table
  const [availableRoles] = useState<RoleFromRoleTable[]>([
    { id: "role_001", name: "项目经理", type: "项目角色", status: "active" },
    { id: "role_002", name: "系统管理员", type: "平台角色", status: "active" },
    { id: "role_003", name: "数据分析师", type: "数据角色", status: "active" },
    { id: "role_005", name: "产品经理", type: "项目角色", status: "active" },
  ])
  
  const { toast } = useToast()

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const response = await getProjectRoles(project.id)
      if (response.success && response.data) {
        setRoles(response.data)
      } else {
        toast({
          title: "获取角色列表失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "获取角色列表失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [project.id])

  const handleOpenPermissions = (role: ProjectRole) => {
    setSelectedRole(role)
    setIsPermissionsDrawerOpen(true)
  }

  // Reset form
  const resetForm = () => {
    setRoleForm({
      roleName: "",
      clientName: "",
      roleType: "项目角色",
      description: ""
    })
  }

  // Handle add role
  const handleAddRole = () => {
    setIsAddDialogOpen(true)
    resetForm()
  }

  // Handle save new role
  const handleSaveRole = () => {
    if (!roleForm.roleName.trim() || !roleForm.description.trim()) {
      toast({
        title: "请填写必填字段",
        description: "角色名称和角色释义不能为空",
        variant: "destructive",
      })
      return
    }

    // Create new role object
    const newRole: ProjectRole = {
      id: `role_${Date.now()}`,
      projectId: project.id,
      roleId: `role_${Date.now()}_role`,
      roleName: roleForm.roleName,
      displayName: roleForm.clientName,
      identity: roleForm.roleType,
      definition: roleForm.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setRoles([...roles, newRole])
    setIsAddDialogOpen(false)
    resetForm()
    
    toast({
      title: "新增成功",
      description: "角色已成功添加",
    })
  }

  // Handle edit role
  const handleEditRole = (role: ProjectRole) => {
    setEditingRole(role)
    setRoleForm({
      roleName: role.roleName,
      clientName: role.displayName || "",
      roleType: role.identity as RoleType,
      description: role.definition,
    })
    setIsEditDialogOpen(true)
  }

  // Handle save edited role
  const handleSaveEditedRole = () => {
    if (!roleForm.roleName.trim() || !roleForm.description.trim()) {
      toast({
        title: "请填写必填字段",
        description: "角色名称和角色释义不能为空",
        variant: "destructive",
      })
      return
    }

    if (!editingRole) return

    const updatedRoles = roles.map(role =>
      role.id === editingRole.id
        ? {
            ...role,
            roleName: roleForm.roleName,
            displayName: roleForm.clientName,
            identity: roleForm.roleType,
            definition: roleForm.description,
            updatedAt: new Date().toISOString(),
          }
        : role
    )

    setRoles(updatedRoles)
    setIsEditDialogOpen(false)
    setEditingRole(null)
    resetForm()
    
    toast({
      title: "更新成功",
      description: "角色信息已成功更新",
    })
  }

  // Handle delete role
  const handleDeleteRole = (role: ProjectRole) => {
    setDeletingRole(role)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete role
  const confirmDeleteRole = () => {
    if (!deletingRole) return

    setRoles(roles.filter(role => role.id !== deletingRole.id))
    setIsDeleteDialogOpen(false)
    setDeletingRole(null)
    
    toast({
      title: "删除成功",
      description: "角色已成功删除",
    })
  }

  // Handle permissions config
  const handlePermissionsConfig = (role: ProjectRole) => {
    setPermissionConfigRole(role)
    setIsPermissionsConfigOpen(true)
  }

  // Handle permission type change
  const handlePermissionTypeChange = (permissionId: string, type: "all" | "specific") => {
    setPermissions(permissions.map(permission =>
      permission.id === permissionId
        ? { ...permission, type, specificRoles: type === "specific" ? [] : undefined }
        : permission
    ))
  }

  // Handle specific roles change
  const handleSpecificRolesChange = (permissionId: string, roleIds: string[]) => {
    setPermissions(permissions.map(permission =>
      permission.id === permissionId
        ? { ...permission, specificRoles: roleIds }
        : permission
    ))
  }

  // Get available roles for permission configuration
  const getAvailableRolesForPermission = (roleType: RoleType) => {
    return availableRoles.filter(role => 
      role.status === "active" && role.type === roleType
    )
  }

  // Save permissions configuration
  const handleSavePermissions = () => {
    // TODO: 调用权限保存接口
    setIsPermissionsConfigOpen(false)
    setPermissionConfigRole(null)
    
    toast({
      title: "权限配置已保存",
      description: "权限配置已成功保存",
    })
  }

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
    <>
      <div className="space-y-6">
        {/* 操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h3 className="text-lg font-medium">成员角色</h3>
          </div>
          <Button onClick={handleAddRole} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新增角色
          </Button>
        </div>

        {/* 角色表格 */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>角色名称</TableHead>
                <TableHead>C端名称</TableHead>
                <TableHead>身份</TableHead>
                <TableHead>定义</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    暂无角色数据
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.roleName}</TableCell>
                    <TableCell>{role.displayName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={role.identity === "管理者" ? "default" : "secondary"}
                        className={role.identity === "管理者" ? "bg-blue-500" : "bg-gray-500"}
                      >
                        {role.identity}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{role.definition}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePermissionsConfig(role)}>
                            <Shield className="mr-2 h-4 w-4" />
                            权限
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditRole(role)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRole(role)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 角色统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium">总角色数</h4>
            </div>
            <p className="text-2xl font-bold mt-2">{roles.length}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <h4 className="font-medium">管理角色</h4>
            </div>
            <p className="text-2xl font-bold mt-2">
              {roles.filter(role => role.identity === "管理者").length}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <h4 className="font-medium">执行角色</h4>
            </div>
            <p className="text-2xl font-bold mt-2">
              {roles.filter(role => role.identity === "执行者").length}
            </p>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
          <p>• 角色表格展示角色名称、C端名、身份、定义</p>
          <p>• 点击"权限"按钮可进入权限抽屉页配置详细权限</p>
          <p>• 支持配置页面权限、字段权限、事项权限、可见性等</p>
        </div>
      </div>

      {/* 权限配置抽屉 */}
      {selectedRole && (
        <ProjectRolePermissionsDrawer
          role={selectedRole}
          project={project}
          open={isPermissionsDrawerOpen}
          onOpenChange={setIsPermissionsDrawerOpen}
        />
      )}

      {/* 新增角色对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>新增角色</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="roleName">角色名称</Label>
                <Input
                  id="roleName"
                  value={roleForm.roleName}
                  onChange={(e) => setRoleForm({...roleForm, roleName: e.target.value})}
                  placeholder="请输入角色名称"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientName">C端名称</Label>
                <Input
                  id="clientName"
                  value={roleForm.clientName}
                  onChange={(e) => setRoleForm({...roleForm, clientName: e.target.value})}
                  placeholder="请输入C端名称"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roleType">角色类型</Label>
              <Select value={roleForm.roleType} onValueChange={(value: RoleType) => setRoleForm({...roleForm, roleType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="项目角色">项目角色</SelectItem>
                  <SelectItem value="平台角色">平台角色</SelectItem>
                  <SelectItem value="数据角色">数据角色</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">角色释义</Label>
              <Textarea
                id="description"
                value={roleForm.description}
                onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                placeholder="请输入角色释义"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveRole}>
              确认
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑角色对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑角色</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editRoleName">角色名称</Label>
                <Input
                  id="editRoleName"
                  value={roleForm.roleName}
                  onChange={(e) => setRoleForm({...roleForm, roleName: e.target.value})}
                  placeholder="请输入角色名称"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editClientName">C端名称</Label>
                <Input
                  id="editClientName"
                  value={roleForm.clientName}
                  onChange={(e) => setRoleForm({...roleForm, clientName: e.target.value})}
                  placeholder="请输入C端名称"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editRoleType">角色类型</Label>
              <Select value={roleForm.roleType} onValueChange={(value: RoleType) => setRoleForm({...roleForm, roleType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="项目角色">项目角色</SelectItem>
                  <SelectItem value="平台角色">平台角色</SelectItem>
                  <SelectItem value="数据角色">数据角色</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editDescription">角色释义</Label>
              <Textarea
                id="editDescription"
                value={roleForm.description}
                onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                placeholder="请输入角色释义"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveEditedRole}>
              确认
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除角色 "{deletingRole?.roleName}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRole} className="bg-destructive text-destructive-foreground">
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 权限配置抽屉 */}
      <Sheet open={isPermissionsConfigOpen} onOpenChange={setIsPermissionsConfigOpen}>
        <SheetContent side="right" className="w-[30vw] min-w-[520px] max-w-[90vw] sm:w-full sm:max-w-full flex flex-col">
          <SheetHeader className="border-b">
            <SheetTitle className="text-xl font-semibold">
              项目角色权限配置
            </SheetTitle>
            <div className="text-sm text-gray-600 pt-2 pb-4">
              配置角色：{permissionConfigRole?.roleName}
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-8 py-6 px-6">
              {permissions.map((permission, index) => (
                <div key={permission.id}>
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium text-gray-900 flex items-center gap-1">
                      {permission.type === "specific" && <span className="text-red-500">*</span>}
                      {permission.name}
                    </Label>
                    <RadioGroup
                      value={permission.type}
                      onValueChange={(value: "all" | "specific") => handlePermissionTypeChange(permission.id, value)}
                      className="!grid-none flex items-center space-x-8"
                      style={{ display: 'flex' }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id={`${permission.id}-all`} />
                        <Label htmlFor={`${permission.id}-all`} className="text-sm font-normal cursor-pointer">
                          全部角色
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific" id={`${permission.id}-specific`} />
                        <Label htmlFor={`${permission.id}-specific`} className="text-sm font-normal cursor-pointer">
                          指定角色
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {permission.type === "specific" && (
                    <div className="mt-4 pl-6">
                      <div className="w-full max-w-md">
                        <Select
                          value={permission.specificRoles?.[0] || ""}
                          onValueChange={(value) => handleSpecificRolesChange(permission.id, value ? [value] : [])}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="请选择角色..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableRolesForPermission(permissionConfigRole?.identity as RoleType || "项目角色").map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {index < permissions.length - 1 && (
                    <div className="border-b border-gray-100 mt-8"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsPermissionsConfigOpen(false)}
            >
              取消
            </Button>
            <Button 
              onClick={handleSavePermissions}
            >
              保存
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
} 