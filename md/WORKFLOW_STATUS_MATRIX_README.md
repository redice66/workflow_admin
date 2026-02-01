# 工作流状态定义矩阵模块

## 概述

这是一个基于 React + TypeScript + Ant Design 开发的工作流状态定义矩阵配置模块。该模块用于配置工作流中的状态定义，支持拖拽排序、状态添加、编辑等功能。

**📍 当前位置**：该模块已整合到任务管理系统的工作流配置弹窗中，作为"状态定义"标签页存在。用户可通过任务管理页面访问该功能。

## 功能特性

### 📊 状态定义矩阵表格
- **列**：表示状态名称（如：待开始、需求收集等）
- **行**：固定4行，分别是：
  - 初始状态
  - 进行中状态 
  - 结束状态
  - 暂停状态

### 🎯 交互功能
- 每个单元格包含 **Radio 单选项**
- 同一行中最多只能选择一个状态列
- 每列为一个可配置状态（支持后续动态添加）

### ✨ 核心功能
1. **添加状态**：页面顶部右上角【添加状态】按钮
2. **拖拽排序**：支持状态列的横向拖拽排序
3. **状态编辑**：双击或点击编辑按钮编辑列头状态名称
4. **保存/取消**：右下角操作按钮

## 技术架构

### 技术栈
- **React 18** + **TypeScript**
- **Ant Design** (UI组件库)
- **@hello-pangea/dnd** (拖拽功能)
- **Tailwind CSS** (样式)

### 组件结构

```
components/workflow/
├── StatusMatrix.tsx      # 主要状态矩阵组件
├── StatusColumn.tsx      # 状态列组件
└── AddStateModal.tsx     # 添加状态Modal组件

types/
└── workflow-state.ts     # 类型定义

lib/api/
└── workflow-state-api.ts # API接口

components/tasks/
└── task-workflow-dialog.tsx  # 工作流弹窗组件（集成状态定义功能）
```

## 整合说明

### 模块整合

状态定义矩阵模块已成功整合到任务管理系统中：

- **原独立页面**：`/dashboard/workflow-config` （已删除）
- **新整合位置**：`TaskWorkflowDialog` 组件的"状态定义"标签页
- **访问路径**：任务管理 → 事项内容 → 事项工作流 → 状态定义

### 整合优势

1. **统一用户体验**：状态定义功能与任务工作流紧密集成，用户操作更直观
2. **模块化设计**：`StatusMatrix` 组件保持独立，可复用于其他场景
3. **功能互补**：状态定义与转换规则、流程预览形成完整的工作流配置体系
4. **减少页面跳转**：用户无需离开任务管理流程即可完成状态配置

## 文件说明

### 1. 类型定义 (types/workflow-state.ts)

```typescript
// 状态类型枚举
export enum StateType {
  INITIAL = 'initial',      // 初始状态
  PROGRESS = 'progress',    // 进行中状态
  END = 'end',             // 结束状态
  PAUSE = 'pause'          // 暂停状态
}

// 状态数据接口
export interface StateItem {
  id: string           // 状态唯一标识
  name: string         // 状态名称
  description?: string // 状态描述
  order: number        // 排序序号
  isDefault?: boolean  // 是否为默认状态
  createdAt?: string   // 创建时间
  updatedAt?: string   // 更新时间
}

// 状态矩阵配置接口
export interface StateMatrixConfig {
  [StateType.INITIAL]: string | null      // 初始状态选中的状态ID
  [StateType.PROGRESS]: string | null     // 进行中状态选中的状态ID
  [StateType.END]: string | null          // 结束状态选中的状态ID
  [StateType.PAUSE]: string | null        // 暂停状态选中的状态ID
}
```

### 2. API接口 (lib/api/workflow-state-api.ts)

包含以下API方法（含TODO标识）：

