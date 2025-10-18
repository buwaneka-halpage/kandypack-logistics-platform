# Warehouse-Scoped RBAC Implementation - Update Summary

## Date: October 19, 2025

## Overview
Updated the frontend RBAC system to implement **warehouse-scoped access control**, ensuring that warehouse staff can only access data for their assigned warehouse, while Management and System Administrators maintain full access across all warehouses.

---

## Files Updated

### 1. ✅ `app/types/roles.ts`
**Status:** Already includes warehouse scoping

**Key Features:**
- `Permission` interface includes `scope?: 'all' | 'own' | 'warehouse'`
- `WarehouseContext` interface for warehouse information
- `ROLE_PERMISSIONS` mapping includes scope for each permission:
  - Management: `scope: 'all'` for all resources
  - StoreManager: `scope: 'warehouse'` for orders, inventory, schedules
  - WarehouseStaff: `scope: 'warehouse'` for warehouse operations
  - Driver: `scope: 'own'` for personal deliveries
- `hasPermission()` - Basic permission checking
- `hasPermissionWithScope()` - Warehouse-aware permission validation

**Example Permission:**
```typescript
[UserRole.STORE_MANAGER]: [
  { resource: 'order', action: 'read', scope: 'warehouse' }, // Only warehouse orders
  { resource: 'order', action: 'update', scope: 'warehouse' },
  ...
]

[UserRole.MANAGEMENT]: [
  { resource: 'order', action: 'read', scope: 'all' }, // All warehouses
  { resource: 'warehouse', action: 'assign', scope: 'all' }, // Assign orders to warehouses
  ...
]
```

---

### 2. ✅ `app/hooks/useAuth.tsx`
**Changes Made:**

#### Updated User Interface:
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  warehouseId?: string;  // NEW: Assigned warehouse for scoped roles
  warehouseName?: string; // NEW: For display purposes
}
```

#### Updated AuthContextType:
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, userRole?: 'staff' | 'customer') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasUserPermission: (resource: string, action: string) => boolean;
  hasUserPermissionWithScope: (resource: string, action: string, resourceWarehouseId?: string) => boolean; // NEW
}
```

#### New Function:
```typescript
const hasUserPermissionWithScope = (
  resource: string, 
  action: string, 
  resourceWarehouseId?: string
): boolean => {
  if (!user) return false;
  return hasPermissionWithScope(
    user.role, 
    resource, 
    action, 
    user.warehouseId,  // User's assigned warehouse
    resourceWarehouseId // Resource's warehouse
  );
};
```

#### Updated Login Function:
```typescript
// Now extracts warehouse info from backend response
const user: User = {
  id: response.user_id,
  email: email,
  name: response.user_name,
  role: mappedRole,
  warehouseId: response.warehouse_id,   // NEW
  warehouseName: response.warehouse_name, // NEW
};
```

---

### 3. ✅ `app/services/api.ts`
**Changes Made:**

#### Updated LoginStaff Response Type:
```typescript
async loginStaff(username: string, password: string) {
  // ...
  return httpClient.postFormData<{
    access_token: string;
    token_type: string;
    user_id: string;
    user_name: string;
    role: string;
    warehouse_id?: string;  // NEW: Optional warehouse assignment
    warehouse_name?: string; // NEW: For display
  }>('/users/login', formData as any);
}
```

#### Enhanced OrdersAPI:
```typescript
export const OrdersAPI = {
  // Existing methods with warehouse_id parameter
  async getAll(params?: { 
    status?: string; 
    customer_id?: string; 
    warehouse_id?: string  // NEW: Filter by warehouse
  }) {
    return httpClient.get<any[]>('/orders', params);
  },

  // NEW: Assign order to warehouse (Management/SystemAdmin only)
  async assignToWarehouse(orderId: string, warehouseId: string) {
    return httpClient.post<any>(`/orders/${orderId}/assign-warehouse`, { 
      warehouse_id: warehouseId 
    });
  },

  // NEW: Get orders by warehouse (for warehouse staff)
  async getByWarehouse(warehouseId: string, params?: { status?: string }) {
    return httpClient.get<any[]>(`/warehouses/${warehouseId}/orders`, params);
  },
};
```

---

### 4. ✅ `RBAC_IMPLEMENTATION_GUIDE.md`
**New Section Added:** Warehouse-Based Access Control

**Content:**
- Detailed explanation of permission scopes (all, warehouse, own)
- Order assignment workflow (Customer → Management → Warehouse Staff → Driver)
- Data isolation principles
- Backend requirements for warehouse filtering
- Database schema updates needed
- Security best practices

