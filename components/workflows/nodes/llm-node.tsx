import { Handle, Position } from "reactflow"

export function LLMNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      model?: string
      modelType?: string
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "LLM"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
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
