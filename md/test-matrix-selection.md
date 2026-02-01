# 状态矩阵选择功能测试

## 修改内容

实现了状态定义标签页中的差异化选择规则：

### 选择规则
1. **初始状态 (INITIAL)**: 只能选择一列（单选）
2. **暂停状态 (PAUSE)**: 只能选择一列（单选）  
3. **进行中状态 (PROGRESS)**: 可以选择多列（多选）
4. **结束状态 (END)**: 可以选择多列（多选）

### 主要修改

1. **types/workflow-state.ts**
   - 更新了 `StateMatrixConfig` 接口，支持多选类型使用数组
   - 添加了 `multiSelect` 配置到 `STATE_TYPE_CONFIG`
   - 新增辅助函数：`isMultiSelectType`, `isStateSelected`, `getSelectedStates`

2. **components/workflow/StatusMatrix.tsx**
   - 更新了 `handleMatrixChange` 逻辑，支持多选和单选的不同处理
   - 修改了删除状态时的清理逻辑
   - 更新了保存验证和统计信息计算
   - 改进了状态矩阵的显示，包含选择数量提示

3. **components/workflow/StatusColumn.tsx**
   - 更新了选择状态的显示逻辑
   - 添加了"多选"提示标签
   - 改进了视觉反馈

4. **components/tasks/task-workflow-dialog.tsx**
   - 更新了状态组合逻辑，支持处理多选状态

### 测试场景

可以通过以下步骤测试功能：

1. 打开任意任务的工作流配置对话框
2. 切换到"状态定义"标签页  
3. 尝试在初始状态列选择多个状态 - 应该只能选择一个
4. 尝试在暂停状态列选择多个状态 - 应该只能选择一个
5. 尝试在进行中状态列选择多个状态 - 应该可以选择多个
6. 尝试在结束状态列选择多个状态 - 应该可以选择多个
7. 查看右上角的统计信息，应该正确显示选择数量

### UI改进

- 多选类型的列会显示"多选"提示
- 统计信息会显示各类型的选择数量
- 选中的状态会有蓝色背景高亮