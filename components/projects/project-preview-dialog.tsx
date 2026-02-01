"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type Project } from "@/lib/api/projects-api"

interface ProjectPreviewDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectPreviewDialog({ project, open, onOpenChange }: ProjectPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-50">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-lg font-medium">项目预览</DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">项目ID</h3>
              <p className="text-sm">{project.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">状态</h3>
              <Badge
                variant={project.status === "active" ? "default" : "secondary"}
                className={project.status === "active" ? "bg-blue-500" : "bg-gray-500"}
              >
                {project.status === "active" ? "启用" : "停用"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">项目名称</h3>
              <p className="text-sm">{project.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">C端展示名称</h3>
              <p className="text-sm">{project.displayName || "-"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">项目释义</h3>
            <p className="text-sm bg-white p-3 rounded border">{project.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">C端提示语</h3>
            <p className="text-sm bg-white p-3 rounded border">{project.displayDescription || "-"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">创建人</h3>
              <p className="text-sm">{project.createdBy}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">创建时间</h3>
              <p className="text-sm">{project.createdAt}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">更新人</h3>
              <p className="text-sm">{project.updatedBy}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">更新时间</h3>
              <p className="text-sm">{project.updatedAt}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            关闭
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 