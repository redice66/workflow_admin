# API接口文档

## 📋 概述

本文档描述了工作流管理系统的后端API接口，包括认证、用户管理、项目管理、事项管理、工作流管理等模块的接口定义。

**技术栈**: Spring Boot + Maven + MySQL + JDK8  
**接口规范**: RESTful API  
**数据格式**: JSON  
**认证方式**: JWT Token

---

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
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "email": "admin@example.com",
      "avatar": "https://example.com/avatar.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

### 2. 用户登出
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### 3. 刷新Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

### 4. 发送密码重置码
```http
POST /api/auth/send-reset-code
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 5. 验证密码重置码
```http
POST /api/auth/verify-reset-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

### 6. 重置密码
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "newPassword": "new_password"
}
```

---

## 👤 用户管理接口

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
  "phone": "13800138001"
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
  "theme": "dark",
  "language": "zh-CN",
  "notifications": {
    "email": true,
    "push": false
  }
}
```

---

## 🏗️ 项目管理接口

### 1. 获取项目列表
```http
GET /api/projects?page=1&pageSize=10&search=关键词&status=active
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "success": true,
  "code": 200,
  "message": "获取项目列表成功",
  "data": {
    "list": [
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
    "page": 1,
    "pageSize": 10
  }
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

### 7. 保存项目字段配置
```http
POST /api/projects/{id}/fields
Authorization: Bearer {token}
Content-Type: application/json

{
  "fields": [
    {
      "fieldId": "title",
      "displayName": "标题",
      "required": true,
      "editable": true,
      "sortOrder": 1
    }
  ]
}
```

### 8. 获取项目阶段
```http
GET /api/projects/{id}/stages
Authorization: Bearer {token}
```

### 9. 保存项目阶段
```http
POST /api/projects/{id}/stages
Authorization: Bearer {token}
Content-Type: application/json

{
  "stages": [
    {
      "name": "需求分析",
      "displayName": "需求分析阶段",
      "description": "分析项目需求",
      "sortOrder": 1
    }
  ]
}
```

### 10. 获取项目内容库
```http
GET /api/projects/{id}/contents?stageId=1
Authorization: Bearer {token}
```

### 11. 保存项目内容
```http
POST /api/projects/{id}/contents
Authorization: Bearer {token}
Content-Type: application/json