```typescript
// 获取状态列表 - TODO: 集成状态管理菜单页的API接口
export async function getStateList(): Promise<StateListResponse>

// 添加新状态 - TODO: 集成状态管理菜单页的API接口  
export async function addState(stateData: { name: string; description?: string }): Promise<StateListResponse>

// 更新状态名称 - TODO: 集成状态管理菜单页的API接口
export async function updateStateName(stateId: string, name: string): Promise<StateListResponse>

// 获取工作流配置 - TODO: 替换为真实API调用
export async function getWorkflowConfig(configId?: string): Promise<SaveConfigResponse>

// 保存工作流配置 - TODO: 替换为真实API调用
export async function saveWorkflowConfig(config: {...}): Promise<SaveConfigResponse>
```

### 3. 组件说明

#### StatusMatrix.tsx (主组件)
- 状态矩阵表格的主要容器
- 管理状态列表和矩阵配置
- 处理拖拽排序逻辑
- 提供添加状态、保存/取消功能

#### StatusColumn.tsx (状态列组件)
- 单个状态列的展示和交互
- 支持状态名称编辑
- 包含4个Radio选项
- 支持拖拽移动

#### AddStateModal.tsx (添加状态Modal)
- 状态添加的表单界面
- 包含表单验证
- 支持状态名称和描述输入

## 使用方法

### 1. 基本使用

```typescript
import { StatusMatrix } from '@/components/workflow/StatusMatrix'
import { WorkflowStateConfig } from '@/types/workflow-state'

function MyPage() {
  const handleCancel = () => {
    // 处理取消操作
    console.log('用户取消了配置')
  }

  const handleSave = (config: WorkflowStateConfig) => {
    // 处理保存操作
    console.log('保存的配置:', config)
  }

  return (
    <StatusMatrix 
      onCancel={handleCancel}
      onSave={handleSave}
    />
  )
}
```

### 2. 页面访问

**新访问路径**：通过任务管理页面的工作流配置功能
1. 进入 `/dashboard/tasks` 页面
2. 点击任务表格中的操作下拉菜单
3. 选择【内容】进入任务内容配置
4. 点击【事项工作流】模块
5. 在工作流配置弹窗中，【状态定义】标签页即为状态定义矩阵功能

**旧访问路径**：`/dashboard/workflow-config`（已废弃）

### 3. API集成

当前使用Mock数据，需要替换为真实API：

```typescript
// 示例：集成真实API
export async function getStateList(): Promise<StateListResponse> {
  const response = await fetch('/api/states', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return await response.json()
}
```

## Mock数据

目前包含7个预设状态：

```typescript
const mockStates = [
  { id: 'state_001', name: '待开始', description: '任务尚未开始执行' },
  { id: 'state_002', name: '需求收集', description: '收集和整理项目需求' },
  { id: 'state_003', name: '设计阶段', description: '进行产品设计和架构设计' },
  { id: 'state_004', name: '开发中', description: '正在进行开发工作' },
  { id: 'state_005', name: '测试中', description: '正在进行测试验证' },
  { id: 'state_006', name: '已完成', description: '任务已完成' },
  { id: 'state_007', name: '暂停中', description: '任务暂时停止' }
]
```

默认矩阵配置：
- 初始状态：待开始
- 进行中状态：开发中  
- 结束状态：已完成
- 暂停状态：暂停中

## 操作指南

### 1. 添加状态
1. 点击右上角【添加状态】按钮
2. 在弹出的Modal中输入状态名称和描述
3. 点击确定完成添加

### 2. 编辑状态名称  
1. 将鼠标悬停在状态列头
2. 点击出现的编辑图标
3. 修改名称后按Enter或点击保存图标

### 3. 配置状态矩阵
1. 在对应的行和列交叉位置点击Radio选项
2. 每行最多只能选择一个状态
3. 建议至少配置初始状态和结束状态

### 4. 拖拽排序
1. 鼠标悬停在状态列头部
2. 按住并拖拽到目标位置
3. 释放鼠标完成排序

### 5. 保存配置
1. 完成配置后点击右下角【确定】按钮
2. 系统会验证配置的有效性
3. 保存成功后返回上级页面

## 样式定制

### Ant Design主题定制

可以通过ConfigProvider自定义主题：

```typescript
import { ConfigProvider } from 'antd'

const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
}

<ConfigProvider theme={theme}>
  <StatusMatrix />
</ConfigProvider>
```

### CSS样式覆盖

在`globals.css`中已添加自定义样式：

