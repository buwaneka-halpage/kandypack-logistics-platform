# Warehouse RBAC - Quick Reference Card

## 🎯 At a Glance

### Permission Scopes
```
all       → Management, SystemAdmin (all warehouses)
warehouse → StoreManager, WarehouseStaff, DriverAssistant (single warehouse)
own       → Customer, Driver (personal only)
```

### Order Flow
```
Customer → Unassigned → Management Assigns → Warehouse Processes → Driver Delivers
          (NULL)      (warehouse_id set)    (warehouse staff)      (own scope)
```

---

## 🔑 Key Functions

### Check Basic Permission
```typescript
const { hasUserPermission } = useAuth();

if (hasUserPermission('order', 'create')) {
  // User can create orders
}
```

### Check Warehouse-Scoped Permission
```typescript
const { hasUserPermissionWithScope } = useAuth();

const canUpdate = hasUserPermissionWithScope(
  'order',           // resource
  'update',          // action
  order.warehouse_id // resource's warehouse
);
```

### Get User's Warehouse
```typescript
const { user } = useAuth();

console.log(user?.warehouseId);   // 'WH-COLOMBO'
console.log(user?.warehouseName); // 'Colombo Central Warehouse'
```

---

## 📡 API Calls

### Get All Orders (filtered by role)
```typescript
// Management sees all
// Warehouse staff see only theirs
const orders = await OrdersAPI.getAll();
```

### Get Warehouse-Specific Orders
```typescript
const orders = await OrdersAPI.getByWarehouse('WH-001');
```

### Assign Order to Warehouse (Management only)
```typescript
await OrdersAPI.assignToWarehouse('ORDER-123', 'WH-001');
```

---

## 🛡️ Role Access Matrix

| Role              | Orders View | Assign WH | Inventory | All Customers |
|-------------------|-------------|-----------|-----------|---------------|
| Management        | ALL         | ✅        | ALL       | ✅            |
| SystemAdmin       | ALL         | ✅        | ALL       | ✅            |
| StoreManager      | WH-ONLY     | ❌        | WH-ONLY   | ✅            |
| WarehouseStaff    | WH-ONLY     | ❌        | WH-ONLY   | ❌            |
| DriverAssistant   | WH-ONLY     | ❌        | ❌        | ❌            |
| Driver            | OWN         | ❌        | ❌        | ❌            |
| Customer          | OWN         | ❌        | ❌        | ❌            |

---

## 💡 Common Patterns

### Load Data Based on Role
```typescript
const { user } = useAuth();

if (user?.role === UserRole.MANAGEMENT) {
  // Get all
  const data = await OrdersAPI.getAll();
} else if (user?.warehouseId) {
  // Get warehouse-specific
  const data = await OrdersAPI.getByWarehouse(user.warehouseId);
} else {
  // Get own
  const data = await OrdersAPI.getAll({ customer_id: user.id });
}
```

### Conditional Rendering
```typescript
{user?.role === UserRole.MANAGEMENT && (
  <button>Assign to Warehouse</button>
)}

{user?.warehouseId && (
  <p>Your Warehouse: {user.warehouseName}</p>
)}

{!user?.warehouseId && user?.role !== UserRole.MANAGEMENT && (
  <div>No warehouse assigned. Contact admin.</div>
)}
```

### Check Before Action
```typescript
const handleUpdate = async (order: Order) => {
  // Verify permission first
  if (!hasUserPermissionWithScope('order', 'update', order.warehouse_id)) {
    alert('Cannot update orders from other warehouses');
    return;
  }
  
  // Proceed with update
  await OrdersAPI.update(order.id, updateData);
};
```

---

## 🐛 Common Issues

### Issue: User has no warehouse
```typescript
if (!user?.warehouseId && 
    [UserRole.STORE_MANAGER, UserRole.WAREHOUSE_STAFF].includes(user?.role)) {
  return <div>No warehouse assigned. Contact administrator.</div>;
}
```

### Issue: Cross-warehouse access attempt
```typescript
if (order.warehouse_id !== user.warehouseId && 
    user.role !== UserRole.MANAGEMENT) {
  return <div>⚠️ This order is in a different warehouse</div>;
}
```

### Issue: Order not yet assigned
```typescript
if (!order.warehouse_id) {
  return (
    <div>
      ⚠️ Not assigned to warehouse yet
      {hasUserPermission('warehouse', 'assign') && (
        <button>Assign Now</button>
      )}
    </div>
  );
}
```

---

## 🔒 Security Checklist

- [ ] Never trust client-side checks alone
- [ ] Always validate on backend
- [ ] Include warehouse_id in JWT token
- [ ] Filter all queries by warehouse
- [ ] Log all warehouse assignments
- [ ] Audit cross-warehouse access attempts
- [ ] Validate warehouse exists before assignment
- [ ] Check foreign key constraints
- [ ] Implement rate limiting
- [ ] Review access logs regularly

---

## 📚 Documentation Files

1. `WAREHOUSE_ACCESS_CONTROL_GUIDE.md` - Complete guide
2. `WAREHOUSE_RBAC_FLOW_DIAGRAM.md` - Visual flows
3. `WAREHOUSE_RBAC_UPDATE_SUMMARY.md` - Detailed changes
4. `WAREHOUSE_RBAC_COMPLETE_SUMMARY.md` - Full summary
5. `app/components/examples/WarehouseAccessExamples.tsx` - Live examples

---

## 🚀 Quick Start

### For Frontend Developers
```typescript
// 1. Import what you need
import { useAuth } from '~/hooks/useAuth';
import { OrdersAPI } from '~/services/api';
import { UserRole } from '~/types/roles';

// 2. Get user info
const { user, hasUserPermission, hasUserPermissionWithScope } = useAuth();

// 3. Check permissions
const canAssign = hasUserPermission('warehouse', 'assign');

// 4. Load data
const orders = user?.warehouseId 
  ? await OrdersAPI.getByWarehouse(user.warehouseId)
  : await OrdersAPI.getAll();

// 5. Render conditionally
{canAssign && <AssignButton />}
```

### For Backend Developers
```python
# 1. Get user from JWT
current_user = get_current_user(token)

# 2. Check if warehouse-scoped
if current_user.role in ['StoreManager', 'WarehouseStaff']:
    # Filter by warehouse
    orders = db.query(Order).filter(
        Order.warehouse_id == current_user.warehouse_id
    ).all()
else:
    # Management sees all
    orders = db.query(Order).all()

# 3. Validate on updates
if resource.warehouse_id != current_user.warehouse_id:
    raise HTTPException(403, "Cross-warehouse access denied")
```

---

## 📞 Need Help?

- **Types**: See `app/types/roles.ts`
- **Auth**: See `app/hooks/useAuth.tsx`
- **API**: See `app/services/api.ts`
- **Examples**: See `app/components/examples/WarehouseAccessExamples.tsx`

---

**Quick Tip**: When in doubt, check `user.warehouseId` and compare with `resource.warehouse_id`!

✨ **Happy Coding!**
