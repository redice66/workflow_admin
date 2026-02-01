# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing & Quality
npm run type-check   # TypeScript type checking (if available)
npm run format       # Format with Prettier (if available)

# Dependencies
npm install          # Install dependencies
npm ci               # Clean install for CI/CD
```

## Core Architecture

### Application Structure
- **Next.js 15 App Router** with server/client components
- **TypeScript-first** - strict mode enabled
- **Monorepo-style** organization within single repo

### Key Directories
```
app/                    # Next.js App Router
├── dashboard/          # Main admin interface
│   ├── projects/       # Project template management
│   ├── tasks/          # Task management with workflows
│   ├── fields/         # Dynamic field configuration
│   ├── roles/          # RBAC permission system
│   ├── status/         # Status matrix management
│   └── workflow-config/# Workflow visual editor
├── login/             # Authentication pages
├── forgot-password/
└── reset-password/

components/             # Component library
├── ui/                # 50 Radix UI components (shadcn/ui based)
├── projects/          # Project management (6-tab config)
├── tasks/             # Task management (workflow dialog)
├── fields/            # Field system (dynamic field config)
├── roles/             # Role & permissions
├── status/            # Status management
├── workflow/          # Workflow components
└── workflows/         # ReactFlow-based workflow editor

lib/                   # Business logic
├── api/               # 13 API modules with mock data
├── stores/            # Zustand global state (node-store, fields-store)
├── hooks/             # Custom React hooks
└── utils.ts           # Shared utilities

types/                 # TypeScript type definitions
├── project.ts         # Project-related interfaces
└── workflow-state.ts  # Workflow state types

hooks/                 # Custom React hooks
├── use-mobile.tsx     # Mobile detection hook
└── use-toast.ts       # Toast notification hook
```

## State Management Pattern
- **Server State**: TanStack Query for caching/syncing API data
- **Global State**: Zustand stores for cross-component state
  - `node-store.ts` - Workflow nodes, edges, and node templates
  - `fields-store.ts` - Dynamic field definitions and filtering
- **Local State**: React useState for component-scoped state
- **Form State**: React Hook Form + Zod for complex form validation
- **Data Flow**: API → TanStack Query → Components → Zustand (when needed for global access)

## Key Business Modules

### 1. Project Management (`components/projects/`)
- **Purpose**: Project template lifecycle management
- **Key Files**:
  - `project-management.tsx` - Main component
  - `project-table.tsx` - CRUD operations
  - `tabs/` - 6 configuration tabs (fields, settings, stages, content, roles, activity)

### 2. Task Management (`components/tasks/`)
- **Purpose**: Complex workflow-driven task system
- **Key Components**:
  - `task-workflow-dialog.tsx` - Workflow configuration
  - Dynamic field setup and validation
  - State transition management

### 3. Workflow System (`components/workflows/`)
- **Purpose**: Visual workflow editor using ReactFlow
- **Features**:
  - Node-based visual editor with drag-and-drop
  - Multiple node types: tasks, gateways (exclusive/parallel), events (timer/message), AI nodes
  - Status matrix and state transitions
  - Permission-based workflow control
  - Auto-layout using dagre algorithm

### 4. Dynamic Field System (`components/fields/`, `lib/fields-store.ts`)
- **Purpose**: Configurable field definitions for forms
- **Field Types**: Single/multi-line text, rich text, attachment, dropdown (single/multi), number, dateTime, user select, reference
- **Features**:
  - Field reusability across projects
  - Option references between fields
  - Status management (active/inactive)
  - Client-side vs admin-side display customization

## API Architecture
All API modules in `lib/api/` follow:
- Mock data for development
- Standardized response format: `{ code: number, data: T, message: string }`
- CRUD operations with optimistic updates
- Error handling via toast notifications

**Key APIs**:
- `projects-api.ts` - Project template CRUD
- `workflow-api.ts` - Workflow configuration & nodes
- `fields-api.ts` - Dynamic field definitions
- `task-api.ts` - Task management
- `status-api.ts` - Status matrix
- `roles-api.ts` - RBAC roles & permissions
- `auth-api.ts` - Authentication
- `user-api.ts` - User management
- Other supporting APIs: workflow-state, task-content, task-permissions, workflows, nodes

## Development Patterns

### Component Structure
```typescript
// Typical component pattern
"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"

interface ComponentProps {
  // Props with proper typing
}

export function ComponentName({ ...props }: ComponentProps) {
  // Component logic
}
```

### API Usage Pattern
```typescript
// Standard API call pattern
const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: () => projectsApi.getAll()
})
```

### Form Handling
```typescript
// React Hook Form with Zod validation
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {}
})
```

## File Organization Rules
- **Components**: PascalCase (`ProjectManagement.tsx`)
- **Files**: kebab-case (`project-table.tsx`)
- **Types**: PascalCase interfaces
- **Constants**: UPPER_SNAKE_CASE

## Build Configuration
- **Next.js**: `next.config.mjs` - ignores TS/ESLint errors for dev speed
- **TypeScript**: Strict mode enabled, path aliases `@/*` map to project root
- **Tailwind**: Custom HSL color tokens with CSS variables, responsive design
- **Images**: Unoptimized for local dev (set in next.config.mjs)
- **Port**: Dev server runs on http://localhost:3000 by default

## Key Dependencies
- **UI Framework**: Next.js 15.2.4 with App Router
- **Component Library**: Radix UI primitives + shadcn/ui patterns
- **State Management**:
  - TanStack Query v5 for server state
  - Zustand v5 for global client state
- **Forms**: React Hook Form v7 + Zod validation
- **Workflow**: ReactFlow v11 for visual workflow editor
- **Drag & Drop**: @hello-pangea/dnd (formerly react-beautiful-dnd)
- **Styling**: Tailwind CSS v3 + tailwind-merge + class-variance-authority
- **Icons**: Lucide React + Ant Design Icons
- **Others**: date-fns, immer, dagre (for graph layouts)

## Common Development Tasks

### Adding a New Module
1. Create page route in `app/dashboard/[module]/page.tsx`
2. Create component in `components/[module]/`
3. Add API module in `lib/api/[module]-api.ts`
4. Add types in `types/[module].ts` if needed

### Working with Workflows
- Use ReactFlow components from `components/workflows/`
- Follow node-based pattern for visual editing
- Implement state machine patterns for transitions

### Form Development
- Use React Hook Form + Zod for validation
- Leverage existing UI components from `components/ui/`
- Follow established modal/drawer patterns

### API Integration
- Follow existing API module patterns
- Use TanStack Query for server state
- Implement optimistic updates where appropriate

## 全局配置
- 技术问题优先用中文回复
- 代码注释要详细，新人能看懂
- 优先使用成熟开源方案，避免重复造轮子
- 性能优化必须有benchmark数据
- 数据库操作必须考虑并发安全