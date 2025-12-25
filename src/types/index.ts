// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  sessionId?: string;
}

export interface Session {
  id: string;
  deviceInfo: {
    browser?: string;
    os?: string;
    device?: string;
    platform?: string;
  } | null;
  ipAddress: string | null;
  userAgent: string | null;
  lastActivity: string;
  createdAt: string;
  rememberMe: boolean;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string | null;
  assigneeId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User;
  createdBy?: User;
  project?: Project;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId?: string;
  assigneeId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId?: string;
  assigneeId?: string;
}

// Project Types
export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  taskId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: User | null;
  task?: Task | null;
}

export interface CreateCommentInput {
  content: string;
  taskId: string;
}

export interface UpdateCommentInput {
  content: string;
}

// Label Types
export interface Label {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabelInput {
  name: string;
  color?: string;
}

export interface UpdateLabelInput {
  name?: string;
  color?: string;
}

export interface LabelTaskInput {
  labelId: string;
  taskId: string;
}

// Role Types
// Simple Role (used in User context - permissions as string array)
export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// Detailed Role (used in admin panel - permissions as Permission objects)
export interface RoleDetail {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

export interface AssignPermissionInput {
  roleId: string;
  permissionId: string;
}

// Permission Types
export interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  roleCount?: number;
  createdAt: string;
  roles?: Role[];
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

