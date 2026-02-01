"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Select from 'react-select'
import { FixedSizeList as List } from 'react-window'
import type { Task } from "@/lib/api/task-api"
import { fetchEnabledRoles } from '@/lib/api/roles-api'
import { saveTaskPermissions } from '@/lib/api/task-permissions-api'

interface TaskPermissionsDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PermissionSetting {
  type: string
  label: string
  allRoles: boolean
  selectedRoles: string[]
}

interface User {
  id: string
  name: string
  roleId: string
  roleName: string
}

interface Role {
  id: string
  name: string
  // users: User[] // 不再依赖users字段
}

interface SelectOption {
  value: string
  label: string
  role: string
}

// 虚拟滚动菜单组件
const VirtualizedMenuList = (props: any) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * 35;

  return (
    <List
      width="100%"
      height={Math.min(maxHeight, 200)}
      itemCount={children.length}
      itemSize={35}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => (
        <div style={style}>{children[index]}</div>
      )}
    </List>
  );
};

export function TaskPermissionsDialog({ task, open, onOpenChange }: TaskPermissionsDialogProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([])

  // 权限设置状态
  const [permissions, setPermissions] = useState<PermissionSetting[]>([
    {
      type: "create",
      label: "创建",
      allRoles: true,
      selectedRoles: [],
    },
    {
      type: "view",
      label: "查看",
      allRoles: true,
      selectedRoles: [],
    },
    {
      type: "edit",
      label: "编辑",
      allRoles: true,
      selectedRoles: [],
    },
    {
      type: "delete",
      label: "删除",
      allRoles: true,
      selectedRoles: [],
    },
  ])

  // 加载角色数据
  useEffect(() => {
    if (open) {
      loadRoles()
    }
  }, [open])

  const loadRoles = async () => {
    try {
      // 从接口获取启用角色
      const enabledRoles = await fetchEnabledRoles()
      setAvailableRoles(enabledRoles)
      const options: SelectOption[] = enabledRoles.map((role) => ({
        value: String(role.id),
        label: role.name,
        role: role.name,
      }))
      setSelectOptions(options)
    } catch (error) {
      console.error("加载角色数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载角色数据，请重试",
        variant: "destructive",
      })
    }
  }

  const handlePermissionTypeChange = (type: string, allRoles: boolean) => {
    setPermissions(
      permissions.map((permission) =>
        permission.type === type
          ? { ...permission, allRoles, selectedRoles: allRoles ? [] : permission.selectedRoles }
          : permission,
      ),
    )
  }

  const handleRoleSelectionChange = (type: string, selectedOptions: SelectOption[]) => {
    const selectedIds = selectedOptions.map(option => option.value)
    setPermissions(
      permissions.map((permission) =>
        permission.type === type
          ? { ...permission, selectedRoles: selectedIds }
          : permission,
      ),
    )
  }

  const handleSave = async () => {
    // 校验：所有指定角色的权限必须至少选择一个角色
    for (const permission of permissions) {
      if (!permission.allRoles && permission.selectedRoles.length === 0) {
        toast({
          title: `请为"${permission.label}"权限选择至少一个角色`,
          variant: "destructive",
        })
        return
      }
    }
    setSaving(true)
    try {
      // TODO: 调用后端API保存权限配置
      await saveTaskPermissions(String(task.id), permissions)
      toast({
        title: "保存成功",
        description: "事项权限配置已保存",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("保存权限配置失败:", error)
      toast({
        title: "保存失败",
        description: "请重试",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // 自定义Select样式
  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '40px',
      borderColor: '#e2e8f0',
      '&:hover': {
        borderColor: '#cbd5e1',
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#dbeafe',
      border: '1px solid #bfdbfe',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#1e40af',
      fontSize: '0.875rem',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#60a5fa',
      ':hover': {
        backgroundColor: '#bfdbfe',
        color: '#1e40af',
      },
    }),
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-normal text-gray-900">
            事项管理 ｜ {task.name} ｜ 事项权限
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {permissions.map((permission, index) => (
            <div key={permission.type}>
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-gray-900 flex items-center gap-1">
                  {!permission.allRoles && <span className="text-red-500">*</span>}
                    {permission.label}
                  </Label>
                  <RadioGroup
                    value={permission.allRoles ? "all" : "specific"}
                    onValueChange={(value) => handlePermissionTypeChange(permission.type, value === "all")}
                  className="!grid-none flex items-center space-x-8"
                  style={{ display: 'flex' }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id={`${permission.type}-all`} />
                    <Label htmlFor={`${permission.type}-all`} className="text-sm font-normal cursor-pointer">
                      全部角色
                    </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific" id={`${permission.type}-specific`} />
                    <Label htmlFor={`${permission.type}-specific`} className="text-sm font-normal cursor-pointer">
                      指定人员
                    </Label>
                    </div>
                  </RadioGroup>
                </div>

                {!permission.allRoles && (
                <div className="mt-4 pl-6">
                  <div className="w-full max-w-md">
                    <Select
                      isMulti
                      options={selectOptions}
                      value={selectOptions.filter(option => 
                        permission.selectedRoles.includes(option.value)
                      )}
                      onChange={(selectedOptions) => 
                        handleRoleSelectionChange(permission.type, selectedOptions as SelectOption[])
                      }
                      placeholder="请选择角色..."
                      noOptionsMessage={() => "未找到匹配的角色"}
                      isSearchable
                      isClearable
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      styles={selectStyles}
                      components={{
                        MenuList: VirtualizedMenuList,
                      }}
                      maxMenuHeight={200}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                    </div>
                  </div>
                )}

              {index < permissions.length - 1 && (
                <div className="border-b border-gray-100 mt-8"></div>
              )}
              </div>
            ))}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t mt-8">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={saving}
            className="px-8 py-2"
          >
            取消
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2" 
            disabled={saving}
          >
            {saving ? "保存中..." : "确定"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}