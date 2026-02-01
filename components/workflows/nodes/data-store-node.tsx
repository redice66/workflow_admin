import { Handle, Position } from "reactflow"

export function DataStoreNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      capacity?: string
      persistent?: boolean
    }
  }
}) {
  const config = data.config || {}

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-500 text-white">
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
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "数据存储"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {config.capacity && (
          <div className="mb-1">
            <span className="text-muted-foreground">容量: </span>
            <span>{config.capacity}</span>
          </div>
        )}
        <div className="mb-1">
          <span className="text-muted-foreground">持久化: </span>
          <span>{config.persistent ? "是" : "否"}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
