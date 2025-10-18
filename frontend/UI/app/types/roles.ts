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
  action: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'assign' | '*';
  scope?: 'all' | 'own' | 'warehouse'; // Scope of permission
}

// Warehouse context for scoped permissions
export interface WarehouseContext {
  warehouseId?: string;
  storeName?: string;
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: [
    { resource: 'order', action: 'create', scope: 'own' },
    { resource: 'order', action: 'read', scope: 'own' }, // own orders only
    { resource: 'order', action: 'update', scope: 'own' }, // own orders only
    { resource: 'review', action: 'create', scope: 'own' },
  ],
  [UserRole.MANAGEMENT]: [
    { resource: '*', action: 'read', scope: 'all' }, // read all
    { resource: 'reports', action: 'execute', scope: 'all' },
    { resource: 'reports', action: 'read', scope: 'all' },
    { resource: 'analytics', action: 'read', scope: 'all' },
    { resource: 'audit', action: 'read', scope: 'all' },
    { resource: 'user', action: 'create', scope: 'all' },
    { resource: 'user', action: 'update', scope: 'all' },
    { resource: 'user', action: 'delete', scope: 'all' },
    { resource: 'customer', action: 'read', scope: 'all' },
    { resource: 'order', action: 'read', scope: 'all' },
    { resource: 'order', action: 'update', scope: 'all' },
    { resource: 'order', action: 'create', scope: 'all' },
    { resource: 'warehouse', action: 'read', scope: 'all' },
    { resource: 'warehouse', action: 'assign', scope: 'all' }, // Assign orders to warehouses
    { resource: 'order-assignment', action: 'create', scope: 'all' }, // Assign orders to warehouses
    { resource: 'order-assignment', action: 'update', scope: 'all' },
  ],
  [UserRole.STORE_MANAGER]: [
    { resource: 'order', action: 'read', scope: 'warehouse' }, // Only warehouse orders
    { resource: 'order', action: 'update', scope: 'warehouse' },
    { resource: 'rail', action: 'create', scope: 'warehouse' },
    { resource: 'rail', action: 'update', scope: 'warehouse' },
    { resource: 'rail', action: 'read', scope: 'warehouse' },
    { resource: 'truck', action: 'create', scope: 'warehouse' },
    { resource: 'truck', action: 'update', scope: 'warehouse' },
    { resource: 'truck', action: 'read', scope: 'warehouse' },
    { resource: 'driver', action: 'read', scope: 'warehouse' },
    { resource: 'driver', action: 'update', scope: 'warehouse' },
    { resource: 'assistant', action: 'read', scope: 'warehouse' },
    { resource: 'assistant', action: 'update', scope: 'warehouse' },
    { resource: 'route', action: 'read', scope: 'warehouse' },
    { resource: 'route', action: 'update', scope: 'warehouse' },
    { resource: 'warehouse', action: 'read', scope: 'warehouse' },
    { resource: 'store', action: 'read', scope: 'warehouse' },
    { resource: 'store', action: 'update', scope: 'warehouse' },
    { resource: 'customer', action: 'read', scope: 'all' }, // Can view customers for order placement
  ],
  [UserRole.WAREHOUSE_STAFF]: [
    { resource: 'warehouse', action: 'read', scope: 'warehouse' }, // Only assigned warehouse
    { resource: 'warehouse', action: 'update', scope: 'warehouse' },
    { resource: 'inventory', action: 'create', scope: 'warehouse' },
    { resource: 'inventory', action: 'update', scope: 'warehouse' },
    { resource: 'inventory', action: 'read', scope: 'warehouse' },
    { resource: 'rail', action: 'read', scope: 'warehouse' }, // To verify arrivals
    { resource: 'truck', action: 'read', scope: 'warehouse' }, // To prepare dispatches
    { resource: 'order', action: 'read', scope: 'warehouse' }, // Limited to warehouse orders
  ],
  [UserRole.DRIVER]: [
    { resource: 'delivery', action: 'read', scope: 'own' }, // Own deliveries only
    { resource: 'delivery', action: 'update', scope: 'own' }, // Update status
    { resource: 'route', action: 'read', scope: 'own' }, // Own routes only
    { resource: 'issue', action: 'create', scope: 'own' }, // Report issues
  ],
  [UserRole.DRIVER_ASSISTANT]: [
    { resource: 'driver', action: 'read', scope: 'warehouse' },
    { resource: 'driver', action: 'update', scope: 'warehouse' },
    { resource: 'driver', action: 'assign', scope: 'warehouse' },
    { resource: 'assistant', action: 'read', scope: 'warehouse' },
    { resource: 'truck', action: 'read', scope: 'warehouse' },
    { resource: 'truck', action: 'update', scope: 'warehouse' },
    { resource: 'route', action: 'read', scope: 'warehouse' },
    { resource: 'route', action: 'update', scope: 'warehouse' },
    { resource: 'schedule', action: 'create', scope: 'warehouse' },
    { resource: 'schedule', action: 'update', scope: 'warehouse' },
  ],
  [UserRole.SYSTEM_ADMIN]: [
    { resource: '*', action: 'create', scope: 'all' },
    { resource: '*', action: 'read', scope: 'all' },
    { resource: '*', action: 'update', scope: 'all' },
    { resource: '*', action: 'delete', scope: 'all' },
    { resource: '*', action: 'execute', scope: 'all' },
    { resource: 'warehouse', action: 'assign', scope: 'all' }, // Assign orders to warehouses
    { resource: 'order-assignment', action: 'create', scope: 'all' },
    { resource: 'order-assignment', action: 'update', scope: 'all' },
  ]
};