```css
/* Ant Design 自定义样式 */
.ant-radio-wrapper {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

/* 状态矩阵表格样式 */
.status-matrix-cell:hover {
  background-color: #f0f9ff !important;
}
```

## 使用流程指南

### 完整操作流程

1. **进入任务管理页面**
   - 访问：`http://localhost:3000/dashboard/tasks`
   - 或从侧边栏点击"事项管理"

2. **打开工作流配置**
   - 在任务表格中找到目标任务
   - 点击操作列的"..."按钮
   - 选择"内容"

3. **进入工作流设置**
   - 在弹出的任务内容页面中
   - 点击"事项工作流"模块

4. **配置状态定义**
   - 在工作流配置弹窗中，选择"状态定义"标签页
   - 使用状态定义矩阵进行配置
   - 支持：拖拽排序、添加状态、编辑状态、矩阵配置

5. **保存配置**
   - 完成配置后点击"确定"按钮
   - 系统会验证配置有效性并保存

### 注意事项

1. **浏览器兼容性**：建议使用Chrome、Firefox、Safari最新版本
2. **性能优化**：状态数量建议不超过20个，以保证良好的用户体验
3. **数据同步**：目前使用Mock数据，后续需要集成真实API
4. **错误处理**：遇到问题时查看浏览器控制台，会有详细的错误信息

## 待办事项 (TODO)

### ✅ 已完成
- [x] 状态定义矩阵模块开发
- [x] 拖拽排序功能实现
- [x] 添加状态功能实现
- [x] 状态编辑功能实现
- [x] 整合到任务管理系统
- [x] Ant Design中文语言包配置
- [x] TypeScript类型安全保障

### 🔄 进行中
- [ ] **API集成**（优先级：高）
  - [ ] 集成状态管理菜单页的查询状态接口
  - [ ] 替换所有Mock数据为真实API调用
  - [ ] 添加错误处理和重试机制
  - [ ] 实现API缓存策略

### 📋 待实现
- [ ] **功能增强**
  - [ ] 添加状态删除功能
  - [ ] 支持批量操作
  - [ ] 添加配置历史记录
  - [ ] 实现配置模板功能

- [ ] **用户体验**
  - [ ] 添加操作确认对话框
  - [ ] 优化拖拽体验
  - [ ] 添加快捷键支持
  - [ ] 实现响应式设计优化

- [ ] **权限和安全**
  - [ ] 添加用户权限验证
  - [ ] 实现操作日志记录
  - [ ] 添加数据验证和安全检查

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问页面
http://localhost:3000/dashboard/workflow-config
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 代码规范

- 使用TypeScript进行类型检查
- 遵循React Hooks最佳实践
- 组件和函数添加完整的注释
- 使用ESLint和Prettier保持代码风格一致

## 故障排除

### 常见问题

1. **拖拽不工作**
   - 确保已安装`@hello-pangea/dnd`
   - 检查浏览器是否支持拖拽API

2. **样式不正确**
   - 确保Ant Design CSS已正确导入
   - 检查Tailwind CSS配置

3. **API调用失败**
   - 检查网络连接
   - 验证API端点配置
   - 查看浏览器控制台错误信息

### 调试技巧

```typescript
// 开启调试模式
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('当前状态:', states)
  console.log('矩阵配置:', matrix)
}
```

## 工作流预览组件代码

### 1. 主要容器组件 (components/tasks/enhanced-workflow-preview.tsx)

#### JSX 容器结构
```tsx
export function EnhancedWorkflowPreview({ 
  states, 
  transitions, 
  height = 500,
  showFullscreen = true 
}: EnhancedWorkflowPreviewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [showMiniMap, setShowMiniMap] = useState(true)

  return (
    <div className="w-full h-full flex flex-col">
      {/* 控制面板 */}
      <div className="flex items-center justify-between p-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">工作流预览</h3>
          <Badge variant="secondary">{states.length} 个状态</Badge>
          <Badge variant="secondary">{transitions.length} 个转换</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowMiniMap(!showMiniMap)}
          >
            {showMiniMap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            缩略图
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetView}
          >
            <RefreshCw className="h-4 w-4" />
            重置视图
          </Button>
        </div>
      </div>

      {/* 流程图 */}
      <div className="flex-1 workflow-container" style={{ width: '100%', height: `${height - 60}px`, position: 'relative' }}>
        <ReactFlowProvider>
          <WorkflowFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            showMiniMap={showMiniMap}
          />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
```