**Key Addition:**
```markdown
### Overview of Warehouse-Scoped Access Control

1. **Management** and **System Administrator** roles can:
   - View all orders across all warehouses
   - Assign unassigned orders to specific warehouses
   - Manage warehouse assignments and reallocations

2. **Warehouse-scoped roles** (Store Manager, Warehouse Staff, Driver Assistant) can only:
   - Access orders assigned to their specific warehouse
   - Manage inventory for their warehouse only
   - Schedule deliveries from their warehouse only

3. **Permission Scopes**:
   - `all`: Full access across all warehouses (Management, SystemAdmin)
   - `warehouse`: Limited to assigned warehouse (StoreManager, WarehouseStaff, DriverAssistant)
   - `own`: Access to own resources only (Customer, Driver)
```

---

### 5. ✅ `FRONTEND_RBAC_IMPLEMENTATION.md`
**Major Section Added:** Warehouse-Scoped Access Control

**New Content:**
1. **Warehouse-Based Access Control Overview** (at top of document)
2. **Permission Scopes explanation** with workflows
3. **Order Assignment Flow** diagram
4. **Data Isolation** principles
5. **Implementation Details** section at end with:
   - User-Warehouse Assignment
   - Permission Checking with Warehouse Context
   - Order Assignment Workflow (Management)
   - Warehouse Staff Dashboard
   - Backend Integration Requirements
6. **Database Schema Updates** needed
7. **Testing Scenarios** for warehouse scoping
8. **Security Best Practices** for warehouse access

**Example Code Added:**
```typescript
// Example: Warehouse Staff Dashboard
function WarehouseStaffDashboard() {
  const { user } = useAuth();

  if (!user?.warehouseId) {
    return <div>No warehouse assigned. Contact administrator.</div>;
  }

  return (
    <div>
      <h1>Warehouse: {user.warehouseName}</h1>
      {/* Only show orders for this warehouse */}
      <WarehouseOrders warehouseId={user.warehouseId} />
    </div>
  );
}
```

---

### 6. ✅ NEW: `app/components/examples/WarehouseAccessExamples.tsx`
**Purpose:** Comprehensive examples demonstrating warehouse-scoped access

**Components Included:**

1. **OrderAssignmentPage** - Management assigns orders to warehouses
   - View unassigned orders
   - View all warehouses with capacity
   - Assign orders to specific warehouses
   - Only accessible by Management/SystemAdmin

2. **WarehouseOrdersPage** - Warehouse staff view their orders
   - Management sees all orders
   - Warehouse staff see only their warehouse orders
   - Permission checks before update operations
   - Warehouse context validation

3. **WarehouseInventoryPage** - Warehouse-scoped inventory
   - Only shows inventory for assigned warehouse
   - Warns if no warehouse assigned
   - Permission-based access control

4. **RoleBasedDashboard** - Different views by role
   - Management: All warehouses overview
   - Store Manager: Single warehouse metrics
   - Warehouse Staff: Operations metrics
   - Warning if warehouse not assigned

---

### 7. ✅ NEW: `WAREHOUSE_ACCESS_CONTROL_GUIDE.md`
**Purpose:** Comprehensive guide for implementing warehouse-scoped access

**Sections:**
1. **Architecture** - Explanation of 3 permission scopes
2. **User Assignment Flow** - How to create users with warehouses
3. **Order Assignment Workflow** - Complete flow from customer to delivery
4. **Frontend Implementation** - Code examples for components
5. **Backend Implementation Requirements** - Database schema, API endpoints
6. **Testing Scenarios** - 4 comprehensive test cases
7. **Security Best Practices** - 6 security guidelines
8. **Common Issues and Solutions** - Troubleshooting guide

**Key Features:**
- SQL schema updates for Users and Orders tables
- Python backend examples with FastAPI
- Complete frontend component examples
- Security audit recommendations
- Row-level security examples

---

## Backend Requirements

### Database Schema Changes Needed:

