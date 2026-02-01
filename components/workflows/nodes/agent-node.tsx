import { Handle, Position } from "reactflow"

export function AgentNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      title?: string
      model?: string
      modelType?: string
      instructions?: string
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "代理"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        <div className="mb-1 text-muted-foreground">{config.title || "常规"}</div>
        <div className="mb-2 text-muted-foreground">{config.instructions || "处理用户输入"}</div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm bg-green-100"></div>
          <span>{config.model || "默认模型"}</span>
          <span className="text-[10px] uppercase text-muted-foreground">{config.modelType || "CHAT"}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
