import { Handle, Position } from "reactflow"

export function DataObjectNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      dataType?: string
      isCollection?: boolean
    }
  }
}) {
  const config = data.config || {}

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white">
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "数据对象"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {config.dataType && (
          <div className="mb-1">
            <span className="text-muted-foreground">数据类型: </span>
            <span>{config.dataType}</span>
          </div>
        )}
        <div className="mb-1">
          <span className="text-muted-foreground">集合: </span>
          <span>{config.isCollection ? "是" : "否"}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