```sql
-- Add warehouse_id to Users table
ALTER TABLE Users 
ADD COLUMN warehouse_id VARCHAR(255),
ADD COLUMN assigned_at DATETIME,
ADD CONSTRAINT fk_users_warehouse 
  FOREIGN KEY (warehouse_id) 
  REFERENCES Stores(StoreID);

CREATE INDEX idx_users_warehouse ON Users(warehouse_id);

-- Add warehouse_id to Orders table
ALTER TABLE Orders
ADD COLUMN warehouse_id VARCHAR(255),
ADD COLUMN assigned_at DATETIME,
ADD COLUMN assigned_by VARCHAR(255),
ADD CONSTRAINT fk_orders_warehouse
  FOREIGN KEY (warehouse_id)
  REFERENCES Stores(StoreID);

CREATE INDEX idx_orders_warehouse ON Orders(warehouse_id);
CREATE INDEX idx_orders_warehouse_status ON Orders(warehouse_id, Status);
```

### Backend API Changes Needed:

1. **Update `/users/login` endpoint** to return:
   ```json
   {
     "warehouse_id": "WH-001",
     "warehouse_name": "Colombo Central Warehouse"
   }
   ```

2. **Update `/orders` endpoint** to filter by warehouse:
   ```python
   if user.role in ['StoreManager', 'WarehouseStaff', 'DriverAssistant']:
       if not user.warehouse_id:
           raise HTTPException(400, "User has no warehouse assigned")
       
       return db.query(Order).filter(
           Order.warehouse_id == user.warehouse_id
       ).all()
   ```

3. **Add `/orders/{order_id}/assign-warehouse` endpoint**:
   ```python
   @router.post("/orders/{order_id}/assign-warehouse")
   async def assign_warehouse(
       order_id: str,
       warehouse_id: str,
       current_user: User = Depends(get_current_user)
   ):
       if current_user.role not in ['Management', 'SystemAdmin']:
           raise HTTPException(403, "Only management can assign warehouses")
       
       # Assign order
       order.warehouse_id = warehouse_id
       order.assigned_at = datetime.now()
       order.assigned_by = current_user.id
       db.commit()
   ```

4. **Add `/warehouses/{warehouse_id}/orders` endpoint**:
   ```python
   @router.get("/warehouses/{warehouse_id}/orders")
   async def get_warehouse_orders(
       warehouse_id: str,
       current_user: User = Depends(get_current_user)
   ):
       # Verify user can access this warehouse
       if current_user.role in ['StoreManager', 'WarehouseStaff', 'DriverAssistant']:
           if current_user.warehouse_id != warehouse_id:
               raise HTTPException(403, "Access denied to this warehouse")
       
       return db.query(Order).filter(
           Order.warehouse_id == warehouse_id
       ).all()
   ```

---

## How It Works

### Scenario 1: Customer Places Order

```
1. Customer logs in → Role: Customer
2. Customer creates order → Order created with warehouse_id = NULL
3. Order appears in "Unassigned Orders" list (visible to Management only)
```

### Scenario 2: Management Assigns Order to Warehouse

```
1. Management logs in → Role: Management, warehouseId = NULL (can see all)
2. Views unassigned orders list
3. Selects order and chooses "Warehouse A" 
4. Calls OrdersAPI.assignToWarehouse('ORDER-001', 'WH-A')
5. Order.warehouse_id set to 'WH-A'
6. Order now visible to Warehouse A staff only
```

### Scenario 3: Warehouse Staff Processes Order

```
1. Store Manager logs in → Role: StoreManager, warehouseId = 'WH-A'
2. Dashboard loads → Calls OrdersAPI.getByWarehouse('WH-A')
3. Backend filters: WHERE warehouse_id = 'WH-A'
4. Only sees orders assigned to Warehouse A
5. Updates order status within their warehouse
```

### Scenario 4: Attempted Cross-Warehouse Access (Blocked)

```
1. Warehouse Staff (WH-A) tries to update Order-123 (WH-B)
2. Frontend checks: hasUserPermissionWithScope('order', 'update', 'WH-B')
3. Check fails: user.warehouseId ('WH-A') ≠ resourceWarehouseId ('WH-B')
4. Button disabled or hidden
5. If API called directly → Backend returns 403 Forbidden
```

---

## Usage Examples

### Example 1: Check Permission with Warehouse Scope

```typescript
import { useAuth } from '~/hooks/useAuth';

function OrderCard({ order }) {
  const { hasUserPermissionWithScope } = useAuth();

  const canUpdate = hasUserPermissionWithScope(
    'order',
    'update',
    order.warehouse_id  // Check if user can update THIS specific order
  );

  return (
    <div>
      <h3>Order #{order.id}</h3>
      <p>Warehouse: {order.warehouse_name}</p>
      {canUpdate && <button>Update Order</button>}
    </div>
  );
}
```

### Example 2: Load Warehouse-Specific Data

