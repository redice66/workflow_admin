import { Handle, Position } from "reactflow"

export function InclusiveGatewayNode({
  data,
}: {
  data: {
    label?: string
    conditions?: Array<{
      condition: string
    }>
  }
}) {
  const conditions = data.conditions || [{ condition: "条件1" }, { condition: "条件2" }]

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
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "包容网关"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        <div className="mb-1 text-muted-foreground">满足条件的分支都会执行</div>
        {conditions.map((condition, index) => (
          <div key={index} className="mb-2">
            <div className="mb-1 font-medium text-muted-foreground">条件 {index + 1}</div>
            <div className="rounded bg-muted p-1">
              <code>{condition.condition}</code>
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id={String.fromCharCode(97 + index)} // a, b, c, ...
              style={{ top: 80 + index * 40 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
