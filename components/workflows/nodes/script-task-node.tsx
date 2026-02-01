import { Handle, Position } from "reactflow"

export function ScriptTaskNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      language?: string
      script?: string
    }
  }
}) {
  const config = data.config || {}

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-white">
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
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "脚本任务"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {config.language && (
          <div className="mb-1">
            <span className="text-muted-foreground">语言: </span>
            <span>{config.language}</span>
          </div>
        )}
        {config.script && (
          <div className="mb-1">
            <span className="text-muted-foreground">脚本: </span>
            <div className="mt-1 rounded bg-muted p-1">
              <code className="text-xs">
                {config.script.length > 50 ? config.script.substring(0, 50) + "..." : config.script}
              </code>
            </div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
