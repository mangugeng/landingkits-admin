export interface Staff {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  level: 'super_admin' | 'admin' | 'manager' | 'staff';
  permissions: StaffPermission[];
  status: 'active' | 'inactive';
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffActivity {
  id: string;
  staffId: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete';
  details: string;
  timestamp: string;
}

export const STAFF_PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ANALYTICS: 'view_analytics',
  
  // User Management
  VIEW_USERS: 'view_users',
  ADD_USERS: 'add_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  
  // Staff Management
  VIEW_STAFF: 'view_staff',
  ADD_STAFF: 'add_staff',
  EDIT_STAFF: 'edit_staff',
  DELETE_STAFF: 'delete_staff',
  
  // Content Management
  VIEW_CONTENT: 'view_content',
  ADD_CONTENT: 'add_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  
  // Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',
} as const;

export const PERMISSION_GROUPS = {
  DASHBOARD: ['VIEW_DASHBOARD', 'VIEW_ANALYTICS'],
  USER_MANAGEMENT: ['VIEW_USERS', 'ADD_USERS', 'EDIT_USERS', 'DELETE_USERS'],
  STAFF_MANAGEMENT: ['VIEW_STAFF', 'ADD_STAFF', 'EDIT_STAFF', 'DELETE_STAFF'],
  CONTENT_MANAGEMENT: ['VIEW_CONTENT', 'ADD_CONTENT', 'EDIT_CONTENT', 'DELETE_CONTENT'],
  SETTINGS: ['VIEW_SETTINGS', 'EDIT_SETTINGS'],
} as const;

export const PERMISSION_DESCRIPTIONS: Record<keyof typeof STAFF_PERMISSIONS, string> = {
  VIEW_DASHBOARD: 'Dapat melihat dashboard utama',
  VIEW_ANALYTICS: 'Dapat melihat data analitik',
  VIEW_USERS: 'Dapat melihat daftar pengguna',
  ADD_USERS: 'Dapat menambah pengguna baru',
  EDIT_USERS: 'Dapat mengedit data pengguna',
  DELETE_USERS: 'Dapat menghapus pengguna',
  VIEW_STAFF: 'Dapat melihat daftar staf',
  ADD_STAFF: 'Dapat menambah staf baru',
  EDIT_STAFF: 'Dapat mengedit data staf',
  DELETE_STAFF: 'Dapat menghapus staf',
  VIEW_CONTENT: 'Dapat melihat konten',
  ADD_CONTENT: 'Dapat menambah konten baru',
  EDIT_CONTENT: 'Dapat mengedit konten',
  DELETE_CONTENT: 'Dapat menghapus konten',
  VIEW_SETTINGS: 'Dapat melihat pengaturan',
  EDIT_SETTINGS: 'Dapat mengedit pengaturan',
};

export type StaffPermission = typeof STAFF_PERMISSIONS[keyof typeof STAFF_PERMISSIONS];

export const DEFAULT_PERMISSIONS: Record<Staff['level'], StaffPermission[]> = {
  super_admin: Object.values(STAFF_PERMISSIONS),
  admin: [
    STAFF_PERMISSIONS.VIEW_DASHBOARD,
    STAFF_PERMISSIONS.VIEW_ANALYTICS,
    STAFF_PERMISSIONS.VIEW_USERS,
    STAFF_PERMISSIONS.ADD_USERS,
    STAFF_PERMISSIONS.EDIT_USERS,
    STAFF_PERMISSIONS.VIEW_STAFF,
    STAFF_PERMISSIONS.ADD_STAFF,
    STAFF_PERMISSIONS.EDIT_STAFF,
    STAFF_PERMISSIONS.VIEW_CONTENT,
    STAFF_PERMISSIONS.ADD_CONTENT,
    STAFF_PERMISSIONS.EDIT_CONTENT,
    STAFF_PERMISSIONS.VIEW_SETTINGS,
  ],
  manager: [
    STAFF_PERMISSIONS.VIEW_DASHBOARD,
    STAFF_PERMISSIONS.VIEW_ANALYTICS,
    STAFF_PERMISSIONS.VIEW_USERS,
    STAFF_PERMISSIONS.VIEW_CONTENT,
    STAFF_PERMISSIONS.ADD_CONTENT,
    STAFF_PERMISSIONS.EDIT_CONTENT,
    STAFF_PERMISSIONS.VIEW_SETTINGS,
  ],
  staff: [
    STAFF_PERMISSIONS.VIEW_DASHBOARD,
    STAFF_PERMISSIONS.VIEW_CONTENT,
    STAFF_PERMISSIONS.ADD_CONTENT,
    STAFF_PERMISSIONS.EDIT_CONTENT,
  ],
}; 