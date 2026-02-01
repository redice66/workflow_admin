"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { WorkflowPreview } from "./workflow-preview"
import { Eye } from "lucide-react"
import { useNodeStore } from "@/lib/node-store"

interface WorkflowPreviewDialogProps {
  workflowId?: string
  trigger?: React.ReactNode
  title?: string
}

export function WorkflowPreviewDialog({ 
  workflowId, 
  trigger,
  title = "工作流预览"
}: WorkflowPreviewDialogProps) {
  const [open, setOpen] = useState(false)
  const { nodes } = useNodeStore()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            预览
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[85vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <WorkflowPreview 
            workflowId={workflowId}
            onClose={() => setOpen(false)}
            showFullScreen={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}