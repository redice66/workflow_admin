import { Handle, Position } from "reactflow"

export function StartNode({ data }: { data: { label?: string } }) {
  return (
    <div className="flex h-10 w-32 items-center justify-center rounded-full border bg-white px-4 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
        <span className="text-sm font-medium">{data.label || "开始"}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