#### 内部 WorkflowFlow 组件
```tsx
function WorkflowFlow({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  onInit, 
  nodeTypes, 
  edgeTypes,
  showMiniMap
}: {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: any
  onEdgesChange: any
  onConnect: any
  onInit: any
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  showMiniMap: boolean
}) {
  const { project } = useReactFlow()

  // 优化拖拽逻辑 - 使用 useReactFlow().project() 进行坐标转换
  const onNodeDrag = useCallback(
    (event: any, node: Node) => {
      // 使用 project 方法进行正确的坐标转换
      const projected = project({ x: event.clientX, y: event.clientY })
      
      // 更新节点位置
      onNodesChange([
        {
          type: 'position',
          id: node.id,
          position: {
            x: projected.x - (node.width || 0) / 2,
            y: projected.y - (node.height || 0) / 2,
          },
        },
      ])
    },
    [project, onNodesChange]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
      onInit={handleInit}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      className="bg-gray-50"
      nodesDraggable={true}
      elementsSelectable={true}
      nodesConnectable={false}
      panOnDrag={true}
      zoomOnScroll={true}
      zoomOnPinch={true}
      snapToGrid={false}
      onlyRenderVisibleElements={false}
      fitView
      minZoom={0.1}
      maxZoom={4}
      attributionPosition="bottom-left"
    >
      <Background gap={12} size={1} />
      <Controls className="!bg-white !shadow-lg" />
      {showMiniMap && (
        <MiniMap 
          className="!bg-white !shadow-lg" 
          nodeColor={(node) => {
            const nodeData = node.data
            switch (nodeData?.type) {
              case 'start': return '#10B981'
              case 'progress': return '#3B82F6'
              case 'pause': return '#F59E0B'
              case 'end': return '#EF4444'
              default: return '#6B7280'
            }
          }}
        />
      )}
    </ReactFlow>
  )
}
```

### 2. 容器 CSS 样式

#### 动态样式注入
```tsx
// 添加CSS样式优化
useEffect(() => {
  const style = document.createElement('style')
  style.textContent = `
    .workflow-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    /* 确保 ReactFlow 容器有正确的尺寸 */
    .react-flow {
      width: 100% !important;
      height: 100% !important;
      position: relative !important;
    }
    
    /* 确保节点容器正确显示 */
    .react-flow__viewport {
      width: 100% !important;
      height: 100% !important;
    }
    
    /* 优化拖拽性能 - 移除所有过渡动画 */
    .react-flow__node {
      transition: none !important;
      transform: none !important;
      z-index: 10;
    }
    
    .react-flow__node:active {
      cursor: grabbing;
      z-index: 20;
    }
    
    /* 确保画布拖拽正常 */
    .react-flow__pane {
      cursor: grab;
      transition: none !important;
    }
    
    .react-flow__pane:active {
      cursor: grabbing;
    }
    
    /* 优化边和标签样式 */
    .react-flow__edge {
      transition: none !important;
      z-index: 5;
    }
    
    .react-flow__edge-path {
      transition: none !important;
      stroke-width: 2px;
      stroke: #6B7280;
    }
    
    /* 确保标签无边框且美观 */
    .react-flow__edge-text {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      font-size: 12px;
      font-weight: 500;
      color: #374151;
    }
    
    /* 确保Handle正确显示 */
    .react-flow__handle {
      width: 8px;
      height: 8px;
      background: #6B7280;
      border: 2px solid white;
      border-radius: 50%;
    }
    
    .react-flow__handle:hover {
      background: #3B82F6;
    }
  `
  document.head.appendChild(style)
  
  return () => {
    document.head.removeChild(style)
  }
}, [])
```

### 3. Modal 集成代码 (components/tasks/task-workflow-dialog.tsx)

