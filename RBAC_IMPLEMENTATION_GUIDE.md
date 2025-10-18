# KandyPack Role-Based Access Control (RBAC) Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Current Implementation Status](#current-implementation-status)
4. [Complete Implementation Roadmap](#complete-implementation-roadmap)
5. [Frontend Implementation](#frontend-implementation)
6. [Backend Implementation](#backend-implementation)
7. [Database Schema for RBAC](#database-schema-for-rbac)
8. [Security Best Practices](#security-best-practices)

---

## Overview

The KandyPack Supply Chain Distribution System requires a comprehensive Role-Based Access Control (RBAC) system to manage access to different functionalities based on user roles. The system serves **six distinct user groups**, each with specific responsibilities and permissions.

### RBAC Goals
- ✅ Restrict access to features based on user roles
- ✅ Ensure secure authentication and authorization
- ✅ Maintain audit trails for all user actions
- ✅ Support session management with automatic timeouts (15 minutes)
- ✅ Enforce password policies and encryption (AES-256, TLS)

---

## User Roles & Permissions

### Overview of Warehouse-Scoped Access Control

The KandyPack system implements **warehouse-based access control** for operational roles. This ensures that:

1. **Management** and **System Administrator** roles can:
   - View all orders across all warehouses
   - Assign customer orders to specific warehouses across the country
   - Manage warehouse assignments and reallocations

2. **Warehouse-scoped roles** (Store Manager, Warehouse Staff, Driver Assistant) can only:
   - Access orders assigned to their specific warehouse
   - Manage resources (inventory, trucks, drivers) within their warehouse
   - Schedule deliveries from their warehouse only

3. **Permission Scopes**:
   - `all`: Full access across all warehouses (Management, SystemAdmin)
   - `warehouse`: Access limited to assigned warehouse (StoreManager, WarehouseStaff, DriverAssistant)
   - `own`: Access to own resources only (Customer, Driver)

This architecture supports the distributed nature of KandyPack's supply chain with multiple warehouses nationwide.

---

### 1. **Customer** 
**Role Code:** `customer`  
**Access Level:** External User  
**Primary Interface:** Web Application (Customer Portal)

#### Permissions & Use Cases

| Use Case | Description | Steps | Permissions Required |
|----------|-------------|-------|---------------------|
| **Place Order** | Submit new orders with delivery details | 1. Login to system<br>2. Navigate to order placement<br>3. Enter order details and address<br>4. System validates (7 days advance requirement)<br>5. Receive confirmation email<br>6. View delivery status | `order:create`<br>`order:view_own` |
| **Cancel Order** | Cancel order within 12 hours | 1. View placed orders<br>2. Select order to cancel<br>3. Provide cancellation reason<br>4. System processes cancellation | `order:cancel_own` |
| **Update Order** | Modify order before warehouse departure | 1. Access order section<br>2. Update quantities or add items<br>3. System validates changes<br>4. Confirm updates | `order:update_own` |
| **Change Delivery Address** | Update delivery location before dispatch | 1. Select order<br>2. Modify delivery address<br>3. System validates new address<br>4. Confirm change | `order:update_address` |
| **Track Order Status** | Monitor last-mile road delivery | 1. Navigate to orders section<br>2. View package tracking<br>3. See real-time status updates | `order:track_own` |
| **Review Service** | Provide feedback after delivery | 1. Access completed orders<br>2. Submit service review<br>3. Rate experience | `review:create` |

**Route Access:**
- `/customer/home` - Dashboard
- `/customer/new-order` - Place orders
- `/customer/track-order` - Track shipments
- `/customer/order-history` - View past orders
- `/customer/help-support` - Support center

---

### 2. **Store Manager** 
**Role Code:** `StoreManager`  
**Access Level:** Internal Staff (Management)  
**Primary Interface:** Admin Web Portal
**Warehouse Scope:** Limited to assigned warehouse only

#### Permissions & Use Cases

| Use Case | Description | Steps | Permissions Required |
|----------|-------------|-------|---------------------|
| **Schedule Rail Cargo Trip** | Allocate warehouse orders to train schedules | 1. Login with authorized credentials<br>2. Navigate to "Rail Transport" section<br>3. **View pending orders for assigned warehouse only** (7+ days advance)<br>4. Select orders for destination<br>5. System calculates space requirements<br>6. View available train capacity<br>7. Assign orders to trip<br>8. System validates capacity<br>9. Confirm assignment<br>10. System updates status to "Scheduled for Rail" | `rail:view:warehouse`<br>`rail:schedule:warehouse`<br>`rail:allocate:warehouse`<br>`order:update_status:warehouse` |
| **Schedule Last-Mile Road Delivery** | Assign trucks, drivers, and assistants from warehouse | 1. Login to system<br>2. Navigate to "Road Delivery" section<br>3. **View warehouse goods ready for delivery** (warehouse-scoped)<br>4. Select delivery route from warehouse<br>5. System shows available resources from warehouse:<br>&nbsp;&nbsp;&nbsp;- Drivers assigned to warehouse<br>&nbsp;&nbsp;&nbsp;- Assistants at warehouse<br>&nbsp;&nbsp;&nbsp;- Trucks at warehouse location<br>6. Assign truck, driver, and assistant<br>7. System validates constraints<br>8. Resolve conflicts if any<br>9. Confirm schedule<br>10. System notifies personnel | `truck:view:warehouse`<br>`truck:schedule:warehouse`<br>`driver:view:warehouse`<br>`driver:assign:warehouse`<br>`assistant:view:warehouse`<br>`assistant:assign:warehouse`<br>`route:view:warehouse`<br>`order:update_status:warehouse` |
| **View Customer Order History** | Access customer orders assigned to warehouse | 1. Login to system<br>2. Navigate to "Customer Management"<br>3. Search customer by ID/name<br>4. **View only orders assigned to this warehouse** with:<br>&nbsp;&nbsp;&nbsp;- Order details<br>&nbsp;&nbsp;&nbsp;- Delivery status<br>&nbsp;&nbsp;&nbsp;- Route information<br>5. Filter by date/status<br>6. Export warehouse-specific reports<br>7. System logs access | `customer:view:all`<br>`order:view:warehouse`<br>`order:export:warehouse` |

**Route Access:**
- `/admin/dashboard` - Warehouse dashboard
- `/admin/rail-scheduling` - Rail cargo for warehouse
- `/admin/last-mile` - Road delivery from warehouse
- `/admin/orders` - Orders assigned to warehouse only
- `/admin/stores` - Warehouse operations
- `/admin/routers` - Warehouse routes

**Important Note:** Store Managers can only see and manage orders that have been **assigned to their warehouse** by Management or System Admin.

---

### 3. **Warehouse Staff** 
**Role Code:** `WarehouseStaff`  
**Access Level:** Internal Staff (Operations)  
**Primary Interface:** Web/Mobile Interface
**Warehouse Scope:** Limited to assigned warehouse only

#### Permissions & Use Cases

| Use Case | Description | Steps | Permissions Required |
|----------|-------------|-------|---------------------|
| **Manage Warehouse Inventory** | Record and update stock levels for assigned warehouse | 1. Login with authorized credentials<br>2. Navigate to "Warehouse Inventory"<br>3. **View current inventory for assigned warehouse only** (products, quantities, locations)<br>4. Upon rail cargo arrival at warehouse:<br>&nbsp;&nbsp;&nbsp;- Select corresponding trip<br>&nbsp;&nbsp;&nbsp;- View expected goods for this warehouse<br>&nbsp;&nbsp;&nbsp;- Verify received quantities<br>&nbsp;&nbsp;&nbsp;- Log discrepancies if any<br>5. System updates warehouse inventory<br>6. For road delivery dispatch from warehouse:<br>&nbsp;&nbsp;&nbsp;- Mark items as dispatched<br>&nbsp;&nbsp;&nbsp;- System reduces warehouse inventory<br>7. System logs transaction with warehouse ID | `inventory:view:warehouse`<br>`inventory:update:warehouse`<br>`inventory:receive:warehouse`<br>`inventory:dispatch:warehouse`<br>`rail:verify_arrival:warehouse` |

**Route Access:**
- `/admin/stores` - Assigned warehouse management only
- `/admin/orders` - View orders for assigned warehouse
- Mobile app for inventory updates

**Important Note:** Warehouse Staff can only manage inventory and orders for their **assigned warehouse**. They cannot see or access data from other warehouses.

---

### 4. **Management** 
**Role Code:** `Management`  
**Access Level:** Internal Staff (Executive)  
**Primary Interface:** Admin Web Portal (Reports & Analytics)
**Warehouse Scope:** Full access to all warehouses

#### Permissions & Use Cases

| Use Case | Description | Steps | Permissions Required |
|----------|-------------|-------|---------------------|
| **Assign Orders to Warehouses** | Allocate customer orders to specific warehouses nationwide | 1. Login with authorized credentials<br>2. Navigate to "Order Management"<br>3. View unassigned customer orders<br>4. Select order(s) to assign<br>5. View list of all warehouses:<br>&nbsp;&nbsp;&nbsp;- Warehouse locations<br>&nbsp;&nbsp;&nbsp;- Current capacity<br>&nbsp;&nbsp;&nbsp;- Geographic proximity to customer<br>6. Select optimal warehouse based on:<br>&nbsp;&nbsp;&nbsp;- Customer delivery address<br>&nbsp;&nbsp;&nbsp;- Warehouse capacity<br>&nbsp;&nbsp;&nbsp;- Inventory availability<br>7. Confirm warehouse assignment<br>8. System updates order with warehouse_id<br>9. Order becomes visible to warehouse staff<br>10. System logs assignment for audit | `order:read:all`<br>`order:update:all`<br>`warehouse:assign:all`<br>`order-assignment:create:all`<br>`warehouse:view:all` |
| **Generate Sales & Utilization Reports** | Analyze performance metrics across all warehouses | 1. Login with authorized credentials<br>2. Navigate to "Reports and Analytics"<br>3. View available report types:<br>&nbsp;&nbsp;&nbsp;- Quarterly sales reports (all warehouses)<br>&nbsp;&nbsp;&nbsp;- Product popularity analysis<br>&nbsp;&nbsp;&nbsp;- City/route-wise sales<br>&nbsp;&nbsp;&nbsp;- Driver/assistant working hours per warehouse<br>&nbsp;&nbsp;&nbsp;- Truck usage statistics by warehouse<br>&nbsp;&nbsp;&nbsp;- Warehouse performance comparison<br>4. Select report type<br>5. Specify parameters (date range, quarter, warehouse filter)<br>6. System retrieves data from all warehouses<br>7. Review generated report with:<br>&nbsp;&nbsp;&nbsp;- Sales value and volume<br>&nbsp;&nbsp;&nbsp;- Most ordered items<br>&nbsp;&nbsp;&nbsp;- Regional breakdowns<br>&nbsp;&nbsp;&nbsp;- Resource utilization<br>&nbsp;&nbsp;&nbsp;- Cross-warehouse comparisons<br>8. Filter/sort data<br>9. Export as PDF/CSV<br>10. System logs activity | `reports:view_all:all`<br>`reports:generate:all`<br>`reports:export:all`<br>`analytics:view:all`<br>`sales:view:all`<br>`driver:view_hours:all`<br>`assistant:view_hours:all`<br>`truck:view_usage:all` |
| **View All System Data** | Access comprehensive system information across warehouses | Full access to all resources for oversight | `*:view_all:all` (Super permission) |
| **Audit User Actions** | Review system logs from all warehouses | Access audit trails for compliance | `audit:view:all`<br>`logs:view_all:all` |
| **Reallocate Orders** | Move orders between warehouses if needed | 1. View assigned orders<br>2. Select order to reallocate<br>3. Choose new warehouse<br>4. System validates and updates<br>5. Notifies both warehouse teams | `order:update:all`<br>`warehouse:assign:all` |

**Route Access:**
- `/admin/dashboard` - Executive dashboard (all warehouses)
- `/admin/reports` - Analytics and reporting (cross-warehouse)
- `/admin/logs` - Activity logs (all warehouses)
- `/admin/admin-management` - User management
- `/admin/order-assignment` - Warehouse assignment interface
- All other admin routes (read access across all warehouses)

**Important Note:** Management has **full visibility and control** across all warehouses. They are responsible for the critical function of assigning customer orders to the appropriate warehouse based on logistics optimization.

---

### 5. **Driver** 
**Role Code:** `Driver`  
**Access Level:** Internal Staff (Field Operations)  
**Primary Interface:** Mobile Application

#### Permissions & Use Cases

| Use Case | Description | Steps | Permissions Required |
|----------|-------------|-------|---------------------|
| **Deliver Packages** | Execute last-mile deliveries | 1. Login via mobile app<br>2. Navigate to "Delivery Schedule"<br>3. View assigned routes with:<br>&nbsp;&nbsp;&nbsp;- Delivery locations<br>&nbsp;&nbsp;&nbsp;- Customer orders<br>&nbsp;&nbsp;&nbsp;- Expected times<br>4. Confirm package loading at warehouse<br>5. Verify against delivery manifest<br>6. Begin delivery route<br>7. At each stop:<br>&nbsp;&nbsp;&nbsp;- Deliver packages<br>&nbsp;&nbsp;&nbsp;- Collect customer confirmation<br>&nbsp;&nbsp;&nbsp;- Update status to "Delivered"<br>8. For issues (customer unavailable):<br>&nbsp;&nbsp;&nbsp;- Log issue details<br>&nbsp;&nbsp;&nbsp;- System marks for follow-up<br>9. System logs driver hours (40hr/week limit)<br>10. Mark route as finished<br>11. System notifies Store Manager | `delivery:view_assigned`<br>`delivery:update_status`<br>`delivery:complete`<br>`issue:report`<br>`route:view_assigned` |

**Route Access:**
- Mobile app only
- Driver portal (if web access provided)
- Limited to own assigned routes

**Constraints:**
- Cannot be assigned consecutive deliveries
- Maximum 40 hours per week
- Working hours automatically tracked

---

### 6. **Driver Assistant** 
**Role Code:** `DriverAssistant`  
**Access Level:** Internal Staff (Operations Support)  
**Primary Interface:** Web/Mobile Interface
**Warehouse Scope:** Limited to assigned warehouse only

#### Permissions & Use Cases

| Use Case | Description | Steps | Permissions Required |
|----------|-------------|-------|---------------------|
| **Assign Drivers** | Allocate drivers to delivery routes from warehouse | 1. Login with authorized credentials<br>2. Navigate to "Driver Assignment"<br>3. **View scheduled routes for assigned warehouse only**<br>4. Select route<br>5. System shows available drivers from warehouse:<br>&nbsp;&nbsp;&nbsp;- Filters out consecutive assignments<br>&nbsp;&nbsp;&nbsp;- Excludes drivers exceeding 40hrs/week<br>&nbsp;&nbsp;&nbsp;- Shows only drivers assigned to this warehouse<br>6. Select driver from available list<br>7. System validates:<br>&nbsp;&nbsp;&nbsp;- No scheduling conflicts<br>&nbsp;&nbsp;&nbsp;- Hour limit compliance<br>8. If conflict, system suggests alternatives<br>9. Confirm assignment<br>10. System logs and notifies driver | `driver:view:warehouse`<br>`driver:assign:warehouse`<br>`route:view:warehouse`<br>`schedule:manage:warehouse` |
| **Check Routes** | Verify route scheduling and compliance for warehouse | 1. Login to system<br>2. Navigate to "Route Management"<br>3. **View scheduled delivery routes from warehouse**<br>4. Select route to review<br>5. System shows:<br>&nbsp;&nbsp;&nbsp;- Orders and stops (warehouse orders only)<br>&nbsp;&nbsp;&nbsp;- Expected timelines<br>&nbsp;&nbsp;&nbsp;- Assigned personnel and truck from warehouse<br>6. Verify compliance:<br>&nbsp;&nbsp;&nbsp;- No overlapping assignments<br>&nbsp;&nbsp;&nbsp;- Assistant limit (2 consecutive routes)<br>&nbsp;&nbsp;&nbsp;- Truck compatibility<br>7. Flag issues for resolution<br>8. System logs review<br>9. Mark route as verified or escalate<br>10. System updates route record | `route:view:warehouse`<br>`route:verify:warehouse`<br>`route:flag_issues:warehouse`<br>`driver:view:warehouse`<br>`assistant:view:warehouse`<br>`truck:view:warehouse` |
| **Schedule Trucks** | Assign trucks to delivery routes from warehouse | 1. Login to system<br>2. Navigate to "Truck Scheduling"<br>3. **View routes needing trucks (warehouse routes only)**<br>4. Select route<br>5. System shows available trucks at warehouse:<br>&nbsp;&nbsp;&nbsp;- Filters by availability<br>&nbsp;&nbsp;&nbsp;- Checks capacity compatibility<br>&nbsp;&nbsp;&nbsp;- Shows only warehouse fleet<br>6. Select truck<br>7. System validates:<br>&nbsp;&nbsp;&nbsp;- No overlapping routes<br>&nbsp;&nbsp;&nbsp;- Usage limit compliance<br>8. If conflict, system suggests alternatives<br>9. Confirm assignment<br>10. System notifies personnel | `truck:view:warehouse`<br>`truck:schedule:warehouse`<br>`route:view:warehouse`<br>`schedule:manage:warehouse` |

**Route Access:**
- `/admin/rosters` - Driver/assistant management (warehouse team)
- `/admin/last-mile` - Delivery scheduling (warehouse operations)
- Mobile app for field operations

**Constraints:**
- Assistants limited to 2 consecutive routes
- Maximum 60 hours per week for assistants
- Must validate all scheduling constraints
- **Can only manage resources assigned to their warehouse**

---

### 7. **System Administrator** (Implied Role)
**Role Code:** `SystemAdmin`  
**Access Level:** Super Admin  
**Primary Interface:** Admin Portal + System Console
**Warehouse Scope:** Full access to all warehouses

#### Permissions
- Full system access (`*:*:all`)
- User management (`user:create:all`, `user:update:all`, `user:delete:all`)
- Role assignment (`role:assign:all`, `role:modify:all`)
- Warehouse assignment for users (`user:assign_warehouse:all`)
- Order-to-warehouse assignment (`order:assign_warehouse:all`, `warehouse:assign:all`)
- System configuration (`system:configure:all`)
- Database management (`database:manage:all`)
- Security settings (`security:manage:all`)

#### Additional Responsibilities
- Assign staff members to specific warehouses
- Manage warehouse-user relationships
- Assist Management with order-to-warehouse assignments when needed
- Configure warehouse-specific settings and policies

**Important Note:** System Administrators have the same warehouse assignment capabilities as Management and can assign both orders and users to warehouses.

---

## Current Implementation Status

### ✅ **Implemented** (Frontend)

1. **Dual Authentication System**
   - **Admin Login:** `/admin` - Uses `admin` role
   - **Customer Login:** `/login` - Uses `customer` role
   - Separate OAuth2 flows for each portal

2. **Protected Routes**
   - **ProtectedRoute Component:** Guards admin routes
   - **CustomerProtectedRoute Component:** Guards customer routes
   - Role-based redirection with user feedback
   - Loading states during authentication checks

3. **Authentication Context (useAuth)**
   - User state management
   - JWT token handling (localStorage)
   - Login/logout functionality
   - Role verification
   - Session persistence

4. **Route Configuration**
   - Admin routes: `/admin/*`
   - Customer routes: `/customer/*`
   - Public routes: `/` (landing page)

### ✅ **Implemented** (Backend)

1. **JWT Authentication**
   - Secret key: `dev-secret-change-me` (⚠️ Change in production)
   - Algorithm: HS256
   - Token expiration: 100 minutes
   - Token payload includes: `sub` (user_id), `role`

2. **Password Security**
   - Primary: pbkdf2_sha256 (salted hashing)
   - Fallback: SHA256 hex digest (legacy support)
   - Password verification with hash comparison

3. **Dual OAuth2 Schemes**
   - `oauth2_scheme_user`: `/users/login`
   - `oauth2_scheme_customer`: `/customers/login`

4. **Authorization Dependencies**
   - `get_current_user`: Validates staff/admin users
   - `get_current_customer`: Validates customer users
   - `require_management`: Enforces Management role

5. **Database Models**
   - **Users Table:** Stores staff with `role` field
     - Roles: Management, StoreManager, Driver, DriverAssistant, WarehouseStaff
   - **Customers Table:** Separate authentication for customers

6. **API Endpoint Protection**
   - Orders: Management, StoreManager can view all; Customers can create
   - Reports: Management only
   - Rail/Truck Scheduling: Management, StoreManager
   - Customer data: Management only

### ⚠️ **Partially Implemented**

1. **Role Granularity**
   - Currently only checks `admin` vs `customer` in frontend
   - Backend has more roles (Management, StoreManager, etc.) not fully utilized
   - No distinction between Management, StoreManager, WarehouseStaff in frontend

2. **Permission System**
   - No fine-grained permissions (only role-based)
   - Missing permission-level checks (e.g., `order:create`, `reports:view`)

3. **Audit Logging**
   - Basic logging exists but not comprehensive
   - No centralized audit trail system
   - Limited access log retention

### ❌ **Not Implemented**

1. **Multi-Role Support in Frontend**
   - No UI for Driver role
   - No UI for Driver Assistant role
   - No UI for Warehouse Staff role
   - No distinction between Management and StoreManager in routes

2. **Session Management**
   - No automatic 15-minute timeout
   - No session tracking across devices
   - No "logout all devices" functionality

3. **Password Policies**
   - No minimum length enforcement
   - No complexity requirements
   - No password expiration
   - No password history

4. **Mobile Application**
   - No mobile app for Drivers
   - No mobile app for Warehouse Staff

5. **Advanced Security Features**
   - No intrusion detection
   - No rate limiting
   - No 2FA/MFA support
   - No IP whitelisting

---

## Complete Implementation Roadmap

### Phase 1: Enhanced Frontend RBAC (2-3 weeks)

#### 1.1 Expand Role System
```typescript
// frontend/UI/app/types/roles.ts
export enum UserRole {
  CUSTOMER = 'customer',
  MANAGEMENT = 'Management',
  STORE_MANAGER = 'StoreManager',
  WAREHOUSE_STAFF = 'WarehouseStaff',
  DRIVER = 'Driver',
  DRIVER_ASSISTANT = 'DriverAssistant',
  SYSTEM_ADMIN = 'SystemAdmin'
}

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
}

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
    { resource: 'analytics', action: 'read' },
    { resource: 'audit', action: 'read' },
  ],
  [UserRole.STORE_MANAGER]: [
    { resource: 'order', action: 'read' },
    { resource: 'order', action: 'update' },
    { resource: 'rail', action: 'create' },
    { resource: 'rail', action: 'update' },
    { resource: 'truck', action: 'create' },
    { resource: 'truck', action: 'update' },
    { resource: 'driver', action: 'read' },
    { resource: 'assistant', action: 'read' },
  ],
  // ... more roles
};
```

#### 1.2 Update useAuth Hook
```typescript
// frontend/UI/app/hooks/useAuth.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, portal: 'admin' | 'customer') => Promise<boolean>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export function useAuth(): AuthContextType {
  // ... existing code
  
  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
    return permissions.some(p => 
      (p.resource === '*' || p.resource === resource) && 
      (p.action === action || p.action === '*')
    );
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role as UserRole);
    }
    return user.role === role;
  };

  return { user, isAuthenticated, loading, login, logout, hasPermission, hasRole };
}
```

#### 1.3 Create Permission-Based Route Guards
```typescript
// frontend/UI/app/components/PermissionRoute.tsx
import { Navigate } from "react-router";
import { useAuth } from "~/hooks/useAuth";

interface PermissionRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: { resource: string; action: string }[];
  fallback?: string;
}

export function PermissionRoute({ 
  children, 
  requiredRoles, 
  requiredPermissions,
  fallback = "/unauthorized" 
}: PermissionRouteProps) {
  const { user, isAuthenticated, loading, hasRole, hasPermission } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to={fallback} replace />;
  }

  // Check permission requirements
  if (requiredPermissions) {
    const hasAllPermissions = requiredPermissions.every(p =>
      hasPermission(p.resource, p.action)
    );
    if (!hasAllPermissions) {
      return <Navigate to={fallback} replace />;
    }
  }

  return <>{children}</>;
}
```

#### 1.4 Update Route Configuration
```typescript
// frontend/UI/app/routes.ts
export default [
  index("routes/landing.tsx"),
  
  // Customer routes
  route("/login", "routes/customer-login.tsx"),
  layout("components/customer/CustomerLayout.tsx", [
    route("/customer/home", "routes/customer-home.tsx"),
    route("/customer/new-order", "routes/customer-new-order.tsx"),
    route("/customer/track-order", "routes/customer-track-order.tsx"),
    route("/customer/order-history", "routes/customer-order-history.tsx"),
    route("/customer/help-support", "routes/customer-help-support.tsx"),
  ]),
  
  // Admin/Staff login
  route("/admin", "routes/login.tsx"),
  
  // Management routes
  layout("components/admin/ManagementLayout.tsx", [
    route("/management/dashboard", "routes/management-dashboard.tsx"),
    route("/management/reports", "routes/reports.tsx"),
    route("/management/analytics", "routes/analytics.tsx"),
    route("/management/logs", "routes/logs.tsx"),
    route("/management/admin-management", "routes/admin.tsx"),
  ]),
  
  // Store Manager routes
  layout("components/admin/StoreManagerLayout.tsx", [
    route("/store-manager/dashboard", "routes/sm-dashboard.tsx"),
    route("/store-manager/orders", "routes/order-management.tsx"),
    route("/store-manager/rail-scheduling", "routes/rail-scheduling.tsx"),
    route("/store-manager/last-mile", "routes/last-mile.tsx"),
    route("/store-manager/stores", "routes/stores.tsx"),
  ]),
  
  // Warehouse Staff routes
  layout("components/admin/WarehouseLayout.tsx", [
    route("/warehouse/dashboard", "routes/warehouse-dashboard.tsx"),
    route("/warehouse/inventory", "routes/warehouse-inventory.tsx"),
    route("/warehouse/receiving", "routes/warehouse-receiving.tsx"),
  ]),
  
  // Driver Assistant routes
  layout("components/admin/DriverAssistantLayout.tsx", [
    route("/driver-assistant/dashboard", "routes/da-dashboard.tsx"),
    route("/driver-assistant/assign-drivers", "routes/assign-drivers.tsx"),
    route("/driver-assistant/check-routes", "routes/check-routes.tsx"),
    route("/driver-assistant/schedule-trucks", "routes/schedule-trucks.tsx"),
  ]),
  
  // Shared admin routes (accessible by multiple roles)
  route("/admin/dashboard", "routes/dashboard.tsx"), // Accessible by Management, StoreManager
  route("/admin/orders", "routes/order-management.tsx"), // StoreManager, Management
] satisfies RouteConfig;
```

### Phase 2: Backend RBAC Enhancement (2-3 weeks)

#### 2.1 Implement Permission-Based Authorization
```python
# backend/app/core/permissions.py
from enum import Enum
from typing import List, Dict, Set

class Resource(str, Enum):
    ORDER = "order"
    CUSTOMER = "customer"
    RAIL = "rail"
    TRUCK = "truck"
    DRIVER = "driver"
    ASSISTANT = "assistant"
    WAREHOUSE = "warehouse"
    REPORT = "report"
    ROUTE = "route"
    STORE = "store"
    USER = "user"

class Action(str, Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    EXECUTE = "execute"

class Permission:
    def __init__(self, resource: Resource, action: Action):
        self.resource = resource
        self.action = action
    
    def __str__(self):
        return f"{self.resource}:{self.action}"

# Role-Permission Mapping
ROLE_PERMISSIONS: Dict[str, Set[str]] = {
    "Customer": {
        "order:create",
        "order:read",  # Own orders only
        "order:update",  # Own orders only
        "review:create",
    },
    "Management": {
        "*:read",  # Read all resources
        "report:execute",
        "report:read",
        "analytics:read",
        "audit:read",
        "user:create",
        "user:update",
        "user:delete",
    },
    "StoreManager": {
        "order:read",
        "order:update",
        "rail:create",
        "rail:update",
        "rail:read",
        "truck:create",
        "truck:update",
        "truck:read",
        "driver:read",
        "assistant:read",
        "route:read",
        "route:update",
        "warehouse:read",
        "store:read",
        "store:update",
    },
    "WarehouseStaff": {
        "warehouse:read",
        "warehouse:update",
        "inventory:create",
        "inventory:update",
        "inventory:read",
        "rail:read",  # To verify arrivals
        "truck:read",  # To prepare dispatches
        "order:read",  # Limited to warehouse orders
    },
    "Driver": {
        "delivery:read",  # Own deliveries only
        "delivery:update",  # Update status
        "route:read",  # Own routes only
        "issue:create",  # Report issues
    },
    "DriverAssistant": {
        "driver:read",
        "driver:assign",
        "assistant:read",
        "truck:read",
        "truck:assign",
        "route:read",
        "route:verify",
        "schedule:create",
        "schedule:update",
    },
    "SystemAdmin": {
        "*:*",  # All permissions
    }
}

def has_permission(role: str, resource: str, action: str) -> bool:
    """Check if a role has a specific permission"""
    if role not in ROLE_PERMISSIONS:
        return False
    
    permissions = ROLE_PERMISSIONS[role]
    
    # Check for wildcard permissions
    if "*:*" in permissions:
        return True
    if f"*:{action}" in permissions:
        return True
    if f"{resource}:*" in permissions:
        return True
    
    # Check exact permission
    return f"{resource}:{action}" in permissions
```

#### 2.2 Create Permission Decorators
```python
# backend/app/core/auth.py (addition)
from app.core.permissions import has_permission
from functools import wraps

def require_permission(resource: str, action: str):
    """Decorator to enforce permission-based access control"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: Dict = None, **kwargs):
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated"
                )
            
            role = current_user.get("role", "")
            if not has_permission(role, resource, action):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: {resource}:{action} required"
                )
            
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

def require_any_role(allowed_roles: List[str]):
    """Decorator to check if user has any of the specified roles"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: Dict = None, **kwargs):
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated"
                )
            
            role = current_user.get("role", "")
            if role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Requires one of: {', '.join(allowed_roles)}"
                )
            
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator
```

#### 2.3 Update API Endpoints
```python
# backend/app/api/orders.py (updated)
from app.core.auth import get_current_user, get_current_customer, require_permission, require_any_role

@router.get("/", response_model=List[schemas.order])
@require_any_role(["Management", "StoreManager", "WarehouseStaff"])
async def get_all_orders(
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Get all orders - accessible by Management, StoreManager, WarehouseStaff"""
    role = current_user.get("role")
    
    if role == "WarehouseStaff":
        # Warehouse staff only sees orders in their warehouse
        warehouse_id = current_user.get("warehouse_id")  # Assume stored in token
        orders = db.query(model.Orders).filter(
            model.Orders.warehouse_id == warehouse_id
        ).all()
    else:
        # Management and StoreManager see all orders
        orders = db.query(model.Orders).all()
    
    return orders

@router.post("/", response_model=schemas.order)
async def create_order(
    order: schemas.create_new_order,
    db: db_dependency,
    current_customer: dict = Depends(get_current_customer)
):
    """Create order - Customer only"""
    # Existing validation logic
    # ...
    return new_order

@router.put("/{order_id}", response_model=schemas.order)
@require_any_role(["Management", "StoreManager"])
async def update_order(
    order_id: str,
    order_update: schemas.update_order,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Update order - Management and StoreManager only"""
    # Existing update logic
    # ...
    return order
```

### Phase 3: Session Management & Security (2 weeks)

#### 3.1 Implement Session Timeout
```typescript
// frontend/UI/app/hooks/useSessionTimeout.tsx
import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export function useSessionTimeout() {
  const { logout, isAuthenticated } = useAuth();
  let timeoutId: NodeJS.Timeout;

  const resetTimeout = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    
    if (isAuthenticated) {
      timeoutId = setTimeout(() => {
        alert('Your session has expired due to inactivity. Please log in again.');
        logout();
      }, TIMEOUT_DURATION);
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    // Events that reset the timeout
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    resetTimeout(); // Initial timeout

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [resetTimeout]);
}
```

#### 3.2 Add Password Policy Enforcement
```python
# backend/app/core/password_policy.py
import re
from typing import Tuple

class PasswordPolicy:
    MIN_LENGTH = 8
    MAX_LENGTH = 128
    REQUIRE_UPPERCASE = True
    REQUIRE_LOWERCASE = True
    REQUIRE_DIGITS = True
    REQUIRE_SPECIAL_CHARS = True
    SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    @staticmethod
    def validate(password: str) -> Tuple[bool, str]:
        """Validate password against policy"""
        if len(password) < PasswordPolicy.MIN_LENGTH:
            return False, f"Password must be at least {PasswordPolicy.MIN_LENGTH} characters"
        
        if len(password) > PasswordPolicy.MAX_LENGTH:
            return False, f"Password must not exceed {PasswordPolicy.MAX_LENGTH} characters"
        
        if PasswordPolicy.REQUIRE_UPPERCASE and not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        
        if PasswordPolicy.REQUIRE_LOWERCASE and not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        
        if PasswordPolicy.REQUIRE_DIGITS and not re.search(r'\d', password):
            return False, "Password must contain at least one digit"
        
        if PasswordPolicy.REQUIRE_SPECIAL_CHARS:
            if not any(char in PasswordPolicy.SPECIAL_CHARS for char in password):
                return False, f"Password must contain at least one special character: {PasswordPolicy.SPECIAL_CHARS}"
        
        return True, "Password is valid"
```

#### 3.3 Implement Audit Logging
```python
# backend/app/core/audit.py
from sqlalchemy import Column, String, DateTime, JSON
from app.core.database import Base
from datetime import datetime, timezone
import uuid

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    log_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)
    user_role = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False)  # e.g., "order:create", "user:login"
    resource_type = Column(String(50), nullable=False)  # e.g., "order", "user"
    resource_id = Column(String(36), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)
    details = Column(JSON, nullable=True)  # Additional context
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

def log_action(
    db: Session,
    user_id: str,
    user_role: str,
    action: str,
    resource_type: str,
    resource_id: str = None,
    ip_address: str = None,
    user_agent: str = None,
    details: dict = None
):
    """Log user action to audit trail"""
    audit_entry = AuditLog(
        user_id=user_id,
        user_role=user_role,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details
    )
    db.add(audit_entry)
    db.commit()
```

### Phase 4: Mobile Application (4-6 weeks)

#### 4.1 Driver Mobile App
- React Native or Flutter application
- Features:
  - Login/authentication
  - View assigned routes
  - Delivery manifest
  - Update delivery status
  - Capture signatures
  - Report issues
  - GPS tracking

#### 4.2 Warehouse Staff Mobile App
- Inventory scanning (barcode/QR)
- Receive shipments
- Dispatch confirmation
- Stock level updates
- Real-time sync with backend

---

## Database Schema for RBAC

### Additional Tables Needed

```sql
-- Permissions table
CREATE TABLE permissions (
    permission_id VARCHAR(36) PRIMARY KEY,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    UNIQUE KEY unique_permission (resource, action)
);

-- Role-Permission mapping
CREATE TABLE role_permissions (
    role_permission_id VARCHAR(36) PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id),
    UNIQUE KEY unique_role_permission (role_name, permission_id)
);

-- Session tracking
CREATE TABLE user_sessions (
    session_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Audit logs (as defined above)
CREATE TABLE audit_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    details JSON,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action)
);

-- Password history (for policy enforcement)
CREATE TABLE password_history (
    history_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user_id (user_id)
);
```

---

## Security Best Practices

### 1. Authentication
- ✅ Use JWT tokens with short expiration (100 minutes currently - consider reducing)
- ✅ Implement refresh tokens for extended sessions
- ✅ Store tokens securely (httpOnly cookies preferred over localStorage)
- ✅ Implement token revocation mechanism

### 2. Authorization
- ✅ Always verify user permissions on backend (never trust frontend)
- ✅ Use principle of least privilege
- ✅ Implement resource-level access control (users can only access their own resources)
- ✅ Validate all input data

### 3. Password Security
- ✅ Enforce strong password policies
- ✅ Use pbkdf2_sha256 or bcrypt for hashing
- ✅ Implement account lockout after failed attempts
- ✅ Support password reset flow with secure tokens
- ✅ Implement 2FA/MFA for sensitive roles (Management, SystemAdmin)

### 4. Session Management
- ✅ Implement automatic timeout (15 minutes)
- ✅ Provide "remember me" option with extended expiration
- ✅ Track active sessions per user
- ✅ Allow users to view and revoke sessions
- ✅ Implement logout on all devices

### 5. Data Protection
- ✅ Encrypt sensitive data at rest (AES-256)
- ✅ Use TLS for data in transit
- ✅ Sanitize all user inputs
- ✅ Implement rate limiting
- ✅ Use parameterized queries (prevent SQL injection)

### 6. Audit & Monitoring
- ✅ Log all authentication attempts
- ✅ Log all authorization failures
- ✅ Log all sensitive operations (create, update, delete)
- ✅ Implement real-time alerting for suspicious activities
- ✅ Regular security audits and penetration testing

### 7. Compliance
- ✅ Follow GDPR/data protection regulations
- ✅ Implement data retention policies
- ✅ Provide user data export functionality
- ✅ Support right to be forgotten (data deletion)

---

## Implementation Checklist

### Immediate Priorities (Week 1-2)
- [ ] Expand role enum in frontend to match backend roles
- [ ] Update useAuth to support all 7 user roles
- [ ] Create permission system in frontend
- [ ] Update route guards to use permission-based checks
- [ ] Test existing admin/customer flow still works

### Short-term (Week 3-4)
- [ ] Implement permission-based authorization in backend
- [ ] Update all API endpoints with proper role/permission checks
- [ ] Add audit logging to all sensitive operations
- [ ] Implement session timeout in frontend
- [ ] Add password policy enforcement

### Medium-term (Month 2)
- [ ] Create Store Manager specific routes and UI
- [ ] Create Warehouse Staff routes and UI
- [ ] Create Driver Assistant routes and UI
- [ ] Implement session management table
- [ ] Add "view active sessions" feature

### Long-term (Month 3-4)
- [ ] Develop Driver mobile application
- [ ] Develop Warehouse Staff mobile app
- [ ] Implement 2FA/MFA
- [ ] Add intrusion detection system
- [ ] Comprehensive security audit

---

## Testing Strategy

### Unit Tests
- Test permission checking logic
- Test role validation
- Test password policy enforcement
- Test token generation/validation

### Integration Tests
- Test login flows for all roles
- Test protected route access
- Test API endpoint authorization
- Test session timeout behavior

### End-to-End Tests
- Test complete user journeys for each role
- Test role switching scenarios
- Test unauthorized access attempts
- Test concurrent session handling

### Security Tests
- Penetration testing
- SQL injection testing
- XSS testing
- CSRF testing
- Session hijacking testing

---

## Monitoring & Maintenance

### Metrics to Track
- Failed login attempts per user
- Authorization failures by role
- Session timeout frequency
- API endpoint usage by role
- Average session duration

### Alerts
- Multiple failed login attempts
- Unusual access patterns
- Privilege escalation attempts
- Unauthorized API calls
- Session anomalies

### Regular Reviews
- Weekly: Review failed authorization logs
- Monthly: Audit trail analysis
- Quarterly: Permission review and cleanup
- Annually: Comprehensive security audit

---

## Conclusion

This RBAC implementation guide provides a comprehensive roadmap for securing the KandyPack Logistics Platform. The system is designed with six distinct user roles, each with specific permissions and use cases:

1. **Customer** - External users placing and tracking orders
2. **Store Manager** - Scheduling rail/road transport and managing operations
3. **Warehouse Staff** - Managing inventory and shipment verification
4. **Management** - Executive oversight and reporting
5. **Driver** - Last-mile delivery execution
6. **Driver Assistant** - Resource scheduling and route management

The current implementation provides a solid foundation with dual authentication portals and basic role-based routing. The roadmap outlined above will enhance the system with:
- Fine-grained permission controls
- Comprehensive audit logging
- Session management with timeouts
- Mobile applications for field staff
- Advanced security features

By following this guide and implementing the suggested phases, KandyPack will have a production-ready RBAC system that ensures secure, efficient, and compliant operations across all user groups.
