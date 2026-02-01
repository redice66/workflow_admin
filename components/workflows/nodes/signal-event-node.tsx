import { Handle, Position } from "reactflow"

export function SignalEventNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      signalRef?: string
      scope?: string
    }
  }
}) {
  const config = data.config || {}

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white">
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
              <path d="M2 20h.01"></path>
              <path d="M7 20v-4"></path>
              <path d="M12 20v-8"></path>
              <path d="M17 20v-12"></path>
              <path d="M22 4v16"></path>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "信号事件"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {config.signalRef && (
          <div className="mb-1">
            <span className="text-muted-foreground">信号引用: </span>
            <span>{config.signalRef}</span>
          </div>
        )}
        {config.scope && (
          <div className="mb-1">
            <span className="text-muted-foreground">作用域: </span>
            <span>{config.scope}</span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
