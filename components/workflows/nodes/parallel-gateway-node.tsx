import { Handle, Position } from "reactflow"

export function ParallelGatewayNode({
  data,
}: {
  data: {
    label?: string
    branches?: number
  }
}) {
  const branches = data.branches || 2

  return (
    <div className="flex w-48 flex-col rounded-lg border bg-white shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span className="text-sm font-medium">{data.label || "并行网关"}</span>
        </div>
      </div>
      <div className="p-3 text-xs">
        <div className="mb-1 text-muted-foreground">并行分支数: {branches}</div>
        <div className="mb-1 text-muted-foreground">所有分支完成后合并</div>

        {/* 动态创建多个输出连接点 */}
        {Array.from({ length: branches }).map((_, index) => (
          <Handle
            key={index}
            type="source"
            position={Position.Right}
            id={String.fromCharCode(97 + index)} // a, b, c, ...
            style={{ top: 60 + index * 20 }}
          />
        ))}
      </div>
    </div>
  )
}
