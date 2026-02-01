import { Handle, Position } from "reactflow"

export function EmailTaskNode({
  data,
}: {
  data: {
    label?: string
    config?: {
      to?: string
      subject?: string
      content?: string
    }
  }
}) {
  const config = data.config || {}

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-white">
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
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "邮件任务"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {config.to && (
          <div className="mb-1">
            <span className="text-muted-foreground">收件人: </span>
            <span>{config.to}</span>
          </div>
        )}
        {config.subject && (
          <div className="mb-1">
            <span className="text-muted-foreground">主题: </span>
            <span>{config.subject}</span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
