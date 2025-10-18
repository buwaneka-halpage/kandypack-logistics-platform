# Warehouse-Scoped Access Control - Implementation Guide

## Overview

KandyPack operates with **multiple warehouses across the country**. This document explains how the warehouse-scoped access control is implemented to ensure data isolation and proper authorization.

## Architecture

### Permission Scopes

The RBAC system uses three levels of permission scope:

1. **`all` scope** - Full access across all warehouses
   - **Who**: Management, System Administrator
   - **Access**: View and manage all orders, all warehouses
   - **Use case**: Assign orders to warehouses, view company-wide reports

2. **`warehouse` scope** - Limited to assigned warehouse
   - **Who**: Store Manager, Warehouse Staff, Driver Assistant
   - **Access**: Only resources within assigned warehouse
   - **Use case**: Manage warehouse operations, schedule local deliveries

3. **`own` scope** - Personal resources only
   - **Who**: Customer, Driver
   - **Access**: Only their own orders/deliveries
   - **Use case**: Track personal orders, update delivery status

## User Assignment Flow

### 1. User Creation with Warehouse Assignment

When creating warehouse-scoped staff:

```sql
-- Backend: Assign user to warehouse during creation
INSERT INTO Users (UserID, UserName, Role, warehouse_id) 
VALUES ('U001', 'john.doe@kandypack.com', 'StoreManager', 'WH-001');
```

```typescript
// Frontend: Create user with warehouse
const newUser = {
  email: 'john.doe@kandypack.com',
  name: 'John Doe',
  role: 'StoreManager',
  warehouse_id: 'WH-001'  // Assign to specific warehouse
};
```

### 2. Login Response with Warehouse Data

Backend returns warehouse info in login response:

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user_id": "U001",
  "user_name": "John Doe",
  "role": "StoreManager",
  "warehouse_id": "WH-001",      // User's assigned warehouse
  "warehouse_name": "Colombo Central Warehouse"
}
```

Frontend stores this in user object:

```typescript
const user: User = {
  id: response.user_id,
  email: email,
  name: response.user_name,
  role: UserRole.STORE_MANAGER,
  warehouseId: response.warehouse_id,
  warehouseName: response.warehouse_name
};
```

## Order Assignment Workflow

### Step 1: Customer Places Order

```typescript
// Customer creates order (no warehouse assigned yet)
const order = {
  customer_id: 'C001',
  items: [...],
  destination_city: 'Galle',
  warehouse_id: null  // Not assigned yet
};

await OrdersAPI.create(order);
```

### Step 2: Management Assigns to Warehouse

```typescript
// Only Management/SystemAdmin can do this
const { hasUserPermission } = useAuth();

if (hasUserPermission('warehouse', 'assign')) {
  // Assign order to nearest warehouse
  await OrdersAPI.assignToWarehouse('ORDER-001', 'WH-002');
}
```

Backend validates:
```python
@router.post("/orders/{order_id}/assign-warehouse")
async def assign_warehouse(
    order_id: str,
    warehouse_id: str,
    current_user: User = Depends(get_current_user)
):
    # Only Management and SystemAdmin can assign
    if current_user.role not in ['Management', 'SystemAdmin']:
        raise HTTPException(403, "Only management can assign warehouses")
    
    # Assign order
    order = db.query(Order).filter(Order.id == order_id).first()
    order.warehouse_id = warehouse_id
    order.assigned_at = datetime.now()
    order.assigned_by = current_user.id
    db.commit()
    
    return {"message": "Order assigned successfully"}
```

### Step 3: Warehouse Staff Process Order

```typescript
// Store Manager at WH-002 can now see the order
const { user } = useAuth();

if (user?.warehouseId) {
  // Only get orders for this warehouse
  const orders = await OrdersAPI.getByWarehouse(user.warehouseId);
}
```

Backend filters automatically:
```python
@router.get("/warehouses/{warehouse_id}/orders")
async def get_warehouse_orders(
    warehouse_id: str,
    current_user: User = Depends(get_current_user)
):
    # Verify user has access to this warehouse
    if current_user.role in ['StoreManager', 'WarehouseStaff', 'DriverAssistant']:
        if current_user.warehouse_id != warehouse_id:
            raise HTTPException(403, "Access denied to this warehouse")
    
    # Return only orders for this warehouse
    return db.query(Order).filter(
        Order.warehouse_id == warehouse_id
    ).all()
```

## Frontend Implementation

### 1. Permission Checking

```typescript
import { useAuth } from '~/hooks/useAuth';