{
  "stageId": 1,
  "title": "内容标题",
  "content": "内容详情",
  "contentType": "text",
  "sortOrder": 1
}
```

### 12. 获取项目角色
```http
GET /api/projects/{id}/roles
Authorization: Bearer {token}
```

### 13. 保存项目角色
```http
POST /api/projects/{id}/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "roles": [
    {
      "roleId": 1,
      "roleName": "项目经理",
      "displayName": "项目经理",
      "identity": "manager",
      "definition": "负责项目整体管理",
      "permissions": {
        "project": {"read": true, "write": true},
        "task": {"read": true, "write": true}
      }
    }
  ]
}
```

### 14. 获取项目活动
```http
GET /api/projects/{id}/activities?page=1&pageSize=20
Authorization: Bearer {token}
```

---

## 🔧 字段管理接口

### 1. 获取字段列表
```http
GET /api/fields?page=1&pageSize=10&name=关键词&type=text&status=active
Authorization: Bearer {token}
```

### 2. 创建字段
```http
POST /api/fields
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "custom_field",
  "name": "自定义字段",
  "displayName": "自定义字段",
  "description": "字段描述",
  "type": "text",
  "componentType": "Input",
  "validationRules": {
    "required": true,
    "maxLength": 100
  },
  "options": null,
  "defaultValue": ""
}
```

### 3. 更新字段
```http
PUT /api/fields/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "更新后的显示名称",
  "description": "更新后的描述",
  "validationRules": {
    "required": true,
    "maxLength": 200
  }
}
```

### 4. 删除字段
```http
DELETE /api/fields/{id}
Authorization: Bearer {token}
```

---

## 👥 角色管理接口

### 1. 获取角色列表
```http
GET /api/roles?page=1&pageSize=10&name=关键词&status=active
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
    "project": {"read": true, "write": false},
    "task": {"read": true, "write": true}
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
  "description": "更新后的描述",
  "permissions": {
    "project": {"read": true, "write": true},
    "task": {"read": true, "write": true}
  }
}
```

### 4. 删除角色
```http
DELETE /api/roles/{id}
Authorization: Bearer {token}
```

### 5. 获取用户角色
```http
GET /api/roles/users/{userId}
Authorization: Bearer {token}
```

### 6. 分配用户角色
```http
POST /api/roles/users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "roleIds": [1, 2],
  "projectId": 1
}
```

---

## 📊 状态管理接口

### 1. 获取状态列表
```http
GET /api/statuses?page=1&pageSize=10&name=关键词&status=active
Authorization: Bearer {token}
```

### 2. 创建状态
```http
POST /api/statuses
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "新状态",
  "clientDisplayName": "客户端显示名",
  "description": "状态描述",
  "clientDescription": "客户端描述",
  "color": "#3B82F6",
  "icon": "play",
  "sortOrder": 1
}
```

### 3. 更新状态
```http
PUT /api/statuses/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "clientDisplayName": "更新后的显示名",
  "description": "更新后的描述",
  "color": "#10B981"
}
```

### 4. 删除状态
```http
DELETE /api/statuses/{id}
Authorization: Bearer {token}
```

---

## 📋 事项管理接口

### 1. 获取事项列表
```http
GET /api/tasks?page=1&pageSize=10&search=关键词&projectId=1&status=active
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
  "displayDescription": "显示描述",
  "projectId": 1
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
      "fieldId": "title",
      "displayName": "标题",
      "displayDescription": "请输入标题",
      "componentType": "Input",
      "editable": true,
      "required": true,
      "applications": ["create", "edit"],
      "defaultValue": "",
      "validationRules": {
        "required": true,
        "maxLength": 100
      },
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
  "workflowId": "workflow_001",
  "workflowStateId": 1
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
      "roleId": 1,
      "permissions": {
        "read": true,
        "write": true,
        "delete": false
      }
    }
  ]
}
```

### 11. 获取事项通知配置
```http
GET /api/tasks/{id}/notifications
Authorization: Bearer {token}
```

### 12. 保存事项通知配置
```http
POST /api/tasks/{id}/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "notifications": [
    {
      "type": "email",
      "events": ["created", "updated", "completed"],
      "recipients": ["assignee", "creator"]
    }
  ]
}
```

---

## ⚙️ 工作流管理接口

### 1. 获取工作流列表
```http
GET /api/workflows?page=1&pageSize=10&name=关键词&status=active
Authorization: Bearer {token}
```

### 2. 创建工作流
```http
POST /api/workflows
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "workflow_001",
  "name": "新工作流",
  "description": "工作流描述",
  "version": "1.0.0",
  "nodes": [
    {
      "id": "start",
      "type": "startNode",
      "position": {"x": 100, "y": 100},
      "data": {"label": "开始"}
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "start",
      "target": "task_1",
      "type": "smoothstep"
    }
  ],
  "settings": {
    "timeout": 3600,
    "retries": 3
  }
}
```

### 3. 更新工作流
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

### 4. 删除工作流
```http
DELETE /api/workflows/{id}
Authorization: Bearer {token}
```

### 5. 获取工作流状态配置
```http
GET /api/workflows/{id}/states
Authorization: Bearer {token}
```

### 6. 保存工作流状态配置
```http
POST /api/workflows/{id}/states
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "状态配置",
  "description": "配置描述",
  "states": [
    {
      "id": "state_1",
      "name": "待处理",
      "description": "等待处理",
      "order": 1,
      "isDefault": true
    }
  ],
  "matrix": {
    "initial": "state_1",
    "progress": ["state_2", "state_3"],
    "pause": ["state_4"],
    "end": "state_5"
  }
}
```

### 7. 获取工作流权限配置
```http
GET /api/workflows/{id}/permissions
Authorization: Bearer {token}
```

### 8. 保存工作流权限配置
```http
POST /api/workflows/{id}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "permissions": {
    "view": ["admin", "manager"],
    "edit": ["admin"],
    "execute": ["admin", "manager", "user"]
  }
}
```

---

## 📝 通用响应格式

### 成功响应
```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    // 具体数据
  }
}
```

### 分页响应
```json
{
  "success": true,
  "code": 200,
  "message": "获取数据成功",
  "data": {
    "list": [
      // 数据列表
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### 错误响应
```json
{
  "success": false,
  "code": 400,
  "message": "请求参数错误",
  "data": null
}
```

---

## 🔒 错误码定义

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

---

## 📋 接口规范

### 1. 请求头规范
- `Content-Type: application/json` - JSON数据
- `Authorization: Bearer {token}` - JWT认证
- `Accept: application/json` - 接受JSON响应

### 2. 分页参数
- `page`: 页码，从1开始
- `pageSize`: 每页数量，默认10，最大100

### 3. 排序参数
- `sortBy`: 排序字段
- `sortOrder`: 排序方向，asc/desc

### 4. 搜索参数
- `search`: 关键词搜索
- `status`: 状态筛选
- `type`: 类型筛选

### 5. 时间格式
- 统一使用ISO 8601格式：`YYYY-MM-DD HH:mm:ss`

### 6. 文件上传
- 使用`multipart/form-data`格式
- 支持的文件类型：jpg, png, gif, pdf, doc, docx
- 文件大小限制：10MB