#### 工作流配置弹窗结构
```tsx
export function TaskWorkflowDialog({ task, open, onOpenChange }: TaskWorkflowDialogProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("transitions")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            事项内容 | {task.name} | 工作流配置
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="states">状态定义</TabsTrigger>
              <TabsTrigger value="transitions">转换规则</TabsTrigger>
              <TabsTrigger value="preview">流程预览</TabsTrigger>
            </TabsList>

            <TabsContent value="states" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="h-[60vh] bg-white rounded-lg">
                <StatusMatrix 
                  states={rawStates}
                  matrix={matrixConfig}
                  loading={loadingStates}
                  onCancel={handleStatusMatrixCancel}
                  onSave={handleStatusMatrixSave}
                  onConfigChange={handleConfigChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="transitions" className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* 转换规则配置内容 */}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 h-[60vh] overflow-hidden">
              <EnhancedWorkflowPreview 
                states={states}
                transitions={transitions}
                height={400}
                showFullscreen={true}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={saving}>
            {saving ? "保存中..." : "确定"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

#### Modal 内联样式
```tsx
<style jsx>{`
  @keyframes dash {
    0% { stroke-dasharray: 0, 1000; }
    50% { stroke-dasharray: 100, 1000; }
    100% { stroke-dasharray: 0, 1000; }
  }
  
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  
  .workflow-node {
    animation: float 6s ease-in-out infinite;
  }
  
  .workflow-node:nth-child(2n) {
    animation-delay: -2s;
  }
  
  .workflow-node:nth-child(3n) {
    animation-delay: -4s;
  }
`}</style>
```

### 4. 自定义节点和边组件

#### 自定义节点组件
```tsx
const CustomNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start': return '#10B981';
      case 'progress': return '#3B82F6';
      case 'pause': return '#F59E0B';
      case 'end': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const color = getNodeColor(data.type);
  
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        background: 'white',
        minWidth: 120,
        minHeight: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: selected ? '0 0 0 3px #3B82F6' : '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        cursor: 'grab',
      }}
    >
      <div style={{ 
        color: color, 
        fontWeight: 600, 
        fontSize: '14px',
        lineHeight: '1.4',
        wordBreak: 'break-word'
      }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};
```

#### 自定义边组件
```tsx
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
      {/* 连接线 */}
      <path
        id={id}
        d={edgePath}
        style={{ ...style, strokeWidth: 2, stroke: '#6B7280' }}
        fill="none"
        markerEnd={markerEnd}
      />
      {/* 标签 - 无边框，与箭头融为一体 */}
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
              background: 'transparent',
              border: 'none',
              padding: '2px 4px',
              fontSize: 12,
              fontWeight: 500,
              color: '#374151',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              textAlign: 'center',
              textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.8)',
              pointerEvents: 'none',
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

### 5. 水平布局算法

```tsx
// 水平布局算法 - 确保节点从左到右均匀分布
function generateHorizontalLayout(states: any[], nodeSpacing = 300) {
  return states.map((state, index) => {
    const x = index * nodeSpacing + 100; // 水平间距
    const y = 200; // 固定垂直位置，居中显示
    
    return {
      id: state.id,
      type: 'customNode',
      position: { x, y },
      data: {
        label: state.name,
        type: state.type,
        color: state.color
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      draggable: true,
    };
  });
}
```

## 更新日志

### v1.1.0 (2024-01-21)
- ✅ 新增工作流预览组件 `EnhancedWorkflowPreview`
- ✅ 实现水平布局算法，确保节点不重叠
- ✅ 优化拖拽交互，使用 `useReactFlow().project()` 进行坐标转换
- ✅ 自定义节点和边组件，支持箭头连接和标签显示
- ✅ 集成到任务工作流配置弹窗中
- ✅ 添加重置视图和缩略图控制功能

### v1.0.0 (2024-01-20)
- ✅ 完成基础功能开发
- ✅ 实现状态矩阵表格
- ✅ 添加拖拽排序功能
- ✅ 实现状态添加和编辑
- ✅ 完成Mock数据和API接口
- ✅ 添加TypeScript类型定义
- ✅ 集成Ant Design组件库
- ✅ 实现响应式设计

## 许可证

此项目遵循MIT许可证。 