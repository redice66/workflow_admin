import { Handle, Position } from "reactflow"

export function UserTaskNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      assignee?: string
      dueDate?: string
      priority?: string
      description?: string
    }
  }
}) {
  const config = data.config || {}

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "用户任务"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {config.assignee && (
          <div className="mb-1">
            <span className="text-muted-foreground">处理人: </span>
            <span>{config.assignee}</span>
          </div>
        )}
        {config.priority && (
          <div className="mb-1">
            <span className="text-muted-foreground">优先级: </span>
            <span>{config.priority}</span>
          </div>
        )}
        {config.description && (
          <div className="mb-1">
            <span className="text-muted-foreground">描述: </span>
            <span>{config.description}</span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
