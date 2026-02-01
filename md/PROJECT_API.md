# API接口文档

## 🔐 认证相关接口

### 1. 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "name": "svcvit",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功"
}
```

### 2. 用户登出
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### 3. 发送密码重置码
```http
POST /api/auth/send-reset-code
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 4. 验证密码重置码
```http
POST /api/auth/verify-reset-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

### 5. 重置密码
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "newPassword": "new_password"
}
```

## 👤 用户相关接口

### 1. 获取用户信息
```http
GET /api/user/profile
Authorization: Bearer {token}
```

### 2. 更新用户信息
```http
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "新姓名",
  "email": "new@example.com",
  "bio": "新的个人简介",
  "phone": "13800138001",
  "location": "上海"
}
```

### 3. 更新用户密码
```http
PUT /api/user/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "当前密码",
  "newPassword": "新密码"
}
```

### 4. 获取用户设置
```http
GET /api/user/settings
Authorization: Bearer {token}
```

### 5. 更新用户设置
```http
PUT /api/user/settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "notifications": {
    "email": true,
    "push": false,
    "taskUpdates": true,
    "securityAlerts": true,
    "marketingEmails": false
  },
  "theme": "dark"
}
```

### 6. 上传用户头像
```http
POST /api/user/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [文件]
```

## 🏗️ 项目管理接口

### 1. 获取项目列表
```http
GET /api/projects?page=1&pageSize=10&search=关键词
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "产品开发项目",
      "displayName": "产品研发",
      "description": "用于管理产品开发过程中的各种事项和流程",
      "displayDescription": "参与产品开发相关工作",
      "status": "active",
      "createdBy": "张三",
      "createdAt": "2024-01-15 10:30:00",
      "updatedBy": "张三",
      "updatedAt": "2024-01-15 10:30:00"
    }
  ],
  "total": 1,
  "message": "获取项目列表成功"
}
```

### 2. 创建项目
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "新项目",
  "displayName": "新项目显示名",
  "description": "项目描述",
  "displayDescription": "C端显示描述"
}
```

### 3. 更新项目
```http
PUT /api/projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "更新后的项目名",
  "displayName": "更新后的显示名",
  "description": "更新后的描述",
  "displayDescription": "更新后的C端描述"
}
```

### 4. 删除项目
```http
DELETE /api/projects/{id}
Authorization: Bearer {token}
```

### 5. 切换项目状态
```http
PUT /api/projects/{id}/toggle-status
Authorization: Bearer {token}
```

### 6. 获取项目字段配置
```http
GET /api/projects/{id}/fields
Authorization: Bearer {token}
```

### 7. 获取项目阶段
```http
GET /api/projects/{id}/stages
Authorization: Bearer {token}
```

### 8. 获取项目角色
```http
GET /api/projects/{id}/roles
Authorization: Bearer {token}
```

## 🔧 字段管理接口

### 1. 获取字段列表
```http
GET /api/fields?pageNum=1&pageSize=10&name=关键词&type=dropdown&status=active&createdBy=用户
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "total": 25,
  "pageNum": 1,
  "pageSize": 10,
  "list": [
    {
      "id": "1",
      "name": "title",
      "displayName": "标题",
      "hint": "请输入标题",
      "type": "singleLineText",
      "createdBy": "Admin User",
      "updatedBy": "Admin User",
      "createdAt": "2023-01-15T00:00:00.000Z",
      "updatedAt": "2023-01-15T00:00:00.000Z",
      "status": "active"
    }
  ]
}
```

### 2. 创建字段
```http
POST /api/fields
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "new_field",
  "displayName": "新字段",
  "hint": "字段提示",
  "type": "dropdown",
  "options": [
    {
      "label": "选项1",
      "value": "option1"
    }
  ]
}
```

### 3. 更新字段
```http
PUT /api/fields/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "更新后的字段名",
  "hint": "更新后的提示"
}
```

### 4. 删除字段
```http
DELETE /api/fields/{id}
Authorization: Bearer {token}
```

### 5. 更新字段状态
```http
PUT /api/fields/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "inactive"
}
```

### 6. 根据类型获取字段
```http
GET /api/fields/type/{type}
Authorization: Bearer {token}
```

## 👥 角色管理接口

### 1. 获取角色列表
```http
GET /api/roles?page=1&pageSize=10&search=关键词
Authorization: Bearer {token}
```

### 2. 创建角色
```http
POST /api/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "新角色",
  "displayName": "新角色显示名",
  "description": "角色描述",
  "permissions": {
    "projects": ["view", "edit"],
    "tasks": ["view"]
  }
}
```

### 3. 更新角色
```http
PUT /api/roles/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "更新后的角色名",
  "description": "更新后的描述"
}
```

### 4. 删除角色
```http
DELETE /api/roles/{id}
Authorization: Bearer {token}
```

## 📊 状态管理接口

### 1. 获取状态列表
```http
GET /api/status?page=1&pageSize=10&search=关键词
Authorization: Bearer {token}
```

### 2. 创建状态
```http
POST /api/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "新状态",
  "clientDisplayName": "客户端显示名",
  "description": "状态描述",
  "clientDescription": "客户端描述"
}
```

### 3. 更新状态
```http
PUT /api/status/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "clientDisplayName": "更新后的显示名",
  "description": "更新后的描述"
}
```

### 4. 删除状态
```http
DELETE /api/status/{id}
Authorization: Bearer {token}
```

## 📋 事项管理接口

### 1. 获取事项列表
```http
GET /api/tasks?page=1&pageSize=10&search=关键词
Authorization: Bearer {token}
```

### 2. 创建事项
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "新事项",
  "displayName": "新事项显示名",
  "description": "事项描述",
  "displayDescription": "显示描述"
}
```

