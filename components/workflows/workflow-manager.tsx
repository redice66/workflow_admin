"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Edit, Trash2, Play, PauseCircle, Plus, GitBranch, Calendar } from "lucide-react"
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
import * as workflowsApi from "@/lib/api/workflows-api"
import type { Workflow } from "@/lib/api/workflows-api"
import { useToast } from "@/components/ui/use-toast"
import { debounce } from "@/lib/utils"

// TODO: 从后端API获取当前用户的权限信息
const currentUserPermissions = {
  workflows: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    publish: true,
  },
}

export function WorkflowManager() {
  const router = useRouter()
  const { toast } = useToast()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null)

  // 加载工作流列表
  useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // TODO: 从后端API获取工作流列表
        const data = await workflowsApi.getAllWorkflows()
        setWorkflows(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载工作流列表失败")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkflows()
  }, [])

  // Use debounced version of search to prevent excessive re-renders
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchQuery(value)
    }, 300),
    [],
  )

  // Update the debounced search when searchQuery changes
  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  // 过滤工作流列表
  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
  )

  // 删除工作流
  const handleDeleteWorkflow = async () => {
    if (workflowToDelete) {
      try {
        // TODO: 调用后端API删除工作流
        const success = await workflowsApi.deleteWorkflow(workflowToDelete)
        if (success) {
          setWorkflows(workflows.filter((w) => w.id !== workflowToDelete))
          toast({
            title: "删除成功",
            description: "任务流已成功删除",
          })
        }
      } catch (err) {
        toast({
          title: "删除失败",
          description: err instanceof Error ? err.message : "删除任务流失败",
          variant: "destructive",
        })
      } finally {
        setDeleteDialogOpen(false)
        setWorkflowToDelete(null)
      }
    }
  }

  // 确认删除对话框
  const confirmDelete = (id: string) => {
    setWorkflowToDelete(id)
    setDeleteDialogOpen(true)
  }

  // 发布或停用工作流
  const toggleWorkflowStatus = async (id: string, currentStatus: string) => {
    try {
      // TODO: 调用后端API发布或停用工作流
      let updatedWorkflow
      if (currentStatus === "active") {
        updatedWorkflow = await workflowsApi.deactivateWorkflow(id)
        toast({
          title: "操作成功",
          description: "任务流已停用",
        })
      } else {
        updatedWorkflow = await workflowsApi.publishWorkflow(id)
        toast({
          title: "操作成功",
          description: "任务流已激活",
        })
      }

      setWorkflows(workflows.map((w) => (w.id === id ? updatedWorkflow : w)))
    } catch (err) {
      toast({
        title: "操作失败",
        description: err instanceof Error ? err.message : "更改任务流状态失败",
        variant: "destructive",
      })
    }
  }

  // 获取状态标签样式
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // 跳转到添加任务流页面
  const goToAddWorkflow = () => {
    router.push("/dashboard/workflows/create")
  }

  // 跳转到编辑工作流页面
  const goToEditWorkflow = (id: string) => {
    router.push(`/dashboard/workflows/edit/${id}`)
  }

  // 检查权限
  const canCreate = currentUserPermissions.workflows.create
  const canEdit = currentUserPermissions.workflows.edit
  const canDelete = currentUserPermissions.workflows.delete
  const canPublish = currentUserPermissions.workflows.publish

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">任务流管理</h2>
          <p className="text-muted-foreground">管理和监控系统中的工作流</p>
        </div>
        {canCreate && (
          <Button onClick={goToAddWorkflow}>
            <Plus className="mr-2 h-4 w-4" />
            添加任务流
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>任务流列表</CardTitle>
          <CardDescription>系统中的所有任务流及其状态</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索任务流..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>加载失败: {error}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setIsLoading(true)
                  workflowsApi
                    .getAllWorkflows()
                    .then((data) => setWorkflows(data))
                    .catch((err) => setError(err instanceof Error ? err.message : "加载工作流列表失败"))
                    .finally(() => setIsLoading(false))
                }}
              >
                重试
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>版本</TableHead>
                  <TableHead>节点数量</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      没有找到匹配的任务流
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">{workflow.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{workflow.description}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(workflow.status)}>
                          {workflow.status === "active" ? "已激活" : workflow.status === "inactive" ? "已停用" : "草稿"}
                        </Badge>
                      </TableCell>
                      <TableCell>{workflow.version}</TableCell>
                      <TableCell>{workflow.nodes.length}</TableCell>
                      <TableCell>{new Date(workflow.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(workflow.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEdit && (
                              <DropdownMenuItem onClick={() => goToEditWorkflow(workflow.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                编辑
                              </DropdownMenuItem>
                            )}
                            {canPublish && (
                              <DropdownMenuItem onClick={() => toggleWorkflowStatus(workflow.id, workflow.status)}>
                                {workflow.status === "active" ? (
                                  <>
                                    <PauseCircle className="mr-2 h-4 w-4" />
                                    停用
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-2 h-4 w-4" />
                                    激活
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <DropdownMenuItem onClick={() => confirmDelete(workflow.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总任务流数</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredWorkflows.length}</div>
            <p className="text-xs text-muted-foreground">系统中的总任务流数量</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃任务流</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredWorkflows.filter((w) => w.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">当前活跃状态的任务流数量</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">最近更新</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredWorkflows.length > 0
                ? new Date(
                    Math.max(...filteredWorkflows.map((w) => new Date(w.updatedAt).getTime())),
                  ).toLocaleDateString()
                : "无"}
            </div>
            <p className="text-xs text-muted-foreground">最近更新的任务流时间</p>
          </CardContent>
        </Card>
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>您确定要删除此任务流吗？此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkflow} className="bg-destructive text-destructive-foreground">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