```typescript
import { useAuth } from '~/hooks/useAuth';
import { OrdersAPI } from '~/services/api';
import { UserRole } from '~/types/roles';

function OrdersList() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      // Management sees all
      if (user?.role === UserRole.MANAGEMENT) {
        const all = await OrdersAPI.getAll();
        setOrders(all);
      }
      // Warehouse staff see only theirs
      else if (user?.warehouseId) {
        const warehouses = await OrdersAPI.getByWarehouse(user.warehouseId);
        setOrders(warehouses);
      }
    }
    loadOrders();
  }, [user]);

  return <div>{/* Render orders */}</div>;
}
```

### Example 3: Management Assigns Order

```typescript
import { useAuth } from '~/hooks/useAuth';
import { OrdersAPI } from '~/services/api';

function AssignOrderButton({ order }) {
  const { hasUserPermission } = useAuth();

  if (!hasUserPermission('warehouse', 'assign')) {
    return null; // Hide if no permission
  }

  const handleAssign = async (warehouseId: string) => {
    try {
      await OrdersAPI.assignToWarehouse(order.id, warehouseId);
      alert('Order assigned!');
    } catch (error) {
      alert('Failed to assign order');
    }
  };

  return (
    <select onChange={(e) => handleAssign(e.target.value)}>
      <option>Select warehouse...</option>
      <option value="WH-001">Colombo</option>
      <option value="WH-002">Kandy</option>
      <option value="WH-003">Galle</option>
    </select>
  );
}
```

---

## Testing Checklist

- [ ] Management can view all orders across all warehouses
- [ ] Management can assign unassigned orders to warehouses
- [ ] Store Manager (WH-A) can only see WH-A orders
- [ ] Store Manager (WH-A) cannot see WH-B orders
- [ ] Warehouse Staff (WH-A) can only update WH-A inventory
- [ ] Driver sees only their own deliveries
- [ ] Customer sees only their own orders
- [ ] API returns 403 for cross-warehouse access attempts
- [ ] Login response includes warehouse_id and warehouse_name
- [ ] User with no warehouse assignment sees appropriate message
- [ ] Audit log captures all warehouse assignments

---

## Next Steps

1. **Backend Implementation** (Required):
   - [ ] Update database schema (Users and Orders tables)
   - [ ] Modify `/users/login` endpoint to return warehouse info
   - [ ] Add warehouse filtering to `/orders` endpoint
   - [ ] Create `/orders/{id}/assign-warehouse` endpoint
   - [ ] Create `/warehouses/{id}/orders` endpoint
   - [ ] Add warehouse validation to all update operations

2. **Frontend Integration** (Ready):
   - [x] Type definitions updated
   - [x] Auth hook updated with warehouse context
   - [x] API client updated with warehouse methods
   - [x] Permission checking functions ready
   - [x] Example components created
   - [ ] Integrate example components into actual pages

3. **Testing** (After backend ready):
   - [ ] Test Management order assignment workflow
   - [ ] Test warehouse staff isolation
   - [ ] Test cross-warehouse access prevention
   - [ ] Test user without warehouse assignment
   - [ ] Test audit logging

4. **Documentation** (Complete):
   - [x] RBAC Implementation Guide updated
   - [x] Frontend RBAC Implementation updated
   - [x] Warehouse Access Control Guide created
   - [x] Example components with comments created

---

## Summary

The warehouse-scoped access control is now fully implemented on the frontend with:

✅ **Type-safe permission scoping** (all, warehouse, own)  
✅ **Warehouse context in User interface**  
✅ **Scope-aware permission checking functions**  
✅ **API methods for warehouse assignment**  
✅ **Comprehensive examples and documentation**  
✅ **Security best practices defined**  
✅ **Testing scenarios documented**  

**Status:** Frontend implementation complete. Backend implementation required for full functionality.

**Files Created:**
- `WAREHOUSE_ACCESS_CONTROL_GUIDE.md` (comprehensive guide)
- `app/components/examples/WarehouseAccessExamples.tsx` (4 example components)

**Files Updated:**
- `app/types/roles.ts` (already had warehouse support)
- `app/hooks/useAuth.tsx` (added warehouse context)
- `app/services/api.ts` (added warehouse methods)
- `RBAC_IMPLEMENTATION_GUIDE.md` (added warehouse section)
- `FRONTEND_RBAC_IMPLEMENTATION.md` (added warehouse section)

**Ready for:** Backend API development and integration testing.