### 3. 更新事项
```http
PUT /api/tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "更新后的事项名",
  "description": "更新后的描述"
}
```

### 4. 删除事项
```http
DELETE /api/tasks/{id}
Authorization: Bearer {token}
```

### 5. 获取事项字段配置
```http
GET /api/tasks/{id}/fields
Authorization: Bearer {token}
```

### 6. 保存事项字段配置
```http
POST /api/tasks/{id}/fields
Authorization: Bearer {token}
Content-Type: application/json

{
  "fields": [
    {
      "fieldId": "field_1",
      "displayName": "标题",
      "required": true,
      "editable": true,
      "sortOrder": 1
    }
  ]
}
```

### 7. 获取事项工作流配置
```http
GET /api/tasks/{id}/workflow
Authorization: Bearer {token}
```

### 8. 保存事项工作流配置
```http
POST /api/tasks/{id}/workflow
Authorization: Bearer {token}
Content-Type: application/json

{
  "taskId": 1,
  "taskName": "事项名称",
  "states": [
    {
      "id": "state_1",
      "name": "待处理",
      "type": "initial",
      "color": "#52c41a",
      "order": 1
    }
  ],
  "transitions": [
    {
      "id": "trans_1",
      "fromStateId": "state_1",
      "toStateId": "state_2",
      "name": "开始处理"
    }
  ],
  "matrixConfig": {
    "initial": "state_1",
    "progress": ["state_2"],
    "end": ["state_3"],
    "pause": null
  }
}
```

### 9. 获取事项权限配置
```http
GET /api/tasks/{id}/permissions
Authorization: Bearer {token}
```

### 10. 保存事项权限配置
```http
POST /api/tasks/{id}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "permissions": [
    {
      "roleId": "role_1",
      "permissionType": "view",
      "allowed": true
    }
  ]
}
```

## 🔄 工作流管理接口

### 1. 获取工作流列表
```http
GET /api/workflows?status=active
Authorization: Bearer {token}
```

### 2. 获取工作流详情
```http
GET /api/workflows/{id}
Authorization: Bearer {token}
```

### 3. 创建工作流
```http
POST /api/workflows
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "新工作流",
  "description": "工作流描述",
  "nodes": [
    {
      "id": "node_1",
      "type": "startNode",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "开始" }
    }
  ],
  "edges": [],
  "permissions": {
    "viewRoles": ["admin"],
    "editRoles": ["admin"],
    "executeRoles": ["admin", "user"],
    "adminRoles": ["admin"]
  }
}
```

### 4. 更新工作流
```http
PUT /api/workflows/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "更新后的工作流名",
  "description": "更新后的描述",
  "nodes": [...],
  "edges": [...]
}
```

### 5. 删除工作流
```http
DELETE /api/workflows/{id}
Authorization: Bearer {token}
```

### 6. 发布工作流
```http
PUT /api/workflows/{id}/publish
Authorization: Bearer {token}
```

### 7. 停用工作流
```http
PUT /api/workflows/{id}/deactivate
Authorization: Bearer {token}
```

### 8. 获取工作流版本
```http
GET /api/workflows/{id}/versions
Authorization: Bearer {token}
```

### 9. 恢复工作流版本
```http
PUT /api/workflows/{id}/versions/{versionId}/restore
Authorization: Bearer {token}
```

### 10. 比较工作流版本
```http
GET /api/workflows/{id}/versions/compare?version1=v1&version2=v2
Authorization: Bearer {token}
```

### 11. 导出工作流
```http
GET /api/workflows/{id}/export
Authorization: Bearer {token}
```

### 12. 导入工作流
```http
POST /api/workflows/import
Authorization: Bearer {token}
Content-Type: application/json

{
  "workflowJson": "工作流JSON字符串"
}
```

### 13. 更新工作流权限
```http
PUT /api/workflows/{id}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "viewRoles": ["admin", "manager"],
  "editRoles": ["admin"],
  "executeRoles": ["admin", "manager", "user"],
  "adminRoles": ["admin"]
}
```

## 🔄 工作流状态管理接口

### 1. 获取状态列表
```http
GET /api/workflow-states
Authorization: Bearer {token}
```

### 2. 创建状态
```http
POST /api/workflow-states
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "新状态",
  "description": "状态描述"
}
```

### 3. 保存状态配置
```http
POST /api/workflow-states/config
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "配置名称",
  "description": "配置描述",
  "states": [
    {
      "id": "state_1",
      "name": "待处理",
      "order": 1
    }
  ],
  "matrix": {
    "initial": "state_1",
    "progress": ["state_2"],
    "end": ["state_3"],
    "pause": null
  }
}
```

## 📝 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "code": "ERROR_CODE"
}
```

### 分页响应
```json
{
  "success": true,
  "data": {
    "list": [],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10
  },
  "message": "获取成功"
}
```

## 🔒 权限控制

所有接口都需要在请求头中包含有效的认证令牌：

```http
Authorization: Bearer {token}
```

## 📊 状态码说明

- `200`: 请求成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部错误
