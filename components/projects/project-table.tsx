"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Eye, FileText, MoreHorizontal, Pencil, Power, PowerOff, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { type Project, deleteProject, toggleProjectStatus } from "@/lib/api/projects-api"
import { EditProjectDialog } from "./edit-project-dialog"
import { ProjectPreviewDialog } from "./project-preview-dialog"
import { ProjectContentDialog } from "./project-content-dialog"

interface ProjectTableProps {
  projects: Project[]
  loading: boolean
  onProjectsChange: () => void
}

export function ProjectTable({ projects, loading, onProjectsChange }: ProjectTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [previewProject, setPreviewProject] = useState<Project | null>(null)
  const [contentProject, setContentProject] = useState<Project | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteProject(id)
      if (response.success) {
        toast({
          title: "项目删除成功",
          description: response.message,
        })
        onProjectsChange() // 重新获取项目列表
      } else {
        toast({
          title: "项目删除失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "项目删除失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await toggleProjectStatus(id)
      if (response.success) {
        toast({
          title: "状态更新成功",
          description: response.message,
        })
        onProjectsChange() // 重新获取项目列表
      } else {
        toast({
          title: "状态更新失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "状态更新失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    }
  }

  const handlePreview = (project: Project) => {
    setPreviewProject(project)
    setIsPreviewDialogOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditProject(project)
    setIsEditDialogOpen(true)
  }

  const handleContent = (project: Project) => {
    setContentProject(project)
    setIsContentDialogOpen(true)
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>项目ID</TableHead>
              <TableHead>项目名称</TableHead>
              <TableHead>C端展示名称</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建人</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>更新人</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.displayName || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={project.status === "active" ? "default" : "secondary"}
                      className={project.status === "active" ? "bg-blue-500" : "bg-gray-500"}
                    >
                      {project.status === "active" ? "启用" : "停用"}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.createdBy}</TableCell>
                  <TableCell>{project.createdAt}</TableCell>
                  <TableCell>{project.updatedBy}</TableCell>
                  <TableCell>{project.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>项目操作</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handlePreview(project)}>
                          <Eye className="mr-2 h-4 w-4" />
                          预览
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(project)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContent(project)}>
                          <FileText className="mr-2 h-4 w-4" />
                          内容
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleStatus(project.id)}>
                          {project.status === "active" ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" />
                              停用
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              启用
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(project.id)}
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

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>您确定要删除这个项目吗？此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editProject && (
        <EditProjectDialog
          project={editProject}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={onProjectsChange}
        />
      )}

      {previewProject && (
        <ProjectPreviewDialog project={previewProject} open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen} />
      )}

      {contentProject && (
        <ProjectContentDialog project={contentProject} open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen} />
      )}
    </>
  )
} 