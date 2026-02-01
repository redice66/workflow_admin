import { Handle, Position } from "reactflow"

export function ExclusiveGatewayNode({
  data,
}: {
  data: {
    label?: string
    conditions?: Array<{
      type: string
      condition: string
    }>
  }
}) {
  const conditions = data.conditions || [
    { type: "IF", condition: "条件1" },
    { type: "ELSE", condition: "" },
  ]

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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "排他网关"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        {conditions.map((condition, index) => (
          <div key={index} className="mb-2">
            <div className="mb-1 font-medium text-muted-foreground">{condition.type}</div>
            {condition.condition && (
              <div className="rounded bg-muted p-1">
                <code>{condition.condition}</code>
              </div>
            )}
            <Handle
              type="source"
              position={Position.Right}
              id={String.fromCharCode(97 + index)} // a, b, c, ...
              style={{ top: 60 + index * 40 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
