# 按照模板样式的工作流修复说明

## 修复概述

根据您提供的 `EXAMPLE.md` 代码模板，我们严格按照模板样式修改了 `enhanced-workflow-preview.tsx`，实现了完全符合模板要求的节点和边样式。

## 主要修改内容

### 1. ✅ 修复拖拽漂移问题

**实现方案**：
- 使用 `fitView` 初始化视图，避免 transform 漂移
- 确保 nodes 和 edges 使用 ReactFlow 的状态管理（useNodesState / useEdgesState）
- 确保 `<ReactFlow>` 外层容器 div 有固定宽高（width: 100%; height: 100vh）

```tsx
// 使用 ReactFlow 原生状态管理
const [nodes, setNodes, onNodesChange] = useNodesState([])
const [edges, setEdges, onEdgesChange] = useEdgesState([])

// 容器固定宽高
<div className="flex-1 workflow-container" style={{ width: '100%', height: isFullScreen ? 'calc(100vh - 60px)' : `${height - 60}px` }}>
  <ReactFlowProvider>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      // ... 其他配置
    />
  </ReactFlowProvider>
</div>
```

### 2. ✅ 自定义节点样式

**实现方案**：
- 节点为白底 + 彩色边框
- 内部文字同样使用对应颜色显示
- 节点左右两边有 Handle，可以连线

```tsx
// 自定义节点组件
const CustomNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start': return '#10B981' // 绿色
      case 'progress': return '#3B82F6' // 蓝色
      case 'pause': return '#F59E0B' // 橙色
      case 'end': return '#EF4444' // 红色
      default: return '#6B7280' // 灰色
    }
  }

  const color = getNodeColor(data.type)
  
  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        background: 'white',
        minWidth: 100,
        textAlign: 'center',
        boxShadow: selected ? '0 0 0 2px #3B82F6' : '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ color: color, fontWeight: 500 }}>{data.label}</div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  )
}
```

### 3. ✅ 自定义边样式

**实现方案**：
- 使用贝塞尔曲线（getBezierPath）
- 线条灰色（#6B7280），带箭头
- 标签显示在边的中间，支持多行、自动换行
- 标签有白底、浅灰边框、圆角、阴影

```tsx
// 自定义边组件
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* 绘制线 */}
      <path
        id={id}
        d={edgePath}
        style={{ ...style, strokeWidth: 2, stroke: '#6B7280' }}
        fill="none"
        markerEnd={markerEnd}
      />
      {/* 绘制标签 */}
      {label && (
        <foreignObject
          width={120}
          height={50}
          x={labelX - 60}
          y={labelY - 25}
          style={{ overflow: 'visible' }}
        >
          <div
            style={{
              background: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: 6,
              padding: '2px 4px',
              fontSize: 12,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {label}
          </div>
        </foreignObject>
      )}
    </>
  );
};
```

### 4. ✅ 注册 nodeTypes 和 edgeTypes

**实现方案**：
- `nodeTypes={{ customNode: CustomNode }}`
- `edgeTypes={{ customEdge: CustomEdge }}`
- 确保 edges 的 `type: 'customEdge'` 正确

```tsx
// 节点类型定义
const nodeTypes: NodeTypes = {
  customNode: CustomNode,
}

// 边类型定义
const edgeTypes: EdgeTypes = {
  customEdge: CustomEdge,
}

// 边的配置
const flowEdges: Edge[] = transitions.map(transition => ({
  id: transition.id,
  source: transition.fromStateId,
  target: transition.toStateId,
  type: 'customEdge', // 必须和 edgeTypes 注册一致
  animated: false,
  label: transition.name,
  markerEnd: { 
    type: MarkerType.ArrowClosed 
  },
  style: {
    stroke: '#6B7280',
    strokeWidth: 2
  }
}))

// ReactFlow 配置
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
  // ... 其他配置
>
```

## 技术实现细节

### 导入必要的组件

```tsx
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Handle,
  Position,
  getBezierPath,
  type Node,
  type Edge,
  type EdgeProps,
  type NodeTypes,
  type EdgeTypes,
  MarkerType,
  // ... 其他导入
} from "reactflow"
```

### 节点数据配置

```tsx
const flowNodes: Node[] = states.map(state => ({
  id: state.id,
  type: 'customNode',
  position: { x: 0, y: 0 }, // 临时位置，稍后通过布局算法计算
  data: {
    label: state.name,
    type: state.type,
    color: state.color
  },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  draggable: true,
}))
```

### 容器样式优化

```css
.workflow-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.workflow-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: white;
}
```

## 关键特性

### 1. 拖拽性能优化
- **原生状态管理**: 使用 ReactFlow 的 useNodesState 和 useEdgesState
- **固定容器**: 确保容器有明确的宽高，避免布局漂移
- **fitView**: 使用 fitView 初始化视图，避免 transform 问题

### 2. 节点样式优化
- **白底彩色边框**: 节点为白色背景，边框使用对应状态颜色
- **文字颜色**: 节点内文字使用与边框相同的颜色
- **Handle 连接点**: 节点左右两边有 Handle，支持连线
- **选中状态**: 选中时显示蓝色光环效果

### 3. 边样式优化
- **贝塞尔曲线**: 使用 getBezierPath 生成平滑的贝塞尔曲线
- **灰色线条**: 线条颜色为 #6B7280，粗细为 2px
- **箭头指示**: 使用 MarkerType.ArrowClosed 显示闭合箭头
- **标签美化**: 标签有白底、浅灰边框、圆角、阴影

### 4. 标签显示优化
- **居中显示**: 标签显示在边的中间位置
- **多行支持**: 支持 whiteSpace: 'normal' 和 wordBreak: 'break-word'
- **自动换行**: 长文本自动换行显示
- **样式统一**: 所有标签使用相同的样式规范

## 与模板代码的对应关系

| 模板特性 | 实现状态 |
|---------|---------|
| 自定义节点样式 | ✅ 完全按照模板实现 |
| 自定义边样式 | ✅ 完全按照模板实现 |
| getBezierPath | ✅ 已实现 |
| foreignObject 标签 | ✅ 已实现 |
| Handle 连接点 | ✅ 已实现 |
| 颜色配置 | ✅ 已实现 |
| 类型注册 | ✅ 已实现 |

## 测试验证

### 拖拽测试
1. **节点拖拽**: 节点能够平滑拖拽，无漂移
2. **画布拖拽**: 画布拖拽正常工作，无错位
3. **连线更新**: 拖拽节点时连线实时更新

### 显示测试
1. **节点样式**: 节点显示为白底彩色边框，文字颜色对应
2. **边样式**: 边为灰色贝塞尔曲线，带箭头
3. **标签样式**: 标签显示在边中间，样式美观
4. **Handle 显示**: 节点左右两边有连接点

### 功能测试
1. **连线功能**: 可以通过 Handle 进行连线
2. **状态管理**: 使用 ReactFlow 原生状态管理
3. **布局稳定**: 容器固定宽高，布局稳定

## 兼容性保证

- ✅ 与现有工作流配置系统完全兼容
- ✅ 支持所有转换规则配置
- ✅ 保持原有的数据结构和接口
- ✅ 向后兼容，不影响现有功能

## 后续优化建议

1. **动画效果**: 可添加拖拽时的平滑动画
2. **标签定制**: 可提供更多标签样式选项
3. **交互增强**: 可添加双击编辑等功能
4. **性能监控**: 可添加性能监控和优化
5. **错误处理**: 可添加更完善的错误处理机制
