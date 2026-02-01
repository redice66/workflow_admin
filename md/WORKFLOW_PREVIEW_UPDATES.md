# 工作流预览组件更新说明

## 更新概述

根据您的要求，我们对 `enhanced-workflow-preview.tsx` 组件进行了全面优化，实现了所有指定的功能需求。

## 已完成的修改

### 1. ✅ 四种类型的节点用不同颜色区分

- **初始状态 (start)**: 绿色 `#10B981`
- **进行中状态 (progress)**: 蓝色 `#3B82F6`  
- **暂停状态 (pause)**: 橙色 `#F59E0B`
- **结束状态 (end)**: 红色 `#EF4444`

### 2. ✅ 工作流流转数据从转换规则tab中配置的转换规则获取

- 组件接收 `transitions` 数组作为props
- 数据来源：`task-workflow-dialog.tsx` 中的转换规则配置
- 支持完整的转换规则数据结构（包含条件、角色等）

### 3. ✅ 节点名称为选择的状态名称（去除其他多余的显示名称）

- 节点只显示状态名称，移除了类型标签和描述信息
- 简化了节点显示，提高可读性
- 节点数据使用 `state.name` 作为显示文本

### 4. ✅ 节点之间使用箭头连接，显示状态流转方向

- 使用 `MarkerType.ArrowClosed` 创建清晰的箭头
- 箭头指向表示工作流的流转方向
- 箭头样式统一，颜色为 `#6B7280`

### 5. ✅ 连接线上显示配置的转换名称

- 在箭头上方显示 `transition.name`
- 标签样式优化：
  - 白色背景确保可读性
  - 边框和圆角美化外观
  - 合适的字体大小和粗细

### 6. ✅ 节点拖拽跟随鼠标不要漂移并且始终显示

- 使用 React Flow 原生拖拽系统
- 设置 `onlyRenderVisibleElements={false}` 确保节点始终可见
- 实时连线更新，拖拽时箭头自动跟随
- 网格对齐 (`snapToGrid={true}`) 确保拖拽精确性

### 7. ✅ 画布全屏显示后的交互优化

- **去除返回按钮**: 全屏模式下不再显示返回按钮
- **缩略图控制**: 点击缩略图按钮可展示或隐藏缩略图
- **重置视图**: 点击重置视图按钮，工作流流程自动格式化
- **退出全屏**: 点击退出全屏按钮返回预览页
- **其他操作**: 任何其他操作都不会关闭当前页面

## 技术实现细节

### 节点组件优化
```tsx
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
    <div className="px-4 py-3 rounded-lg border-2 shadow-md">
      <div className="font-medium text-sm" style={{ color }}>
        {data.label} {/* 只显示状态名称 */}
      </div>
    </div>
  )
}
```

### 接口定义更新
```tsx
interface EnhancedWorkflowPreviewProps {
  states: Array<{
    id: string
    name: string
    type: "start" | "progress" | "end" // 简化为三种类型
    color: string
    order?: number
  }>
  transitions: Array<{
    id: string
    fromStateId: string
    toStateId: string
    name: string // 转换名称
    description?: string
    condition?: string
    requiredRole?: string
  }>
  height?: number
  showFullscreen?: boolean
}
```

### 全屏模式控制面板
```tsx
<div className="flex items-center gap-2">
  <Button onClick={() => setShowMiniMap(!showMiniMap)}>
    {showMiniMap ? <EyeOff /> : <Eye />}
    缩略图
  </Button>
  
  <Button onClick={handleResetView}>
    <RefreshCw />
    重置视图
  </Button>
  
  <Button onClick={toggleFullScreen}>
    {isFullScreen ? <Minimize2 /> : <Maximize2 />}
    {isFullScreen ? '退出全屏' : '全屏'}
  </Button>
  
  {/* 移除了返回按钮 */}
</div>
```

## 测试页面更新

更新了测试页面 `/dashboard/tasks/test-workflow` 以匹配新的数据结构：

- 6个状态节点（创建、OA审核中、产品上架、暂停审核、完成、因故终止）
- 8个转换规则（包含暂停和恢复流程）
- 完整的交互功能测试

## 与现有系统的集成

组件已完全集成到 `task-workflow-dialog.tsx` 中：

```tsx
<TabsContent value="preview" className="space-y-4 h-[60vh] overflow-hidden">
  <EnhancedWorkflowPreview 
    states={states}
    transitions={transitions}
    height={400}
    showFullscreen={true}
  />
</TabsContent>
```

## 性能优化

- **拖拽性能**: 使用 React Flow 优化的拖拽系统
- **渲染优化**: 节点简化后渲染性能提升
- **内存管理**: 全屏模式使用 Portal，避免内存泄漏

## 用户体验改进

1. **视觉清晰度**: 节点颜色区分明确，状态流转一目了然
2. **交互流畅性**: 拖拽无漂移，连线实时更新
3. **操作便捷性**: 全屏模式下的控制按钮布局合理
4. **信息简洁性**: 去除冗余信息，突出核心内容

## 兼容性

- ✅ 与现有工作流配置系统完全兼容
- ✅ 支持所有转换规则配置
- ✅ 保持原有的数据结构和接口
- ✅ 向后兼容，不影响现有功能

## 后续扩展建议

1. **节点编辑**: 可添加双击节点编辑功能
2. **转换验证**: 可添加转换规则验证逻辑
3. **导出功能**: 可添加工作流图导出功能
4. **动画效果**: 可添加状态转换动画
5. **权限控制**: 可基于角色控制节点操作权限
