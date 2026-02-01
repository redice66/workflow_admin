# 后端表结构设计文档

## 📊 数据库表结构

### 1. 用户认证相关表

#### 1.1 用户表 (users)
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    name VARCHAR(100) NOT NULL COMMENT '姓名',
    role VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色',
    bio TEXT COMMENT '个人简介',
    phone VARCHAR(20) COMMENT '手机号',
    location VARCHAR(100) COMMENT '位置',
    avatar_url VARCHAR(255) COMMENT '头像URL',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active' COMMENT '状态',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) COMMENT '用户表';
```

#### 1.2 用户设置表 (user_settings)
```sql
CREATE TABLE user_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    notifications_email BOOLEAN DEFAULT TRUE COMMENT '邮件通知',
    notifications_push BOOLEAN DEFAULT TRUE COMMENT '推送通知',
    notifications_task_updates BOOLEAN DEFAULT TRUE COMMENT '任务更新通知',
    notifications_security_alerts BOOLEAN DEFAULT TRUE COMMENT '安全警报通知',
    notifications_marketing_emails BOOLEAN DEFAULT FALSE COMMENT '营销邮件通知',
    theme VARCHAR(20) DEFAULT 'light' COMMENT '主题',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) COMMENT '用户设置表';
```

#### 1.3 密码重置表 (password_resets)
```sql
CREATE TABLE password_resets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    token VARCHAR(255) UNIQUE NOT NULL COMMENT '重置令牌',
    expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
    used BOOLEAN DEFAULT FALSE COMMENT '是否已使用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) COMMENT '密码重置表';
