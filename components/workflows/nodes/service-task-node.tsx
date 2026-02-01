import { Handle, Position } from "reactflow"

export function ServiceTaskNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      service?: string
      method?: string
      parameters?: string
    }
  }
}) {
  const config = data.config || {}

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "服务任务"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {config.service && (
          <div className="mb-1">
            <span className="text-muted-foreground">服务: </span>
            <span>{config.service}</span>
          </div>
        )}
        {config.method && (
          <div className="mb-1">
            <span className="text-muted-foreground">方法: </span>
            <span>{config.method}</span>
          </div>
        )}
        {config.parameters && (
          <div className="mb-1">
            <span className="text-muted-foreground">参数: </span>
            <span>{config.parameters}</span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