function OrderManagementPage() {
  const { user, hasUserPermission, hasUserPermissionWithScope } = useAuth();

  // Check basic permission
  const canReadOrders = hasUserPermission('order', 'read');

  // Check with warehouse scope
  const canUpdateOrder = (orderWarehouseId: string) => {
    return hasUserPermissionWithScope('order', 'update', orderWarehouseId);
  };

  // Management can assign warehouses
  const canAssignWarehouse = hasUserPermission('warehouse', 'assign');

  return (
    <div>
      {canAssignWarehouse && (
        <button>Assign to Warehouse</button>
      )}
      
      {canReadOrders && (
        <OrdersList />
      )}
    </div>
  );
}
```

### 2. Data Fetching with Warehouse Context

```typescript
import { OrdersAPI } from '~/services/api';
import { UserRole } from '~/types/roles';

function OrdersList() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;

      // Management sees all orders
      if (user.role === UserRole.MANAGEMENT || user.role === UserRole.SYSTEM_ADMIN) {
        const allOrders = await OrdersAPI.getAll();
        setOrders(allOrders);
      }
      // Warehouse staff see only their warehouse
      else if (user.warehouseId) {
        const warehouseOrders = await OrdersAPI.getByWarehouse(user.warehouseId);
        setOrders(warehouseOrders);
      }
      // Customer sees only their orders
      else if (user.role === UserRole.CUSTOMER) {
        const myOrders = await OrdersAPI.getAll({ customer_id: user.id });
        setOrders(myOrders);
      }
    }

    loadOrders();
  }, [user]);

  return (
    <div>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

### 3. Conditional Rendering

```typescript
function OrderCard({ order }: { order: any }) {
  const { user, hasUserPermissionWithScope } = useAuth();

  // Check if user can update this specific order
  const canUpdate = hasUserPermissionWithScope(
    'order', 
    'update', 
    order.warehouse_id
  );

  return (
    <div className="order-card">
      <h3>Order #{order.id}</h3>
      <p>Warehouse: {order.warehouse_name}</p>
      
      {/* Only show if user can update */}
      {canUpdate && (
        <button onClick={() => handleUpdate(order.id)}>
          Update Order
        </button>
      )}

      {/* Show warning if cross-warehouse access attempted */}
      {user?.warehouseId && user.warehouseId !== order.warehouse_id && (
        <div className="text-red-600">
          ⚠️ This order is assigned to a different warehouse
        </div>
      )}
    </div>
  );
}
```

## Backend Implementation Requirements

### 1. User Table Schema

```sql
ALTER TABLE Users 
ADD COLUMN warehouse_id VARCHAR(255),
ADD COLUMN assigned_at DATETIME,
ADD CONSTRAINT fk_users_warehouse 
  FOREIGN KEY (warehouse_id) 
  REFERENCES Stores(StoreID);

CREATE INDEX idx_users_warehouse ON Users(warehouse_id);
```

### 2. Orders Table Schema

```sql
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

### 3. Login Endpoint Update

```python
@router.post("/users/login")
async def login_user(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # Authenticate user
    user = authenticate_user(db, username, password)
    
    if not user:
        raise HTTPException(401, "Invalid credentials")
    
    # Get warehouse info if user is warehouse-scoped
    warehouse_id = None
    warehouse_name = None
    
    if user.role in ['StoreManager', 'WarehouseStaff', 'DriverAssistant']:
        warehouse_id = user.warehouse_id
        if warehouse_id:
            warehouse = db.query(Store).filter(Store.StoreID == warehouse_id).first()
            warehouse_name = warehouse.Name if warehouse else None
    
    # Create JWT token
    access_token = create_access_token({
        "sub": user.UserID,
        "role": user.Role,
        "warehouse_id": warehouse_id
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.UserID,
        "user_name": user.UserName,
        "role": user.Role,
        "warehouse_id": warehouse_id,
        "warehouse_name": warehouse_name
    }
```

### 4. Warehouse-Filtered Endpoints

```python
@router.get("/orders")
async def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Management/SystemAdmin see all
    if current_user.role in ['Management', 'SystemAdmin']:
        return db.query(Order).all()
    
    # Warehouse-scoped roles see only their warehouse
    if current_user.role in ['StoreManager', 'WarehouseStaff', 'DriverAssistant']:
        if not current_user.warehouse_id:
            raise HTTPException(400, "User has no warehouse assigned")
        
        return db.query(Order).filter(
            Order.warehouse_id == current_user.warehouse_id
        ).all()
    
    # Customers see only their orders
    if current_user.role == 'Customer':
        return db.query(Order).filter(
            Order.CustomerID == current_user.UserID
        ).all()
    
    raise HTTPException(403, "Insufficient permissions")

@router.get("/warehouses/{warehouse_id}/orders")
async def get_warehouse_orders(
    warehouse_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user can access this warehouse
    if current_user.role in ['StoreManager', 'WarehouseStaff', 'DriverAssistant']:
        if current_user.warehouse_id != warehouse_id:
            raise HTTPException(403, "Access denied to this warehouse")
    elif current_user.role not in ['Management', 'SystemAdmin']:
        raise HTTPException(403, "Insufficient permissions")
    
    return db.query(Order).filter(
        Order.warehouse_id == warehouse_id
    ).all()

@router.post("/orders/{order_id}/assign-warehouse")
async def assign_warehouse(
    order_id: str,
    warehouse_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only Management and SystemAdmin
    if current_user.role not in ['Management', 'SystemAdmin']:
        raise HTTPException(403, "Only management can assign warehouses")
    
    order = db.query(Order).filter(Order.OrderID == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    
    # Verify warehouse exists
    warehouse = db.query(Store).filter(Store.StoreID == warehouse_id).first()
    if not warehouse:
        raise HTTPException(404, "Warehouse not found")
    
    # Assign
    order.warehouse_id = warehouse_id
    order.assigned_at = datetime.now()
    order.assigned_by = current_user.UserID
    
    db.commit()
    
    # Log the assignment
    log_audit_event(
        user_id=current_user.UserID,
        action="ASSIGN_WAREHOUSE",
        resource_type="Order",
        resource_id=order_id,
        details=f"Assigned order to warehouse {warehouse_id}"
    )
    
    return {"message": "Order assigned successfully"}
```

## Testing Scenarios

### Test 1: Management Assigns Order
```
1. Login as Management user
2. Navigate to order assignment page
3. View unassigned orders
4. Select order and warehouse
5. Assign order
6. Verify order appears in warehouse staff's view
```

### Test 2: Warehouse Staff Cannot See Other Warehouses
```
1. Login as Store Manager (Warehouse A)
2. Navigate to orders page
3. Verify only Warehouse A orders shown
4. Attempt API call to Warehouse B orders
5. Verify 403 Forbidden response
6. Check audit log for unauthorized attempt
```

### Test 3: Cross-Warehouse Prevention
```
1. Login as Warehouse Staff (Warehouse A)
2. Get order ID from Warehouse B
3. Attempt to update Warehouse B order via API
4. Verify 403 Forbidden response
5. Verify order not updated
```

### Test 4: Management Can See All
```
1. Login as Management
2. Navigate to orders page
3. Verify orders from all warehouses visible
4. Apply warehouse filter
5. Verify filtering works correctly
```

## Security Best Practices

1. **Always validate warehouse context server-side**
   - Never trust client-side checks
   - Validate on every API request
   - Check both user's warehouse AND resource's warehouse

2. **Audit all warehouse assignments**
   ```python
   log_audit_event(
       user_id=current_user.id,
       action="ASSIGN_WAREHOUSE",
       resource_type="Order",
       resource_id=order_id,
       details={"warehouse_id": warehouse_id}
   )
   ```

3. **Include warehouse_id in JWT claims**
   ```python
   token_data = {
       "sub": user_id,
       "role": user_role,
       "warehouse_id": user_warehouse_id  # Include in token
   }
   ```

4. **Implement row-level security**
   ```sql
   -- PostgreSQL example
   CREATE POLICY warehouse_isolation ON orders
   FOR SELECT
   USING (
       warehouse_id = current_setting('app.user_warehouse_id')::varchar
       OR current_setting('app.user_role')::varchar IN ('Management', 'SystemAdmin')
   );
   ```

5. **Monitor cross-warehouse access attempts**
   - Log all 403 responses
   - Alert on repeated unauthorized attempts
   - Implement rate limiting

6. **Regular access audits**
   - Review who accessed which warehouses
   - Verify warehouse assignments are current
   - Check for orphaned accounts

## Common Issues and Solutions

### Issue 1: User has no warehouse assigned
```typescript
if (!user?.warehouseId) {
  return (
    <div className="error-message">
      No warehouse assigned. Contact administrator.
    </div>
  );
}
```

### Issue 2: Trying to access cross-warehouse data
```typescript
if (order.warehouse_id !== user.warehouseId && 
    user.role !== UserRole.MANAGEMENT) {
  throw new Error('Cannot access orders from other warehouses');
}
```

### Issue 3: Order not yet assigned to warehouse
```typescript
if (!order.warehouse_id) {
  return (
    <div className="warning">
      ⚠️ Order not yet assigned to a warehouse
      {hasUserPermission('warehouse', 'assign') && (
        <button>Assign Now</button>
      )}
    </div>
  );
}
```

## Summary

The warehouse-scoped access control ensures:
- ✅ Data isolation between warehouses
- ✅ Management can assign and view all
- ✅ Warehouse staff see only their location
- ✅ Proper authorization at API level
- ✅ Audit trail for all assignments
- ✅ Type-safe permission checking

This architecture supports KandyPack's distributed operations while maintaining security and data privacy.
