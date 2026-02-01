import { Handle, Position } from "reactflow"

export function HttpRequestNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      method?: string
      url?: string
      headers?: string
      body?: string
    }
  }
}) {
  const config = data.config || {}

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "HTTP请求"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {config.method && (
          <div className="mb-1">
            <span className="text-muted-foreground">方法: </span>
            <span>{config.method}</span>
          </div>
        )}
        {config.url && (
          <div className="mb-1">
            <span className="text-muted-foreground">URL: </span>
            <span className="truncate block">{config.url}</span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