```

### 2. 项目管理相关表

#### 2.1 项目表 (projects)
```sql
CREATE TABLE projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '项目名称',
    display_name VARCHAR(100) NOT NULL COMMENT 'C端展示名称',
    description TEXT COMMENT '项目释义',
    display_description TEXT COMMENT 'C端提示语',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    created_by BIGINT NOT NULL COMMENT '创建人ID',
    updated_by BIGINT NOT NULL COMMENT '更新人ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by)
) COMMENT '项目表';
```

#### 2.2 项目字段配置表 (project_fields)
```sql
CREATE TABLE project_fields (
    id VARCHAR(36) PRIMARY KEY COMMENT '字段配置ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    field_id VARCHAR(36) NOT NULL COMMENT '字段ID',
    field_name VARCHAR(100) NOT NULL COMMENT '字段名称',
    display_name VARCHAR(100) NOT NULL COMMENT '显示名称',
    component_type VARCHAR(50) NOT NULL COMMENT '组件类型',
    required BOOLEAN DEFAULT FALSE COMMENT '是否必填',
    editable BOOLEAN DEFAULT TRUE COMMENT '是否可编辑',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES fields(id),
    INDEX idx_project_id (project_id),
    INDEX idx_field_id (field_id),
    INDEX idx_sort_order (sort_order)
) COMMENT '项目字段配置表';
```

#### 2.3 项目阶段表 (project_stages)
```sql
CREATE TABLE project_stages (
    id VARCHAR(36) PRIMARY KEY COMMENT '阶段ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    name VARCHAR(100) NOT NULL COMMENT '阶段名称',
    display_name VARCHAR(100) NOT NULL COMMENT '显示名称',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_sort_order (sort_order)
) COMMENT '项目阶段表';
```

#### 2.4 项目内容库表 (project_contents)
```sql
CREATE TABLE project_contents (
    id VARCHAR(36) PRIMARY KEY COMMENT '内容ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    stage_id VARCHAR(36) NOT NULL COMMENT '阶段ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT COMMENT '内容',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (stage_id) REFERENCES project_stages(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_stage_id (stage_id),
    INDEX idx_sort_order (sort_order)
) COMMENT '项目内容库表';
```

#### 2.5 项目角色表 (project_roles)
```sql
CREATE TABLE project_roles (
    id VARCHAR(36) PRIMARY KEY COMMENT '角色ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    role_id VARCHAR(36) NOT NULL COMMENT '角色ID',
    role_name VARCHAR(100) NOT NULL COMMENT '角色名称',
    display_name VARCHAR(100) NOT NULL COMMENT '显示名称',
    identity VARCHAR(100) COMMENT '身份标识',
    definition TEXT COMMENT '角色定义',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_project_id (project_id),
    INDEX idx_role_id (role_id)
) COMMENT '项目角色表';
```

#### 2.6 项目角色权限表 (project_role_permissions)
```sql
CREATE TABLE project_role_permissions (
    id VARCHAR(36) PRIMARY KEY COMMENT '权限ID',
    project_role_id VARCHAR(36) NOT NULL COMMENT '项目角色ID',
    permission_type ENUM('page', 'field', 'task', 'visibility') NOT NULL COMMENT '权限类型',
    resource_id VARCHAR(36) NOT NULL COMMENT '资源ID',
    allowed BOOLEAN DEFAULT TRUE COMMENT '是否允许',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_role_id) REFERENCES project_roles(id) ON DELETE CASCADE,
    INDEX idx_project_role_id (project_role_id),
    INDEX idx_permission_type (permission_type),
    INDEX idx_resource_id (resource_id)
) COMMENT '项目角色权限表';
```

#### 2.7 项目设置表 (project_settings)
```sql
CREATE TABLE project_settings (
    id VARCHAR(36) PRIMARY KEY COMMENT '设置ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    field_visibility_settings JSON COMMENT '字段可见性设置',
    field_editability_settings JSON COMMENT '字段可编辑性设置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY uk_project_id (project_id)
) COMMENT '项目设置表';
```

#### 2.8 项目动态表 (project_activities)
```sql
CREATE TABLE project_activities (
    id VARCHAR(36) PRIMARY KEY COMMENT '动态ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    activity_type VARCHAR(50) NOT NULL COMMENT '活动类型',
    description TEXT COMMENT '描述',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    user_name VARCHAR(100) NOT NULL COMMENT '用户名',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_project_id (project_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) COMMENT '项目动态表';
```

### 3. 字段管理相关表

#### 3.1 字段表 (fields)
```sql
CREATE TABLE fields (
    id VARCHAR(36) PRIMARY KEY COMMENT '字段ID',
    name VARCHAR(100) NOT NULL COMMENT '字段名称',
    display_name VARCHAR(100) NOT NULL COMMENT 'C端展示名称',
    hint TEXT COMMENT '字段释义',
    client_hint TEXT COMMENT 'C端展示释义',
    type ENUM('singleLineText', 'multiLineText', 'dropdown', 'multiSelect', 'dateTime', 'number', 'checkbox', 'radio', 'file', 'image', 'richText') NOT NULL COMMENT '元件类型',
    use_reference BOOLEAN DEFAULT FALSE COMMENT '是否引用选项',
    reference_field_id VARCHAR(36) COMMENT '引用的字段ID',
    created_by BIGINT NOT NULL COMMENT '创建人ID',
    updated_by BIGINT NOT NULL COMMENT '更新人ID',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    FOREIGN KEY (reference_field_id) REFERENCES fields(id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by)
) COMMENT '字段表';
```

#### 3.2 字段选项表 (field_options)
```sql
CREATE TABLE field_options (
    id VARCHAR(36) PRIMARY KEY COMMENT '选项ID',
    field_id VARCHAR(36) NOT NULL COMMENT '字段ID',
    label VARCHAR(100) NOT NULL COMMENT '选项名称',
    value VARCHAR(100) NOT NULL COMMENT '选项值',
    hint VARCHAR(200) COMMENT '选项提示',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
    INDEX idx_field_id (field_id),
    INDEX idx_sort_order (sort_order)
) COMMENT '字段选项表';
```

### 4. 角色管理相关表

#### 4.1 角色表 (roles)
```sql
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY COMMENT '角色ID',
    name VARCHAR(100) NOT NULL COMMENT '角色名称',
    display_name VARCHAR(100) NOT NULL COMMENT '显示名称',
    description TEXT COMMENT '角色描述',
    permissions JSON COMMENT '权限配置',
    created_by BIGINT NOT NULL COMMENT '创建人ID',
    updated_by BIGINT NOT NULL COMMENT '更新人ID',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by)
) COMMENT '角色表';
```

### 5. 状态管理相关表

#### 5.1 状态表 (statuses)
```sql
CREATE TABLE statuses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '状态名称',
    client_display_name VARCHAR(100) NOT NULL COMMENT '客户端显示名称',
    description TEXT COMMENT '状态描述',
    client_description TEXT COMMENT '客户端描述',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    creator BIGINT NOT NULL COMMENT '创建人ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_creator (creator)
) COMMENT '状态表';
```

### 6. 事项管理相关表

#### 6.1 事项表 (tasks)
```sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '事项名称',
    display_name VARCHAR(100) NOT NULL COMMENT '显示名称',
    description TEXT COMMENT '事项描述',
    display_description TEXT COMMENT '显示描述',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    creator BIGINT NOT NULL COMMENT '创建人ID',
    updater BIGINT NOT NULL COMMENT '更新人ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator) REFERENCES users(id),
    FOREIGN KEY (updater) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_creator (creator)
) COMMENT '事项表';
```

#### 6.2 事项字段配置表 (task_fields)
```sql
CREATE TABLE task_fields (
    id VARCHAR(36) PRIMARY KEY COMMENT '配置ID',
    task_id BIGINT NOT NULL COMMENT '事项ID',
    field_id VARCHAR(36) NOT NULL COMMENT '字段ID',
    field_name VARCHAR(100) NOT NULL COMMENT '字段名称',
    display_name VARCHAR(100) NOT NULL COMMENT '显示名称',
    display_description TEXT COMMENT '显示描述',
    component_type VARCHAR(50) NOT NULL COMMENT '组件类型',
    editable BOOLEAN DEFAULT TRUE COMMENT '是否可编辑',
    required BOOLEAN DEFAULT FALSE COMMENT '是否必填',
    applications JSON COMMENT '应用场景',
    default_value JSON COMMENT '默认值',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES fields(id),
    INDEX idx_task_id (task_id),
    INDEX idx_field_id (field_id),
    INDEX idx_sort_order (sort_order)
) COMMENT '事项字段配置表';
```

#### 6.3 事项工作流配置表 (task_workflows)
```sql
CREATE TABLE task_workflows (
    id VARCHAR(36) PRIMARY KEY COMMENT '工作流ID',
    task_id BIGINT NOT NULL COMMENT '事项ID',
    workflow_config JSON NOT NULL COMMENT '工作流配置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE KEY uk_task_id (task_id)
) COMMENT '事项工作流配置表';
```

#### 6.4 事项权限配置表 (task_permissions)
```sql
CREATE TABLE task_permissions (
    id VARCHAR(36) PRIMARY KEY COMMENT '权限ID',
    task_id BIGINT NOT NULL COMMENT '事项ID',
    role_id VARCHAR(36) NOT NULL COMMENT '角色ID',
    permission_type ENUM('view', 'edit', 'delete', 'approve', 'assign') NOT NULL COMMENT '权限类型',
    allowed BOOLEAN DEFAULT TRUE COMMENT '是否允许',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_task_id (task_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_type (permission_type)
) COMMENT '事项权限配置表';
```

### 7. 工作流管理相关表

#### 7.1 工作流表 (workflows)
```sql
CREATE TABLE workflows (
    id VARCHAR(36) PRIMARY KEY COMMENT '工作流ID',
    name VARCHAR(100) NOT NULL COMMENT '工作流名称',
    description TEXT COMMENT '工作流描述',
    status ENUM('draft', 'active', 'inactive') DEFAULT 'draft' COMMENT '状态',
    version VARCHAR(20) DEFAULT '1.0.0' COMMENT '版本',
    nodes JSON NOT NULL COMMENT '节点配置',
    edges JSON NOT NULL COMMENT '边配置',
    permissions JSON COMMENT '权限配置',
    settings JSON COMMENT '设置配置',
    created_by BIGINT NOT NULL COMMENT '创建人ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by)
) COMMENT '工作流表';
```

#### 7.2 工作流版本表 (workflow_versions)
```sql
CREATE TABLE workflow_versions (
    id VARCHAR(36) PRIMARY KEY COMMENT '版本ID',
    workflow_id VARCHAR(36) NOT NULL COMMENT '工作流ID',
    version VARCHAR(20) NOT NULL COMMENT '版本号',
    description TEXT COMMENT '版本描述',
    nodes JSON NOT NULL COMMENT '节点配置',
    edges JSON NOT NULL COMMENT '边配置',
    created_by BIGINT NOT NULL COMMENT '创建人ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_workflow_id (workflow_id),
    INDEX idx_version (version)
) COMMENT '工作流版本表';
```

#### 7.3 工作流状态配置表 (workflow_states)
```sql
CREATE TABLE workflow_states (
    id VARCHAR(36) PRIMARY KEY COMMENT '状态ID',
    workflow_id VARCHAR(36) NOT NULL COMMENT '工作流ID',
    name VARCHAR(100) NOT NULL COMMENT '状态名称',
    description TEXT COMMENT '状态描述',
    type ENUM('initial', 'progress', 'end', 'pause') NOT NULL COMMENT '状态类型',
    color VARCHAR(7) DEFAULT '#1890ff' COMMENT '状态颜色',
    is_default BOOLEAN DEFAULT FALSE COMMENT '是否默认状态',
    order_num INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    INDEX idx_workflow_id (workflow_id),
    INDEX idx_type (type),
    INDEX idx_order_num (order_num)
) COMMENT '工作流状态配置表';
```

#### 7.4 工作流状态矩阵表 (workflow_state_matrix)
```sql
CREATE TABLE workflow_state_matrix (
    id VARCHAR(36) PRIMARY KEY COMMENT '矩阵ID',
    workflow_id VARCHAR(36) NOT NULL COMMENT '工作流ID',
    state_id VARCHAR(36) NOT NULL COMMENT '状态ID',
    matrix_config JSON NOT NULL COMMENT '矩阵配置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (state_id) REFERENCES workflow_states(id) ON DELETE CASCADE,
    UNIQUE KEY uk_workflow_state (workflow_id, state_id)
) COMMENT '工作流状态矩阵表';
```

