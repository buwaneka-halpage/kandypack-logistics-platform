// User Roles enum matching backend
export enum UserRole {
  CUSTOMER = 'Customer',
  MANAGEMENT = 'Management',
  STORE_MANAGER = 'StoreManager',
  WAREHOUSE_STAFF = 'WarehouseStaff',
  DRIVER = 'Driver',
  DRIVER_ASSISTANT = 'DriverAssistant',
  SYSTEM_ADMIN = 'SystemAdmin'
}

// Permission interface
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute' | '*';
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: [
    { resource: 'order', action: 'create' },
    { resource: 'order', action: 'read' }, // own orders only
    { resource: 'order', action: 'update' }, // own orders only
    { resource: 'review', action: 'create' },
  ],
  [UserRole.MANAGEMENT]: [
    { resource: '*', action: 'read' }, // read all
    { resource: 'reports', action: 'execute' },
    { resource: 'reports', action: 'read' },
    { resource: 'analytics', action: 'read' },
    { resource: 'audit', action: 'read' },
    { resource: 'user', action: 'create' },
    { resource: 'user', action: 'update' },
    { resource: 'user', action: 'delete' },
    { resource: 'customer', action: 'read' },
    { resource: 'order', action: 'read' },
    { resource: 'order', action: 'update' },
  ],
  [UserRole.STORE_MANAGER]: [
    { resource: 'order', action: 'read' },
    { resource: 'order', action: 'update' },
    { resource: 'rail', action: 'create' },
    { resource: 'rail', action: 'update' },
    { resource: 'rail', action: 'read' },
    { resource: 'truck', action: 'create' },
    { resource: 'truck', action: 'update' },
    { resource: 'truck', action: 'read' },
    { resource: 'driver', action: 'read' },
    { resource: 'driver', action: 'update' },
    { resource: 'assistant', action: 'read' },
    { resource: 'assistant', action: 'update' },
    { resource: 'route', action: 'read' },
    { resource: 'route', action: 'update' },
    { resource: 'warehouse', action: 'read' },
    { resource: 'store', action: 'read' },
    { resource: 'store', action: 'update' },
    { resource: 'customer', action: 'read' },
  ],
  [UserRole.WAREHOUSE_STAFF]: [
    { resource: 'warehouse', action: 'read' },
    { resource: 'warehouse', action: 'update' },
    { resource: 'inventory', action: 'create' },
    { resource: 'inventory', action: 'update' },
    { resource: 'inventory', action: 'read' },
    { resource: 'rail', action: 'read' }, // To verify arrivals
    { resource: 'truck', action: 'read' }, // To prepare dispatches
    { resource: 'order', action: 'read' }, // Limited to warehouse orders
  ],
  [UserRole.DRIVER]: [
    { resource: 'delivery', action: 'read' }, // Own deliveries only
    { resource: 'delivery', action: 'update' }, // Update status
    { resource: 'route', action: 'read' }, // Own routes only
    { resource: 'issue', action: 'create' }, // Report issues
  ],
  [UserRole.DRIVER_ASSISTANT]: [
    { resource: 'driver', action: 'read' },
    { resource: 'driver', action: 'update' },
    { resource: 'assistant', action: 'read' },
    { resource: 'truck', action: 'read' },
    { resource: 'truck', action: 'update' },
    { resource: 'route', action: 'read' },
    { resource: 'route', action: 'update' },
    { resource: 'schedule', action: 'create' },
    { resource: 'schedule', action: 'update' },
  ],
  [UserRole.SYSTEM_ADMIN]: [
    { resource: '*', action: 'create' },
    { resource: '*', action: 'read' },
    { resource: '*', action: 'update' },
    { resource: '*', action: 'delete' },
    { resource: '*', action: 'execute' },
  ]
};

// Helper function to check if role has permission
export function hasPermission(role: UserRole, resource: string, action: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  // Check for wildcard permissions
  if (permissions.some(p => p.resource === '*' && p.action === '*')) {
    return true;
  }
  if (permissions.some(p => p.resource === '*' && p.action === action)) {
    return true;
  }
  if (permissions.some(p => p.resource === resource && p.action === '*')) {
    return true;
  }
  
  // Check exact permission
  return permissions.some(p => p.resource === resource && p.action === action);
}

// Helper function to check if user has any of the specified roles
export function hasAnyRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

// Helper function to get user-friendly role name
export function getRoleName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    [UserRole.CUSTOMER]: 'Customer',
    [UserRole.MANAGEMENT]: 'Management',
    [UserRole.STORE_MANAGER]: 'Store Manager',
    [UserRole.WAREHOUSE_STAFF]: 'Warehouse Staff',
    [UserRole.DRIVER]: 'Driver',
    [UserRole.DRIVER_ASSISTANT]: 'Driver Assistant',
    [UserRole.SYSTEM_ADMIN]: 'System Administrator'
  };
  return roleNames[role] || role;
}