// Helper function to check if role has permission
export function hasPermission(
  role: UserRole, 
  resource: string, 
  action: string,
  context?: WarehouseContext
): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  // Check for wildcard permissions with 'all' scope
  if (permissions.some(p => p.resource === '*' && p.action === '*' && p.scope === 'all')) {
    return true;
  }
  if (permissions.some(p => p.resource === '*' && p.action === action && p.scope === 'all')) {
    return true;
  }
  if (permissions.some(p => p.resource === resource && p.action === '*' && p.scope === 'all')) {
    return true;
  }
  
  // Check exact permission with scope consideration
  const matchingPermissions = permissions.filter(
    p => p.resource === resource && p.action === action
  );
  
  if (matchingPermissions.length === 0) {
    return false;
  }
  
  // If any permission has 'all' scope, grant access
  if (matchingPermissions.some(p => p.scope === 'all')) {
    return true;
  }
  
  // If user has 'warehouse' scope permission, they need a warehouse context
  if (matchingPermissions.some(p => p.scope === 'warehouse')) {
    // Warehouse-scoped permissions require context validation
    // This will be validated at the component/API level
    return true;
  }
  
  // If user has 'own' scope permission (for customers/drivers)
  if (matchingPermissions.some(p => p.scope === 'own')) {
    return true;
  }
  
  return false;
}

// Helper function to check if permission scope allows access
export function hasPermissionWithScope(
  role: UserRole,
  resource: string,
  action: string,
  userWarehouseId?: string,
  resourceWarehouseId?: string
): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  const matchingPermissions = permissions.filter(
    p => 
      (p.resource === resource || p.resource === '*') && 
      (p.action === action || p.action === '*')
  );
  
  if (matchingPermissions.length === 0) {
    return false;
  }
  
  // System admin and management have 'all' scope
  if (matchingPermissions.some(p => p.scope === 'all')) {
    return true;
  }
  
  // Warehouse-scoped access: check if user's warehouse matches resource's warehouse
  if (matchingPermissions.some(p => p.scope === 'warehouse')) {
    if (userWarehouseId && resourceWarehouseId) {
      return userWarehouseId === resourceWarehouseId;
    }
    // If warehouse IDs not provided, allow (will be validated server-side)
    return true;
  }
  
  // Own scope (customer/driver accessing own resources)
  if (matchingPermissions.some(p => p.scope === 'own')) {
    return true;
  }
  
  return false;
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
