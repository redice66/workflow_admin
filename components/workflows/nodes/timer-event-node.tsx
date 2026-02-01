import { Handle, Position } from "reactflow"

export function TimerEventNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      expression?: string
      repeat?: boolean
      repeatCount?: number
    }
  }
}) {
  const config = data.config || {}

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
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
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "定时事件"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {config.expression && (
          <div className="mb-1">
            <span className="text-muted-foreground">表达式: </span>
            <span>{config.expression}</span>
          </div>
        )}
        <div className="mb-1">
          <span className="text-muted-foreground">重复: </span>
          <span>{config.repeat ? "是" : "否"}</span>
        </div>
        {config.repeat && config.repeatCount && (
          <div className="mb-1">
            <span className="text-muted-foreground">重复次数: </span>
            <span>{config.repeatCount}</span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
