# 工作流预览组件实现说明

## 概述

根据图片中的工作流设计，我们实现了一个增强版的工作流预览组件 `EnhancedWorkflowPreview`，完全满足您提出的四个核心需求。

## 实现的功能

### 1. 节点拖拽跟随鼠标，消除拖拽时的漂移和消失问题

- ✅ **使用 React Flow 原生拖拽系统**：通过 `nodesDraggable={true}` 启用节点拖拽
- ✅ **实时连线更新**：拖拽节点时，箭头连线会自动跟随调整
- ✅ **网格对齐**：通过 `snapToGrid={true}` 和 `snapGrid={[15, 15]}` 确保拖拽精确性
- ✅ **防止节点消失**：使用 `onlyRenderVisibleElements={false}` 确保所有节点始终可见

### 2. 节点间使用箭头连接，箭头上显示转换名称

- ✅ **箭头连接**：使用 `MarkerType.ArrowClosed` 创建清晰的箭头
- ✅ **转换名称显示**：在箭头上显示 `transition.name`
- ✅ **标签样式优化**：
  - 白色背景确保可读性
  - 边框和圆角美化外观
  - 合适的字体大小和粗细
- ✅ **悬停效果**：鼠标悬停时箭头变粗，增强交互体验

### 3. 全屏页，点击画布背景不要关闭画布

- ✅ **全屏模式**：使用 `createPortal` 实现真正的全屏显示
- ✅ **背景点击处理**：`handlePaneClick` 只清除选中状态，不关闭画布
- ✅ **ESC键退出**：支持按ESC键退出全屏模式
- ✅ **全屏层级**：使用 `z-index: 9999` 确保全屏显示在最顶层

### 4. 点击返回按钮，只退出全屏模式，不关闭整个页面

- ✅ **返回按钮**：全屏模式下显示返回按钮
- ✅ **退出逻辑**：`handleExitFullscreen` 只退出全屏，不关闭页面
- ✅ **状态保持**：退出全屏后保持所有工作流状态和位置

## 技术特性

### 自动布局算法
- **从左到右布局**：使用拓扑排序实现层次化布局
- **智能分层**：根据节点依赖关系自动计算层级
- **循环依赖处理**：妥善处理可能存在的循环依赖情况

### 自定义节点组件
- **类型化颜色**：根据节点类型（start/progress/end）显示不同颜色
- **选中状态**：选中时显示蓝色光环效果
- **悬停效果**：鼠标悬停时的视觉反馈

### 交互体验优化
- **缩略图控制**：可切换显示/隐藏缩略图
- **视图重置**：一键重置到最佳视图
- **键盘快捷键**：支持ESC键退出全屏
- **响应式设计**：适配不同屏幕尺寸

## 使用示例

```tsx
import { EnhancedWorkflowPreview } from "@/components/tasks/enhanced-workflow-preview"

// 状态数据
const states = [
  {
    id: "1",
    name: "创建",
    type: "start",
    color: "#10B981",
    description: "初始状态"
  },
  // ... 更多状态
]

// 转换数据
const transitions = [
  {
    id: "t1",
    fromStateId: "1",
    toStateId: "2",
    name: "提交审核",
    description: "提交到OA审核"
  },
  // ... 更多转换
]

// 使用组件
<EnhancedWorkflowPreview
  states={states}
  transitions={transitions}
  height={600}
  showFullscreen={true}
/>
```

## 文件结构

```
components/tasks/
├── enhanced-workflow-preview.tsx    # 主组件文件
└── task-workflow-dialog.tsx         # 已集成到工作流配置页

app/dashboard/tasks/
└── test-workflow/
    └── page.tsx                     # 测试页面
```

## 测试页面

访问 `/dashboard/tasks/test-workflow` 可以查看完整的工作流预览效果，包含：
- 5个状态节点（创建、OA审核中、产品上架、完成、因故终止）
- 6个转换规则（提交审核、驳回、自动上架、完成、作废）
- 完整的交互功能测试

## 与图片设计的对应关系

| 图片元素 | 实现功能 |
|---------|---------|
| 圆角矩形节点 | 自定义节点组件，支持拖拽 |
| 箭头连接线 | React Flow 箭头，显示转换名称 |
| 转换名称标签 | 箭头上方的白色标签 |
| 从左到右布局 | 自动布局算法实现 |
| 全屏查看 | Portal 全屏模式 |

## 性能优化

- **虚拟化渲染**：React Flow 内置的虚拟化确保大量节点时的性能
- **状态管理**：使用 `useCallback` 和 `useMemo` 优化重渲染
- **CSS 优化**：动态注入样式，避免样式冲突

## 兼容性

- ✅ Next.js 15+
- ✅ React 18+
- ✅ TypeScript 5+
- ✅ Tailwind CSS
- ✅ 现代浏览器支持

## 后续扩展

该组件设计为可扩展的，可以轻松添加：
- 节点编辑功能
- 转换规则配置
- 工作流验证
- 导出功能
- 更多布局算法
